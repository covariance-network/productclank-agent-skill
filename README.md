# ProductClank Campaigns - Agent Skill

An [Agent Skill](https://agentskills.io) for creating Communiply campaigns on ProductClank.

## What is This?

This is an Agent Skill that enables AI agents to create community-driven brand advocacy campaigns on ProductClank. Agents can autonomously discover relevant Twitter/X conversations, generate authentic replies, and coordinate community members to amplify brands through genuine word-of-mouth.

**ProductClank Communiply** solves the authenticity problem in social media marketing: when your brand promotes itself, people dismiss it as advertising. Communiply enables real people (employees, users, community members) to naturally recommend your brand in relevant conversations — creating authentic word-of-mouth at scale.

## Quick Start

**New to the API?** Start here: [QUICKSTART.md](QUICKSTART.md) — Get your first campaign running in 5 minutes!

### For AI Agents

This skill is loaded automatically when an agent needs to create Twitter/X marketing campaigns. The agent will:

1. Register itself via `POST /api/v1/agents/register` (gets API key + 300 free credits)
2. Search for the product via `GET /api/v1/agents/products/search?q=name`
3. Create the campaign via `POST /api/v1/agents/campaigns` (10 credits)
4. (Optional) Share the campaign URL with the user for review
5. Call `POST /api/v1/agents/campaigns/{id}/generate-posts` (12 credits/post)
6. Return the campaign dashboard URL for tracking

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

## Getting Started

### 1. Register Your Agent (Self-Service)

No manual approval needed — register instantly:

```bash
curl -X POST https://api.productclank.com/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{"name": "MyAgent", "description": "AI agent for social media campaigns"}'
```

You'll receive:
- **API key** (`pck_live_*`) — shown once, save immediately
- **300 free credits** — enough for ~24 posts (no USDC needed to start)

Optional fields: `wallet_address`, `erc8004_agent_id`, `website`, `logo`, `user_id` (link to existing ProductClank user for shared credits & dashboard access)

### 2. Find Your Product

```bash
curl "https://api.productclank.com/api/v1/agents/products/search?q=MyProduct" \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
```

Don't have a product? Create one at [app.productclank.com/products](https://app.productclank.com/products)

### 3. Create Your First Campaign

```bash
curl -X POST https://api.productclank.com/api/v1/agents/campaigns \
  -H "Authorization: Bearer pck_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "YOUR_PRODUCT_UUID",
    "title": "Launch Campaign",
    "keywords": ["AI tools", "productivity apps"],
    "search_context": "People discussing AI productivity tools"
  }'
```

### 4. Generate Posts

```bash
curl -X POST https://api.productclank.com/api/v1/agents/campaigns/CAMPAIGN_ID/generate-posts \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
```

### 5. Buy More Credits (When Free Credits Run Out)

**Option A: x402 Protocol** (Recommended)
- Requires: Wallet with private key access + USDC on Base
- Payment happens automatically via `@x402/fetch`

**Option B: Direct USDC Transfer**
- Send USDC on Base to: `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
- Submit tx hash via `POST /api/v1/agents/credits/topup`

**Option C: Trusted Agent Status**
- Contact ProductClank for whitelisting (testing/partnerships)

## Directory Structure

```
productclank-agent-skill/
├── QUICKSTART.md               # 5-minute quick start guide (START HERE!)
├── SKILL.md                    # Main skill documentation (loaded by agents)
├── README.md                   # This file
├── CHANGELOG.md                # Version history
├── references/
│   ├── API_REFERENCE.md        # Complete API specification
│   └── EXAMPLES.md             # Code examples for common use cases
└── scripts/
    └── create-campaign.mjs     # Helper script for quick campaign creation
```

## API Endpoints

### Registration & Identity
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/agents/register` | Self-register, get API key + 300 free credits |
| GET | `/agents/me` | View agent profile & rate limits |
| POST | `/agents/rotate-key` | Rotate API key |
| POST | `/agents/import` | Import ERC-8004 agent metadata |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/agents/products/search?q=` | Search products by name/UUID |

### Campaigns
| Method | Endpoint | Cost | Description |
|--------|----------|------|-------------|
| POST | `/agents/campaigns` | 10 credits | Create campaign |
| GET | `/agents/campaigns` | Free | List your campaigns |
| GET | `/agents/campaigns/{id}` | Free | Campaign details & stats |
| POST | `/agents/campaigns/{id}/generate-posts` | 12 cr/post | Trigger discovery & replies |
| POST | `/agents/campaigns/{id}/review-posts` | 2 cr/post | AI relevancy review & cleanup |
| POST | `/agents/campaigns/{id}/delegates` | Free | Add campaign delegator |
| POST | `/agents/campaigns/boost` | 200-300 cr | Boost a specific tweet |

### Credits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/agents/credits/balance` | Check credit balance |
| POST | `/agents/credits/topup` | Buy credit bundle (USDC on Base) |
| GET | `/agents/credits/history` | Transaction history |

## Credit System

### Free Credits
Every new agent gets **300 free credits** on registration — no payment needed to start.

### Credit Costs

| Operation | Credits |
|-----------|---------|
| Create campaign | 10 |
| Discover post + generate reply | 12 |
| Tweet boost (10 AI replies) | 200 |
| Tweet boost (likes/repost) | 300 |
| Review post (AI relevancy) | 2 |

### Credit Bundles (USDC on Base)

| Bundle | Price | Credits | ~Posts |
|--------|-------|---------|--------|
| nano | $2 | 40 | ~3 |
| micro | $10 | 200 | ~16 |
| small | $25 | 550 | ~45 |
| medium | $50 | 1,200 | ~100 |
| large | $100 | 2,600 | ~216 |
| enterprise | $500 | 14,000 | ~1,166 |

All payments in USDC on Base network (chain ID 8453).

## Rate Limits

- **Default**: 10 campaigns per day per agent
- **Custom limits**: Contact ProductClank for higher limits

## Use Cases

### 1. Competitor Intercept
Target conversations mentioning competitors. Community naturally suggests your product.

### 2. Problem-Based Targeting
Find people expressing pain points your product solves.

### 3. Brand Amplification
Third-party validation reinforces positive mentions of your brand.

### 4. Tweet Boost
Amplify a specific tweet with 10 authentic community reply threads.

### 5. Product Launches
Coordinate community amplification during launch week.

## How Communiply Works

1. **AI Discovers Opportunities** — Monitors Twitter/X 24/7 for relevant conversations
2. **Generates Smart Replies** — Context-aware, value-adding responses (not sales pitches)
3. **Community Amplifies** — Real people post from personal accounts
4. **Tracks Results** — Real-time analytics on engagement, reach, and ROI

## FAQ

**Q: Do I need to contact anyone to get an API key?**
A: No! Self-register via `POST /api/v1/agents/register`. API key + 300 free credits are provided instantly.

**Q: Do I need USDC to start?**
A: No. Registration includes 300 free credits — enough for ~24 posts. Buy more when you run out.

**Q: What happens after a campaign is created?**
A: Call `POST /api/v1/agents/campaigns/{id}/generate-posts` to trigger Twitter discovery and reply generation. Credits are deducted at that point. Optionally share the campaign URL with the user for review first.

**Q: How much does it cost to create a campaign?**
A: 10 credits for campaign creation + 12 credits per post discovered. A typical 10-post test campaign costs ~130 credits.

**Q: Can I list or check my campaigns via API?**
A: Yes! `GET /api/v1/agents/campaigns` lists all your campaigns. `GET /api/v1/agents/campaigns/{id}` shows details and stats.

**Q: What if I lose my API key?**
A: Use `POST /api/v1/agents/rotate-key` with your current key to generate a new one. If you've lost access completely, contact ProductClank.

**Q: Can I delete or pause campaigns?**
A: Yes, via the web dashboard at [app.productclank.com/communiply/campaigns/](https://app.productclank.com/communiply/campaigns/)

**Q: Is there a test environment?**
A: No separate test API — use the 300 free credits from registration to test on production.

**Q: How do I increase rate limits?**
A: Contact ProductClank with your use case and expected volume.

## Support & Resources

- **API Documentation**: [references/API_REFERENCE.md](references/API_REFERENCE.md)
- **Campaign Dashboard**: [app.productclank.com/communiply/campaigns/](https://app.productclank.com/communiply/campaigns/)
- **Website**: [productclank.com](https://www.productclank.com)
- **Twitter**: [@productclank](https://twitter.com/productclank)
- **Warpcast**: [warpcast.com/productclank](https://warpcast.com/productclank)

## Version

**Version:** 1.3.0
**Last Updated:** 2026-03-06
**Agent Skills Spec:** v1 (Anthropic)

---

**Built for the [Agent Skills](https://agentskills.io) standard**
