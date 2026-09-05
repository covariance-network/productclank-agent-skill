# Content Studio — API Reference

Set up and run a brand's own content pipeline. Part of the public Agents API; the
content engine is the source of truth and this skill + the MCP connector are wrappers
over these endpoints. Setup, drafting, topics and the queue are **free**; AI rewrites /
reviews cost 2 credits, a KB rule 1, a pasted brand doc 5. **Nothing publishes.**

| Endpoint | Purpose | Cost |
|---|---|---|
| `GET /agents/content/spaces` | content-enabled spaces you may write into | free |
| `GET /agents/content/workspace` | the brand's calibration (voice, platforms, post types, topics, style guides) | free |
| `POST /agents/content/workspace` | turn content on / update settings (can create a solo space) | free · 5 with `brand_doc` |
| `GET/POST/PATCH/DELETE /agents/content/topics` · `POST …/topics/suggest` | topic inventory | free |
| `POST /agents/content/candidates` | draft posts in the voice (auto-scored) | free |
| `GET /agents/content/queue` | drafts with reviewer scores | free |
| `PATCH /agents/content/drafts` | stage / discard / edit (free) · revise / fix / humanize / review (2) | free · 2 |
| `POST /agents/content/feedback` | reaction → standing KB rule | 1 |

Base URL: `https://api.productclank.com/api/v1`
Auth: `Authorization: Bearer <api_key>` on every request.

`caller_user_id` — trusted agents (e.g. the Claude connector) act on behalf of a
user and pass `caller_user_id`; the connector sets it automatically from the OAuth
session. A non-trusted agent omits it and acts as its own linked user.

---

## GET /api/v1/agents/content/spaces

List the content-enabled spaces the caller may draft into — spaces the user owns,
account-delegates, or manages (campaign-member) **and** which have the content
engine enabled.

**Query params**

| Param | Required | Notes |
|-------|----------|-------|
| `caller_user_id` | Trusted agents | The user to scope the list to. |

**200**

```json
{
  "success": true,
  "spaces": [
    { "space_id": "c75562db-3341-…", "name": "ProductClank Community" },
    { "space_id": "49398afc-…", "name": "TipRanks" }
  ]
}
```

An empty `spaces` array means the user has not enabled the content engine on any
space they control. They can turn it on at <https://app.productclank.com/content>.

---

## POST /api/v1/agents/content/candidates

Write 1–25 draft candidates into a content space. Candidates land as
`status: "draft"`, `source: "agent"`, unreviewed — they surface in the builder's
"All Content" queue for a human to review, edit, and schedule. **Free. Never
auto-published.**

**Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `space_id` | string (UUID) | Yes | From `GET /agents/content/spaces`. |
| `candidates` | object[] | Yes | 1–25 items. |
| `candidates[].text` | string | Yes | The post body / draft text. |
| `candidates[].title` | string | No | Short internal label / topic. |
| `candidates[].platform` | string | No | e.g. `ProductClank X`, `LinkedIn`, `Farcaster`. |
| `candidates[].template` | string | No | e.g. `Build-in-Public`, `Proof Point`. Defaults to `Build-in-Public`. |
| `caller_user_id` | string (UUID) | Trusted agents | The user whose space is written into. |

`platform` must be one of the workspace's `platforms` (case-insensitive; omitted → the
first one; unknown → `400 unknown_platform` with the allowed list). Drafts are auto-scored
against the brand voice a moment after they land — read the scores via `GET /agents/content/queue`.

**Request**

```json
{
  "space_id": "c75562db-3341-…",
  "candidates": [
    {
      "text": "Shipped agent-written content today 🚀",
      "title": "Launch",
      "platform": "X",
      "template": "Proof Point"
    },
    { "text": "A human still reviews and schedules everything." }
  ]
}
```

**200**

```json
{
  "success": true,
  "created": 2,
  "draft_ids": ["9416624f-…", "9ad39a19-…"],
  "space_id": "c75562db-3341-…",
  "review_url": "https://app.productclank.com/content?space=c75562db-3341-…",
  "next_step": "Candidates are in the builder's All Content queue as unreviewed drafts. A human reviews, edits, and schedules them — nothing is auto-published."
}
```

**Errors**

| HTTP | `error` | Meaning |
|------|---------|---------|
| 400 | `validation_error` | Missing `space_id`, or no candidate has a non-empty `text`. |
| 400 | `too_many_candidates` | More than 25 candidates in one call — split into multiple calls. |
| 401 | `unauthorized` | Missing or invalid API key. |
| 403 | `forbidden` | The user doesn't control that space, or has revoked this app's authorization. |
| 404 | `not_found` / `content_not_enabled` | The content engine is not enabled on that space — set it up with `POST /agents/content/workspace`. |
| 400 | `unknown_platform` | `platform` is not one of the workspace platforms (response lists `platforms`). |

Error shape:

```json
{ "success": false, "error": "not_found", "message": "Content is not enabled for this space. Turn it on at /content first." }
```


---

## GET /api/v1/agents/content/workspace

The brand's full calibration — read it **before** drafting so you write in the brand's
own voice. **Free.**

**Query params**

| Param | Required | Notes |
|-------|----------|-------|
| `space_id` | Yes | An Amplify space the user owns / delegates / manages. |
| `caller_user_id` | Trusted agents | The user to act as. |

**200**

```json
{
  "success": true,
  "space_id": "c75562db-…",
  "space_name": "Acme",
  "enabled": true,
  "workspace": {
    "brand_name": "Acme",
    "platforms": ["X", "LinkedIn"],
    "voice": "Warm, plain-spoken, first-person plural. Hook in line 1. No hashtags, ≤1 emoji…",
    "post_types": "Build-in-public notes, customer wins, short how-tos",
    "platform_playbook": "X: short and punchy. LinkedIn: longer, reflective.",
    "review_threshold": 75,
    "automation_paused": false,
    "trending_source_handles": [],
    "onboarding_completed_at": "2026-09-05T10:00:00Z"
  },
  "topics": [
    { "id": "…", "label": "Why distribution beats building", "keywords": ["distribution", "launch"], "search_context": "", "is_active": true, "last_run_at": null }
  ],
  "style_guides": [],
  "review_url": "https://app.productclank.com/content?space=c75562db-…"
}
```

`enabled:false` (with `setup_hint`) means the space has no content engine yet — run the
onboarding interview and `POST /agents/content/workspace`.

---

## POST /api/v1/agents/content/workspace

Turn content on for a space, or update its settings. **Free** with structured fields;
`brand_doc` (a pasted brand template that Claude structures) costs **5 credits**.
First-time setup requires at least `voice` and `platforms`. Topics are appended (≤12
per call; keywords proposed when omitted).

**Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `space_id` | string (UUID) | One of | Existing space to enable / update. |
| `new_space` | `{ name, description? }` | One of | Create a solo Amplify space owned by the user (idempotent on name). |
| `brand_name` | string | No | Defaults to the space name. |
| `platforms` | string[] | First setup | Where the brand posts, e.g. `["X", "LinkedIn"]`. |
| `voice` | string | First setup | Tone in 3–5 words, do's / don'ts, typical length, emoji / hashtag / link policy, words to use / avoid, the feel of their example posts. |
| `post_types` | string | No | The kinds of posts they want. |
| `platform_playbook` | string | No | Per-platform notes. |
| `topics` | `[{ label, keywords?, search_context? }]` | No | ≤12 per call, appended. |
| `review_threshold` | number 0–100 | No | Reviewer pass bar (default 75). |
| `trending_source_handles` | string[] | No | ≤20 X accounts to pin for "Trending on X". |
| `brand_doc` | string | No | A filled brand template (≥40 chars) — **billed 5**. |
| `caller_user_id` | string (UUID) | Trusted agents | The user to act as. |

**200** — same shape as GET plus `created_space`, `created_workspace`, `topics_created`, `next_step`.

**Errors:** `400 validation_error` (no target, or first setup without `voice`) · `402 insufficient_credits` (brand_doc) · `403 forbidden` · `404 not_found`.

---

## Topics — GET / POST / PATCH / DELETE /api/v1/agents/content/topics

The inventory of themes the brand talks about. **All free.**

- `GET ?space_id=` → `{ topics: [{ id, label, keywords, search_context, is_active, last_run_at }] }`
- `POST { space_id, topics: [{ label, keywords?, search_context? }] }` → adds ≤12; returns `{ created, topics }`
- `PATCH { space_id, topic_id, label?, keywords?, search_context?, is_active? }` → `{ topic }` (`is_active:false` pauses it)
- `DELETE { space_id, topic_id }` → `{ deleted }` (past drafts survive)

### POST /api/v1/agents/content/topics/suggest

`{ space_id }` → `{ suggestions: [{ title, angle, why }] }` — KB-grounded ideas that differ
from the existing topics. Offer them to the user; add the keepers with `POST /topics`. **Free.**

---

## GET /api/v1/agents/content/queue

The space's drafts as the user sees them, with the reviewer's verdict. **Free.**

**Query params**

| Param | Required | Notes |
|-------|----------|-------|
| `space_id` | Yes | |
| `status` | No | `active` (default: pending + reviewed + staged) · `pending` · `reviewed` · `staged` · `discarded` |
| `limit` | No | ≤100, default 50 |

**200**

```json
{
  "success": true,
  "space_id": "…",
  "status": "active",
  "review_threshold": 75,
  "counts": { "pending": 1, "reviewed": 3, "staged": 1, "discarded": 0 },
  "drafts": [
    {
      "id": "9416624f-…",
      "title": "Launch",
      "platform": "X",
      "template": "Proof Point",
      "text": "Shipped agent-written content today 🚀 …",
      "status": "reviewed",
      "source": "agent",
      "review": { "score": 82, "verdict": "pass", "summary": "Cut the second sentence — the hook already lands.", "notes": "…" },
      "starred": false,
      "tags": [],
      "created_at": "2026-09-05T10:05:00Z"
    }
  ],
  "review_url": "https://app.productclank.com/content?space=…"
}
```

`staged` = approved by the user, awaiting publish (publishing is the user's step in the web tool).

---

## PATCH /api/v1/agents/content/drafts

Act on one draft. **Stage and discard are the user's decisions — confirm first.**

**Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `space_id` | string (UUID) | Yes | |
| `draft_id` | string (UUID) | Yes | From the queue or a candidates response. |
| `action` | string | Yes | `stage` · `discard` · `edit` · `revise` · `fix` · `humanize` · `review` |
| `text` | string | `edit` | Replacement text (free; clears the old score). |
| `preset` | string | `revise` | One-click chip: `shorter`, `longer`, `punchier`, `deeper`, `simpler`, `more_specific`, `less_salesy`, `more_casual`, `more_formal`. |
| `instruction` | string | `revise` / `fix` / `humanize` | The user's note in their words (`revise` needs a preset or an instruction). |

**Costs:** `stage` / `discard` / `edit` free · `revise` / `fix` / `humanize` **2** (content-rewrite) · `review` **2** (content-review). `fix` is a surgical edit targeting the reviewer's notes; `revise` applies the chip / instruction on top of the brand voice; `humanize` strips the AI feel.

**200**

```json
{ "success": true, "action": "revise", "credits_charged": 2, "draft": { "…": "…" }, "review_url": "…", "note": "Text changed, so the old score was cleared…" }
```

**Errors:** `400 validation_error` · `402 insufficient_credits` · `403 forbidden` · `404 not_found`.

---

## POST /api/v1/agents/content/feedback

Teach the engine: a reaction becomes a durable rule in the brand voice KB so future
drafts and reviews honor it. **1 credit.**

**Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `space_id` | string (UUID) | Yes | |
| `feedback` | string | Yes | e.g. "too long", "punchier hooks", "never say 'leverage'", "more first-person on LinkedIn". |
| `draft_id` | string (UUID) | No | The draft it was about — grounds the rule in an example. |
| `apply` | boolean | No | Default `true` — appended to the KB now. `false` → left pending for the user in web Settings. |

**200**

```json
{
  "success": true,
  "applied": true,
  "rule": { "id": "…", "section": "Voice & style", "markdown": "- Keep X posts under 200 characters; one idea per post.", "rationale": "…", "status": "approved" },
  "next_step": "Rule added to the brand voice KB — future drafts and reviews follow it."
}
```
