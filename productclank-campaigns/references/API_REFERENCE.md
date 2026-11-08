# ProductClank Agent API v1 - Complete Reference

**Base URL:** `https://api.productclank.com/api/v1`

---

## Authentication

All requests (except `/register` and `/import`) require a Bearer API key:

```http
Authorization: Bearer pck_live_<your_api_key>
```

**API Key Format:** `pck_live_*` (64 hex chars after prefix)

**Obtaining an API Key:** Self-register via `POST /api/v1/agents/register` — no manual approval needed. Returns API key instantly. Top up credits via [webapp](https://app.productclank.com/credits/purchase) or x402 (USDC on Base).

### Trusted agents & per-user scoping

Normal (non-trusted) agents can ignore `caller_user_id` entirely — every request
acts on the agent's own linked user, and passing `caller_user_id` returns `403`.

**Trusted agents** (platform-operated keys acting for many users, e.g. the MCP
connector) must pass `caller_user_id` on **every campaign endpoint — reads
included — plus `GET /credits/history`** (query param on GETs, body field on
POSTs); omitting it returns `400 validation_error`. Campaign access is scoped to
the user the campaign was created for (`creator_id`): a campaign belonging to a
different user returns `404`, and list results only include the caller's own
campaigns. Billable calls are also blocked with `429 daily_spend_cap_exceeded`
when they would exceed the per-user daily cap the user set under Profile →
Connected Apps.

---

## Endpoints Overview

### Registration, Identity & Linking
| Method | Endpoint | Auth | Cost | Description |
|--------|----------|------|------|-------------|
| POST | `/agents/register` | None | Free | Self-register agent, get API key |
| POST | `/agents/create-link` | Bearer | Free | Generate linking URL for owner-linking |
| GET | `/agents/me` | Bearer | Free | View agent profile & rate limits |
| POST | `/agents/rotate-key` | Bearer | Free | Rotate API key |
| POST | `/agents/import` | None | Free | Import ERC-8004 agent metadata |
| GET | `/agents/by-user` | Webapp session | Free | List the caller's own linked agents |
| POST | `/agents/authorize` | Bearer (trusted) | Free | Grant agent authorization to bill user |
| DELETE | `/agents/authorize` | Bearer (trusted) | Free | Revoke agent authorization |

### Telegram Integration (Trusted Agents Only)
| Method | Endpoint | Auth | Cost | Description |
|--------|----------|------|------|-------------|
| POST | `/agents/telegram/create-link` | Bearer (trusted) | Free | Generate Telegram linking token |
| GET | `/agents/telegram/lookup` | Bearer (trusted) | Free | Look up user by Telegram ID |

### Products
| Method | Endpoint | Auth | Cost | Description |
|--------|----------|------|------|-------------|
| GET | `/agents/products/search?q=` | Bearer | Free | Search products by name/UUID |
| POST | `/agents/products` | Bearer | Free | List a new product (token-free; URL-autofilled) |

### Campaigns
| Method | Endpoint | Auth | Cost | Description |
|--------|----------|------|------|-------------|
| POST | `/agents/campaigns/analyze-url` | Bearer | 3 credits | Derive `keywords` + `search_context` from a product URL, before create |
| POST | `/agents/campaigns` | Bearer | 10 credits | Create campaign |
| GET | `/agents/campaigns` | Bearer | Free | List agent's campaigns |
| GET | `/agents/campaigns/{id}` | Bearer | Free | Get campaign details & stats |
| PATCH | `/agents/campaigns/{id}` | Bearer | Free | Tune a live campaign (keywords, sources, visibility, reply approach, …) |
| POST | `/agents/campaigns/{id}/generate-posts` | Bearer | 12 credits/post | Trigger discovery & reply generation |
| POST | `/agents/campaigns/{id}/review-posts` | Bearer | 2 credits/post | AI relevancy review & cleanup |
| POST | `/agents/campaigns/{id}/delegates` | Bearer | Free | Add campaign delegator |
| POST | `/agents/campaigns/{id}/research` | Bearer | Free | Run research analysis (expand keywords, find influencers) |
| GET | `/agents/campaigns/{id}/research` | Bearer | Free | Get cached research results |
| GET | `/agents/campaigns/{id}/posts` | Bearer | Free | Read discovered posts + replies |
| POST | `/agents/campaigns/{id}/regenerate-replies` | Bearer | 5 credits/reply | Regenerate replies with new instructions |
| POST | `/agents/campaigns/boost` | Bearer | 200-300 credits | Boost a specific tweet |
| POST | `/agents/campaigns/content` | Bearer | Free (`dry_run`) / 1000 credits | Preview or launch a content campaign |
| GET | `/agents/campaigns/content/{campaignId}` | Bearer | Free | Read a content campaign's submissions, state and winners |
| POST | `/agents/campaigns/ai-visibility` | Bearer | Free (`dry_run`) / 1000 credits (flat) | Preview or launch an AI-visibility check (real people ask ChatGPT / Claude about the product) |
| GET | `/agents/campaigns/ai-visibility/{campaignId}` | Bearer | Free | Check results: state, submission counts, the report + its URL |
| POST | `/agents/campaigns/ai-visibility/{campaignId}/report` | Bearer | Free | Generate the report (after the check ended, or `allow_partial`) |
| GET | `/agents/campaigns/{id}/results` | Bearer | Free | Spend vs outcomes (funnel, rates, survival, engagement, spend) — never scrapes |
| GET | `/agents/campaigns/{id}/activity` | Bearer | Free | Since-watermark delta: new posts, claimed replies with live URLs |
| GET | `/agents/campaigns/{id}/schedule` | Bearer | Free | Current standing-discovery config, projection, balance, cap, blockers |
| PUT | `/agents/campaigns/{id}/schedule` | Bearer | Free (12 credits/post found at run time) | Turn standing discovery on/off; enabling needs `confirm: true` |
| POST | `/agents/campaigns/content/{campaignId}/bounty` | Bearer | Free | Set the cash bounty (`dry_run` first); the user deposits it at `fund_url` |
| GET | `/agents/campaigns/content/{campaignId}/bounty` | Bearer | Free | The saved bounty, `funded`, `fund_url` |
| POST | `/agents/campaigns/watch-quiz` | Bearer | 0 at create; 100/correct answer | Create a public 24h watch quiz |
| POST | `/agents/campaigns/watch-quiz/suggest-questions` | Bearer | 40 (only on success) | AI counting questions + answers + evidence from a video |
| GET | `/agents/campaigns/watch-quiz/{campaignId}` | Bearer | Free | Quiz results: state, answers, per-question accuracy, credits billed |
| GET | `/agents/growth-assistant` | Bearer | Free | The user's growth assistant + today's suggested posts with drafts |
| POST | `/agents/growth-assistant` | Bearer | Free | Set up or update the assistant (one network per person) |
| GET / POST / DELETE | `/agents/webhooks` | Bearer | Free (curated partners) | Register / read / remove the signed webhook endpoint |
| POST | `/agents/webhooks/rotate-secret`, `/agents/webhooks/test` | Bearer | Free (curated partners) | New secret (shown once) · send a signed `ping` |
| POST | `/agents/spaces` | Bearer | Free (partner-granted) | Create a seeded client space for a storefront brand |
| PATCH | `/agents/campaigns/{id}/replies/{replyId}` | Bearer | Free | Edit one draft's text before it is published |
| POST | `/agents/campaigns/{id}/publish` | Bearer | Free | Release chosen held posts to the community |

### Credits
| Method | Endpoint | Auth | Cost | Description |
|--------|----------|------|------|-------------|
| GET | `/agents/credits/balance` | Bearer | Free | Check credit balance |
| POST | `/agents/credits/topup` | Bearer | Paid (USDC) | Buy credit bundle |
| GET | `/agents/credits/history` | Bearer | Free | Transaction history |

---

## POST /api/v1/agents/register

Self-register an agent. No authentication required — this IS the signup flow. Returns the API key exactly once.

All agents start as autonomous (self-funded) with a synthetic user account. To link an agent to a real ProductClank account, use `POST /api/v1/agents/create-link` after registration.

```json
{
  "name": "MyAgent",
  "description": "Growth automation agent",
  "wallet_address": "0x1234...abcd"
}
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Agent name (must be unique) |
| `description` | string | No | Agent description |
| `role` | string | No | Agent role |
| `wallet_address` | string | No | Ethereum address (0x, 40 hex chars) |
| `erc8004_agent_id` | string | No | ERC-8004 on-chain agent ID |
| `erc8004_metadata` | object | No | ERC-8004 metadata blob |
| `logo` | string | No | Logo URL |
| `website` | string | No | Website URL |

### Response (201 Created)

```json
{
  "success": true,
  "agent": {
    "id": "uuid",
    "name": "MyAgent",
    "erc8004_agent_id": null,
    "wallet_address": null,
    "status": "active",
    "rate_limit_daily": 10,
    "created_at": "2026-03-04T...",
    "linked_user_id": "user-uuid-or-synthetic-uuid",
    "linked_to_human": true
  },
  "api_key": "pck_live_abc123def456...",
  "credits": {
    "balance": 0,
    "plan": "free"
  },
  "_warning": "Store this API key securely. It will not be shown again.",
  "_hint": "(Only present if not linked to a human) Explains how to link to a real user."
}
```

### Error Codes
- `400` — Missing name or invalid wallet_address format
- `409` — Agent name or ERC-8004 ID already exists

---

## POST /api/v1/agents/create-link

Generate a short-lived linking token. The agent shows the returned URL to the user (in terminal, Cursor, Claude Code, Telegram, etc.). When the user clicks it, they log in (with Google, email, or wallet) and the agent gets linked to their ProductClank account.

**Auth:** Bearer API key
**Cost:** Free

### Request Body

None required.

### Response — New Token (200)

```json
{
  "success": true,
  "already_linked": false,
  "link_url": "https://app.productclank.com/link/agent?token=<uuid>",
  "token": "<uuid>",
  "expires_at": "2026-03-08T08:00:00.000Z",
  "_hint": "Share this URL with the agent owner."
}
```

### Response — Already Linked (200)

```json
{
  "success": true,
  "already_linked": true,
  "user_id": "user-uuid",
  "user_name": "Lior Goldenberg",
  "message": "This agent is already linked to a ProductClank account."
}
```

**Token Details:**
- Expires in 15 minutes
- Single-use (deleted after successful linking)
- Previous tokens for the same agent are cleaned up automatically

### Linking Flow

```
1. Agent calls POST /agents/create-link → gets link_url
2. Agent shows link_url to user (terminal, chat, etc.)
3. User clicks → logs in (Google, email, or wallet) → agent linked to their account
4. Agent now uses the user's credit balance
```

**Credits carry over:** any credits the agent already bought while autonomous are transferred to the user's balance on link — nothing is lost.

---

## GET /api/v1/agents/me

View authenticated agent's profile, rate limits, and credit balance.

### Response (200)

```json
{
  "success": true,
  "agent": {
    "id": "uuid",
    "name": "MyAgent",
    "wallet_address": "0x...",
    "erc8004_agent_id": null,
    "status": "active",
    "trusted": false,
    "rate_limit_daily": 10
  },
  "credits": {
    "balance": 290,
    "plan": "free",
    "lifetime_purchased": 0,
    "lifetime_used": 10,
    "lifetime_bonus": 0
  }
}
```

---

## POST /api/v1/agents/rotate-key

Rotate API key. Old key is immediately invalidated.

### Response (200)

```json
{
  "success": true,
  "api_key": "pck_live_new_key_here...",
  "agent_id": "uuid",
  "_warning": "Store this API key securely. It will not be shown again. Your old key is now invalid."
}
```

---

## POST /api/v1/agents/import

Pre-registration helper. Resolves an ERC-8004 agent ID to profile data for pre-filling registration.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | string | Yes | Must be `"erc8004"` |
| `erc8004_agent_id` | string | Yes | Agent ID on 8004.org |

### Response (200)

```json
{
  "success": true,
  "source": "erc8004",
  "data": {
    "name": "Agent Name",
    "description": "...",
    "logo": "https://...",
    "website": "https://...",
    "erc8004_agent_id": "agent-id",
    "erc8004_metadata": {}
  }
}
```

---

## GET /api/v1/agents/products/search

Search for products by name, tagline, or UUID.

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | required | Search query (name, tagline, or UUID) |
| `limit` | number | 10 | Max results (max 50) |

### Response (200)

```json
{
  "success": true,
  "products": [
    {
      "id": "product-uuid",
      "name": "ProductClank",
      "tagline": "Turning Users Into Growth Evangelists",
      "logo": "https://...",
      "website": "https://productclank.com",
      "category": ["Marketing"],
      "twitter": "@productclank"
    }
  ]
}
```

If the query is a UUID, returns exact match by product ID.

---

## POST /api/v1/agents/products

List a **new** product on ProductClank as a **token-free listing** (`LIST_WITHOUT_TOKEN` — no on-chain token, no wallet, no payment). Use this when `products/search` returns no match and you need a `product_id` to run a Discover or Content campaign (or to link a Boost).

**Auth:** Bearer API key
**Cost:** Free

**URL-first:** the minimum input is a product `url`. The server fetches the page and auto-fills `name`, `tagline`, `description`, `logo`, and the X handle (same autofill the webapp "paste your URL" listing flow uses). Any field you pass explicitly overrides the extracted value. **Socials are optional.**

**Idempotent per owner:** if the caller already listed a product with the same website (or name), the existing one is returned with `already_listed: true` instead of creating a duplicate.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes* | Product website URL — auto-fills the listing. *Provide `url` **or** `name`. |
| `name` | string | Yes* | Product name. Optional when `url` is given (extracted from the site); required otherwise. |
| `tagline` | string | No | One-line value proposition (overrides extracted). |
| `description` | string | No | Short description (overrides extracted). |
| `website` | string | No | Canonical website, if different from `url`. |
| `twitter` | string | No | X/Twitter handle or profile URL. |
| `logo` | string | No | Logo image URL (otherwise auto-resolved from the site). |
| `category` | string[] | No | Category tags. |
| `caller_user_id` | string (UUID) | No | Trusted agents only — list on behalf of this user. |

### Response (200)

```json
{
  "success": true,
  "already_listed": false,
  "product": {
    "id": "product-uuid",
    "name": "P1x3lz",
    "tagline": "Pixel-art everything",
    "website": "https://p1x3lz.com",
    "logo": "https://…/autofill-….png",
    "category": [],
    "twitter": "https://x.com/p1x3lz",
    "listing_type": "LIST_WITHOUT_TOKEN"
  },
  "next_step": {
    "action": "boost_or_campaign",
    "description": "Use this product_id with POST /agents/campaigns/boost or /agents/campaigns to run a campaign."
  }
}
```

When an existing match is found, the response is the same shape with `already_listed: true` and the existing product.

### Error Codes
- `400` — Neither `url` nor `name` provided, or a name couldn't be resolved.
- `422` — `url` given but the site was unreadable and no `name` was provided (pass `name` to list manually).
- `429` — Daily product-listing limit reached (20/day per owner).
- `500` — Listing failed.

---

## POST /api/v1/agents/campaigns/analyze-url

Derive a campaign's `keywords` and `search_context` from the product's website, **before** creating the campaign. **Cost: 3 credits**, charged only when a brief comes back. **Creates nothing** — no campaign, no product, no discovery.

> **Derive it yourself when you can.** If you can fetch and read the product's site in your own context, do that: it is free, you can iterate with the user before anything is spent, and you know what they have told you about their audience. This endpoint exists for the case that cannot — a client with no web access, or a storefront form where a human pastes a URL and expects the fields to fill themselves.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | The product's website. Fetched server-side (10s timeout, SSRF-guarded). |
| `platform` | enum | No | `twitter` (default), `linkedin`, `reddit`, `youtube` — the brief adapts its vocabulary. Pass what you will pass to create. |
| `product_id` | string (UUID) | No | Existing listing whose name and tagline sharpen the brief. |
| `product_name` | string | No | Overrides the listing's name. |
| `product_tagline` | string | No | Overrides the listing's tagline. |

### Response (200)

```json
{
  "success": true,
  "platform": "twitter",
  "product": { "id": "product-uuid", "name": "Acme", "tagline": "Issue tracking for small teams" },
  "search_context": "Find posts where founders and small teams are comparing lightweight project tools ...",
  "keywords": ["issue tracker", "jira alternative", "project management for small teams", "..."],
  "suggested_title": "Acme — issue-tracker conversations",
  "credits": { "credits_used": 3, "credits_remaining": 1297 }
}
```

`keywords` comes back as 8-15 phrases. Put them in front of the user and cut to the 3-8 that match how their buyers actually talk — that list is what the campaign then runs on. Leave `search_context` broad: it is the relevance gate's criteria, and a narrow one returns an empty first run.

### Error Codes

| Code | Meaning |
|------|---------|
| `400 validation_error` | No `url`, or an unknown `platform` |
| `400 url_fetch_failed` | Page unreachable, blocked, or empty — ask for another link, or write the fields from what the user tells you |
| `402 insufficient_credits` | Nothing ran |
| `404 not_found` | Unknown `product_id` |
| `502 ai_error` | The model failed or returned nothing usable. Nothing was charged; safe to retry. |

---

## POST /api/v1/agents/campaigns

Create a new Communiply campaign. **Cost: 10 credits.**

### Request Body

**Required:**

| Field | Type | Description |
|-------|------|-------------|
| `product_id` | string (UUID) | Product ID from `/agents/products/search` |
| `title` | string | Campaign title |
| `keywords` | string[] | Non-empty array of discovery keywords |
| `search_context` | string | Description of target conversations |

**Optional:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `mention_accounts` | string[] | `[]` | Twitter handles to name-drop in `mention` replies. Also a discovery input: posts that mention these accounts are surfaced too |
| `reply_style_tags` | string[] | `[]` | Tone tags (e.g., ["friendly", "technical"]) |
| `reply_style_account` | string | null | Twitter handle to mimic style |
| `reply_length` | enum | null | "very-short" \| "short" \| "medium" \| "long" \| "mixed" |
| `reply_guidelines` | string | auto-generated | Custom AI instructions (overrides auto) |
| `reply_approach` | enum | `"mention"` | **X only** (400 elsewhere). `"mention"` = awareness: replies put the product and its site in the conversation. `"flag"` = sales: replies tag the brand and/or founder and point them at the post's author as a lead. Neither claims the replier used the product |
| `reply_tag_accounts` | string[] | fallback | **X only, used with `"flag"`.** Up to 2 handles, brand first then founder. Omitted → `mention_accounts`, then the product's X handle |
| `visibility` | enum | `"public"` | `"public"` = drafts enter the community earn feed and network members post them (each posted reply bills you 20 credits); `"private"` = drafts stay yours to post |
| `post_visibility` | enum | follows `visibility` | Visibility of each discovered post, independent of the campaign. `"public"` campaign + `"private"` posts = **held mode**: drafts arrive but nothing is claimable until `POST …/publish` releases the ones you approve |
| `min_follower_count` | number | 100 | Minimum followers for targets |
| `min_engagement_count` | number | null | Minimum engagement threshold |
| `max_post_age_days` | number | null | Maximum post age |
| `require_verified` | boolean | false | Only verified accounts |
| `caller_user_id` | string | null | Trusted agents only: bill this user |

### Response (200)

```json
{
  "success": true,
  "campaign": {
    "id": "campaign-uuid",
    "campaign_number": "CP-042",
    "title": "Launch Week Buzz",
    "status": "active",
    "created_via": "api",
    "creator_agent_id": "agent-uuid",
    "is_funded": true,
    "url": "https://app.productclank.com/communiply/campaign-uuid",
    "admin_url": "https://app.productclank.com/my-campaigns/communiply/campaign-uuid"
  },
  "credits": {
    "credits_used": 10,
    "credits_remaining": 290,
    "billing_user_id": "user-uuid"
  },
  "next_step": {
    "action": "generate_posts",
    "endpoint": "POST /api/v1/agents/campaigns/{id}/generate-posts",
    "description": "Generate posts for this campaign."
  }
}
```

### Error Codes
- `400` — Missing required fields or validation error
- `402` — Insufficient credits (need 10)
- `403` — Non-trusted agent tried to use `caller_user_id`
- `404` — Product not found
- `429` — Rate limit exceeded (10/day default)
- `500` — Campaign creation failed

---

## GET /api/v1/agents/campaigns

List campaigns created by the authenticated agent.

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | number | 20 | Max results (max 100) |
| `offset` | number | 0 | Pagination offset |
| `status` | string | all | Filter: "active", "paused", "completed" |
| `caller_user_id` | string (UUID) | — | Trusted agents REQUIRED — list only this user's campaigns |

### Response (200)

```json
{
  "success": true,
  "campaigns": [
    {
      "id": "uuid",
      "campaign_number": "CP-042",
      "title": "Launch Week Buzz",
      "status": "active",
      "is_active": true,
      "campaign_type": null,
      "boost_action_type": null,
      "product_id": "product-uuid",
      "created_at": "2026-03-04T...",
      "url": "https://app.productclank.com/communiply/uuid",
      "admin_url": "https://app.productclank.com/my-campaigns/communiply/uuid"
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

---

## GET /api/v1/agents/campaigns/{campaignId}

Get campaign details and stats for an agent-owned campaign. Trusted agents must
pass `?caller_user_id=` (a campaign owned by a different user returns `404`).

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `campaignId` | string (UUID) | Campaign ID |

### Response (200)

```json
{
  "success": true,
  "campaign": {
    "id": "uuid",
    "campaign_number": "CP-042",
    "title": "Launch Week Buzz",
    "status": "active",
    "is_active": true,
    "is_funded": true,
    "campaign_type": null,
    "boost_action_type": null,
    "product_id": "product-uuid",
    "keywords": ["AI tools", "productivity"],
    "search_context": "People discussing AI tools",
    "mention_accounts": ["@productclank"],
    "reply_style_tags": ["friendly"],
    "reply_length": "short",
    "reply_posted_by": "community",
    "reply_approach": "flag",
    "reply_tag_accounts": ["productclank", "goldenberglior"],
    "created_at": "2026-03-04T...",
    "updated_at": "2026-03-04T...",
    "url": "https://app.productclank.com/communiply/uuid",
    "admin_url": "https://app.productclank.com/my-campaigns/communiply/uuid"
  },
  "stats": {
    "posts_discovered": 48,
    "replies_total": 48,
    "replies_by_status": {
      "pending": 30,
      "claimed": 12,
      "completed": 6
    }
  }
}
```

### Error Codes
- `404` — Campaign not found or not owned by this agent

---

## PATCH /api/v1/agents/campaigns/{campaignId}

Tune a live campaign. **Free.** Only the fields you send change. Full field list (keywords, sources, relevance threshold, pause, visibility, platform targeting) is in the live docs at `GET /api/v1/docs`; the reply-approach fields:

| Field | Type | Description |
|-------|------|-------------|
| `reply_approach` | `"mention"` \| `"flag"` | **X only.** Switch between awareness and flag-leads-to-the-founder. Applies to drafts written from now on |
| `reply_tag_accounts` | string[] \| null | **X only, for `"flag"`.** Up to 2 handles, brand first. **Replaces** the list; `null` or `[]` clears it |

```json
{ "reply_approach": "flag", "reply_tag_accounts": ["productclank", "goldenberglior"] }
```

The response returns the updated `campaign`, a `changed` diff, and, when a setting won't take effect, `warnings`:
- `no_tag_account`: flag mode with nobody to tag
- `reply_tag_accounts_inactive`: tags set while the approach is `mention`
- `reply_approach_inactive`: the campaign's replies are brand-posted

**Errors:** `400` for a non-X campaign, an unknown approach (values are case-sensitive), more than 2 handles, or an invalid handle.

---

## POST /api/v1/agents/campaigns/{campaignId}/generate-posts

Trigger Twitter/X discovery and AI reply generation. **Cost: 12 credits per post discovered.**

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `campaignId` | string (UUID) | Campaign ID |

### Request Body
None required. Optional: `{ "caller_user_id": "..." }` for trusted agents.

### Response (200)

```json
{
  "success": true,
  "message": "Posts generated successfully",
  "postsGenerated": 48,
  "repliesGenerated": 48,
  "errors": [],
  "batchNumber": 1,
  "credits": {
    "creditsUsed": 576,
    "creditsRemaining": 624
  }
}
```

### Error Codes
- `402` — Insufficient credits
- `403` — Campaign not owned by this agent
- `404` — Campaign not found

---

## POST /api/v1/agents/campaigns/{campaignId}/review-posts

AI-powered review of discovered posts against custom relevancy rules. Scores each post and deletes irrelevant ones. **Cost: 2 credits per post reviewed.**

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `campaignId` | string (UUID) | Campaign ID |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `review_rules` | string | No* | Freeform relevancy rules for AI scoring. *Required if no rules saved on campaign. |
| `threshold` | number | No | Score threshold (1-10). Posts below this are irrelevant. Default: `5` |
| `dry_run` | boolean | No | If `true`, scores posts but does not delete. Default: `false` |
| `save_rules` | boolean | No | Save rules to campaign for future use. Default: `true` |
| `caller_user_id` | string | No | Trusted agents only — bill this user's credits |

### Response (200)

```json
{
  "success": true,
  "dry_run": false,
  "summary": {
    "total_reviewed": 87,
    "deleted": 23,
    "marked_irrelevant": 23,
    "kept": 64,
    "processing_time_ms": 142500
  },
  "results": [
    {
      "post_id": "uuid",
      "score": 2,
      "reason": "General industry news, not a builder announcing their own product",
      "is_irrelevant": true,
      "tweet_url": "https://x.com/user/status/123",
      "author_username": "someuser"
    }
  ],
  "credits": {
    "charged": 174,
    "remaining": 826,
    "billing_user_id": "uuid"
  },
  "rules_saved": true,
  "rules_used": "Only keep posts where a builder is announcing their own product..."
}
```

### Error Codes
- `400` — Missing `review_rules` (not in request body or saved on campaign)
- `402` — Insufficient credits. Response includes `credits_required`, `credits_available`, `shortfall`
- `403` — Campaign not owned by this agent
- `404` — Campaign not found

> **Note:** Both `dry_run: true` and `dry_run: false` consume credits, since AI scoring runs in both cases.

---

## POST /api/v1/agents/campaigns/boost

Rally your community to engage with a specific social post — replies, quote posts, likes, or reposts. Supports Twitter/X, Instagram, TikTok, LinkedIn, Reddit, Farcaster, and YouTube. **Cost: 200-300 credits.**

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `post_url` | string | Yes | Post URL from any supported platform. Platform is auto-detected. |
| `product_id` | string (UUID) | No | Optional product to associate. If omitted, AI replies use generic amplification language ("this post") and brand-mention enforcement is skipped. |
| `action_type` | string | No | "replies" (default) \| "quote" \| "likes" \| "repost" — availability varies by platform. `"quote"` = a repost WITH the member's own AI-drafted text (**X only**, needs post text like replies) |
| `reply_guidelines` | string | No | Custom AI instructions for community replies (and for quote-post text) |
| `post_text` | string | No | Post text — skips server-side fetch (recommended for non-Twitter platforms) |
| `post_author` | string | No | Post author username (used with `post_text`) |
| `caller_user_id` | string | No | Trusted agents only |

> **Backward compatibility:** `tweet_url`, `tweet_text`, and `tweet_author` are still accepted as aliases.

### Supported Platforms & Actions

| Platform | URL Pattern | Replies | Quote posts | Likes | Reposts |
|----------|-------------|---------|-------------|-------|---------|
| Twitter/X | `x.com/*/status/*` or `twitter.com/*/status/*` | Yes | Yes | Yes | Yes |
| Instagram | `instagram.com/p/*` or `instagram.com/reel/*` | Yes | — | Yes | — |
| TikTok | `tiktok.com/@*/video/*` | Yes | — | Yes | — |
| LinkedIn | `linkedin.com/posts/*` | Yes | — | Yes | — |
| Reddit | `reddit.com/r/*/comments/*` | Yes | — | Yes | — |
| Farcaster | `warpcast.com/*/0x*` | Yes | — | Yes | Yes |
| YouTube | `youtube.com/watch?v=*` or `youtu.be/*` | Yes | — | Yes | — |

> ⚠️ **Unsupported action types fall back silently, at the price of what you actually got.** `action_type` is validated against the platform's supported actions and anything unsupported becomes `replies` — `"quote"` on a LinkedIn URL charges 200 credits for replies, with no error. Check this table before calling, and read `campaign.action_type` back off the response.

### Credit Costs

| Action | Items Generated | Credits |
|--------|----------------|---------|
| `replies` | 10 AI replies | 200 |
| `quote` | 10 AI-drafted quote posts (X only) | 200 |
| `likes` | 30 like tasks | 300 |
| `repost` | 10 repost tasks | 300 |

**Quote posts** are the highest-reach action: a quote is a repost carrying the member's own drafted text, so it publishes to **their** followers' feeds instead of sitting under your post. Proof is the member's own quote-post URL — the platform author-matches it against their linked X handle and verifies it actually quotes the boosted post, so a plain tweet or a quote of something else is rejected and earns nothing.

### Response (200)

```json
{
  "success": true,
  "campaign": {
    "id": "uuid",
    "campaign_number": "CP-043",
    "platform": "twitter",
    "action_type": "replies",
    "is_reboost": false,
    "url": "https://app.productclank.com/communiply/uuid",
    "admin_url": "https://app.productclank.com/my-campaigns/communiply/uuid"
  },
  "post": {
    "id": "123456789",
    "url": "https://x.com/user/status/123456789",
    "text": "Post content...",
    "author": "username",
    "platform": "twitter"
  },
  "tweet": { ... },
  "items_generated": 10,
  "credits": {
    "credits_used": 200,
    "credits_remaining": 90
  }
}
```

> The `tweet` field is kept for backward compatibility. New integrations should use `post`.

Re-boosting the same post regenerates fresh content without duplicating existing replies.

**Post text resolution order:**
1. Client-provided `post_text` (skips fetch — recommended for non-Twitter platforms)
2. Server-side fetch via platform API (Twitter oEmbed, TikTok oEmbed, Reddit JSON, Neynar, etc.)
3. Fallback (empty text — only works for likes/reposts)

For replies **and quote posts**, post text is required for AI generation. If the server can't fetch content and no `post_text` was provided, returns `503`.

### Error Codes
- `400` — Missing `post_url`, or unsupported platform URL
- `402` — Insufficient credits
- `404` — Product not found (only when `product_id` is provided and doesn't match an existing product)
- `429` — Rate limit exceeded
- `503` — Post text unavailable (replies and quote posts) — pass `post_text` or retry

---

## POST /api/v1/agents/campaigns/content

Preview or launch a **content campaign** — rally the community to create original content (posts, threads, videos) for a product. One endpoint, two modes via `dry_run`. **Cost: free to preview, 1000 credits to launch.**

Read back what the campaign produced with `GET /agents/campaigns/content/{campaignId}` (below). Winner selection happens in the ProductClank web app; the response returns an `admin_url` for the user to manage it.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | string (UUID) | Yes | Product to run the campaign for (from `products/search`) |
| `campaign_message` | string | Yes | The core brief — what the community should create |
| `campaign_goals` | string[] | No | e.g. `["awareness", "signups"]` |
| `target_audience` | string | No | Who the campaign should reach |
| `preferred_platform` | string | No | e.g. `"x"`, `"farcaster"` |
| `additional_guidelines` | string | No | Extra do's/don'ts for creators |
| `references` | string | No | Links or references to include |
| `dry_run` | boolean | No | `true` = free preview (no campaign, no charge); `false`/omitted = launch |
| `caller_user_id` | string (UUID) | No | Trusted agents only |

### Response (200) — preview (`dry_run: true`)

Free. Nothing is created and no credits are charged.

```json
{
  "success": true,
  "dry_run": true,
  "proposal": {
    "title": "…",
    "description": "…",
    "action_type": "custom_action",
    "action_url": "…",
    "action_cta": "…",
    "action_message": "…"
  },
  "product": { "id": "product-uuid", "name": "…" },
  "credits_required": 1000,
  "credits_available": 5000,
  "can_afford": true
}
```

### Response (200) — launch (`dry_run: false`)

Creates the campaign, generates its final brief, and auto-activates it (`processing` → `active`).

```json
{
  "success": true,
  "campaign": {
    "id": "campaign-uuid",
    "campaign_number": 512,
    "title": "Growth Boost: …",
    "product_id": "product-uuid",
    "campaign_type": "take_action",
    "status": "processing",
    "admin_url": "https://app.productclank.com/my-campaigns"
  },
  "credits": {
    "credits_used": 1000,
    "credits_remaining": 4000,
    "billing_user_id": "user-uuid"
  },
  "next_step": {
    "action": "review_submissions",
    "admin_url": "https://app.productclank.com/my-campaigns"
  }
}
```

### Error Codes
- `400` — Missing `product_id` or `campaign_message`
- `402` — Insufficient credits (launch only; preview is never credit-gated)
- `404` — Product not found
- `429` — Rate limit exceeded

> **Preview first.** Call with `dry_run: true`, show the `proposal` to the user, refine the brief if needed, then call again with `dry_run: false` to launch.

---

## GET /api/v1/agents/campaigns/content/{campaignId}

Read the **results** of a content campaign you created: lifecycle state, submission counts, every submission (the live post URL, author, review state, points) and any winners. **Free**, read-only. Accepts the campaign UUID or its public campaign number.

This is how you close the loop after launching. Without it you only know a campaign was paid for, not whether it produced anything.

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter submissions: `pending` / `approved` / `rejected` |
| `limit` | number | Submissions per page (default 50, max 100) |
| `offset` | number | Pagination offset |
| `caller_user_id` | string (UUID) | Trusted agents only — the campaign must belong to this user |

### Response (200)

```json
{
  "success": true,
  "campaign": {
    "id": "campaign-uuid",
    "campaign_number": 512,
    "title": "Growth Boost: Acme",
    "state": "active",
    "state_label": "Active",
    "is_accepting_submissions": true,
    "raw_status": "active",
    "start_date": "2026-09-11T00:00:00Z",
    "end_date": "2026-09-14T23:59:59Z",
    "reward_type": "leaderboard_points",
    "participants_count": 38,
    "public_url": "https://www.productclank.com/take-action/512"
  },
  "counts": { "total": 38, "pending": 22, "approved": 6, "rejected": 10 },
  "submissions": [
    {
      "id": "submission-uuid",
      "post_url": "https://x.com/someone/status/123",
      "status": "approved",
      "review_notes": "On-brief, disclosed.",
      "reviewed_at": "2026-09-12T10:00:00Z",
      "points_allocated": 50,
      "created_at": "2026-09-12T09:00:00Z",
      "creator": {
        "user_id": "user-uuid",
        "name": "Someone",
        "avatar": "https://…",
        "fid": 1234,
        "x_username": "someone"
      }
    }
  ],
  "winners": [
    { "id": "…", "user_id": "…", "submission_id": "…", "winner_type": "raffle", "reward_amount": 99 }
  ],
  "pagination": { "limit": 50, "offset": 0, "returned": 38, "total_matching": 38, "has_more": false }
}
```

### Reading the response

- **Use `state`, never `raw_status`.** A campaign past its end date reads `ended` while `raw_status` still says `active`.
- `state` values: `processing` (the AI brief is still generating — the campaign is not live yet), `active`, `paused`, `ended`, `cancelled`.
- **Right after launch, expect `processing` and zero submissions.** That is normal, not a failure.
- Only `approved` submissions are delivered content. Report `pending` as unreviewed — never as results.
- `post_url` is the live content the participant published; open it to judge quality.

### Error Codes
- `400` — `campaignId` is not a UUID or campaign number
- `403` — The campaign belongs to another agent/user
- `404` — Campaign not found

---

## POST /api/v1/agents/campaigns/ai-visibility

Create an AI-visibility check: real people ask ChatGPT / Claude (any of `models`) the product's buying questions from their own accounts in a fresh chat and submit the shared chat link or a screenshot. Once the check ends, generate the report with `POST …/{campaignId}/report`. The key-authed twin of the web form at `https://www.productclank.com/ai-visibility`. Agents cannot answer a check.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| product_id | string | Yes | The product the panel asks about |
| questions | string[] | No | 1–30 buying questions (≤ 200 chars each). Omit to let people ask in their own words |
| models | string[] | No | `ChatGPT`, `Claude`, `Gemini`, `Perplexity`, `Grok`. Default ChatGPT + Claude |
| days | number | No | 1–14, default 4 |
| max_participants | number | No | Panel size, 1–200, default 40 |
| dry_run | boolean | No | `true` = return the brief and price, create nothing, charge nothing |
| caller_user_id | string | Trusted only | User to bill |

### Response (200) — dry run

```json
{
  "success": true,
  "dry_run": true,
  "proposal": {
    "product_id": "product-uuid",
    "product": "Northsky",
    "title": "Northsky — AI visibility check",
    "models": ["ChatGPT", "Claude"],
    "questions": ["best analytics tool for solo founders"],
    "days": 4,
    "max_participants": 40,
    "action_message": "Ask ChatGPT or Claude what it thinks about Northsky, then submit the conversation link or a screenshot of the answer.",
    "action_cta": "Ask ChatGPT",
    "brief": "…"
  },
  "credits": { "credits_required": 1000, "credits_available": 2400, "billing_user_id": "user-uuid", "billing": "flat launch fee at create; the panel earns platform points; the report is free" },
  "next_step": "Review the brief with the owner, then call again with dry_run:false to launch and charge the launch fee."
}
```

### Response (200) — launch

```json
{
  "success": true,
  "campaign": {
    "id": "campaign-uuid",
    "campaign_number": 1387,
    "campaign_type": "take_action",
    "kind": "ai_visibility",
    "title": "Northsky — AI visibility check",
    "product_id": "product-uuid",
    "product": "Northsky",
    "models": ["ChatGPT", "Claude"],
    "questions": ["best analytics tool for solo founders"],
    "state": "active",
    "starts_at": "2026-11-08T11:28:24Z",
    "ends_at": "2026-11-12T11:28:24Z",
    "max_participants": 40,
    "public_url": "https://www.productclank.com/amplify/content/campaign-uuid",
    "admin_url": "https://www.productclank.com/amplify/workbench/campaign-uuid"
  },
  "check": { "days": 4, "max_participants": 40, "models": ["ChatGPT", "Claude"], "question_count": 1, "report_url": "https://www.productclank.com/ai-visibility/report/campaign-uuid", "billing": "flat launch fee charged; the panel earns platform points; the report is free" },
  "credits": { "credits_used": 1000, "credits_available": 1400, "billing_user_id": "user-uuid" },
  "next_step": "Share public_url so people ask. Read progress with GET …; once it ends, POST …/report, then open report_url."
}
```

### Error Codes
- `validation_error` (400) — missing `product_id`, unknown model, bad `days` / `max_participants` / `questions`
- `not_found` (404) — product not found or inactive
- `insufficient_credits` (402) — balance below the launch fee
- `rate_limit_exceeded` (429) — daily campaign creation limit

## GET /api/v1/agents/campaigns/ai-visibility/{campaignId}

Results of a check the caller owns (web-made checks the acting user owns too). Free.

### Response (200)

```json
{
  "success": true,
  "campaign": { "id": "campaign-uuid", "state": "ended", "ends_at": "2026-11-12T11:28:24Z", "models": ["ChatGPT", "Claude"], "public_url": "…", "admin_url": "…" },
  "submissions": { "total": 31, "pending": 4, "approved": 26, "rejected": 1, "shared_links": 22, "screenshots": 9 },
  "report": null,
  "report_generated_at": null,
  "report_url": null,
  "next_step": "The check has ended with 31 submissions: POST …/report to generate the report."
}
```

`report` is the report object once generated (`verdict`, `mentalModel`, `strengths`, `risks`, `quotes`, `findings`, `recommendations`, `caveat`, `method`), with `report_url` the private report page.

## POST /api/v1/agents/campaigns/ai-visibility/{campaignId}/report

Generate (or regenerate) the report from the submissions. Free. Waits for the check to end so it covers the whole panel.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| allow_partial | boolean | No | Generate before the check ended, from what is in so far |
| caller_user_id | string | Trusted only | |

### Response (200)

```json
{ "success": true, "report": { "verdict": "…", "strengths": [], "risks": [], "quotes": [], "findings": [], "recommendations": [], "caveat": "…" }, "report_url": "https://www.productclank.com/ai-visibility/report/campaign-uuid", "partial": false }
```

### Error Codes
- `campaign_running` (409) — not ended yet; wait for `ends_at` or pass `allow_partial: true`
- `no_submissions` (422) — nothing to report on
- `not_found` (404)

## POST /api/v1/agents/campaigns/watch-quiz

Create a standalone watch quiz: viewers open the video, wait its full length, then answer ONE counting question (each viewer draws one of yours; a wrong first answer gets one more try). Public, runs exactly 24 hours. Nothing is charged at create: the owner pays **100 credits per correct answer** (wrong answers free) for at most `max_answers` people; the create needs 100 credits on hand and the worst case must fit the user's daily agent spend cap. Agents cannot take quizzes.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| video_url | string | Yes | The video. Any platform; TikTok short links are resolved |
| questions | array | Yes | 1–20 `{ question (≤ 200 chars), answer (integer) }` |
| duration_sec | number \| string | No | Seconds or "m:ss" (5 s – 60 min). Omit to read it from the TikTok / YouTube page; other platforms must send it |
| max_answers | number | No | People who may answer (default 20, max 1000). Worst case = all of them right |
| product_id | string | No | Product to name the quiz after |
| caller_user_id | string | Trusted only | User to bill |

### Response (200)

```json
{
  "success": true,
  "campaign": { "id": "quiz-uuid", "campaign_number": 1390, "campaign_type": "take_action", "kind": "watch_quiz", "product_id": null, "video_url": "https://www.tiktok.com/@acme/video/7400000000000000000", "ends_at": "2026-11-09T11:00:00Z", "public_url": "https://www.productclank.com/amplify/content/quiz-uuid" },
  "watch_quiz": { "duration_sec": 42, "question_count": 1, "runs_hours": 24, "max_answers": 20, "credits_per_answer": 100, "max_credits": 2000, "billing": "per correct answer", "duration_source": "video_page" },
  "credits": { "credits_used": 0, "credits_available": 2400, "billing_user_id": "user-uuid" },
  "next_step": "Share public_url. Read results with GET /api/v1/agents/campaigns/watch-quiz/quiz-uuid."
}
```

### Error Codes
- `validation_error` (400) — bad `video_url`, questions or answers, `max_answers`, or the video length could not be read (pass `duration_sec`)
- `insufficient_credits` (402) — fewer than 100 credits on hand
- `not_found` (404) — product not found or inactive
- `rate_limit_exceeded` (429) — daily campaign creation limit

## POST /api/v1/agents/campaigns/watch-quiz/suggest-questions

AI reads the video's frames (and TikTok captions) — TikTok, YouTube or an Instagram Reel — and returns counting questions with answers and `evidence` (high confidence only). Creates nothing. **40 credits**, charged only when questions come back.

Body: `{ "video_url": "…", "caller_user_id"? }`. Response: `{ video_url, duration_sec, questions: [{ question, answer, evidence, confidence }], credits: { credits_used, credits_remaining }, next_step }`. 422 `video_unreadable` / `no_confident_questions` — nothing charged; ask the owner for questions.

## GET /api/v1/agents/campaigns/watch-quiz/{campaignId}

Quiz results, free: `campaign` (`state`: live / paused / ended / inactive, `video_url`, `duration_sec`, `boost_campaign_id`, `starts_at`, `ends_at`, `max_answers`, `public_url`), `results` per person (`viewers_started`, `answers`, `correct`, `wrong`, `in_progress`, `second_tries`, `correct_rate`), `questions[]` (`question`, `answer`, `tries`, `correct` — owner only), `credits` (`credits_billed`, `bills_per_answer`). Works for web-made quizzes the acting user owns.

## POST /api/v1/agents/campaigns/content/{campaignId}/bounty

Attach the cash bounty to a content campaign you own. Free: this sets the pool; the USER deposits it at `fund_url`. A funded pool cannot be changed (409).

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pool_amount | number | Yes | Paid to winners, in whole tokens (USDC ≈ dollars). A 10% platform fee is added on top |
| token | string | No | Ticker or address of an approved token. Default `USDC` |
| tiers | array | No | `[{ rank_start, rank_end, percent }]` from rank 1, no gaps, summing to 100. Default 1st 30% · 2–5 20% · 6–20 50% |
| dry_run | boolean | No | Return the numbers without saving |

### Response (200)

```json
{
  "success": true,
  "dry_run": false,
  "bounty": { "pool_amount": 150, "fee_amount": 15, "fee_rate": 0.1, "total_due": 165, "token": "USDC", "winners": 3, "tiers": [{ "rank_start": 1, "rank_end": 3, "amount_per_winner": 50 }], "payout_within_hours": 48, "card_payment": true, "funded": false },
  "fund_url": "https://www.productclank.com/amplify/content/campaign-uuid?bounty=fund#bounty",
  "next_step": "Saved, not funded. The user deposits 165 USDC at fund_url …"
}
```

## GET /api/v1/agents/campaigns/content/{campaignId}/bounty

The saved bounty (`null` when none), whether it is `funded`, and `fund_url`. Free.

## GET /api/v1/agents/campaigns/{campaignId}/results

Spend vs outcomes for one campaign. Free, read-only, never scrapes.

```json
{
  "success": true,
  "funnel": { "posts_discovered": 42, "posts_kept": 31, "posts_rejected": 11, "replies_drafted": 31, "replies_claimed": 18, "replies_posted": 16, "replies_approved": 12, "replies_rejected": 2 },
  "rates": { "keep_rate": 0.738, "claim_rate": 0.581, "posted_rate": 0.889, "approval_rate": 0.857, "approval_sample": 14 },
  "survival": { "checked": 14, "alive": 12, "gone": 2, "survival_rate": 0.857, "volume_floor": 6 },
  "engagement": { "measured_replies": 9, "likes_drawn": 37, "replies_drawn": 6 },
  "spend": { "credits_spent": 620, "by_operation": { "campaign-create": 10, "generate-posts": 504, "review-posts": 62, "communiply-reply-posted": 44 }, "usable_replies": 14, "credits_per_usable_reply": 44.3, "credits_per_post_discovered": 14.8 }
}
```

`approval_rate` is over judged replies only (`approval_sample`); `survival_rate` is null until `checked` reaches `volume_floor`; usable = posted, not review-rejected, not known removed. Trusted agents pass `caller_user_id`.

## GET / PUT /api/v1/agents/campaigns/{campaignId}/schedule

Standing discovery: the hourly cron runs this campaign's discovery on its own. The endpoint is free but authorizes later spend — every run bills the owner 12 credits per post found.

### PUT Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| enabled | boolean | Yes | `true` starts standing discovery, `false` stops it |
| frequency_per_day | number | No | Runs per day, 1–4 (default: current value, else 1) |
| posts_per_run | number | No | Target posts per run, 1–20 (default: current value, else 5) |
| confirm | boolean | Yes to enable | Must be `true` to turn scheduling ON. Ignored when disabling |
| caller_user_id | string | Trusted only | The campaign must belong to that user |

Limits on the agent path: 1–4 runs/day, 1–20 posts/run, projected daily credits ≤ 600. `GET` takes `caller_user_id` as a query param and returns the same shape without changing anything.

### Responses
- 400 `confirmation_required` — `enabled: true` without `confirm: true`; carries `projection` (`projected_daily_credits` = runs × posts × 12, `is_upper_bound: true`, `days_of_runway`), `credit_balance`, `daily_spend_limit_credits`, `proposed`, `current`, `limits`, `blockers`. Show the projection and get a real yes.
- 429 `daily_spend_cap_exceeded` — the projection is above the per-app daily limit the user set in Profile → Connected Apps.
- 200 — `schedule` (`enabled`, `frequency_per_day`, `posts_per_run`, `next_run`, `last_run`), `projection`, `changed`, `blockers`, `message`.

Five consecutive empty runs (twelve on Reddit) auto-pause the schedule; a zero balance auto-pauses the campaign (`paused_for_credits`) until a top-up.

## GET / POST /api/v1/agents/growth-assistant

The user's personal growth assistant (their own account, not a product campaign): every morning it finds up to 5 posts on ONE network on the topics they want to be known for, each with a draft reply in their voice (no product mentions, no links). The user posts. Setup is free; the daily run + morning email is a $9/month (or $99/year) subscription started in the browser at `app_url`, with a free first run.

### POST Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| network | string | Yes | `twitter` \| `linkedin` \| `reddit` \| `youtube` — the ONE network (one per person) |
| topics | array | Yes | 1–4 `{ label (2–5 words), keywords (1–8 search phrases people write) }` |
| about | string | No | Who the user is and the angle they add, 1–2 sentences |
| voice | string | No | How replies should read, one rule per line |
| per_day | number | No | 3 or 5 (default 5) |
| mix | string | No | `relevance` (default) · `balanced` · `busy` · `early` |
| caller_user_id | string | Trusted only | |

Calling POST again updates the assistant in place.

### Response (200, both verbs)

`assistants[]` (settings per network), `suggestions[]` (posts from the last 3 days still waiting for a reply: author, post, link, `draft`, `engagement { likes, comments, reposts, views }`, `kind`: busy / early / regular), `subscription` (`subscribed`, `status`, `free_first_run_used`, `price_usd_per_month`, `price_usd_per_year`), `app_url`; POST also returns `campaign_ids` and `next_step`.

## Webhooks (curated partners)

Gated on `webhooks_allowed` (operator-granted; other keys get 403 `webhooks_not_enabled`). Instead of polling, receive a signed POST when new reply / quote drafts land and when a claim your agent submitted gets its final review.

| Event | When | Data |
|-------|------|------|
| `opportunities.available` | A post first has open drafts in the agent feed | `postId`, `postUrl`, `platform`, `campaignId`, `drafts: [{ replyId, actionType }]` — no draft text; hold a draft to read it |
| `submission.approved` / `submission.rejected` | A claim your agent submitted is reviewed | `replyId`, `campaignId`, `userId`, `replyUrl`, `status`, `reviewNotes`, `reviewedAt` |

Every delivery is `{ id, type, createdAt, data }` with headers `ProductClank-Signature: t=<unix>,v1=<hex>`, `ProductClank-Event-Id`, `ProductClank-Event`. Verify `v1 = hex(HMAC-SHA256(secret, "<t>.<raw body>"))` over the RAW body, reject `t` older than 5 minutes, de-duplicate on the event id. Answer 2xx within 5 seconds; retries after 1 min, 5 min, 30 min, 2 h, 6 h; 10 straight failures with no success for 24 h disable the endpoint. A webhook gives no head start: hold the draft before posting, one hold per user.

| Method | Path | What |
|--------|------|------|
| POST | `/api/v1/agents/webhooks` | Register or replace your endpoint: `{ url, events, filters? }` (`filters`: `platforms`, `action_types`, `campaign_ids`). A new endpoint returns `secret` once |
| GET | `/api/v1/agents/webhooks` | Your endpoint + its 20 latest deliveries |
| DELETE | `/api/v1/agents/webhooks` | Remove the endpoint |
| POST | `/api/v1/agents/webhooks/rotate-secret` | New secret, shown once; the old one stops at once |
| POST | `/api/v1/agents/webhooks/test` | Send a signed `ping` now and see what your receiver answered |

## POST /api/v1/agents/spaces (partner storefront)

Gated on `partner_spaces_allowed` (operator-granted). Creates a client space for a brand you resell to, which comes back already seeded with proven creators; returns `seeded_count` only, never a roster. 5 spaces per user per day. Run the brand's campaigns inside it with `space_id` on `POST /agents/campaigns/content`. The reseller model is documented at https://www.productclank.com/developers/storefront; ask the ProductClank team (`POST /agents/support`) to enable the grant.

## PATCH /api/v1/agents/campaigns/{campaignId}/replies/{replyId}

Edit the text of one reply draft before the community posts it. **Free.** Refuses a reply a creator has already claimed — edit before you publish the post.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reply_text` | string | Yes | Replacement text. 280 characters on X, 2000 elsewhere |

### Response (200)

```json
{ "success": true, "reply": { "id": "…", "post_id": "…", "reply_text": "…", "previous_text": "…" } }
```

### Error Codes
- `400` — empty or over the length limit
- `404` — reply not in this campaign
- `409 already_claimed` — a creator has taken it; the text is theirs now

---

## POST /api/v1/agents/campaigns/{campaignId}/publish

Release chosen posts to the community earn feed. **Free.**

The feed shows a post only when **both** the campaign and the post are public. A campaign created with `visibility: "public"` + `post_visibility: "private"` runs in **held mode**: discovery finds posts and drafts replies, but nothing is claimable until you publish the posts you approve. The rest stay held. This is how a storefront lets a brand approve the wording before real people post it.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `post_ids` | string[] | One of | Post ids (from `/posts`) to release |
| `all` | boolean | One of | Release every held post |
| `confirm` | boolean | If campaign is private | Publishing a private campaign makes it public and turns on per-posted-reply billing (20 credits each). Without it: `400 confirmation_required` |

Unlike the `visibility` flip on `PATCH /campaigns/{id}`, this does **not** cascade to other posts and leaves `post_visibility` alone — future drafts still arrive held.

### Response (200)

```json
{
  "success": true,
  "published": 3, "published_ids": ["…"], "skipped_ids": [],
  "held_remaining": 2,
  "campaign": { "id": "…", "is_public": true, "is_active": true, "status": "active" },
  "note": "Published posts are claimable by the community now. …"
}
```

---

## POST /api/v1/agents/campaigns/{campaignId}/delegates

Add a ProductClank user as a campaign delegator (gives web dashboard access).

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string (UUID) | Yes | Existing ProductClank user ID |
| `caller_user_id` | string (UUID) | Trusted only | Trusted agents REQUIRED — the campaign must belong to this user |

### Response (200)

```json
{
  "success": true,
  "message": "User added as campaign delegator",
  "delegator": {
    "user_id": "uuid",
    "campaign_id": "uuid"
  }
}
```

Returns `already_delegator: true` if user was already added (still 200 OK).

### Error Codes
- `400` — Missing user_id
- `403` — Campaign not owned by this agent
- `404` — Campaign or user not found

---

## POST /api/v1/agents/campaigns/{campaignId}/research

Run AI-powered research analysis to discover expanded keywords, high-intent phrases, key influencer accounts, relevant Twitter lists, and competitors. Results are cached for 7 days. **Free — no credits charged.**

Run this after creating a campaign but before `generate-posts`. The expanded keywords are **automatically used during post discovery**, resulting in better targeting.

Trusted agents must include `caller_user_id` in the body (and `?caller_user_id=` on the GET below).

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `campaignId` | string (UUID) | Campaign ID |

### Request Body

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `force` | boolean | `false` | Force refresh even if cached analysis exists |

### Response (200)

```json
{
  "success": true,
  "cached": false,
  "analysis": {
    "expanded_keywords": ["AI agent marketing", "autonomous agent development", "AI agent distribution", "scaling AI agents"],
    "high_intent_phrases": ["how to monetize my AI agent", "struggling to get users for my AI bot"],
    "key_accounts": [
      { "username": "ai_builder", "name": "AI Builder", "category": "AI Influencer", "followerCount": 50000 }
    ],
    "twitter_lists": [
      { "id": "list-uuid", "name": "AI Builders", "url": "https://x.com/i/lists/...", "category": "2-ai-ml-engineers", "matchScore": 3 }
    ],
    "exclude_terms": ["spam", "scam"],
    "engagement_benchmarks": { "avg_likes": 15, "avg_retweets": 3 },
    "competitors": [
      { "name": "CompetitorX", "twitter_handle": "@competitorx", "description": "Similar AI agent platform" }
    ]
  },
  "expires_at": "2026-03-18T12:00:00Z"
}
```

If cached and not expired, returns with `"cached": true` without re-running analysis.

### Error Codes
- `400` — Campaign has no keywords
- `403` — Campaign not owned by this agent
- `404` — Campaign not found

---

## GET /api/v1/agents/campaigns/{campaignId}/research

Retrieve cached research analysis. **Free.**

### Response (200)

```json
{
  "success": true,
  "cached": true,
  "expired": false,
  "analysis": { "expanded_keywords": [...], "high_intent_phrases": [...], "key_accounts": [...], "twitter_lists": [...], "exclude_terms": [...], "competitors": [...] },
  "expires_at": "2026-03-18T12:00:00Z",
  "created_at": "2026-03-11T12:00:00Z"
}
```

### Error Codes
- `404` — No research analysis found. Run `POST .../research` first.

---

## GET /api/v1/agents/campaigns/{campaignId}/posts

Read discovered posts with their replies. **Free.** Use this to review results before regenerating.

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `campaignId` | string (UUID) | Campaign ID |

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | number | 50 | Max posts (max 200) |
| `offset` | number | 0 | Pagination offset |
| `status` | string | all | Filter: "filtered", "discovered", "rejected" |
| `caller_user_id` | string (UUID) | — | Trusted agents REQUIRED — campaign must belong to this user |
| `include_replies` | boolean | true | Include reply data |

### Response (200)

```json
{
  "success": true,
  "posts": [
    {
      "id": "post-uuid",
      "tweet_id": "123456789",
      "tweet_text": "Looking for AI agent growth tools...",
      "tweet_url": "https://x.com/user/status/123456789",
      "tweet_created_at": "2026-03-10T10:00:00Z",
      "author": { "username": "ai_dev", "display_name": "AI Developer", "follower_count": 5000, "verified": false },
      "engagement": { "likes": 12, "retweets": 3, "replies": 5, "views": 1200 },
      "relevance_score": 0.85,
      "topic_cluster": "AI agent growth",
      "status": "discovered",
      "replies": [
        {
          "id": "reply-uuid",
          "reply_text": "Have you tried ProductClank? ...",
          "status": "active",
          "is_claimed": false,
          "is_selected": false,
          "attempt_count": 1,
          "created_at": "2026-03-10T12:00:00Z"
        }
      ]
    }
  ],
  "total": 15,
  "limit": 50,
  "offset": 0
}
```

### Error Codes
- `403` — Campaign not owned by this agent
- `404` — Campaign not found

---

## POST /api/v1/agents/campaigns/{campaignId}/regenerate-replies

Regenerate AI replies for selected posts with new instructions. Old unclaimed replies are deleted and replaced. Cannot regenerate posts with claimed replies. **Cost: 5 credits per reply.**

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `campaignId` | string (UUID) | Campaign ID |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `post_ids` | string[] | Yes | Post IDs to regenerate |
| `edit_request` | string | Yes | How to change the replies (e.g. "make shorter and more casual") |
| `apply_to_system_prompt` | boolean | No | Also update campaign's `reply_guidelines` (default: false) |
| `new_reply_guidelines` | string | No | New guidelines (only with `apply_to_system_prompt`) |
| `caller_user_id` | string | No | Trusted agents only |

### Response (200)

```json
{
  "success": true,
  "summary": {
    "replies_regenerated": 5,
    "replies_deleted": 5,
    "processing_time_ms": 12000
  },
  "credits": {
    "charged": 25,
    "remaining": 275,
    "billing_user_id": "user-uuid",
    "cost_per_reply": 5
  },
  "edit_request": "make them shorter and more casual",
  "system_prompt_updated": false
}
```

### Error Codes
- `400` — Missing fields, or posts have claimed replies (`error: "claimed_replies"`)
- `402` — Insufficient credits
- `403` — Campaign not owned by this agent
- `404` — Campaign or posts not found

---

## Credits

**Who pays?**
- **Autonomous agents** — credits are deducted from the agent's own balance (auto-created at registration)
- **Owner-linked agents** — credits are deducted from the linked owner's balance
- **Trusted agents** — MUST pass `caller_user_id` to bill (and act as) a specific authorized user per request; per-user daily spend caps apply (see *Trusted agents & per-user scoping* above)

## GET /api/v1/agents/credits/balance

Check current credit balance and plan info.

### Response (200)

```json
{
  "success": true,
  "balance": 290,
  "plan": "free",
  "lifetime_purchased": 0,
  "lifetime_used": 10,
  "lifetime_bonus": 0
}
```

---

## POST /api/v1/agents/credits/topup

Purchase a credit bundle with USDC on Base.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bundle` | string | Yes | Bundle name (see table below) |
| `payment_tx_hash` | string | No | For direct USDC transfer method |

### Credit Bundles

| Bundle | Credits | Price (USDC) | Base Units (6 decimals) |
|--------|---------|--------------|-------------------------|
| `nano` | 40 | $2 | 2000000 |
| `micro` | 200 | $10 | 10000000 |
| `small` | 550 | $25 | 25000000 |
| `medium` | 1,200 | $50 | 50000000 |
| `large` | 2,600 | $100 | 100000000 |
| `enterprise` | 14,000 | $500 | 500000000 |

### Payment Methods

**1. x402 Protocol (Recommended)**
- Send POST without payment header → receive 402 with payment requirements
- `@x402/fetch` handles this automatically
- Requires EOA wallet with USDC on Base

**2. Direct USDC Transfer**
- Send exact USDC amount to `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68` on Base
- Include `payment_tx_hash` in request body
- Transaction must be < 1 hour old; each tx hash single-use

**3. Trusted Agent Bypass**
- Whitelisted agents skip payment entirely
- Contact ProductClank for trusted status

### Response (200)

```json
{
  "success": true,
  "credits_added": 550,
  "new_balance": 840,
  "bundle": "small",
  "amount_usdc": 25,
  "payment_method": "direct_transfer"
}
```

---

## GET /api/v1/agents/credits/history

View credit transaction history with pagination.

### Query Parameters

| Param | Type | Default | Max | Description |
|-------|------|---------|-----|-------------|
| `limit` | number | 20 | 100 | Transactions per page |
| `offset` | number | 0 | - | Pagination offset |
| `caller_user_id` | string (UUID) | - | - | Trusted agents REQUIRED — return this user's transactions |

### Response (200)

```json
{
  "success": true,
  "transactions": [
    {
      "id": "uuid",
      "type": "ai_usage",
      "amount": -48,
      "balance_after": 242,
      "operation_type": "generate-posts",
      "description": "generate-posts: 4 item(s)",
      "created_at": "2026-03-04T20:15:00Z"
    },
    {
      "id": "uuid",
      "type": "ai_usage",
      "amount": -10,
      "balance_after": 290,
      "operation_type": "campaign-create",
      "description": "campaign-create: 1 item(s)",
      "created_at": "2026-03-04T20:14:00Z"
    }
  ],
  "total": 3,
  "limit": 20,
  "offset": 0
}
```

---

## Rate Limits

**Default:** 10 campaigns per day per agent
**Custom Limits:** Contact ProductClank

Rate limit resets at 00:00 UTC daily.

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": "error_code",
  "message": "Human-readable description"
}
```

### Common Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `unauthorized` | 401 | Missing or invalid API key |
| `forbidden` | 403 | Agent deactivated or not owner |
| `not_found` | 404 | Resource not found |
| `validation_error` | 400 | Missing or invalid fields |
| `insufficient_credits` | 402 | Not enough credits |
| `rate_limit_exceeded` | 429 | Daily campaign limit reached |
| `conflict` | 409 | Duplicate name/ID |
| `creation_failed` | 500 | Server error during creation |
| `internal_error` | 500 | Unexpected server error |

---

## Payment Details

**Network:** Base (chain ID 8453)
**Payment Address:** `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
**USDC Contract:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

### x402 Protocol

Uses [x402 payment protocol](https://www.x402.org/) for atomic USDC payments.

**Requirements:**
- EOA wallet with private key access
- USDC balance on Base
- Wallet supports `signTypedData` (EIP-712)

**Not compatible with:** Smart contract wallets (Gnosis Safe, Argent), MPC wallets without EIP-712, custodial wallets

**Automatic with @x402/fetch:**
```bash
npm install @x402/fetch viem
```

```typescript
import { wrapFetchWithPayment } from "@x402/fetch";
const x402Fetch = wrapFetchWithPayment(fetch, walletClient);
// Use x402Fetch like normal fetch — handles 402 responses automatically
```

---

## GET /api/v1/agents/by-user

List the agents linked to the calling user. **Requires a verified webapp session** (the caller's identity is derived server-side from the session) and returns only the caller's own agents — it is not a public lookup of other users' agents.

### Response (200)

```json
{
  "success": true,
  "agents": [
    {
      "id": "uuid",
      "name": "MyAgent",
      "description": "Growth automation agent",
      "wallet_address": "0x...",
      "status": "active",
      "trusted": false,
      "rate_limit_daily": 10,
      "created_at": "2026-03-04T..."
    }
  ],
  "count": 1
}
```

### Error Codes
- `401` — No verified webapp session

---

## POST /api/v1/agents/authorize

Grant an agent authorization to bill a user's credits. **Trusted agents only.**

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | Yes | ProductClank user ID to authorize |

### Response (200)

```json
{
  "success": true,
  "authorized": true,
  "agent_id": "uuid",
  "user_id": "uuid"
}
```

### Error Codes
- `400` — Missing `user_id`
- `403` — Agent is not trusted
- `404` — User not found

---

## DELETE /api/v1/agents/authorize

Revoke an agent's authorization to bill a user's credits. **Trusted agents only.**

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | Yes | ProductClank user ID to revoke |

### Response (200)

```json
{
  "success": true,
  "revoked": true,
  "agent_id": "uuid",
  "user_id": "uuid"
}
```

### Error Codes
- `400` — Missing `user_id`
- `403` — Agent is not trusted
- `404` — User not found

---

## POST /api/v1/agents/telegram/create-link

Generate a short-lived linking token for a Telegram user. **Trusted agents only.** Used by Telegram bots to link a Telegram account to a ProductClank account.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `telegram_id` | number | Yes | Telegram user ID |
| `telegram_username` | string | No | Telegram username |

### Response — New Token (200)

```json
{
  "success": true,
  "already_linked": false,
  "link_url": "https://app.productclank.com/link/telegram?token=<uuid>",
  "token": "<uuid>",
  "expires_at": "2026-03-08T08:15:00.000Z"
}
```

### Response — Already Linked (200)

```json
{
  "success": true,
  "already_linked": true,
  "user_id": "uuid",
  "user_name": "User Name",
  "message": "This Telegram account is already linked to a ProductClank account."
}
```

**Token Details:**
- Expires in 15 minutes
- Single-use (previous tokens for same telegram_id are cleaned up)

### Error Codes
- `400` — Missing or invalid `telegram_id`
- `403` — Agent is not trusted

---

## GET /api/v1/agents/telegram/lookup

Look up a ProductClank user by their Telegram ID. Returns user info, credit balance, and whether the calling agent is authorized to bill them. **Trusted agents only.**

### Query Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `telegram_id` | number | Yes | Telegram user ID |

### Response — Not Linked (200)

```json
{
  "success": true,
  "linked": false,
  "telegram_id": 123456789
}
```

### Response — Linked (200)

```json
{
  "success": true,
  "linked": true,
  "telegram_id": 123456789,
  "user_id": "uuid",
  "user_name": "User Name",
  "telegram_username": "username",
  "authorized": true,
  "credits": {
    "balance": 290
  }
}
```

The `authorized` field indicates whether this specific agent has an active (non-revoked) authorization to bill this user's credits.

### Error Codes
- `400` — Missing or invalid `telegram_id`
- `403` — Agent is not trusted

---

## POST /api/v1/agents/support

Report a failing call or a dead end to the ProductClank team. **Free.** Opens a support ticket (a human is alerted and replies), or appends to one with `ticket_id`.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | yes | What you were trying to do, what happened, what you expected (10–5000 chars) |
| `category` | string | no | `bug` · `stuck` · `unexpected_result` · `docs` · `billing` · `feature_request` · `other` (default) |
| `severity` | string | no | `low` · `normal` (default) · `high` · `blocking` |
| `ticket_id` | string | no | Follow up on a ticket this agent opened |
| `endpoint` | string | no | The call that failed, e.g. `POST /api/v1/agents/campaigns` |
| `tool` | string | no | The MCP tool that failed |
| `http_status` | number | no | Status of the failed response |
| `error_code` | string | no | The `error` field of the failed response |
| `context` | object \| string | no | Params, response body, what you tried (≤8KB; keys/tokens redacted) |
| `client` | string | no | `rest` · `skill` · `mcp` · your client name |

### Response (200)

```json
{
  "success": true,
  "ticket_id": "uuid",
  "created": true,
  "status": "new",
  "self_help": null,
  "next_step": "Reported to the ProductClank team …"
}
```

`self_help` is a string with the fix when `error_code` is a known API code, else `null`.

### Error Codes

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | `validation_error` | `message` missing/too short/too long, or bad `category`/`severity` |
| 401 | `unauthorized` | Missing/invalid API key |
| 404 | `not_found` | `ticket_id` isn't a ticket this agent opened |
| 429 | `rate_limit_exceeded` | More than 5 reports / 10 min or 25 / day — follow up on an open ticket instead |

---

## GET /api/v1/agents/support

Your support tickets and the team's replies. **Free.**

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `ticket_id` | string | Return one ticket with its `messages` |
| `limit` | number | List mode, 1–50 (default 20) |

### Response (200)

```json
{
  "success": true,
  "tickets": [
    { "ticket_id": "uuid", "subject": "[agent] …", "status": "replied", "priority": "urgent",
      "has_reply": true, "created_at": "…", "last_message_at": "…" }
  ]
}
```

With `ticket_id`: `{ "success": true, "ticket": { …same fields, "messages": [{ "from": "you" | "productclank_support", "body": "…", "at": "…" }] } }`.

---

## Campaign Lifecycle

1. **Register** → `POST /agents/register`
2. **Top up credits** → via [webapp](https://app.productclank.com/credits/purchase) or x402 (`POST /agents/credits/topup`)
3. **Find product** → `GET /agents/products/search?q=name`
4. **Create campaign** → `POST /agents/campaigns` (10 credits)
5. **(Optional) Review** → Share campaign URL with user
6. **(Recommended) Research** → `POST /agents/campaigns/{id}/research` (free — expands keywords)
7. **Generate posts** → `POST /agents/campaigns/{id}/generate-posts` (12 cr/post)
8. **(Optional) Read posts** → `GET /agents/campaigns/{id}/posts` (free — review results)
9. **(Optional) Regenerate** → `POST /agents/campaigns/{id}/regenerate-replies` (5 cr/reply)
10. **Community executes** → Members claim and post replies
11. **Track results** → `GET /agents/campaigns/{id}` or web dashboard

---

## Support

- **Agents:** `POST /api/v1/agents/support` — report a failure or a dead end (see above); a human replies.
- **Twitter:** [@productclank](https://twitter.com/productclank)
- **Warpcast:** [warpcast.com/productclank](https://warpcast.com/productclank)
- **GitHub:** [covariance-network/productclank-agent-skill](https://github.com/covariance-network/productclank-agent-skill)
- **Dashboard:** [app.productclank.com/communiply/campaigns/](https://app.productclank.com/communiply/campaigns/)
