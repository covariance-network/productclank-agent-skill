---
name: productclank-content-studio
description: Draft social posts straight into your ProductClank content pipeline. Your agent writes content candidates (X / LinkedIn / Farcaster posts, threads) into a content space you own or manage; they land as UNREVIEWED DRAFTS in the web tool where a human reviews, edits, and schedules them — nothing is auto-published. FREE (no credits). Use when the user wants their agent to DRAFT or WRITE content for their own brand/pipeline for later human review — NOT to run a community campaign (that's productclank-campaigns' Content Campaign, where the community makes content for you).
license: Proprietary
metadata:
  author: ProductClank
  version: 0.1.0
  api_endpoint: https://api.productclank.com/api/v1/agents/content
  website: https://www.productclank.com
  web_ui: https://app.productclank.com/content
compatibility: Free — no credits required. Requires a ProductClank content space with the content engine enabled (turn it on at https://app.productclank.com/content), and that the connected user owns / delegates / manages that space.
---

# ProductClank Content Studio

Let your agent **draft content straight into your ProductClank content pipeline**. You describe what to write (or the agent proposes ideas from what it knows about your product); the agent writes **candidates** into one of your content spaces. Each candidate lands as an **unreviewed draft** in the content tool's "All Content" queue, where **a human reviews, edits, and schedules** it to your own social accounts.

**The agent proposes; you dispose.** Nothing is ever auto-published — the human is always the last step.

> **Not a community campaign.** This is *your own* content pipeline. If instead you want the **community** to create content *for* a product (and reward them), use the **Content Campaign** capability in the `productclank-campaigns` skill.

## When to use this skill

- "Draft three build-in-public posts about today's release into my content space."
- "Write a LinkedIn post and an X thread from these release notes and drop them in my queue for review."
- "Turn this changelog into content candidates for TipRanks."

## Prerequisites

1. **A connected ProductClank account** — via the Claude connector (OAuth) or an agent API key (`Authorization: Bearer pck_live_…`).
2. **A content-enabled space** — a ProductClank content space with the content engine turned on. Enable it once at <https://app.productclank.com/content>. The connected user must **own, account-delegate, or manage** that space (the same permission the web tool enforces).
3. That's it — **no credits required**.

## Authentication

Every endpoint requires `Authorization: Bearer <api_key>`. Trusted agents acting on behalf of a user pass `caller_user_id` (the Claude connector sets this automatically from the OAuth session).

## The flow

1. **Find your space** — `GET /api/v1/agents/content/spaces` returns the content-enabled spaces you can draft into (`{ space_id, name }`). Confirm the target space with the user.
2. **Write candidates** — `POST /api/v1/agents/content/candidates` with the `space_id` and 1–25 candidates. Each candidate is `{ text, title?, platform?, template? }`.
3. **Human reviews** — the drafts appear in the content tool's **All Content** queue (badged **Agent**). The user reviews, edits, scores, and schedules them. Open `review_url` from the response to jump straight there.

### 1. List content spaces

```
GET /api/v1/agents/content/spaces
```

```json
{
  "success": true,
  "spaces": [
    { "space_id": "c75562db-…", "name": "ProductClank Community" },
    { "space_id": "49398afc-…", "name": "TipRanks" }
  ]
}
```

Empty list → the user hasn't enabled the content engine on any space yet. Point them to <https://app.productclank.com/content>.

### 2. Write content candidates

```
POST /api/v1/agents/content/candidates
```

```json
{
  "space_id": "c75562db-3341-…",
  "candidates": [
    {
      "text": "Shipped agent-written content today 🚀 Your agent can now draft posts straight into your ProductClank pipeline for review.",
      "title": "Agent content candidates launch",
      "platform": "ProductClank X",
      "template": "Proof Point"
    },
    { "text": "A human still reviews and schedules everything — nothing auto-publishes." }
  ]
}
```

Only `text` is required per candidate. `platform` and `template` are free-text hints that help the reviewer; omit them and the draft defaults to the `Build-in-Public` template.

**Response:**

```json
{
  "success": true,
  "created": 2,
  "draft_ids": ["9416624f-…", "9ad39a19-…"],
  "space_id": "c75562db-3341-…",
  "review_url": "https://app.productclank.com/content?space=c75562db-3341-…"
}
```

Share `review_url` with the user so they can review, edit, and schedule the drafts.

## Fields

| Field | Where | Required | Notes |
|-------|-------|----------|-------|
| `space_id` | body | Yes | From `list content spaces`. |
| `candidates[].text` | body | Yes | The post body / draft text. |
| `candidates[].title` | body | No | Short internal label / topic. |
| `candidates[].platform` | body | No | e.g. `ProductClank X`, `LinkedIn`, `Farcaster`. |
| `candidates[].template` | body | No | e.g. `Build-in-Public`, `Proof Point`. Defaults to `Build-in-Public`. |
| `caller_user_id` | body | Trusted agents | The user whose space is written into (the connector sets this). |

## Limits & guardrails

- **Up to 25 candidates per call.** Split larger batches across calls.
- **Free** — no credit charge, no auto-review (a human reviews in the tool).
- **Never auto-published.** Candidates stop at the draft stage; a human schedules them.
- Writes are gated to spaces the user actually controls, and honor authorization: if the user revokes your app in **Connected Apps**, writes stop immediately.

## Errors

| HTTP | `error` | Meaning |
|------|---------|---------|
| 400 | `validation_error` | Missing `space_id`, or no candidate has `text`. |
| 400 | `too_many_candidates` | More than 25 candidates in one call. |
| 401 | `unauthorized` | Missing/invalid API key. |
| 403 | `forbidden` | You don't control that space, or the user revoked your app. |
| 404 | `not_found` | The content engine isn't enabled on that space. |

## Safety

The `text` you write is a **draft** — review the content you generate before writing it, and confirm the target space with the user. The user is always the last step: they review, edit, and schedule everything from the content tool. The platform never auto-posts.
