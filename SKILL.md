---
name: productclank-campaigns
description: Create AI-powered Twitter/X brand advocacy campaigns on ProductClank. Automatically discover relevant conversations, generate authentic replies, and coordinate community members to amplify your brand through genuine word-of-mouth. Use when users want to scale social media presence, run community-driven marketing, boost brand awareness, intercept competitors, or turn users into brand advocates.
license: Proprietary
metadata:
  author: ProductClank
  version: "1.1.0"
  api_endpoint: https://app.productclank.com/api/v1/agents/campaigns
  website: https://www.productclank.com
  web_ui: https://app.productclank.com/communiply/campaigns/
compatibility: Credit-based pay-per-use system. Agents buy credits with USDC on Base (chain ID 8453). Supports x402 protocol and direct USDC transfers. Works with any wallet type.
---

# ProductClank Communiply Campaign Creation

Create Communiply campaigns that transform your community into brand advocates by coordinating authentic, AI-powered Twitter/X engagement at scale.

## What is Communiply?

**Communiply is a community-driven brand advocacy platform that solves the authenticity problem in social media marketing.**

### The Problem
When your brand account promotes itself, people automatically dismiss it as advertising. Zero credibility, limited reach, and no one trusts self-promotion.

### The Solution
Communiply enables **real people** (your employees, users, and community members) to naturally recommend your brand in relevant conversations—creating genuine word-of-mouth at scale.

### How It Works
1. **AI discovers opportunities** — Monitors Twitter/X 24/7 for relevant conversations based on keywords, competitors, problems, and topics
2. **Generates smart replies** — Creates context-aware, value-adding responses that help (not sell)
3. **Community amplifies** — Real people post from their personal accounts, creating authentic third-party recommendations
4. **Tracks results** — Real-time analytics on engagement, reach, and ROI

### Why It Works
| When You Promote Yourself ❌ | When Others Recommend You ✅ |
|------------------------------|------------------------------|
| Responses scream "advertisement" | Real users = authentic credibility |
| People dismiss automatically | 10x more trustworthy |
| Zero credibility in competitive conversations | Natural presence everywhere |
| Limited reach—only your followers | Unlimited reach—appears wherever conversations happen |

## Key Use Cases

### 1. Competitor Intercept
**Trigger:** "Looking for Salesforce alternatives"
**Result:** Community members suggest your product with authentic recommendations

### 2. Problem-Based Targeting
**Trigger:** "Struggling with email marketing"
**Result:** Timely, helpful suggestions when people express pain points your product solves

### 3. Brand Amplification
**Trigger:** Someone praises your brand
**Result:** Third-party validation reinforces positive mentions

### 4. Keyword Monitoring
**Trigger:** "Best CRM for startups"
**Result:** Contextual recommendations appear in high-intent searches

## When to Use This Skill

Activate this skill when users mention:
- "Create a Twitter campaign" or "X marketing campaign"
- "Amplify our product on social media"
- "Turn users into advocates" or "community-driven growth"
- "Competitor intercept" or "monitor competitor mentions"
- "Scale word-of-mouth" or "authentic brand advocacy"
- "ProductClank", "Communiply", or "Twitter engagement campaign"
- Need to boost brand awareness, launch week buzz, or community engagement

## Prerequisites

Before creating a campaign, ensure you have:

1. **ProductClank API Key** (format: `pck_live_XXXXXXXX`)
   - Contact ProductClank team to register your agent and receive a key

2. **Credit Balance**
   - Buy credits via `/api/v1/agents/credits/topup` using USDC on Base
   - Check balance via `/api/v1/agents/credits/balance`
   - Credits consumed automatically as operations are performed (~12 credits per post)

3. **Payment Method for Top-ups** (one of):
   - **x402 Protocol**: Wallet with private key access + USDC on Base
   - **Direct Transfer**: Any wallet that can send USDC on Base
   - **Trusted Agent Status**: Whitelisted agents skip payment (contact ProductClank)

4. **Product Registration**
   - Your product must exist on ProductClank with a valid `product_id` (UUID)
   - Visit [app.productclank.com/products](https://app.productclank.com/products) to browse products

## How to Create a Campaign

### Step 0: Check Credit Balance (Optional but Recommended)

```bash
curl https://app.productclank.com/api/v1/agents/credits/balance \
  -H "Authorization: Bearer pck_live_YOUR_KEY"

# Response: { balance: 1200, lifetime_purchased: 1200, lifetime_used: 0 }
```

If balance is low, top up credits first (see "Credit Management" section below).

### Step 1: Gather Campaign Requirements

Ask the user for:
- **Product context**: What product are you promoting? (Get product_id from ProductClank)
- **Campaign goal**: What do you want to achieve? (e.g., "Launch week buzz", "Competitor intercept")
- **Target keywords**: What topics should we monitor? (e.g., ["AI tools", "productivity apps"])
- **Search context**: Describe target conversations (e.g., "People discussing AI productivity tools and automation")
- **Estimated scale**: How many posts do you want to target? (~50 posts = ~600 credits)

Optional refinements:
- **Mention accounts**: Twitter handles to mention naturally (e.g., ["@productclank"])
- **Reply style**: Tone tags (e.g., ["friendly", "technical", "casual"])
- **Reply length**: "very-short" | "short" | "medium" | "long" | "mixed"
- **Custom guidelines**: Specific instructions for AI reply generation
- **Filters**: min_follower_count, min_engagement_count, max_post_age_days, require_verified

### Step 2: Create the Campaign

Campaigns are created immediately (no upfront payment). Credits are consumed automatically as operations are performed.

```typescript
const response = await fetch(
  "https://app.productclank.com/api/v1/agents/campaigns",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer pck_live_YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: "PRODUCT_UUID",
      title: "Launch Week Buzz Campaign",
      keywords: ["web3 tools", "crypto apps", "DeFi platforms"],
      search_context: "People discussing web3 tools, crypto products, and DeFi platforms",
      estimated_posts: 50, // Optional: for cost estimation
      mention_accounts: ["@productclank", "@0xCovariance"],
      reply_style_tags: ["friendly", "technical", "enthusiastic"],
      reply_length: "short",
      min_follower_count: 500,
      max_post_age_days: 7,
    }),
  }
);

const result = await response.json();

if (result.success) {
  console.log(`✅ Campaign created: ${result.campaign.campaign_number}`);
  console.log(`📊 View at: https://app.productclank.com/communiply/campaigns/${result.campaign.id}`);
  console.log(`💳 Estimated cost: ${result.cost_estimate.estimated_credits} credits`);
  console.log(`💰 Current balance: ${result.cost_estimate.current_balance} credits`);
  console.log(`✓ Sufficient credits: ${result.cost_estimate.sufficient_credits}`);
} else {
  console.error(`❌ Error: ${result.error} - ${result.message}`);
}
```

**Response includes cost estimate:**
```json
{
  "success": true,
  "campaign": {
    "id": "uuid",
    "campaign_number": "CP-042",
    "title": "Launch Week Buzz Campaign",
    "status": "active",
    "is_funded": true
  },
  "cost_estimate": {
    "posts_requested": 50,
    "estimated_credits": 600,
    "current_balance": 1200,
    "sufficient_credits": true,
    "note": "Sufficient credits available"
  }
}
```

**Campaign Fields:**
- `product_id` (required): Product UUID
- `title` (required): Campaign name
- `keywords` (required): Array of keywords to monitor
- `search_context` (required): Description of target conversations
- `estimated_posts` (optional): Expected number of posts for cost estimation
- `mention_accounts` (optional): Twitter handles to mention
- `reply_style_tags` (optional): Tone tags (e.g., ["friendly", "technical"])
- `reply_length` (optional): "very-short" | "short" | "medium" | "long" | "mixed"
- `reply_guidelines` (optional): Custom instructions for AI
- `min_follower_count` (optional): Minimum followers (default: 100)
- `min_engagement_count` (optional): Minimum engagement threshold
- `max_post_age_days` (optional): Maximum post age in days
- `require_verified` (optional): Only verified accounts

### Step 3: Handle the Response

#### Success (200 OK)
```json
{
  "success": true,
  "campaign": {
    "id": "uuid-here",
    "campaign_number": "CP-042",
    "title": "Launch Week Buzz Campaign",
    "status": "active",
    "created_via": "api",
    "creator_agent_id": "agent-uuid",
    "is_funded": true
  },
  "cost_estimate": {
    "posts_requested": 50,
    "estimated_credits": 600,
    "current_balance": 1200,
    "sufficient_credits": true,
    "note": "Sufficient credits available"
  }
}
```

**Next steps:**
- Campaign is live and actively discovering Twitter conversations
- AI is generating replies for relevant posts (consumes 12 credits per post)
- Community members can claim and execute reply opportunities
- Credits deducted automatically as operations are performed
- View campaign dashboard: `https://app.productclank.com/communiply/campaigns/{campaign.id}`
- Track analytics, engagement, and ROI in real-time

#### Low Credit Warning (200 OK, but warning in response)
```json
{
  "success": true,
  "campaign": {...},
  "cost_estimate": {
    "posts_requested": 50,
    "estimated_credits": 600,
    "current_balance": 200,
    "sufficient_credits": false,
    "note": "Warning: Low credit balance. Consider topping up via /api/v1/agents/credits/topup"
  }
}
```

**Action:** Top up credits via `/api/v1/agents/credits/topup` to avoid interruptions.

#### Rate Limit Exceeded (429)
```json
{
  "success": false,
  "error": "rate_limit_exceeded",
  "message": "Daily campaign creation limit exceeded (10/day)
    "x402": {
      "description": "x402 protocol payment (recommended for wallets with private key access)",
      "config": { /* x402 payment requirements */ }
    },
    "direct_transfer": {
      "description": "Send USDC directly to payment address, then re-submit with payment_tx_hash in request body",
      "pay_to": "0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68",
      "amount_usdc": 99,
      "network": "Base (chain ID 8453)",
      "asset": "USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)"
    }
  }
}
```

**Fix:** Wait until next day or contact ProductClank for higher limits.

#### Unauthorized (401)
```json
{
  "success": false,
  "error": "unauthorized",
  "message": "Invalid API key"
}
```

**Fix:** Verify API key is correct and starts with `pck_live_`.

## Credit Management

### Credit Bundles (USDC on Base)

| Bundle | Price | Credits | Rate | Posts (~12 cr/post) | Best For |
|--------|-------|---------|------|---------------------|----------|
| **nano** | $2 USDC | 50 credits | 25 cr/$ | ~4 posts | **Testing the API** |
| **micro** | $10 USDC | 200 credits | 20 cr/$ | ~16 posts | Small test campaign |
| **small** | $25 USDC | 550 credits | 22 cr/$ | ~45 posts | Product launch |
| **medium** | $50 USDC | 1,200 credits | 24 cr/$ | ~100 posts | Medium campaign |
| **large** | $100 USDC | 2,600 credits | 26 cr/$ | ~216 posts | Large campaign |
| **enterprise** | $500 USDC | 14,000 credits | 28 cr/$ | ~1,166 posts | High volume |

### Credit Costs per Operation

| Operation | Credits | Cost @ $50 bundle (24 cr/$) |
|-----------|---------|------------------------------|
| Discover post + generate reply | 12 | ~$0.50 |
| Generate reply only | 8 | ~$0.33 |
| Regenerate reply | 5 | ~$0.21 |
| Tweet boost (10 AI replies) | 80 | ~$3.33 |
| Chat message | 3 | ~$0.12 |
| Keyword generation | 2 | ~$0.08 |

### Check Balance

```bash
curl https://app.productclank.com/api/v1/agents/credits/balance \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
```

**Response:**
```json
{
  "success": true,
  "balance": 1200,
  "user_id": "uuid",
  "agent_id": "uuid",
  "agent_name": "MyAgent",
  "lifetime_purchased": 5000,
  "lifetime_used": 3800,
  "lifetime_bonus": 0
}
```

### Top Up Credits

#### Option A: Using x402 Protocol (Recommended)

```typescript
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

const topup = await x402Fetch(
  "https://app.productclank.com/api/v1/agents/credits/topup",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer pck_live_YOUR_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ bundle: "medium" })  // $50 → 1200 credits
  }
);

const result = await topup.json();
// { success: true, credits_added: 1200, new_balance: 1200, bundle: "medium", payment: {...} }
```

**Dependencies:**
```bash
npm install @x402/fetch viem
```

#### Option B: Direct USDC Transfer

```typescript
// Step 1: Send USDC on Base to payment address
// - Token: USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
// - Network: Base (chain ID 8453)
// - To: 0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68
// - Amount: Exact bundle price (e.g., 50 USDC for medium)

// Step 2: Submit with transaction hash
const topup = await fetch(
  "https://app.productclank.com/api/v1/agents/credits/topup",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer pck_live_YOUR_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      bundle: "medium",
      payment_tx_hash: "0x..."  // Your confirmed tx hash
    })
  }
);
```

### View Transaction History

```bash
curl "https://app.productclank.com/api/v1/agents/credits/history?limit=50&offset=0" \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
```

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "uuid",
      "type": "topup_purchase",
      "amount": 1200,
      "balance_after": 2700,
      "description": "Credit top-up: medium bundle",
      "created_at": "2026-02-20T18:00:00Z"
    },
    {
      "id": "uuid",
      "type": "ai_usage",
      "amount": -576,
      "balance_after": 2124,
      "operation_type": "generate-posts",
      "campaign_id": "CP-042",
      "description": "generate-posts: 48 item(s)",
      "created_at": "2026-02-20T18:05:00Z"
    }
  ],
  "total": 2,
  "limit": 50,
  "offset": 0
}
```

All payments are in USDC on Base network.

## Rate Limits

- **Default**: 10 campaigns per day per agent
- **Custom limits**: Contact ProductClank for higher limits

## Best Practices

1. **Be Specific with Keywords**
   - ✅ Good: ["AI productivity tools", "automation software", "workflow optimization"]
   - ❌ Bad: ["AI", "tools", "software"]

2. **Write Clear Search Context**
   - ✅ Good: "People discussing challenges with project management and looking for better collaboration tools"
   - ❌ Bad: "People talking about stuff"

3. **Set Appropriate Filters**
   - Use `min_follower_count` to target quality accounts (default: 100)
   - Use `max_post_age_days` to ensure timely engagement (default: unlimited)
   - Use `require_verified` for high-profile campaigns (default: false)

4. **Customize Reply Guidelines**
   - Provide specific brand voice instructions
   - Mention key value propositions to highlight
   - Include do's and don'ts for messaging

5. **Direct Users to Web UI**
   - After creating a campaign via API, direct users to view it at:
   - `https://app.productclank.com/communiply/campaigns/{campaign_id}`
   - The web UI provides visual analytics, reply management, and community coordination

## Advanced Features

### Custom Reply Guidelines
Instead of auto-generated guidelines, provide custom instructions:

```typescript
{
  reply_guidelines: `
    Reply as a developer who has used our product for 6+ months.
    Focus on: ease of integration, excellent documentation, responsive support.
    Avoid: marketing speak, over-promising, comparing to competitors directly.
    Mention @productclank naturally when relevant.
    Include our website (https://productclank.com) if it adds value.
  `
}
```

### Multi-Source Discovery
Communiply discovers opportunities from multiple sources:
- **Keyword searches**: Monitors Twitter for your specified keywords
- **Influencer accounts**: Tracks high-engagement accounts in your niche
- **Twitter Lists**: Monitors curated lists of relevant users
- **7-layer filtering**: Ensures only quality, relevant posts are surfaced

### Community Coordination
After campaign creation:
1. AI discovers relevant conversations (consumes 12 credits per post discovered + reply generated)
2. Generates contextual replies for each opportunity
3. Community members browse opportunities in dashboard
4. They claim replies, customize if needed, and post from personal accounts
5. Submit proof (tweet URL + optional screenshot)
6. Earn rewards after verification

## Support & Resources

- **API Documentation**: [app.productclank.com/api/v1/docs](https://app.productclank.com/api/v1/docs)
- **Campaign Dashboard**: [app.productclank.com/communiply/campaigns/](https://app.productclank.com/communiply/campaigns/)
- **Website**: [productclank.com](https://www.productclank.com)
- **Twitter**: [@productclank](https://twitter.com/productclank)
- **Warpcast**: [warpcast.com/productclank](https://warpcast.com/productclank)
- **Contact**: For API keys, trusted agent status, or higher rate limits

## Complete Example Flow

```typescript
// 1. User asks: "I want to create a Twitter campaign for my DeFi app launch"

// 2. Check credit balance first
const balanceRes = await fetch(
  "https://app.productclank.com/api/v1/agents/credits/balance",
  {
    headers: { "Authorization": "Bearer pck_live_YOUR_KEY" }
  }
);
const { balance } = await balanceRes.json();

// 3. Top up if needed (targeting 100 posts = ~1200 credits)
if (balance < 1200) {
  const topupRes = await x402Fetch(
    "https://app.productclank.com/api/v1/agents/credits/topup",
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer pck_live_YOUR_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ bundle: "medium" })  // $50 → 1200 credits
    }
  );
  const { credits_added, new_balance } = await topupRes.json();
  console.log(`✅ Topped up ${credits_added} credits (new balance: ${new_balance})`);
}

// 4. Gather campaign requirements
const campaignRequest = {
  product_id: "abc-123-def", // From ProductClank
  title: "DeFi App Launch Week",
  keywords: [
    "DeFi platforms",
    "yield farming",
    "decentralized finance",
    "crypto staking"
  ],
  search_context: "People discussing DeFi platforms, yield farming strategies, and crypto staking opportunities",
  estimated_posts: 100,  // For cost estimation
  mention_accounts: ["@mydefiapp"],
  reply_style_tags: ["professional", "technical", "helpful"],
  reply_length: "short",
  min_follower_count: 1000,
  max_post_age_days: 3,
  require_verified: false
};

// 5. Create campaign (no payment required - credits deducted during operations)
const result = await fetch(
  "https://app.productclank.com/api/v1/agents/campaigns",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(campaignRequest)
  }
).then(r => r.json());

// 6. Inform user of success
console.log(`
✅ Campaign "${result.campaign.title}" created successfully!

📊 Campaign Details:
   - Campaign ID: ${result.campaign.campaign_number}
   - Status: ${result.campaign.status}
   - Active: Yes

💳 Credit Estimate:
   - Estimated cost: ${result.cost_estimate.estimated_credits} credits (~${result.cost_estimate.posts_requested} posts)
   - Current balance: ${result.cost_estimate.current_balance} credits
   - Sufficient credits: ${result.cost_estimate.sufficient_credits ? 'Yes' : 'No'}

🔗 Next Steps:
   - View dashboard: https://app.productclank.com/communiply/campaigns/${result.campaign.id}
   - AI is now discovering relevant conversations (12 credits per post)
   - Community members can claim and execute reply opportunities
   - Track real-time analytics and engagement
   - Monitor credit usage: https://app.productclank.com/api/v1/agents/credits/history

Your campaign will actively monitor Twitter and coordinate community engagement. Credits are consumed automatically as operations are performed.
`);
```

## Troubleshooting

### "Low credit balance" warning
- Campaign created successfully but may run out of credits
- Top up via `/api/v1/agents/credits/topup`
- Check balance regularly via `/api/v1/agents/credits/balance`
- Operations will pause if balance reaches zero

### "Payment verification failed" (during credit top-up)
- Ensure USDC balance is sufficient
- For direct transfer: verify tx hash is correct and confirmed
- For x402: ensure wallet has `signTypedData` capability
- Transaction must be recent (within 1 hour)
- Each transaction hash can only be used once

### "Product not found"
- Verify product_id exists on ProductClank
- Visit [app.productclank.com/products](https://app.productclank.com/products) to find valid products

### "Invalid API key"
- Ensure key starts with `pck_live_`
- Contact ProductClank team to verify key status

### "Rate limit exceeded"
- Default limit: 10 campaigns per day
- Wait until next day or contact ProductClank for higher limits

### "Rate limit exceeded"
- Default limit: 10 campaigns/day
- Contact ProductClank for higher limits

## Additional Resources

For complete API reference with detailed examples, see:
- [references/API_REFERENCE.md](references/API_REFERENCE.md) - Full API specification
- [references/EXAMPLES.md](references/EXAMPLES.md) - Code examples for common scenarios
- [scripts/create-campaign.mjs](scripts/create-campaign.mjs) - Helper script for quick campaign creation
