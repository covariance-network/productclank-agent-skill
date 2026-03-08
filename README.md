# ProductClank Campaigns - Agent Skill

An [Agent Skill](https://agentskills.io) for creating Communiply campaigns on ProductClank.

## 🗺️ Which Endpoint Should I Use?

**Quick decision tree:**

```
What do you want to do?
│
├─ Amplify a specific tweet RIGHT NOW
│  └─> POST /agents/campaigns/boost
│      • Cost: 200-300 credits
│      • Result: 10 AI-generated reply threads OR likes/reposts
│      • Time: Immediate (single action)
│      • Best for: Product launches, announcements, one-time promotion
│
└─ Monitor conversations ongoing & respond when relevant
   └─> POST /agents/campaigns (Communiply)
       • Cost: 10 + (12 credits × posts discovered)
       • Result: Continuous 24/7 monitoring & replies
       • Time: Ongoing automated campaign
       • Best for: Competitor intercept, problem targeting, brand monitoring
```

**Still not sure?** See the [Comparison Table](#campaign-types-comparison) below.

---

## 💰 Campaign Cost Estimator

**Your 300 free credits can run:**

| Campaign Type | Credits Needed | Posts Generated | Best For |
|---------------|----------------|----------------|----------|
| **Small test** | ~60 | 4 posts | Testing the API |
| **Medium test** | ~130 | 10 posts | Proof of concept |
| **Full test** | ~250 | 20 posts | Real campaign test |
| **Tweet boost** | 200-300 | 10 replies OR engagement | One-time amplification |

**Formula:** `Total = 10 (campaign) + (posts × 12) + (optional: review × 2)`

**Example breakdown:**
- Campaign creation: 10 credits
- Discover + generate 20 posts: 20 × 12 = 240 credits
- Review 20 posts (optional): 20 × 2 = 40 credits
- **Total: 290 credits** ← Fits in free tier!

**Need more?** See [Credit Bundles](#credit-bundles-usdc-on-base) below.

---

## What is This?

This is an Agent Skill that enables AI agents to create community-driven brand advocacy campaigns on ProductClank. Agents can autonomously discover relevant Twitter/X conversations, generate authentic replies, and coordinate community members to amplify brands through genuine word-of-mouth.

**ProductClank Communiply** solves the authenticity problem in social media marketing: when your brand promotes itself, people dismiss it as advertising. Communiply enables real people (employees, users, community members) to naturally recommend your brand in relevant conversations — creating authentic word-of-mouth at scale.

## Quick Start

**New to the API?** Start here: [QUICKSTART.md](QUICKSTART.md) — Get your first campaign running in 5 minutes!

### For AI Agents

This skill is loaded automatically when an agent needs to create Twitter/X marketing campaigns. The agent will:

1. Register itself via `POST /api/v1/agents/register` — two paths:
   - **Autonomous**: No `user_id` → gets own credit balance (self-funded via crypto)
   - **Owner-linked**: With `user_id` → shares owner's credits, campaigns visible in their dashboard
2. Search for the product via `GET /api/v1/agents/products/search?q=name`
3. Create the campaign via `POST /api/v1/agents/campaigns` (10 credits)
4. Share both URLs: **admin dashboard** (owner) + **public page** (community participants)
5. Call `POST /api/v1/agents/campaigns/{id}/generate-posts` (12 credits/post)
6. (Optional) Call `POST /api/v1/agents/campaigns/{id}/review-posts` to AI-filter irrelevant posts (2 credits/post)

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

## Campaign Types Comparison

| Feature | Communiply | Boost |
|---------|-----------|-------|
| **Use case** | Ongoing monitoring & advocacy | One-time tweet amplification |
| **Target** | Keyword-based conversations | Specific tweet URL |
| **Cost** | 10 + (12 × posts) | 200-300 credits (fixed) |
| **Discovery** | Continuous 24/7 scanning | Immediate burst |
| **Replies** | As many as AI finds | Fixed (10 reply threads) |
| **Timeline** | Ongoing campaign | One-shot action |
| **Best for** | Competitor intercept, problem targeting | Launch announcements, specific posts |

**When to use Communiply:**
- "Monitor whenever someone mentions [competitor]"
- "Find people asking about [problem your product solves]"
- "Ongoing brand advocacy campaign"

**When to use Boost:**
- "We just launched v2.0, amplify this tweet"
- "This announcement needs 10 replies ASAP"
- "Boost this specific Product Hunt post"

## Getting Started

### 1. Register Your Agent

Self-register via the API — no approval needed:

```bash
curl -X POST https://api.productclank.com/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{"name": "MyAgent"}'
```

Returns your API key instantly (shown once — store securely) + **300 free credits**.

All agents start as **autonomous** (self-funded). To use your existing ProductClank credits instead, link the agent to your account:

```bash
# After registration, generate a linking URL
curl -X POST https://api.productclank.com/api/v1/agents/create-link \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
# → Returns link_url — click it, log in via Privy, and your agent is linked
```

Optional registration fields: `wallet_address`, `erc8004_agent_id`, `website`, `logo`

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

**Two funding scenarios:**

#### Scenario 1: Autonomous Agents (Self-Funded)
Agent manages its own credit balance and pays for campaigns independently.

**Option A: x402 Protocol** (Recommended)
- Requires: Wallet with private key access + USDC on Base
- Payment happens automatically via `@x402/fetch`
- Network: Base (Coinbase L2, chain ID 8453)

**Option B: Direct USDC Transfer**
- Send USDC on Base to: `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
- Submit tx hash via `POST /api/v1/agents/credits/topup`

#### Scenario 2: Agent Running Campaigns for Users
Agent creates campaigns on behalf of users, who pay for the credits.

**Option A: Fund the Agent Account**
- Same as Scenario 1 (x402 or direct USDC)
- Agent uses its own balance, user reimburses agent off-platform

**Option B: User Tops Up Their Own Account** (Recommended)
- **Via Web App:** https://app.productclank.com/credits
  - **Credit card payments** - No crypto needed
  - **Crypto payments** - USDC on Base
  - **One-time purchase** - Buy credits as needed
  - **Monthly subscription** - Better rates per credit, auto-renewal
- Agent calls API with `caller_user_id` to bill the user's balance
- User manages credits and billing through the webapp dashboard

**Don't have crypto yet?** Your 300 free credits let you test everything first. By the time you need more, you'll know if it's worth the investment.

```
productclank-agent-skill/
├── QUICKSTART.md               # 5-minute quick start guide (START HERE!)
├── SKILL.md                    # Main skill documentation (loaded by agents)
├── README.md                   # This file
├── CHANGELOG.md                # Version history
├── references/
│   ├── API_REFERENCE.md        # Complete API specification
│   └── EXAMPLES.md             # Code examples for common use cases
├── scripts/
│   ├── create-campaign.mjs     # Helper: Create Communiply campaign
│   ├── boost-tweet.mjs         # Helper: Boost specific tweet
│   ├── review-posts.mjs        # Helper: AI review posts
│   └── check-results.mjs       # Helper: Poll campaign stats
└── examples/
    ├── competitor-intercept.md # Use case walkthrough
    ├── problem-targeting.md    # Use case walkthrough
    └── tweet-boost.md          # Use case walkthrough
```

## API Endpoints

### Registration, Identity & Linking
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/agents/register` | Self-register, get API key + 300 free credits |
| POST | `/agents/create-link` | Generate a linking URL for owner-linking |
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

| Bundle | Price | Credits | Rate | ~Posts | Best For |
|--------|-------|---------|------|--------|----------|
| **nano** | $2 | 40 | 20 cr/$ | ~3 | Extending free tier |
| micro | $10 | 200 | 20 cr/$ | ~16 | Small test campaign |
| small | $25 | 550 | 22 cr/$ | ~45 | Product launch |
| medium | $50 | 1,200 | 24 cr/$ | ~100 | Medium campaign |
| large | $100 | 2,600 | 26 cr/$ | ~216 | Large campaign |
| enterprise | $500 | 14,000 | 28 cr/$ | ~1,166 | High volume |

All payments in USDC on Base network (chain ID 8453).

## Rate Limits & Quotas

| Resource | Default Limit | Upgrade Path |
|----------|--------------|--------------|
| Campaigns created | 10/day | Contact ProductClank |
| API calls | 100/hour | Auto-scales with usage |
| Campaign delegates | 5/campaign | Contact for more |
| Credit balance | Unlimited | Buy more bundles |

**What happens when you hit a limit:**
```json
{
  "success": false,
  "error": "rate_limit_exceeded",
  "message": "Daily campaign limit reached (10/10)",
  "retry_after": "2026-03-05T00:00:00Z",
  "limit": 10,
  "usage": 10
}
```

**Need higher limits?** Contact ProductClank with your use case, expected volume, and business model. Typical turnaround: 24-48 hours.

## Use Cases

### 1. Launch Campaigns with Community Rewards
**Run a campaign to reward your community for amplifying your product announcements.**

How it works:
- Create a boost campaign for your launch tweet or product announcement
- Community members submit their posts/engagement (retweets, likes, replies)
- Reward participants with credits or points in YOUR system (loyalty program, token rewards, etc.)
- Communiply handles all the discovery, reply generation, and tracking
- You focus on converting the amplification into real customers

**Example:** Product launch week - users earn 10 points per repost, 5 points per like. Top contributors get bonus rewards.

### 2. Competitor Intercept
Target conversations mentioning competitors. Community naturally suggests your product.

### 3. Problem-Based Targeting
Find people expressing pain points your product solves.

### 4. Brand Amplification
Third-party validation reinforces positive mentions of your brand.

### 5. Tweet Boost
Amplify a specific tweet with 10 authentic community reply threads.

### 6. Product Launches
Coordinate community amplification during launch week.

```
┌─────────────────────────────────────────┐
│ 1. YOU: Create Campaign via API         │
│    POST /agents/campaigns                │
│    Cost: 10 credits                      │
└────────────┬────────────────────────────┘
             │
             v
┌─────────────────────────────────────────┐
│ 2. YOU: Trigger Post Discovery          │
│    POST /campaigns/{id}/generate-posts   │
│    Cost: 12 credits/post                 │
└────────────┬────────────────────────────┘
             │
             v
┌─────────────────────────────────────────┐
│ 3. AI: Scans Twitter 24/7               │
│    • Finds conversations matching        │
│      keywords ("AI tools", etc.)         │
│    • Generates smart, helpful replies    │
│    • No spammy sales pitches             │
└────────────┬────────────────────────────┘
             │
             v
┌─────────────────────────────────────────┐
│ 4. COMMUNITY: Claims & Posts             │
│    • Real people review replies          │
│    • Choose which to post                │
│    • Post from personal accounts         │
│    • Earn rewards for engagement         │
└────────────┬────────────────────────────┘
             │
             v
┌─────────────────────────────────────────┐
│ 5. RESULTS: Track Performance            │
│    GET /campaigns/{id}                   │
│    • Engagement stats                    │
│    • Reach metrics                       │
│    • ROI tracking                        │
└─────────────────────────────────────────┘
```

**Key takeaway:** You trigger the discovery. AI monitors 24/7. Community executes. You track results.

## Skill Version Detection

Every API response includes an `X-Skill-Version` header. Agents should check this periodically and re-fetch if newer.

**Recommended implementation:**

```javascript
// On agent startup (once/day max)
const skillMeta = await fetch(
  "https://raw.githubusercontent.com/covariance-network/productclank-agent-skill/main/SKILL.md"
).then(r => r.text()).then(text => 
  text.match(/version: "(\d+\.\d+\.\d+)"/)?.[1]
);

const cachedVersion = localStorage.getItem("productclank-skill-version");

if (skillMeta !== cachedVersion) {
  console.log(`New skill version: ${skillMeta}`);
  // Re-fetch SKILL.md
  localStorage.setItem("productclank-skill-version", skillMeta);
}
```

**When to check:**
- On agent startup (once/day max)
- When API returns deprecation warning headers
- After major ProductClank announcements

## FAQ

**Q: Do I need to contact anyone to get an API key?**
A: No! Self-register via `POST /api/v1/agents/register`. API key + 300 free credits are provided instantly.

**Q: Do I need USDC to start?**
A: No. Registration includes 300 free credits — enough for ~24 posts. Buy more when you run out.

**Q: What happens after a campaign is created?**
A: Share the admin dashboard URL (`/my-campaigns/communiply/{id}`) with the campaign owner and the public URL (`/communiply/{id}`) with community participants. Then call `POST /api/v1/agents/campaigns/{id}/generate-posts` to trigger Twitter discovery and reply generation (12 credits/post). Optionally use `review-posts` to AI-filter irrelevant results (2 credits/post).

**Q: How much does it cost to create a campaign?**
A: 10 credits for campaign creation + 12 credits per post discovered. A typical 10-post test campaign costs ~130 credits.

**Q: Can I list or check my campaigns via API?**
A: Yes! `GET /api/v1/agents/campaigns` lists all your campaigns. `GET /api/v1/agents/campaigns/{id}` shows details and stats.

**Q: What if I lose my API key?**
A: Use `POST /api/v1/agents/rotate-key` with your current key to generate a new one. If you've lost access completely, contact ProductClank.

**Q: Can I delete or pause campaigns?**
A: Yes, via the admin dashboard at `https://app.productclank.com/my-campaigns/communiply/{campaign_id}`

**Q: Is there a test environment?**
A: No separate test API — use the 300 free credits from registration to test on production.

**Q: What's the difference between autonomous and owner-linked agents?**
A: **Autonomous agents** have their own credit balance and fund themselves via crypto. **Owner-linked agents** share the owner's credit balance — the owner can also manage campaigns in the webapp UI.

**Q: How do I link my agent to my account?**
A: Call `POST /api/v1/agents/create-link` to get a linking URL. Click it, log in via Privy, and the agent is linked to your account.

**Q: How do I increase rate limits?**
A: Contact ProductClank with your use case and expected volume.

**Q: Which endpoint should I use - Communiply or Boost?**
A: See the [decision tree](#-which-endpoint-should-i-use) at the top of this README.

## Support & Resources

- **API Documentation**: [references/API_REFERENCE.md](references/API_REFERENCE.md)
- **Campaign Admin Dashboard**: `https://app.productclank.com/my-campaigns/communiply/{campaign_id}`
- **Public Campaign Page**: `https://app.productclank.com/communiply/{campaign_id}`
- **Website**: [productclank.com](https://www.productclank.com)
- **Twitter**: [@productclank](https://twitter.com/productclank)
- **Warpcast**: [warpcast.com/productclank](https://warpcast.com/productclank)

## Version

**Version:** 2.1.0  
**Last Updated:** 2026-03-08  
**Agent Skills Spec:** v1 (Anthropic)

---

**Built for the [Agent Skills](https://agentskills.io) standard**
