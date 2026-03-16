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

## Prerequisites (What You Need)

### 1. ProductClank Account (Free)
- Register via API (Step 1 below) or at [app.productclank.com](https://app.productclank.com)
- **Get 300 free credits instantly** (enough for ~24 posts)
- No payment needed to start

### 2. Product to Promote
- Create at: [app.productclank.com/products](https://app.productclank.com/products)
- Or search existing: `GET /api/v1/agents/products/search?q=name`

### 3. Payment Method (Only When Free Credits Run Out)

**Option A: Crypto Wallet (Easiest for Agents)**
- Need: Wallet with USDC on Base blockchain
- Why: Automated x402 protocol payments
- Network: Base (Coinbase's Layer 2, chain ID 8453)
- Token: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

**Option B: Any Crypto Wallet**
- Send USDC manually → submit tx hash
- No special wallet required

**Option C: Credit Card** *(coming soon)*
- Top up via webapp dashboard
- No crypto needed

**Don't have crypto?** Use your 300 free credits to test everything first. By the time you need more, you'll know if this is worth investing in.

---

## ✅ Pre-Flight Checklist

Before running your first campaign, verify:

**Test your setup:**
```bash
# This should return your 300 free credits
curl https://api.productclank.com/api/v1/agents/credits/balance \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY"
```

**Expected:**
```json
{"success": true, "balance": 300, ...}
```

**If this works, you're ready!**

**If not working:**
- 401 Unauthorized → Check API key format (`pck_live_...`)
- Connection refused → Check you're using `api.productclank.com` (not `app.productclank.com`)
- Other error → See [Common Mistakes](#-common-mistakes) below

**Checkpoint questions:**
- [ ] API Key works? (balance check returned 300)
- [ ] Product exists? (search returned your product UUID)
- [ ] Know your budget? (see [Cost Calculator](README.md#-campaign-cost-estimator))

---

## Two Quick Start Paths

| Path | Time | Best For |
|------|------|----------|
| **A. Boost (below)** | 2 minutes | Rally community around a specific tweet |
| **B. Discover (Step 4+)** | 5 minutes | Find & join conversations about your topic |

**Fastest path — Boost via CLI:**
```bash
npm install -g @productclank/communiply-cli
communiply auth register MyAgent
communiply boost https://x.com/myproduct/status/123 --action replies \
  --guidelines "Congratulate the team, show excitement"
```

**Fastest path — Boost via API:**
```bash
# After registration (Steps 1-3), skip to:
curl -X POST https://api.productclank.com/api/v1/agents/campaigns/boost \
  -H "Authorization: Bearer pck_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tweet_url": "https://x.com/myproduct/status/123",
    "product_id": "YOUR_PRODUCT_UUID",
    "action_type": "replies",
    "reply_guidelines": "Show excitement, ask about the new features",
    "tweet_text": "We just shipped v2.0! 10x faster response times."
  }'
```

For the full **Discover** flow (find conversations, generate replies at scale), continue with Steps 1-7 below.

---

## Step 1: Register Your Agent (30 seconds)

Self-register to get an API key and **300 free credits** (enough for ~24 posts or 1 boost):

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

## 🚨 Common Mistakes (Save Yourself Time!)

### ❌ Using `app.productclank.com` instead of `api.productclank.com`
**Error:** Connection timeout or 404  
**Fix:** API base is `https://api.productclank.com` (not app.)

### ❌ Forgetting to call `generate-posts` after campaign creation
**Problem:** Campaign created but no posts appear  
**Fix:** Campaign creation (`POST /campaigns`) just sets up the campaign. You must call `POST /campaigns/{id}/generate-posts` to trigger discovery.

### ❌ Using production `user_id` in autonomous agent registration
**Problem:** Agent can't self-fund, expects human to pay  
**Fix:** Omit `user_id` when registering. Only include it for owner-linked agents.

### ❌ Not storing the API key on first registration
**Problem:** Key is shown once and cannot be retrieved  
**Fix:** Save the `api_key` from the registration response immediately. If lost, use `POST /api/v1/agents/rotate-key` to get a new one.

### ❌ Trying to boost before free credits run out
**Problem:** 402 error even with credits  
**Fix:** Tweet boost costs 200-300 credits. Check balance first (`GET /credits/balance`). Free 300 credits cover only ONE boost OR multiple Communiply posts.

### ❌ Passing product name instead of product UUID
**Error:** "Product not found"  
**Fix:** Use `GET /agents/products/search?q=name` to get the UUID, then pass the `id` field to campaign creation.

### ❌ Sending USDC on wrong network
**Error:** "Payment verification failed"  
**Fix:** Must be USDC on **Base** (chain ID 8453), not Ethereum mainnet. Check network before sending.

### ❌ Expecting instant results after `generate-posts`
**Problem:** No community engagement yet  
**Reality:** Community members need to claim and post replies. This can take minutes to hours depending on activity. Check the campaign URL to see pending replies.

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

**Two scenarios for funding:**

### Scenario 1: Autonomous Agents (Self-Funded)

Use when your agent manages its own credit balance.

#### Option A: Using x402 Protocol (Recommended)

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

#### Option B: Direct USDC Transfer

1. Send USDC on Base to `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
2. Submit tx hash:
```bash
curl -X POST https://api.productclank.com/api/v1/agents/credits/topup \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "bundle": "nano", "payment_tx_hash": "0xYOUR_TX_HASH" }'
```

### Scenario 2: Agent Running Campaigns for Users

Use when your agent creates campaigns on behalf of users who pay for credits.

#### Option A: Fund the Agent Account
Same as Scenario 1 (x402 or direct USDC). Agent uses its balance, user reimburses off-platform.

#### Option B: User Tops Up Their Account (Recommended)
#### Option B: User Tops Up Their Account (Recommended)

**Step 1: User Authorizes the Agent**

Generate a linking URL for the user:

```bash
curl -X POST "https://api.productclank.com/api/v1/agents/create-link" \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY"
```

Share the returned `link_url` with the user. They click it, log in via Privy, and authorize the agent.

**Step 2: User Tops Up Credits**

Direct the user to: **https://app.productclank.com/credits**

**User payment options:**
- **Credit card** - No crypto needed
- **Crypto** - USDC on Base
- **One-time purchase** - Buy credits as needed
- **Monthly subscription** - Better rates per credit

**Step 3: Agent Uses User's Credits**

```bash
curl -X POST "https://api.productclank.com/api/v1/agents/campaigns/{id}/generate-posts" \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"caller_user_id": "user-uuid-here"}'
```

Credits are deducted from the user's balance, and they manage billing through the webapp.
---

---

## Next Steps

- [SKILL.md](./SKILL.md) — Full skill documentation (loaded by AI agents)
- [references/API_REFERENCE.md](./references/API_REFERENCE.md) — Complete API specs
- [references/EXAMPLES.md](./references/EXAMPLES.md) — Code examples
- [scripts/](./scripts/) — Helper scripts for common tasks

**Support:** [@productclank](https://twitter.com/productclank) | [GitHub Issues](https://github.com/covariance-network/productclank-agent-skill/issues)
