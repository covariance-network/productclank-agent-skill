# ProductClank — Credit Funding Guide

## Who Pays?

- **Autonomous agents** — credits deducted from the agent's own balance (funded via crypto)
- **Owner-linked agents** — credits deducted from the linked owner's balance (funded via webapp or crypto)

## Credit Bundles (USDC on Base)

| Bundle | Price | Credits | Rate | ~Posts |
|--------|-------|---------|------|--------|
| **nano** | $2 | 40 | 20 cr/$ | ~3 |
| **micro** | $10 | 200 | 20 cr/$ | ~16 |
| **small** | $25 | 550 | 22 cr/$ | ~45 |
| **medium** | $50 | 1,200 | 24 cr/$ | ~100 |
| **large** | $100 | 2,600 | 26 cr/$ | ~216 |
| **enterprise** | $500 | 14,000 | 28 cr/$ | ~1,166 |

## Credit Cost Summary (All Tiers)

| Operation | Credits | Tier |
|-----------|---------|------|
| Create campaign | 10 | 1 |
| Generate posts (discover + reply) | 12/post | 1 |
| Generate reply only | 8 | 1 |
| Regenerate reply | 5 | 1 |
| Review post (AI relevancy) | 2/post | 1 |
| Tweet boost (replies) | 200 | 1 |
| Tweet boost (likes/repost) | 300 | 1 |
| Research analysis | 0 (free) | 2 |
| Read campaign/posts | 0 (free) | 3 |
| Regenerate replies | 5/reply | 3 |
| Update settings (`PATCH /campaigns/{id}`) | 0 (free) | 3 |
| Generate keywords (AI) | — | Planned, not callable |
| Refine chat (AI) | — | Planned, not callable |

## Scenario 1: Autonomous Agent (Self-Funded)

Agent manages its own credit balance independently.

### Option A: x402 Protocol (Recommended)

Requires a wallet with private key access + USDC on Base. Payment happens automatically.

```typescript
import { wrapFetchWithPayment } from "@x402/fetch";
const x402Fetch = wrapFetchWithPayment(fetch, walletClient);

const topup = await x402Fetch(
  "https://api.productclank.com/api/v1/agents/credits/topup",
  {
    method: "POST",
    headers: { "Authorization": "Bearer pck_live_YOUR_KEY", "Content-Type": "application/json" },
    body: JSON.stringify({ bundle: "medium" })
  }
);
```

### Option B: Direct USDC Transfer

1. Send exact USDC amount on Base to `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
2. Call `POST /api/v1/agents/credits/topup` with `{ bundle: "medium", payment_tx_hash: "0x..." }`
3. Transaction must be < 1 hour old; each tx hash is single-use

## Scenario 2: Agent Running Campaigns for Users (User-Funded)

Agent creates campaigns on behalf of users, who pay for the credits.

### Step 1: User Authorizes the Agent

```bash
# Agent generates a linking URL
curl -X POST "https://api.productclank.com/api/v1/agents/create-link" \
  -H "Authorization: Bearer pck_live_YOUR_AGENT_API_KEY"
```

Share the returned `link_url` with the user. They click it, log in (with Google, email, or wallet), and authorize the agent to use their credits.

### Step 2: User Tops Up Credits

Direct the user to: **https://app.productclank.com/credits**

User payment options:
- **Credit card** — No crypto needed
- **Crypto** — USDC on Base
- **Monthly subscription** — Better rates per credit, auto-renewal

### Step 3: Agent Uses User's Credits

Once authorized, pass `caller_user_id` to bill the user's balance:

```bash
curl -X POST "https://api.productclank.com/api/v1/agents/campaigns/{id}/generate-posts" \
  -H "Authorization: Bearer pck_live_YOUR_AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"caller_user_id": "user-uuid-here"}'
```

The user manages credits and billing through the webapp dashboard.

## Checking Balance & History

```bash
# Check balance
curl https://api.productclank.com/api/v1/agents/credits/balance \
  -H "Authorization: Bearer pck_live_YOUR_KEY"

# Transaction history
curl "https://api.productclank.com/api/v1/agents/credits/history?limit=50" \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
```

## Payment Details

- **Network:** Base (chain ID 8453)
- **Payment Address:** `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
- **USDC Contract:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **x402 Protocol:** v2 with EIP-3009 `TransferWithAuthorization`

## Campaign Tiers (live)

### Tier 2: Research-Enhanced Campaign

Enhance campaigns with AI-powered research before generating posts.

```
1. POST /agents/campaigns                   → 10 credits
2. POST /agents/campaigns/{id}/research     → free
3. GET  /agents/campaigns/{id}/research     → free
4. POST /agents/campaigns/{id}/generate-posts → 12 credits/post
```

> Planned, not callable yet: `POST /agents/generate-keywords`, `POST /agents/campaigns/{id}/verticals`.
> Source selection ships today as the free `sources` field on `PATCH /agents/campaigns/{id}`.

### Tier 3: Iterate & Optimize

Full campaign lifecycle management with AI refinement.

```
5. GET  /agents/campaigns/{id}/posts              → free
6. POST /agents/campaigns/{id}/regenerate-replies → 5 credits/reply
7. PATCH /agents/campaigns/{id}                   → free (update settings, incl. `sources`)
8. POST /agents/campaigns/{id}/generate-posts     → 12 credits/post
9. Repeat 5-8 as needed
```

> Planned, not callable yet: `POST /agents/campaigns/{id}/refine`.
