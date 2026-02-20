---
name: productclank-campaigns
description: Create AI-powered Twitter/X brand advocacy campaigns on ProductClank. Automatically discover relevant conversations, generate authentic replies, and coordinate community members to amplify your brand through genuine word-of-mouth. Use when users want to scale social media presence, run community-driven marketing, boost brand awareness, intercept competitors, or turn users into brand advocates.
license: Proprietary
metadata:
  author: ProductClank
  version: "1.0.0"
  api_endpoint: https://app.productclank.com/api/v1/agents/campaigns
  website: https://www.productclank.com
  web_ui: https://app.productclank.com/communiply/campaigns/
compatibility: Requires USDC on Base (chain ID 8453) for payment. Supports both x402 protocol and direct USDC transfers. Works with any wallet type.
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

2. **Payment Method** (one of):
   - **x402 Protocol**: Wallet with private key access + USDC on Base
   - **Direct Transfer**: Any wallet that can send USDC on Base
   - **Trusted Agent Status**: Whitelisted agents skip payment (contact ProductClank)

3. **Product Registration**
   - Your product must exist on ProductClank with a valid `product_id` (UUID)
   - Visit [app.productclank.com/products](https://app.productclank.com/products) to browse products

## How to Create a Campaign

### Step 1: Gather Campaign Requirements

Ask the user for:
- **Product context**: What product are you promoting? (Get product_id from ProductClank)
- **Campaign goal**: What do you want to achieve? (e.g., "Launch week buzz", "Competitor intercept")
- **Target keywords**: What topics should we monitor? (e.g., ["AI tools", "productivity apps"])
- **Search context**: Describe target conversations (e.g., "People discussing AI productivity tools and automation")
- **Budget**: Which package? test ($0.01) / starter ($99) / growth ($499) / scale ($2000)

Optional refinements:
- **Mention accounts**: Twitter handles to mention naturally (e.g., ["@productclank"])
- **Reply style**: Tone tags (e.g., ["friendly", "technical", "casual"])
- **Reply length**: "very-short" | "short" | "medium" | "long" | "mixed"
- **Custom guidelines**: Specific instructions for AI reply generation
- **Filters**: min_follower_count, min_engagement_count, max_post_age_days, require_verified

### Step 2: Create the Campaign

#### Option A: Using x402 Protocol (Recommended for Private Key Wallets)

```typescript
import { wrapFetchWithPayment } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

// Setup wallet client
const account = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY);
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

// Wrap fetch with x402 payment capability
const x402Fetch = wrapFetchWithPayment(fetch, walletClient);

// Create campaign (payment handled automatically)
const response = await x402Fetch(
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
      selected_package: "starter", // $99
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
  console.log(`💰 Payment: ${result.payment.method} - $${result.payment.amount_usdc} USDC`);
} else {
  console.error(`❌ Error: ${result.error} - ${result.message}`);
}
```

**Dependencies for x402:**
```bash
npm install @x402/fetch viem
```

**x402 Requirements:**
- Wallet must have private key access (EOA)
- Wallet must hold USDC on Base (chain ID 8453)
- USDC balance >= package price
- Smart contract wallets / MPC wallets without `signTypedData` support cannot use x402 — use Direct Transfer instead

#### Option B: Using Direct USDC Transfer (For Wallets Without Private Keys)

```typescript
// Step 1: Send USDC on Base to payment address
// - Token: USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
// - Network: Base (chain ID 8453)
// - To: 0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68
// - Amount: Exact package price (e.g., 99 USDC for starter)

// Step 2: Wait for confirmation, get transaction hash
const txHash = "0x..."; // Your confirmed tx hash

// Step 3: Create campaign with tx hash
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
      keywords: ["web3 tools", "crypto apps"],
      search_context: "People discussing web3 tools and crypto products",
      selected_package: "starter",
      payment_tx_hash: txHash, // Include the transaction hash
    }),
  }
);

const result = await response.json();
```

**Direct Transfer Requirements:**
- Transaction must be confirmed on Base
- Must be a USDC transfer to `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
- Amount must be >= package price
- Transaction must be recent (within 1 hour)
- Each transaction hash can only be used once (no replay attacks)

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
  "payment": {
    "method": "x402",
    "amount_usdc": 99,
    "network": "base",
    "payer": "0xAgentWalletAddress",
    "tx_hash": "0x..." // only for direct_transfer
  }
}
```

**Next steps for user:**
- Campaign is live and actively discovering Twitter conversations
- AI is generating replies for relevant posts
- Community members can claim and execute reply opportunities
- View campaign dashboard: `https://app.productclank.com/communiply/campaigns/{campaign.id}`
- Track analytics, engagement, and ROI in real-time

#### Payment Required (402)
```json
{
  "success": false,
  "error": "payment_required",
  "message": "Payment required to create campaign",
  "amount_usdc": 99,
  "package": "starter",
  "payment_methods": {
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

**This is normal on the first request without payment.** Use `@x402/fetch` to handle automatically, or switch to direct transfer method.

#### Validation Error (400)
```json
{
  "success": false,
  "error": "validation_error",
  "message": "Missing required fields: product_id, title, keywords (non-empty), search_context"
}
```

**Fix:** Ensure all required fields are provided and non-empty.

#### Rate Limit Exceeded (429)
```json
{
  "success": false,
  "error": "rate_limit_exceeded",
  "message": "Daily campaign creation limit exceeded (10/day)"
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

## Campaign Packages & Pricing

| Package | Price (USDC) | Description |
|---------|--------------|-------------|
| **test** | $0.01 | For development and testing |
| **starter** | $99 | Small campaign, ideal for launches |
| **growth** | $499 | Medium campaign, sustained growth |
| **scale** | $2,000 | Large campaign, enterprise-level |

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
1. AI discovers 50-500 relevant conversations (depending on package)
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

// 2. Agent gathers requirements
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
  selected_package: "growth", // $499
  mention_accounts: ["@mydefiapp"],
  reply_style_tags: ["professional", "technical", "helpful"],
  reply_length: "short",
  min_follower_count: 1000,
  max_post_age_days: 3,
  require_verified: false
};

// 3. Create campaign with x402 payment
const result = await x402Fetch(
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

// 4. Inform user of success
console.log(`
✅ Campaign "${result.campaign.title}" created successfully!

📊 Campaign Details:
   - Campaign ID: ${result.campaign.campaign_number}
   - Status: ${result.campaign.status}
   - Funded: ${result.campaign.is_funded ? 'Yes' : 'No'}

💰 Payment:
   - Method: ${result.payment.method}
   - Amount: $${result.payment.amount_usdc} USDC
   - Network: Base

🔗 Next Steps:
   - View dashboard: https://app.productclank.com/communiply/campaigns/${result.campaign.id}
   - AI is now discovering relevant conversations
   - Community members can claim and execute reply opportunities
   - Track real-time analytics and engagement

Your campaign will actively monitor Twitter for the next 30 days and coordinate community engagement automatically.
`);
```

## Troubleshooting

### "Payment verification failed"
- Ensure USDC balance is sufficient
- For direct transfer: verify tx hash is correct and confirmed
- For x402: ensure wallet has `signTypedData` capability

### "Product not found"
- Verify product_id exists on ProductClank
- Visit [app.productclank.com/products](https://app.productclank.com/products) to find valid products

### "Invalid API key"
- Ensure key starts with `pck_live_`
- Contact ProductClank team to verify key status

### "Rate limit exceeded"
- Default limit: 10 campaigns/day
- Contact ProductClank for higher limits

## Additional Resources

For complete API reference with detailed examples, see:
- [references/API_REFERENCE.md](references/API_REFERENCE.md) - Full API specification
- [references/EXAMPLES.md](references/EXAMPLES.md) - Code examples for common scenarios
- [scripts/create-campaign.mjs](scripts/create-campaign.mjs) - Helper script for quick campaign creation
