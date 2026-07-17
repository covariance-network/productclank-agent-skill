# Content Studio — API Reference

Draft content candidates into a ProductClank content space. Both endpoints are
**free** and part of the public Agents API. The content engine is the source of
truth; this skill and the MCP connector are wrappers over these two endpoints.

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

**Request**

```json
{
  "space_id": "c75562db-3341-…",
  "candidates": [
    {
      "text": "Shipped agent-written content today 🚀",
      "title": "Launch",
      "platform": "ProductClank X",
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
| 404 | `not_found` | The content engine is not enabled on that space. |

Error shape:

```json
{ "success": false, "error": "not_found", "message": "Content is not enabled for this space. Turn it on at /content first." }
```
