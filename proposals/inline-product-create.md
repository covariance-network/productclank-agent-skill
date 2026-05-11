# Proposal: Inline product create on `POST /agents/campaigns`

**Status:** Draft — for review by the app-productclank team
**Author:** Agent skill team
**Related:** [PR #4](https://github.com/covariance-network/productclank-agent-skill/pull/4) (Boost `product_id` made optional, v3.2.0)

---

## Context

PR #4 relaxed the Boost endpoint to accept `product_id = null`, matching the webapp's existing tweet-first Amplify behavior. That solved the Boost case.

For Discover/Communiply campaigns (`POST /api/v1/agents/campaigns`), `product_id` is still required by both the client form (`CommuniplyFormContext.tsx:42`) and the server route (`create-campaign/route.ts:99`). **This is correct for output quality** — the research, relevance-scoring, and reply-generation pipelines all depend on product context (description, website, brand voice, category) to produce on-brand output. Making `product_id` simply optional would degrade Discover quality on multiple axes (see risk table below for the analysis).

However, it creates a real agent UX problem: an autonomous agent cannot launch a Discover campaign for a product that isn't already registered on ProductClank, because there is no agent-facing way to create a product. The only product endpoint is `GET /agents/products/search`. Today the docs route the user out of the agent flow entirely to manually create a product in the webapp.

## Goal

Let an agent launch a Discover/Communiply campaign in a single API call for a product that doesn't yet exist on ProductClank, **without** sacrificing the product-context quality that Discover depends on.

## Non-goals

- Making `product_id` optional on Discover (rejected — quality risk).
- Modifying Boost (already product-optional after v3.2.0).
- Building a full product-management surface for agents (could be a follow-up: standalone `POST /agents/products`, `PATCH /agents/products/{id}`).

## Proposed change

Extend `POST /api/v1/agents/campaigns` to accept **either** an existing `product_id` **or** an inline `product` block. Exactly one must be provided.

### Request body — new field

```json
{
  "product": {
    "name": "MyApp",                                   // required
    "website": "https://myapp.com",                    // strongly recommended (dedup signal + reply context)
    "tagline": "One-line description",                 // optional
    "description": "Longer description used for research and reply prompts", // optional but improves quality
    "category": ["Productivity"],                      // optional
    "twitter": "@myapphandle",                         // optional
    "logo": "https://...",                             // optional
    "find_or_create": true                             // default true — reuse existing product if matched
  },
  // ... rest of existing campaign fields unchanged: title, keywords, search_context, etc.
}
```

### Validation rules

- `product_id` XOR `product` — exactly one must be present. `400` if both or neither.
- If `product`:
  - `name` required, trimmed, 1–80 chars.
  - `website` if provided must parse as a valid URL (canonicalized: scheme + host only for dedup).
  - `twitter` if provided is normalized to `@handle` form.
- Existing `product_id` flow unchanged — fully backward compatible.

### Server behavior

When `product` is provided:

1. **Resolve owner** — same user the campaign would be billed to:
   - Autonomous agent → agent's own context.
   - Owner-linked agent → linked user.
   - Trusted agent with `caller_user_id` → that user.
2. **Dedup (default `find_or_create: true`):**
   - Look up product owned by this user matching, in order:
     1. canonicalized `website` (scheme-stripped, lowercased, trailing slash removed) — strongest signal
     2. exact `name` (case-insensitive, trimmed)
   - If matched → reuse `product.id`.
3. **Create (no match, or `find_or_create: false`):**
   - Insert a new product row owned by the resolved user with the supplied fields.
   - **No credits charged** — product creation is free, same as the webapp.
   - Tag `created_via = 'agent-api'` for analytics.
4. **Proceed** with normal campaign creation using the resolved `product_id`. Cost stays `10 credits`.

### Response

Existing campaign response, plus a `product` block telling the caller what happened — so agents can surface dedup decisions to the user:

```json
{
  "success": true,
  "campaign": { ... },
  "product": {
    "id": "uuid",
    "created": false,         // true = new product inserted, false = existing matched
    "match_reason": "website" // or "name", or null when newly created
  },
  "credits": { ... },
  "next_step": { ... }
}
```

### Errors

- `400 validation_error` — both `product_id` and `product` provided, or neither; missing `name`; invalid `website` URL.
- `404 not_found` — explicit `product_id` not found (unchanged).
- `409 conflict` — `find_or_create: false` and a product with the same canonical website or name already exists for this owner. Response includes the conflicting `product_id`.
- `402`, `429`, etc. unchanged.

## Why this preserves quality

The core constraint: research, `review-posts`, and `generate-posts` all read product fields. With this proposal, **a real product row exists** by the time any of those run. Every existing prompt path keeps working as today.

Quality only degrades if the agent supplies a thin `product` block (e.g., `name` only). That's a content-quality risk, not a system risk — equivalent to a user creating a sparse product in the webapp. The mitigation is documentation, not architecture: tell agents in `SKILL.md` to populate `description` + `website` whenever the user has provided enough info to do so.

## Risk table

| Risk | Likelihood | Mitigation |
|---|---|---|
| Agents create duplicates via different name spellings | Medium | Default `find_or_create: true`; website-first dedup; expose `match_reason` so agents can confirm with user. |
| Agents create low-quality stub products that hurt research | Medium | Document recommended fields in SKILL.md. Optionally: include `"product_warnings": ["sparse_description"]` in the response when fields are thin. |
| Trusted agents create products for the wrong user | Low | Owner resolved from same auth path as billing — reuses existing `caller_user_id` enforcement. |
| Spam — agents create many junk products | Low | Daily campaign rate limit caps the volume implicitly. Add a separate `created_via='agent-api'` rate limit if real abuse appears. |
| Cross-user name collision | Low | Dedup scoped per-owner only; no global lookup. |
| User confusion: campaign attached to a different existing product than expected | Low-Medium | `match_reason` in response lets the agent show "linked to existing product X — is this correct?" |

## Webapp & DB impact

- **DB:** no schema change required if the products table already accepts the fields above (it does — same fields as the manual create flow). Add `created_via` column if not present (small migration).
- **Webapp UI:** no change required. Products created via the agent API appear in the user's product list as normal. Optional polish: show a small "Created by agent: MyAgent" badge so users can audit before paid campaigns run on them.
- **Existing manual product creation:** unaffected.

## Agent skill changes (after backend ships)

1. `SKILL.md` — Discover capability:
   - Update the request body schema to show `product_id` OR `product`.
   - Discover step 1 in the interaction guide: search first; if no match, offer to inline-create with the user's permission.
   - Add a short "Inline product create" subsection with an example.
2. `references/API_REFERENCE.md` — full request/response schema for the new field.
3. `references/FAQ.md` — new Q: "What if my product isn't on ProductClank yet?"
4. `references/EXAMPLES.md` — example showing the inline-create flow.
5. Version bump to `3.3.0`; CHANGELOG entry.

## Open questions for the app team

1. **Dedup precedence** — website-first then name, or name-first then website? Asking because agents frequently have only a name from user conversation.
2. **Auto-population from website** — when only `name` + `website` are given, should the server attempt to fetch the site for description / OG tags / logo? Would improve quality but adds latency and a scraping dependency.
3. **Standalone `POST /agents/products`** — should we add one alongside? Inline-create solves the one-shot campaign case; a standalone endpoint helps "search → create → then do other things" patterns and parallels the webapp.
4. **Audit / trust signal** — should agent-created products be flagged differently in the webapp UI ("Created by agent — review details")? Useful before users authorize paid campaigns against them.
5. **Quotas** — any concern about agents creating products with no credit cost? Could add a 1-credit charge if needed to deter abuse.

## Rollout plan

1. Backend ships behind feature flag (`agents_inline_product_create`).
2. Internal smoke test: create campaigns via both `product_id` and inline-product paths; verify research + generate-posts run identically.
3. Enable for autonomous agents first; monitor duplicate-creation rate via `match_reason` analytics.
4. Update agent skill (`v3.3.0`) once backend is stable.
5. Remove flag after a release cycle.

---

## Example agent flow (post-implementation)

```typescript
// User: "Launch a Discover campaign for MyApp — productivity tool at myapp.com"
const res = await fetch(`${API}/campaigns`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    product: {
      name: "MyApp",
      website: "https://myapp.com",
      description: "Productivity tool that helps teams collaborate async",
      category: ["Productivity"],
      twitter: "@myapp",
    },
    title: "MyApp Launch Week",
    keywords: ["async collaboration", "remote teams", "productivity tools"],
    search_context: "People discussing async work and remote team productivity",
  }),
}).then(r => r.json());

if (res.product.created) {
  // Confirm with user
  console.log(`Created new product "MyApp" — id: ${res.product.id}`);
} else if (res.product.match_reason) {
  console.log(`Matched existing product by ${res.product.match_reason} — id: ${res.product.id}`);
}
```
