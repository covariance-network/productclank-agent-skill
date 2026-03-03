---
name: productclank-campaigns
description: Create AI-powered Twitter/X brand advocacy campaigns on ProductClank. Automatically discover relevant conversations, generate authentic replies, and coordinate community members to amplify your brand through genuine word-of-mouth. Use when users want to scale social media presence, run community-driven marketing, boost brand awareness, intercept competitors, or turn users into brand advocates.
license: Proprietary
metadata:
  author: ProductClank
  version: "1.1.0"
  api_endpoint: https://api.productclank.com/api/v1/agents/campaigns
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

### Choose Your Tier

ProductClank supports three tiers of campaign sophistication. Start with Tier 1, and upgrade as your needs grow.

| Tier | Name | Description | Cost | Status |
|------|------|-------------|------|--------|
| 1 | **Quick Launch** | Provide inputs → create → generate posts | ~70 credits ($2.92) | ✅ Available |
| 2 | **Research-Enhanced** | AI keywords → create → research → select sources → generate | ~72-74 credits ($3.00) | 🔜 Coming Soon |
| 3 | **Iterate & Optimize** | ...Tier 2 → read results → AI refine → regenerate → repeat | ~100-200 credits ($4-8) | 🔜 Coming Soon |

**Tier 1 is documented below. Tier 2 & 3 endpoints are coming soon — specs are previewed at the end of this document.**

### Step 0: Check Credit Balance (Optional but Recommended)

```bash
curl https://api.productclank.com/api/v1/agents/credits/balance \
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

Campaigns are created immediately (no upfront payment). No credits are deducted at this stage — credits are only consumed when you call `generate-posts` in Step 3.

```typescript
const response = await fetch(
  "https://api.productclank.com/api/v1/agents/campaigns",
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
  // Share this URL with the user for review before generating posts
  const campaignUrl = `https://app.productclank.com/communiply/campaigns/${result.campaign.id}`;
  console.log(`🔗 Review campaign at: ${campaignUrl}`);
} else {
  console.error(`❌ Error: ${result.error} - ${result.message}`);
}
```

**Response includes cost estimate and next step:**
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
  },
  "next_step": {
    "action": "generate_posts",
    "endpoint": "POST /api/v1/agents/campaigns/{id}/generate-posts",
    "description": "Call this endpoint to discover Twitter conversations and generate replies. Credits are deducted at this step."
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

### Step 3: Generate Posts (Credits Deducted Here)

After creating the campaign, call `generate-posts` to trigger discovery and reply generation. This is when credits are actually deducted.

You may optionally share the campaign URL with the user for review before calling this step.

```typescript
const generateRes = await fetch(
  `https://api.productclank.com/api/v1/agents/campaigns/${result.campaign.id}/generate-posts`,
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer pck_live_YOUR_API_KEY",
    },
  }
);

const generateResult = await generateRes.json();

if (generateResult.success) {
  console.log(`✅ Posts generated: ${generateResult.postsGenerated}`);
  console.log(`💬 Replies generated: ${generateResult.repliesGenerated}`);
  console.log(`💳 Credits used: ${generateResult.credits.creditsUsed}`);
  console.log(`💰 Credits remaining: ${generateResult.credits.creditsRemaining}`);
} else {
  console.error(`❌ Error: ${generateResult.message}`);
}
```

**generate-posts endpoint:**
- **Method:** `POST`
- **Path:** `/api/v1/agents/campaigns/{campaignId}/generate-posts`
- **Auth:** Bearer API key (same as other endpoints)
- **Path param:** `campaignId` (UUID from campaign creation response)
- **Request body:** None required

**Success response:**
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

**Error codes:**
- `402` — Insufficient credits (top up via `/api/v1/agents/credits/topup`)
- `403` — Campaign does not belong to your agent
- `404` — Campaign not found

### Step 4: Handle the Campaign Creation Response

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
  },
  "next_step": {
    "action": "generate_posts",
    "endpoint": "POST /api/v1/agents/campaigns/{id}/generate-posts",
    "description": "Call this endpoint to discover Twitter conversations and generate replies. Credits are deducted at this step."
  }
}
```

**Next steps:**
- Share the campaign URL with the user for review (optional): `https://app.productclank.com/communiply/campaigns/{campaign.id}`
- Call `POST /api/v1/agents/campaigns/{id}/generate-posts` to start discovery (credits deducted here)
- Community members can claim and execute reply opportunities
- Track analytics, engagement, and ROI in real-time via the dashboard

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
| **nano** | $2 USDC | 40 credits | 20 cr/$ | ~3 posts | **Testing the API** |
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
curl https://api.productclank.com/api/v1/agents/credits/balance \
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
  "https://api.productclank.com/api/v1/agents/credits/topup",
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
  "https://api.productclank.com/api/v1/agents/credits/topup",
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
curl "https://api.productclank.com/api/v1/agents/credits/history?limit=50&offset=0" \
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
After campaign creation and calling generate-posts:
1. Call `POST /api/v1/agents/campaigns/{id}/generate-posts` to trigger discovery (credits deducted here, 12 credits per post discovered + reply generated)
2. AI generates contextual replies for each discovered opportunity
3. Community members browse opportunities in dashboard
4. They claim replies, customize if needed, and post from personal accounts
5. Submit proof (tweet URL + optional screenshot)
6. Earn rewards after verification

## Support & Resources

- **API Documentation**: [api.productclank.com/api/v1/docs](https://api.productclank.com/api/v1/docs)
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
  "https://api.productclank.com/api/v1/agents/credits/balance",
  {
    headers: { "Authorization": "Bearer pck_live_YOUR_KEY" }
  }
);
const { balance } = await balanceRes.json();

// 3. Top up if needed (targeting 100 posts = ~1200 credits)
if (balance < 1200) {
  const topupRes = await x402Fetch(
    "https://api.productclank.com/api/v1/agents/credits/topup",
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

// 5. Create campaign (no payment required - credits NOT yet deducted)
const result = await fetch(
  "https://api.productclank.com/api/v1/agents/campaigns",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(campaignRequest)
  }
).then(r => r.json());

// 6. (Optional) Share campaign URL with user for review before generating posts
const campaignUrl = `https://app.productclank.com/communiply/campaigns/${result.campaign.id}`;
console.log(`📊 Campaign created: ${result.campaign.campaign_number}`);
console.log(`🔗 Review at: ${campaignUrl}`);
console.log(`💳 Estimated cost: ${result.cost_estimate.estimated_credits} credits when generate-posts is called`);

// 7. Call generate-posts to trigger discovery and reply generation (credits deducted here)
const generateResult = await fetch(
  `https://api.productclank.com/api/v1/agents/campaigns/${result.campaign.id}/generate-posts`,
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
    }
  }
).then(r => r.json());

// 8. Inform user of success
console.log(`
✅ Campaign "${result.campaign.title}" is live!

📊 Campaign Details:
   - Campaign ID: ${result.campaign.campaign_number}
   - Status: ${result.campaign.status}

📝 Posts Generated:
   - Posts discovered: ${generateResult.postsGenerated}
   - Replies generated: ${generateResult.repliesGenerated}

💳 Credit Usage:
   - Credits used: ${generateResult.credits.creditsUsed}
   - Credits remaining: ${generateResult.credits.creditsRemaining}

🔗 Next Steps:
   - View dashboard: ${campaignUrl}
   - Community members can claim and execute reply opportunities
   - Track real-time analytics and engagement
   - Monitor credit usage: https://api.productclank.com/api/v1/agents/credits/history
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

## Tier 2: Research-Enhanced Campaign (Coming Soon)

Enhance campaigns with AI-powered research before generating posts. Research is free — it improves targeting quality.

### Tier 2 Flow

```
1. POST /agents/generate-keywords           → 2 credits (optional, if user described goals in natural language)
2. POST /agents/campaigns                   → 10 credits
3. POST /agents/campaigns/{id}/research     → free (runs AI analysis)
4. GET  /agents/campaigns/{id}/research     → free (review results)
5. POST /agents/campaigns/{id}/verticals    → free (select discovery sources)
6. POST /agents/campaigns/{id}/generate-posts → 12 credits/post
```

### Planned Endpoints

**POST /agents/generate-keywords** (2 credits)
- Input: `{ search_goals: string, product_name?: string, product_tagline?: string }`
- Output: `{ keywords: string[], credits: { creditsUsed, creditsRemaining } }`
- Uses Claude AI to generate 8-15 search keywords from natural language goals

**POST /agents/campaigns/{id}/research** (free)
- Input: none (uses campaign's keywords)
- Output: `{ analysis: { expandedKeywords, highIntentPhrases, keyAccounts, twitterLists, hashtags, competitors } }`
- Discovers competitors (AI), selects relevant Twitter lists, expands keywords, identifies high-intent phrases

**POST /agents/campaigns/{id}/verticals** (free)
- Input: `{ enabledVerticals: ["keywords", "phrases", "influencers", "lists", "competitors"] }`
- Select which discovery sources to use from the research results

**GET /agents/campaigns/{id}** (free)
- Read campaign details, settings, and stats

**GET /agents/campaigns** (free)
- List all campaigns created by your agent

### When to Use Tier 2
- Exploring a new niche where you don't know the best keywords
- Campaigns targeting 10+ posts where better targeting pays for itself
- Want to leverage Twitter lists, influencer monitoring, or competitor-based discovery

### Example Agent Conversation (Tier 2)
```
User: "I want to promote my AI writing tool to content marketers"
Agent: "Let me research the best keywords and discovery sources for content marketing."
       → POST /agents/generate-keywords { search_goals: "content marketers looking for AI writing tools" }
       → Receives: ["AI writing assistant", "content creation tools", "copywriting AI", ...]
Agent: "Got 12 keywords. Creating your campaign..."
       → POST /agents/campaigns { keywords: [...], search_context: "..." }
Agent: "Running research analysis to find the best discovery sources..."
       → POST /agents/campaigns/{id}/research
       → Receives: 8 Twitter lists, 5 competitors, 15 expanded keywords
Agent: "Found great sources! Enabling keyword + influencer + list discovery..."
       → POST /agents/campaigns/{id}/verticals { enabledVerticals: ["keywords", "influencers", "lists"] }
Agent: "Generating posts with enhanced targeting..."
       → POST /agents/campaigns/{id}/generate-posts
```

## Tier 3: Iterate & Optimize (Coming Soon)

Full campaign lifecycle management. Read results, refine via AI chat, regenerate replies, and iterate.

### Tier 3 Flow (after Tier 1 or 2 steps)

```
7.  GET  /agents/campaigns/{id}/posts             → free (review results)
8.  POST /agents/campaigns/{id}/refine            → 3 credits/message (AI chat)
9.  POST /agents/campaigns/{id}/regenerate-replies → 5 credits/reply
10. PATCH /agents/campaigns/{id}                   → free (update settings)
11. POST /agents/campaigns/{id}/generate-posts     → 12 credits/post (generate more)
12. Repeat 7-11 as needed
```

### Planned Endpoints

**GET /agents/campaigns/{id}/posts** (free)
- Query: `status`, `limit`, `offset`, `includeReplies`, `filterClaimed`
- Returns posts with author info, engagement metrics, replies, relevance scores

**POST /agents/campaigns/{id}/regenerate-replies** (5 credits/reply)
- Input: `{ postIds: string[], editRequest: string, applyToSystemPrompt?: boolean }`
- Regenerate AI replies for specific posts with new instructions
- Can optionally update permanent reply guidelines

**POST /agents/campaigns/{id}/refine** (3 credits/message, synchronous)
- Input: `{ messages: [{ role: "user"|"assistant", content: string }] }`
- Output: `{ message: string, actions_executed: [{ action, result }], credits }`
- AI campaign optimization assistant that can auto-execute actions:
  - `update_keywords` — change campaign keywords
  - `update_reply_guidelines` — change reply instructions
  - `regenerate_replies` — regenerate specific replies
  - `generate_posts` — discover more posts
  - `run_discovery` — discover without reply generation
  - `cleanup_posts` — remove old unclaimed posts
  - `update_campaign_settings` — modify settings
  - `update_visibility` — change campaign visibility

**PATCH /agents/campaigns/{id}** (free)
- Direct setting updates without AI chat: keywords, guidelines, filters, scheduling, visibility

### When to Use Tier 3
- Ongoing campaigns that need continuous optimization
- A/B testing different reply styles or guidelines
- Building automated feedback loops (read results → analyze → refine → regenerate)
- Managing campaigns for multiple products

### Example Agent Conversation (Tier 3)
```
Agent: "Your campaign generated 15 posts. Let me review the results..."
       → GET /agents/campaigns/{id}/posts?includeReplies=true
Agent: "The replies look good but could be more casual. Let me refine..."
       → POST /agents/campaigns/{id}/refine
         { messages: [{ role: "user", content: "Make replies more casual and shorter" }] }
       → Response: { actions_executed: [{ action: "update_reply_guidelines", result: { success: true } }] }
Agent: "Guidelines updated! Regenerating replies for the top 5 posts..."
       → POST /agents/campaigns/{id}/regenerate-replies
         { postIds: [...], editRequest: "shorter, more conversational tone" }
Agent: "Done! 5 replies regenerated. Generating 10 more posts with the new style..."
       → POST /agents/campaigns/{id}/generate-posts
```

## Credit Cost Summary (All Tiers)

| Operation | Credits | Tier |
|-----------|---------|------|
| Create campaign | 10 | 1 |
| Generate posts (discover + reply) | 12/post | 1 |
| Generate keywords (AI) | 2 | 2 |
| Research analysis | 0 (free) | 2 |
| Select verticals | 0 (free) | 2 |
| Read campaign/posts | 0 (free) | 3 |
| Regenerate replies | 5/reply | 3 |
| Refine chat (AI) | 3/message | 3 |
| Update settings | 0 (free) | 3 |
