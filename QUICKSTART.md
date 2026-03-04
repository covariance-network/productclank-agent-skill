# Quick Start Guide - ProductClank Agent API

Get your first campaign running in 5 minutes.

## Campaign Tiers

ProductClank offers three tiers of campaign sophistication:

| Tier | Name | What You Do | Status |
|------|------|-------------|--------|
| **1** | Quick Launch | Provide keywords → create → generate posts | ✅ Available |
| **2** | Research-Enhanced | AI generates keywords → research analysis → smart targeting | 🔜 Coming Soon |
| **3** | Iterate & Optimize | Read results → AI refine → regenerate → iterate | 🔜 Coming Soon |

This guide covers **Tier 1** (Quick Launch). See [SKILL.md](./SKILL.md) for Tier 2 & 3 details.

---

## Prerequisites

Before you start, you'll need:

1. **USDC on Base** (optional — you get **300 free credits** on registration)
   - Network: Base (chain ID 8453)
   - Token: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

2. **Wallet with Private Key** (for x402 payment, only needed for credit top-ups)
   - Or any wallet for direct USDC transfer

3. **Product ID**
   - Your product must exist on ProductClank
   - Search via API: `GET /api/v1/agents/products/search?q=your+product`
   - Or browse at [app.productclank.com/products](https://app.productclank.com/products)
   - Don't have a product yet? Create one at [app.productclank.com/products](https://app.productclank.com/products)

---

## Step 1: Register Your Agent (30 seconds)

Self-register to get an API key and **300 free credits** (enough for ~24 posts):

```bash
curl -X POST https://api.productclank.com/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyAgent",
    "description": "AI agent for social media campaigns"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "agent": {
    "id": "uuid",
    "name": "MyAgent",
    "status": "active",
    "rate_limit_daily": 10,
    "created_at": "2026-03-04T..."
  },
  "api_key": "pck_live_abc123...",
  "credits": {
    "balance": 300,
    "plan": "free"
  },
  "_warning": "Store this API key securely. It will not be shown again."
}
```

> **IMPORTANT:** Save your `api_key` immediately — it is only shown once. If lost, use `POST /api/v1/agents/rotate-key` to generate a new one.

Optional registration fields:
- `wallet_address`: Your agent's wallet (for USDC payments later)
- `erc8004_agent_id`: ERC-8004 on-chain agent ID
- `website`, `logo`: Agent metadata

---

## Step 2: Find Your Product ID (30 seconds)

Search for your product by name:

```bash
curl "https://api.productclank.com/api/v1/agents/products/search?q=ProductClank" \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY"
```

**Expected Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "abc-123-def-456",
      "name": "ProductClank",
      "tagline": "Turning Users Into Growth Evangelists",
      "logo": "https://...",
      "website": "https://productclank.com",
      "twitter": "@productclank"
    }
  ]
}
```

Copy the `id` — you'll need it for campaign creation.

> **Don't see your product?** Create it at [app.productclank.com/products](https://app.productclank.com/products)

---

## Step 3: Check Your Credit Balance (15 seconds)

Verify your API key works and see your free credits:

```bash
curl https://api.productclank.com/api/v1/agents/credits/balance \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY"
```

**Expected Response:**
```json
{
  "success": true,
  "balance": 300,
  "plan": "free",
  "lifetime_purchased": 0,
  "lifetime_used": 0,
  "lifetime_bonus": 300
}
```

✅ **Success:** You see `balance: 300` from your free signup credits
❌ **Error:** Check your API key is correct (starts with `pck_live_`)

> **300 free credits** = ~24 posts (10 credits for campaign creation + 12 credits per post). Enough to run a real test campaign.

---

## Step 4: Create Your First Campaign (1 minute)

Create a campaign — **10 credits are deducted** for campaign creation:

```bash
curl -X POST https://api.productclank.com/api/v1/agents/campaigns \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "YOUR_PRODUCT_UUID",
    "title": "Test Campaign",
    "keywords": ["AI tools", "productivity apps"],
    "search_context": "People discussing AI productivity tools and automation",
    "mention_accounts": ["@productclank"],
    "reply_style_tags": ["friendly", "helpful"],
    "reply_length": "short",
    "min_follower_count": 100,
    "max_post_age_days": 7
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "campaign": {
    "id": "campaign-uuid",
    "campaign_number": "CP-042",
    "title": "Test Campaign",
    "status": "active",
    "created_via": "api",
    "creator_agent_id": "agent-uuid",
    "is_funded": true,
    "url": "https://app.productclank.com/communiply/campaign-uuid"
  },
  "credits": {
    "credits_used": 10,
    "credits_remaining": 290,
    "billing_user_id": "user-uuid"
  },
  "next_step": {
    "action": "generate_posts",
    "endpoint": "POST /api/v1/agents/campaigns/campaign-uuid/generate-posts",
    "description": "Generate posts for this campaign. Optionally share the campaign URL with the user for review first."
  }
}
```

✅ **Success:** Campaign created! You can optionally share the URL with the user for review.
❌ **Error:** Check product_id exists and all required fields are provided

---

## Step 5: Generate Posts (Credits Deducted Here)

Call `generate-posts` to trigger Twitter discovery and reply generation. **12 credits per post** are deducted here:

```bash
curl -X POST https://api.productclank.com/api/v1/agents/campaigns/YOUR_CAMPAIGN_ID/generate-posts \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Posts generated successfully",
  "postsGenerated": 4,
  "repliesGenerated": 4,
  "errors": [],
  "batchNumber": 1,
  "credits": {
    "creditsUsed": 48,
    "creditsRemaining": 242
  }
}
```

✅ **Success:** Posts and replies are generated! Community members can now claim and execute them.
❌ **402 Error:** Insufficient credits — top up via `/api/v1/agents/credits/topup`
❌ **403 Error:** Campaign does not belong to your agent
❌ **404 Error:** Campaign not found — check the campaign ID

---

## Step 6: Check Campaign Status (Optional)

View your campaign details and stats:

```bash
curl https://api.productclank.com/api/v1/agents/campaigns/YOUR_CAMPAIGN_ID \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY"
```

**Expected Response:**
```json
{
  "success": true,
  "campaign": {
    "id": "campaign-uuid",
    "campaign_number": "CP-042",
    "title": "Test Campaign",
    "status": "active",
    "is_active": true,
    "keywords": ["AI tools", "productivity apps"],
    "url": "https://app.productclank.com/communiply/campaign-uuid"
  },
  "stats": {
    "posts_discovered": 4,
    "replies_total": 4,
    "replies_by_status": { "pending": 3, "claimed": 1 }
  }
}
```

Or list all your campaigns:

```bash
curl "https://api.productclank.com/api/v1/agents/campaigns?limit=10" \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY"
```

---

## Step 7: Monitor Your Credits (30 seconds)

```bash
curl "https://api.productclank.com/api/v1/agents/credits/history?limit=5" \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY"
```

**Expected Response:**
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
    },
    {
      "id": "uuid",
      "type": "signup_bonus",
      "amount": 300,
      "balance_after": 300,
      "description": "Free plan signup bonus",
      "created_at": "2026-03-04T20:10:00Z"
    }
  ],
  "total": 3,
  "limit": 5,
  "offset": 0
}
```

---

## Credit Costs Summary

| Operation | Credits | Notes |
|-----------|---------|-------|
| **Registration** | +300 free | One-time signup bonus |
| **Create campaign** | 10 | Deducted at campaign creation |
| **Discover post + generate reply** | 12 | Deducted at generate-posts |
| **Generate reply only** | 8 | For pre-supplied posts |
| **Regenerate reply** | 5 | Refresh existing replies |
| **Tweet boost (10 AI replies)** | 200 | Boost a specific tweet |
| **Review post (AI relevancy)** | 2 | AI scores post against rules |

## Credit Bundles (USDC on Base)

| Bundle | Price | Credits | Rate | Posts (~12 cr/post) | Best For |
|--------|-------|---------|------|---------------------|----------|
| **nano** | $2 | 40 | 20 cr/$ | ~3 posts | **Extending free credits** |
| micro | $10 | 200 | 20 cr/$ | ~16 posts | Small test campaign |
| small | $25 | 550 | 22 cr/$ | ~45 posts | Product launch |
| medium | $50 | 1,200 | 24 cr/$ | ~100 posts | Medium campaign |
| large | $100 | 2,600 | 26 cr/$ | ~216 posts | Large campaign |
| enterprise | $500 | 14,000 | 28 cr/$ | ~1,166 posts | High volume |

---

## Buy More Credits (When Free Credits Run Out)

### Option A: Using x402 Protocol (Recommended)

```bash
npm install @x402/fetch viem
```

```javascript
import { wrapFetchWithPayment } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY);
const walletClient = createWalletClient({ account, chain: base, transport: http() });
const x402Fetch = wrapFetchWithPayment(fetch, walletClient);

const response = await x402Fetch(
  "https://api.productclank.com/api/v1/agents/credits/topup",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ bundle: "nano" })  // $2 → 40 credits
  }
);
console.log(await response.json());
```

### Option B: Direct USDC Transfer

1. Send USDC on Base to `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
2. Submit tx hash:
```bash
curl -X POST https://api.productclank.com/api/v1/agents/credits/topup \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "bundle": "nano", "payment_tx_hash": "0xYOUR_TX_HASH" }'
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Invalid API key" | Ensure key starts with `pck_live_`. Use `POST /api/v1/agents/rotate-key` if lost. |
| "Payment verification failed" | Check USDC balance on Base (not Ethereum). Tx must be < 1 hour old. |
| "Product not found" | Search: `GET /api/v1/agents/products/search?q=name` or browse app.productclank.com/products |
| "Insufficient credits" | Campaign creation = 10 cr, posts = 12 cr each. Top up at `/agents/credits/topup`. |
| "Rate limit exceeded" | Default: 10 campaigns/day. Contact ProductClank for higher limits. |

---

## Next Steps

- [SKILL.md](./SKILL.md) — Full skill documentation (loaded by AI agents)
- [references/API_REFERENCE.md](./references/API_REFERENCE.md) — Complete API specs
- [references/EXAMPLES.md](./references/EXAMPLES.md) — Code examples

**Support:** [@productclank](https://twitter.com/productclank) | [GitHub Issues](https://github.com/covariance-network/productclank-agent-skill/issues)
