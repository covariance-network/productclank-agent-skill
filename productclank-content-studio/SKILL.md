---
name: productclank-content-studio
description: Set up and run a brand's OWN content pipeline on ProductClank. Your agent onboards the brand in a chat (voice, audience, platforms, post types, topic inventory), drafts posts IN that voice, reads back the reviewer's scores, applies one-click calibration (shorter / punchier / deeper…), stages what the user approves, and turns feedback into standing rules. Setup, drafting, topics and the queue are FREE; rewrites 2 credits, a rule 1. Nothing is auto-published — the human stages, and publishes from the web tool. Use when the user wants their agent to SET UP or PRODUCE content for their own brand — NOT to run a community campaign (that's productclank-campaigns' Content Campaign, where the community makes content for you).
license: Proprietary
metadata:
  author: ProductClank
  version: 0.3.0
  api_endpoint: https://api.productclank.com/api/v1/agents/content
  website: https://www.productclank.com
  web_ui: https://app.productclank.com/content
compatibility: Free to set up and draft; rewrites/reviews 2 credits, a KB rule 1, a pasted brand doc 5. The agent can turn the content engine on itself (POST /content/workspace — even creating a solo space for the brand); the connected user must own / delegate / manage the space.
---

# ProductClank Content Studio

Let your agent **set up and run your own content pipeline** on ProductClank. It onboards the brand in a short interview (voice, audience, platforms, post types, the topics you want to own), then **drafts posts in that voice**, reads back how the reviewer scored them, nudges a draft with one word (shorter, punchier, deeper…), stages what you approve, and turns your reactions into standing rules so the next drafts are better.

**The agent proposes; you dispose.** Nothing is ever auto-published — you stage in the chat or the web tool, and publishing is your step there.

> **Not a community campaign.** This is *your own* content pipeline. If instead you want the **community** to create content *for* a product (and reward them), use the **Content Campaign** capability in the `productclank-campaigns` skill.

## When to use this skill

- "Set up content for Acme — ask me what you need to know about our voice and topics."
- "Draft three build-in-public posts about today's release into my content space."
- "Show me the queue. Approve the first one, make the second punchier, and remember: never say 'leverage'."
- "Turn this changelog into content candidates for TipRanks."

## Prerequisites

1. **A connected ProductClank account** — via the Claude connector (OAuth) or an agent API key (`Authorization: Bearer pck_live_…`).
2. **A content-enabled space** — the agent can create one: `POST /content/workspace` turns the engine on for an Amplify space the user owns / delegates / manages, or creates a solo space for the brand with `new_space:{name}`. (The web alternative is <https://app.productclank.com/content>.)
3. **Credits only for AI rewrites** — setup, drafting, topics and reading the queue are free; `revise` / `fix` / `humanize` / `review` cost 2, a KB rule 1, a pasted brand doc 5.

## Authentication

Every endpoint requires `Authorization: Bearer <api_key>`. Trusted agents acting on behalf of a user pass `caller_user_id` (the Claude connector sets this automatically from the OAuth session).

## Identity — which account are you acting as?

**This is the #1 thing to get right** (and the most common source of "it returns nothing"). Every call runs as a *ProductClank user*, and you only ever see **that user's** spaces. There are two ways your agent maps to a user:

- **Non-trusted agent** (the default when you self-register). You act as your **own linked user** — so you only see spaces *your agent's own account* owns/manages, which for a fresh agent is **none**. To act for a human, **link your agent to their account**: `POST /api/v1/agents/create-link` → they open the returned URL and approve. After linking, every call acts as that user with **no `caller_user_id` needed**.
- **Trusted agent** (granted by ProductClank; e.g. a multi-user connector). You **must** pass `caller_user_id` — the ProductClank user id of the person you're acting for — on **every** call, and that user must have authorized your agent.

> Building a connector for many users? Prefer the **OAuth connector**, which resolves the user automatically so you never handle `caller_user_id` at all.

## The flow

1. **Find the space** — `GET /content/spaces` lists content-enabled spaces (`{ space_id, name }`). Empty? Offer to set one up (step 2). Otherwise `GET /content/workspace?space_id=` to read the brand's calibration.
2. **Onboard (first time only)** — interview the user ONE question at a time: brand & site → audience → tone (offer the archetypes: Professional Authority · Friendly Educator · Conversational Peer · Inspirational Motivator · Analytical Thinker · Storyteller) → 2–3 example posts → platforms → post types → 3–8 topics. Read it back, then call `POST /content/workspace` **once** with the answers as fields (free). `new_space:{name}` creates a solo space when the user has none.
3. **Draft in the voice** — `POST /content/candidates` with 1–25 candidates written IN the workspace's voice, on its topics, each tagged with one of its platforms. They are auto-scored by the reviewer a moment later.
4. **Present the queue** — `GET /content/queue?space_id=` returns each draft with `review.score`, `verdict`, and the reviewer's one-line `summary`. Show them one by one: approve, tweak, or drop?
5. **Approve / tweak** — `PATCH /content/drafts`: `stage` (approved), `discard`, `revise` with a preset (`shorter`, `longer`, `punchier`, `deeper`, `simpler`, `more_specific`, `less_salesy`, `more_casual`, `more_formal`) or the user's words, `fix` (reviewer's notes), `humanize`, `review`, `edit`.
6. **Teach** — when a reaction should apply to every future draft, `POST /content/feedback` turns it into a rule in the brand voice KB (applied immediately by default). Say in one line what was learned.
7. **Human publishes** — staged drafts wait in the web tool's **All Content** queue (`review_url`). Publishing is the user's step there.

Full request/response shapes for every endpoint: [references/API_REFERENCE.md](references/API_REFERENCE.md).

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

Only `text` is required per candidate. `platform` must be one of the workspace's platforms (omit it to use the first; an unknown label is rejected with `400 unknown_platform` rather than mis-tagged). `template` defaults to `Build-in-Public`. Drafts are auto-scored against the brand voice in the background — read the scores via `GET /content/queue`.

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
- **Free to draft** — no credit charge; drafts are auto-scored (score-only, never auto-staged).
- **Never auto-published.** Candidates stop at the queue; the user stages, and publishes from the web tool.
- **Stage and discard are the user's decisions** — act on their say-so, never on your own judgment.
- Writes are gated to spaces the user actually controls, and honor authorization: if the user revokes your app in **Connected Apps**, writes stop immediately.

## Errors

| HTTP | `error` | Meaning |
|------|---------|---------|
| 400 | `validation_error` | Missing `space_id`, or no candidate has `text`. |
| 400 | `too_many_candidates` | More than 25 candidates in one call. |
| 401 | `unauthorized` | Missing/invalid API key. |
| 403 | `forbidden` | You don't control that space, or the user revoked your app. |
| 404 | `not_found` / `content_not_enabled` | The content engine isn't enabled on that space — set it up with `POST /content/workspace`. |
| 400 | `unknown_platform` | `platform` isn't one of the workspace's platforms (the response lists them). |

## Troubleshooting

Most "it returns nothing / it says I need access" problems are an **identity** mismatch (see [Identity](#identity--which-account-are-you-acting-as)), **not** a missing approval.

| Symptom | Likely cause | Fix |
|---|---|---|
| `list_content_spaces` returns `[]` (success, no error) | You're a **non-trusted** agent seeing your *own* empty account | **Link** to the user's account (`POST /api/v1/agents/create-link`); or if **trusted**, pass `caller_user_id`. |
| `400 caller_user_id is required for trusted agents` | You're **trusted** but didn't say who you act for | Add `caller_user_id` = the user's ProductClank id. |
| `403 unauthorized_delegation` | The user hasn't authorized your agent, **or** you passed the wrong user id (e.g. a duplicate account) | Have the user authorize your app, or correct `caller_user_id`. |
| `403 forbidden` (write) | That user doesn't own/manage the space, or revoked your app | Use a `space_id` from `list_content_spaces`; re-check authorization. |
| `404 not_found` / `content_not_enabled` | The content engine isn't enabled on that space | Run the onboarding interview and `POST /content/workspace` (free), or the user enables it at <https://app.productclank.com/content>. |

> ⚠️ **Do NOT call `POST /api/v1/agents/authorize` to fix "I can't see the spaces."** That endpoint is a *trusted-agent self-grant* that takes a **`user_id`** (not an `agent_id`), and it does **not** substitute for a missing `caller_user_id` or for linking. Reach for **`create-link`** (to act as a user) or **`caller_user_id`** (if trusted) instead.

## When something fails or you're stuck — report it

Don't retry a failing call in a loop, and don't quietly give up. If a call fails in a way its error doesn't explain, returns something that makes no sense, or you can't finish the user's task, report it. **Free.** A human on the ProductClank team is alerted and replies.

```bash
curl -X POST https://api.productclank.com/api/v1/agents/support \
  -H "Authorization: Bearer $PRODUCTCLANK_API_KEY" -H "Content-Type: application/json" \
  -d '{
    "message": "generate-posts returns 500 for CP-123 on every call since 10:00 UTC",
    "category": "bug",
    "severity": "blocking",
    "endpoint": "POST /api/v1/agents/campaigns/CP-123/generate-posts",
    "http_status": 500,
    "error_code": "internal_error",
    "context": { "max_posts": 10, "tried": "waited 5 min, same result" },
    "client": "skill"
  }'
```

- The response has a `ticket_id`. If `error_code` is a known one (e.g. `insufficient_credits`, `daily_spend_cap_exceeded`, `authorization_revoked`), `self_help` tells you the fix to apply right now.
- Tell the user in one line that you reported it, then carry on with other work.
- To add detail, send the same call with `ticket_id` instead of opening a new ticket.
- Read replies with `GET /api/v1/agents/support` (your tickets, with `has_reply`) or `GET /api/v1/agents/support?ticket_id=…` (the conversation).
- `category`: `bug` · `stuck` · `unexpected_result` · `docs` · `billing` · `feature_request` · `other`. `severity`: `low` · `normal` · `high` · `blocking`.
- Limits: 5 reports per 10 minutes and 25 per day per agent. API keys and tokens in the body are redacted, but don't send secrets.
- Not for expected guards whose error already tells you what to do (a confirmation prompt, an empty balance): relay those to the user.

## Safety

The `text` you write is a **draft** — review the content you generate before writing it, and confirm the target space with the user. The user is always the last step: they review, edit, and schedule everything from the content tool. The platform never auto-posts.
