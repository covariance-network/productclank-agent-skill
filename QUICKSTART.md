# Quick Start Guide - ProductClank Agent API

Get your first campaign running in 5 minutes.

---

## Prerequisites

Before you start, you'll need:

1. **ProductClank API Key**
   - Contact the ProductClank team to get your key (format: `pck_live_XXXXXXXX`)

2. **USDC on Base**
   - Minimum $2 USDC for testing
   - Network: Base (chain ID 8453)
   - Token: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

3. **Wallet with Private Key** (for x402 payment)
   - Or any wallet for direct USDC transfer

4. **Product ID**
   - Your product must exist on ProductClank
   - Get it from [app.productclank.com/products](https://app.productclank.com/products)

---

## Step 1: Check Your Credit Balance (30 seconds)

First, verify your API key works and check your credit balance:

```bash
curl https://app.productclank.com/api/v1/agents/credits/balance \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY"
```

**Expected Response:**
```json
{
  "success": true,
  "balance": 0,
  "user_id": "uuid",
  "agent_id": "uuid",
  "agent_name": "YourAgent",
  "lifetime_purchased": 0,
  "lifetime_used": 0,
  "lifetime_bonus": 0,
  "message": "No credits purchased yet. Use /credits/topup to buy credits."
}
```

✅ **Success:** You see `"success": true` and your agent name
❌ **Error:** Check your API key is correct (starts with `pck_live_`)

---

## Step 2: Buy Credits ($2 Test Bundle) (2 minutes)

### Option A: Using x402 Protocol (Recommended)

Install dependencies:
```bash
npm install @x402/fetch viem
```

Create `buy-credits.mjs`:
```javascript
import { wrapFetchWithPayment } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY);
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

const x402Fetch = wrapFetchWithPayment(fetch, walletClient);

const response = await x402Fetch(
  "https://app.productclank.com/api/v1/agents/credits/topup",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ bundle: "nano" })  // $2 → 50 credits
  }
);

const result = await response.json();
console.log("✅ Credits purchased:", result);
```

Run it:
```bash
export AGENT_PRIVATE_KEY="0x..."
export PRODUCTCLANK_API_KEY="pck_live_..."
node buy-credits.mjs
```

**Expected Response:**
```json
{
  "success": true,
  "credits_added": 50,
  "new_balance": 50,
  "bundle": "nano",
  "payment": {
    "method": "x402",
    "amount_usdc": 2,
    "network": "base",
    "payer": "0xYourWalletAddress"
  }
}
```

### Option B: Direct USDC Transfer

1. **Send USDC on Base:**
   - To: `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
   - Amount: 2 USDC (for nano bundle)
   - Network: Base (chain ID 8453)
   - Token: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

2. **Submit transaction hash:**
```bash
curl -X POST https://app.productclank.com/api/v1/agents/credits/topup \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "bundle": "nano",
    "payment_tx_hash": "0xYOUR_TX_HASH"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "credits_added": 50,
  "new_balance": 50,
  "bundle": "nano",
  "payment": {
    "method": "direct_transfer",
    "amount_usdc": 2,
    "network": "base",
    "tx_hash": "0x..."
  }
}
```

✅ **Success:** You now have 50 credits!
❌ **Error:** Check USDC balance and network (must be Base)

---

## Step 3: Create Your First Campaign (1 minute)

Now create a campaign - no payment required, credits are deducted automatically:

```bash
curl -X POST https://app.productclank.com/api/v1/agents/campaigns \
  -H "Authorization: Bearer pck_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "YOUR_PRODUCT_UUID",
    "title": "Test Campaign",
    "keywords": ["AI tools", "productivity apps"],
    "search_context": "People discussing AI productivity tools and automation",
    "estimated_posts": 4,
    "mention_accounts": ["@productclank"],
    "reply_style_tags": ["friendly", "helpful"],
    "min_follower_count": 100,
    "max_post_age_days": 7
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "campaign": {
    "id": "uuid",
    "campaign_number": "CP-042",
    "title": "Test Campaign",
    "status": "active",
    "created_via": "api",
    "creator_agent_id": "uuid",
    "is_funded": true
  },
  "cost_estimate": {
    "posts_requested": 4,
    "estimated_credits": 48,
    "current_balance": 50,
    "sufficient_credits": true,
    "note": "Sufficient credits available"
  }
}
```

✅ **Success:** Campaign is live! View it at:
`https://app.productclank.com/communiply/campaigns/YOUR_CAMPAIGN_ID`

❌ **Error:** Check product_id exists and all required fields are provided

---

## Step 4: Monitor Your Credits (30 seconds)

Check how many credits were consumed:

```bash
curl "https://app.productclank.com/api/v1/agents/credits/history?limit=5" \
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
      "balance_after": 2,
      "operation_type": "generate-posts",
      "campaign_id": "CP-042",
      "description": "generate-posts: 4 item(s)",
      "created_at": "2026-02-20T20:15:00Z"
    },
    {
      "id": "uuid",
      "type": "topup_purchase",
      "amount": 50,
      "balance_after": 50,
      "description": "Credit top-up: nano bundle",
      "created_at": "2026-02-20T20:10:00Z"
    }
  ],
  "total": 2,
  "limit": 5,
  "offset": 0
}
```

✅ **Success:** You can see all credit purchases and usage!

---

## Credit Bundles & Pricing

| Bundle | Price | Credits | Rate | Posts (~12 cr/post) | Best For |
|--------|-------|---------|------|---------------------|----------|
| **nano** | $2 | 50 | 25 cr/$ | ~4 posts | **Testing the API** |
| micro | $10 | 200 | 20 cr/$ | ~16 posts | Small test campaign |
| small | $25 | 550 | 22 cr/$ | ~45 posts | Product launch |
| medium | $50 | 1,200 | 24 cr/$ | ~100 posts | Medium campaign |
| large | $100 | 2,600 | 26 cr/$ | ~216 posts | Large campaign |
| enterprise | $500 | 14,000 | 28 cr/$ | ~1,166 posts | High volume |

## Credit Costs per Operation

| Operation | Credits | Cost @ $50 bundle |
|-----------|---------|-------------------|
| Discover post + generate reply | 12 | ~$0.50 |
| Generate reply only | 8 | ~$0.33 |
| Regenerate reply | 5 | ~$0.21 |
| Tweet boost (10 AI replies) | 80 | ~$3.33 |
| Chat message | 3 | ~$0.12 |
| Keyword generation | 2 | ~$0.08 |

---

## Common Issues & Fixes

### "Invalid API key"
- Ensure key starts with `pck_live_`
- Contact ProductClank to verify key status

### "Payment verification failed"
- **x402:** Ensure wallet has USDC on Base
- **Direct transfer:** Verify tx hash is correct and confirmed
- Must use Base network (chain ID 8453), not Ethereum mainnet

### "Product not found"
- Verify product_id exists on ProductClank
- Visit [app.productclank.com/products](https://app.productclank.com/products)

### "Low credit balance" warning
- Campaign created successfully but may run out of credits
- Top up via `/api/v1/agents/credits/topup`
- Operations pause if balance reaches zero

### "Rate limit exceeded"
- Default: 10 campaigns per day
- Contact ProductClank for higher limits

---

## Next Steps

### 1. Build Full Integration

See complete examples in:
- [SKILL.md](./SKILL.md) - Full API documentation
- [references/API_REFERENCE.md](./references/API_REFERENCE.md) - Detailed API specs
- [references/EXAMPLES.md](./references/EXAMPLES.md) - Code examples

### 2. Upgrade Bundle

Once testing is complete, upgrade to a larger bundle:
```javascript
// Buy medium bundle ($50 → 1,200 credits)
body: JSON.stringify({ bundle: "medium" })
```

### 3. Monitor Campaign Performance

View your campaign dashboard:
```
https://app.productclank.com/communiply/campaigns/YOUR_CAMPAIGN_ID
```

Track:
- AI-discovered posts
- Generated replies
- Community engagement
- Credit consumption

### 4. Automate Credit Management

Set up auto-monitoring:
```javascript
// Check balance before operations
const balance = await fetch("/api/v1/agents/credits/balance", {...});
if (balance.balance < 120) {
  await topup({ bundle: "medium" });
}
```

---

## Complete Example - Full Workflow

```javascript
import { wrapFetchWithPayment } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

// Setup
const account = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY);
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});
const x402Fetch = wrapFetchWithPayment(fetch, walletClient);

const headers = {
  "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
  "Content-Type": "application/json"
};

// 1. Check balance
const balanceRes = await fetch(
  "https://app.productclank.com/api/v1/agents/credits/balance",
  { headers }
);
const { balance } = await balanceRes.json();
console.log(`💰 Current balance: ${balance} credits`);

// 2. Top up if needed
if (balance < 120) {
  console.log("⚡ Topping up credits...");
  const topupRes = await x402Fetch(
    "https://app.productclank.com/api/v1/agents/credits/topup",
    {
      method: "POST",
      headers,
      body: JSON.stringify({ bundle: "medium" })
    }
  );
  const { credits_added, new_balance } = await topupRes.json();
  console.log(`✅ Added ${credits_added} credits (balance: ${new_balance})`);
}

// 3. Create campaign
console.log("🚀 Creating campaign...");
const campaignRes = await fetch(
  "https://app.productclank.com/api/v1/agents/campaigns",
  {
    method: "POST",
    headers,
    body: JSON.stringify({
      product_id: "YOUR_PRODUCT_UUID",
      title: "Launch Campaign",
      keywords: ["AI tools", "productivity"],
      search_context: "People discussing AI productivity tools",
      estimated_posts: 10
    })
  }
);
const { campaign, cost_estimate } = await campaignRes.json();
console.log(`✅ Campaign created: ${campaign.campaign_number}`);
console.log(`📊 Estimated cost: ${cost_estimate.estimated_credits} credits`);
console.log(`🔗 View: https://app.productclank.com/communiply/campaigns/${campaign.id}`);

// 4. Monitor usage
const historyRes = await fetch(
  "https://app.productclank.com/api/v1/agents/credits/history?limit=5",
  { headers }
);
const { transactions } = await historyRes.json();
console.log(`📜 Recent transactions:`, transactions);
```

---

## Support

Need help?
- **Documentation:** [SKILL.md](./SKILL.md)
- **GitHub Issues:** [github.com/covariance-network/productclank-agent-skill/issues](https://github.com/covariance-network/productclank-agent-skill/issues)
- **Twitter:** [@productclank](https://twitter.com/productclank)
- **Warpcast:** [warpcast.com/productclank](https://warpcast.com/productclank)

---

**Ready to scale?** Check out the [full documentation](./SKILL.md) for advanced features, custom reply guidelines, and production best practices.
