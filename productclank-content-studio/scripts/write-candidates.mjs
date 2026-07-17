#!/usr/bin/env node

/**
 * ProductClank Content Studio — draft content candidates into your content pipeline.
 *
 * FREE. Candidates land as unreviewed drafts in the content tool's "All Content"
 * queue; a human reviews, edits, and schedules them — nothing is auto-published.
 *
 * Usage:
 *   # List the content spaces you can draft into
 *   node write-candidates.mjs --list
 *
 *   # Write a single candidate
 *   node write-candidates.mjs --space <space_id> --text "My draft post" \
 *     [--title "Topic"] [--platform "ProductClank X"] [--template "Proof Point"]
 *
 *   # Write many candidates from a JSON file: [{ "text": "...", "platform": "..." }, ...]
 *   node write-candidates.mjs --space <space_id> --file candidates.json
 *
 * Environment:
 *   PRODUCTCLANK_API_KEY   Your API key (pck_live_*)  [required]
 *   CALLER_USER_ID         The user to act on behalf of  [trusted agents only]
 *   PRODUCTCLANK_API_BASE  Override API base (default https://api.productclank.com/api/v1)
 */

import { readFileSync } from "node:fs";

const API_BASE = process.env.PRODUCTCLANK_API_BASE || "https://api.productclank.com/api/v1";
const API_KEY = process.env.PRODUCTCLANK_API_KEY;
const CALLER_USER_ID = process.env.CALLER_USER_ID; // optional (trusted agents)
const MAX_CANDIDATES = 25;

if (!API_KEY) {
  console.error("❌ PRODUCTCLANK_API_KEY is required. export PRODUCTCLANK_API_KEY=pck_live_...");
  process.exit(1);
}

// Never throw on a non-JSON / error response — normalize to { success, error, message }.
async function parseJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      error: "invalid_response",
      message: `Non-JSON response (HTTP ${response.status})`,
    };
  }
}

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && i + 1 < process.argv.length ? process.argv[i + 1] : undefined;
}
const has = (name) => process.argv.includes(`--${name}`);

async function listSpaces() {
  const qs = CALLER_USER_ID ? `?caller_user_id=${encodeURIComponent(CALLER_USER_ID)}` : "";
  const res = await fetch(`${API_BASE}/agents/content/spaces${qs}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  const body = await parseJson(res);
  if (!res.ok || !body.success) {
    console.error(`❌ ${body.error || res.status}: ${body.message || "failed to list spaces"}`);
    process.exit(1);
  }
  if (!body.spaces?.length) {
    console.log("No content-enabled spaces. Turn on the content engine at https://app.productclank.com/content");
    return;
  }
  console.log("Content spaces you can draft into:");
  for (const s of body.spaces) console.log(`  ${s.space_id}  ${s.name}`);
}

async function writeCandidates(spaceId, candidates) {
  if (!spaceId) {
    console.error("❌ --space <space_id> is required (see --list).");
    process.exit(1);
  }
  if (!candidates.length) {
    console.error("❌ No candidates. Pass --text or --file.");
    process.exit(1);
  }
  if (candidates.length > MAX_CANDIDATES) {
    console.error(`❌ At most ${MAX_CANDIDATES} candidates per call (got ${candidates.length}).`);
    process.exit(1);
  }
  const res = await fetch(`${API_BASE}/agents/content/candidates`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      space_id: spaceId,
      candidates,
      ...(CALLER_USER_ID ? { caller_user_id: CALLER_USER_ID } : {}),
    }),
  });
  const body = await parseJson(res);
  if (!res.ok || !body.success) {
    console.error(`❌ ${body.error || res.status}: ${body.message || "failed to write candidates"}`);
    process.exit(1);
  }
  console.log(`✅ Drafted ${body.created} candidate(s) as unreviewed drafts.`);
  console.log(`   Review, edit & schedule them here: ${body.review_url}`);
  console.log(`   draft_ids: ${(body.draft_ids || []).join(", ")}`);
}

async function main() {
  if (has("list")) return listSpaces();

  const spaceId = arg("space");
  let candidates = [];
  const file = arg("file");
  if (file) {
    candidates = JSON.parse(readFileSync(file, "utf8"));
    if (!Array.isArray(candidates)) {
      console.error("❌ --file must contain a JSON array of candidates.");
      process.exit(1);
    }
  } else if (arg("text")) {
    candidates = [
      {
        text: arg("text"),
        ...(arg("title") ? { title: arg("title") } : {}),
        ...(arg("platform") ? { platform: arg("platform") } : {}),
        ...(arg("template") ? { template: arg("template") } : {}),
      },
    ];
  } else {
    console.error("Usage: --list | --space <id> (--text \"...\" | --file candidates.json)");
    process.exit(1);
  }
  return writeCandidates(spaceId, candidates);
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err.message);
  process.exit(1);
});
