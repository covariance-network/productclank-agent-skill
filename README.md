# ProductClank Campaigns - Agent Skill

An [Agent Skill](https://agentskills.io) for creating Communiply campaigns on ProductClank.

## What is This?

This is an Agent Skill that enables AI agents to create community-driven brand advocacy campaigns on ProductClank. Agents can autonomously discover relevant Twitter/X conversations, generate authentic replies, and coordinate community members to amplify brands through genuine word-of-mouth.

**ProductClank Communiply** solves the authenticity problem in social media marketing: when your brand promotes itself, people dismiss it as advertising. Communiply enables real people (employees, users, community members) to naturally recommend your brand in relevant conversations—creating authentic word-of-mouth at scale.

## Quick Start

**🚀 New to the API?** Start here: [QUICKSTART.md](QUICKSTART.md) - Get your first campaign running in 5 minutes!

### For AI Agents

This skill is loaded automatically when an agent needs to create Twitter/X marketing campaigns. The agent will:

1. Gather campaign requirements from the user
2. Authenticate with ProductClank API
3. Buy credits with USDC on Base (x402 or direct transfer)
4. Create the campaign (credits consumed automatically during operations)
5. Return the campaign dashboard URL for tracking

### For Developers

**First time?** Follow the [Quick Start Guide](QUICKSTART.md) for step-by-step instructions.

**Already familiar?** Use the helper script:

```bash
# Install dependencies
npm install @x402/fetch viem

# Set environment variables
export PRODUCTCLANK_API_KEY=pck_live_YOUR_KEY
export AGENT_PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# Run the helper script
node scripts/create-campaign.mjs
```

See [SKILL.md](SKILL.md) for complete documentation.

## Directory Structure

```
productclank-campaigns/
├── QUICKSTART.md               # 🚀 5-minute quick start guide (START HERE!)
├── SKILL.md                    # Main skill documentation (loaded by agents)
├── README.md                   # This file
├── CHANGELOG.md                # Version history
├── references/
│   ├── API_REFERENCE.md        # Complete API specification
│   └── EXAMPLES.md             # Code examples for common use cases
└── scripts/
    └── create-campaign.mjs     # Helper script for quick campaign creation
```

## Files

### [SKILL.md](SKILL.md)
The main skill file loaded by AI agents. Contains:
- What Communiply is and how it works
- When to use this skill
- Step-by-step instructions for creating campaigns
- Complete examples for x402 and direct transfer payment methods
- Error handling and troubleshooting

### [references/API_REFERENCE.md](references/API_REFERENCE.md)
Complete API specification including:
- Authentication requirements
- Request/response formats
- All payment methods (x402, direct transfer, trusted agents)
- Package pricing
- Rate limits
- Error codes and handling

### [references/EXAMPLES.md](references/EXAMPLES.md)
Practical code examples:
- Basic campaign creation
- Advanced campaigns with custom guidelines
- Competitor intercept campaigns
- Product launch campaigns
- Error handling and retry logic
- TypeScript types

### [scripts/create-campaign.mjs](scripts/create-campaign.mjs)
Ready-to-use script for creating campaigns. Supports both x402 protocol and direct USDC transfers.

## Getting Started

### 1. Register Your Agent

Contact ProductClank to receive an API key:
- Twitter: [@productclank](https://twitter.com/productclank)
- Warpcast: [warpcast.com/productclank](https://warpcast.com/productclank)
- Website: [productclank.com](https://www.productclank.com)

Provide:
- Agent name and description
- Intended use case
- Wallet address (for payments)
- Estimated daily campaign volume

### 2. Set Up Payment

Choose a payment method:

**Option A: x402 Protocol** (Recommended)
- Requires: Wallet with private key access + USDC on Base
- Set `AGENT_PRIVATE_KEY` environment variable
- Payment happens automatically via x402 protocol

**Option B: Direct USDC Transfer**
- Requires: Any wallet that can send USDC on Base
- Send USDC to payment address: `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
- Set `PAYMENT_TX_HASH` environment variable with tx hash

**Option C: Trusted Agent Status**
- Contact ProductClank for whitelisting
- Skip payment entirely (for testing/partnerships)

### 3. Create Your First Campaign

Using the helper script:

```bash
# Edit the campaignData object in scripts/create-campaign.mjs
# Then run:
node scripts/create-campaign.mjs
```

Or programmatically:

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
  "https://app.productclank.com/api/v1/agents/campaigns",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: "YOUR_PRODUCT_UUID",
      title: "Launch Week Campaign",
      keywords: ["AI tools", "productivity apps"],
      search_context: "People discussing AI productivity tools",
      selected_package: "test", // $0.01 for testing
    }),
  }
);

const result = await response.json();
console.log("Campaign:", result.campaign);
```

## Payment Packages

| Package | Price | Description |
|---------|-------|-------------|
| test | $0.01 | For development and testing |
| starter | $99 | Small campaign, ideal for launches |
| growth | $499 | Medium campaign, sustained growth |
| scale | $2,000 | Large campaign, enterprise-level |

All payments in USDC on Base network (chain ID 8453).

## Rate Limits

- **Default**: 10 campaigns per day per agent
- **Custom limits**: Contact ProductClank for higher limits

## Use Cases

### 1. Competitor Intercept
Target conversations mentioning competitors. When people discuss alternatives, your community naturally suggests your product.

### 2. Problem-Based Targeting
Find people expressing pain points your product solves. Timely, helpful suggestions when they need it most.

### 3. Brand Amplification
When someone praises your brand, third-party validation reinforces positive mentions.

### 4. Product Launches
Coordinate community amplification during launch week. Real people sharing authentic excitement.

## How Communiply Works

1. **AI Discovers Opportunities** — Monitors Twitter/X 24/7 for relevant conversations based on keywords, competitors, problems
2. **Generates Smart Replies** — Creates context-aware, value-adding responses (not sales pitches)
3. **Community Amplifies** — Real people post from personal accounts, creating authentic third-party recommendations
4. **Tracks Results** — Real-time analytics on engagement, reach, and ROI

## Why It Works

| When You Promote Yourself ❌ | When Others Recommend You ✅ |
|------------------------------|------------------------------|
| Responses scream "advertisement" | Real users = authentic credibility |
| People dismiss automatically | 10x more trustworthy |
| Zero credibility in competitive conversations | Natural presence everywhere |
| Limited reach—only your followers | Unlimited reach—wherever conversations happen |

## Support & Resources

- **API Documentation**: [app.productclank.com/api/v1/docs](https://app.productclank.com/api/v1/docs)
- **Campaign Dashboard**: [app.productclank.com/communiply/campaigns/](https://app.productclank.com/communiply/campaigns/)
- **Website**: [productclank.com](https://www.productclank.com)
- **Twitter**: [@productclank](https://twitter.com/productclank)
- **Warpcast**: [warpcast.com/productclank](https://warpcast.com/productclank)

## Installation for Agents

If you're building an agent that uses this skill:

```bash
# Install as a dependency
npm install @x402/fetch viem

# Or with yarn
yarn add @x402/fetch viem

# Or with pnpm
pnpm add @x402/fetch viem
```

Then load the skill from this directory or reference it via GitHub.

## Validation

Validate the skill format:

```bash
# Using skills-ref CLI
skills-ref validate ./productclank-campaigns
```

## Contributing

This skill is maintained by ProductClank. For issues or improvements:
- Open an issue on GitHub
- Contact via Twitter: [@productclank](https://twitter.com/productclank)
- Email: Via contact form on [productclank.com](https://www.productclank.com)

## License

Proprietary. The API and service are proprietary to ProductClank. This skill documentation is provided as a convenience for AI agents to interact with the ProductClank API.

See [LICENSE.txt](LICENSE.txt) for complete terms (if available).

## FAQ

**Q: Do I need a ProductClank account?**
A: No, agents use API keys directly. The agent creates campaigns on behalf of users.

**Q: What happens after a campaign is created?**
A: The campaign immediately starts discovering relevant Twitter conversations. AI generates contextual replies, and community members can claim and execute them. Results are tracked in real-time via the dashboard.

**Q: Can I delete or pause campaigns?**
A: Yes, via the web dashboard at [app.productclank.com/communiply/campaigns/](https://app.productclank.com/communiply/campaigns/)

**Q: What if I don't have private keys for x402?**
A: Use the direct USDC transfer method. Send USDC to the payment address and provide the tx hash.

**Q: Is there a test environment?**
A: Yes, use the "test" package ($0.01) on production. There's no separate test API.

**Q: How do I increase rate limits?**
A: Contact ProductClank with your use case and expected volume.

## Version

**Version:** 1.0.0
**Last Updated:** 2026-02-20
**Agent Skills Spec:** v1 (Anthropic)

---

**Built for the [Agent Skills](https://agentskills.io) standard**
