---
name: productclank-campaigns
description: Create AI-powered Twitter/X brand advocacy campaigns on ProductClank. Automatically discover relevant conversations, generate authentic replies, and coordinate community members to amplify your brand through genuine word-of-mouth. Use when users want to scale social media presence, run community-driven marketing, boost brand awareness, intercept competitors, or turn users into brand advocates.
license: Proprietary
metadata:
  author: ProductClank
  version: "2.1.0"
  api_endpoint: https://api.productclank.com/api/v1/agents/campaigns
  website: https://www.productclank.com
  web_ui: https://app.productclank.com/communiply/campaigns/
compatibility: Credit-based pay-per-use system. Self-registration with 300 free credits. Agents buy more credits with USDC on Base (chain ID 8453). Supports x402 protocol and direct USDC transfers. Works with any wallet type.
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
| When You Promote Yourself | When Others Recommend You |
|---------------------------|--------------------------|
| Responses scream "advertisement" | Real users = authentic credibility |
| People dismiss automatically | 10x more trustworthy |
| Zero credibility in competitive conversations | Natural presence everywhere |
| Limited reach—only your followers | Unlimited reach—appears wherever conversations happen |

## Key Use Cases

### 1. Launch Campaigns with Community Rewards
**Run a campaign to reward your community for amplifying your product announcements.**
- Create a boost campaign for your launch tweet or product announcement
- Community members submit their posts/engagement (retweets, likes, replies)
- Reward participants with credits or points in YOUR system (loyalty program, token rewards, etc.)
- Communiply handles all the discovery, reply generation, and tracking

**Example:** Product launch week — users earn 10 points per repost, 5 points per like. Top contributors get bonus rewards.

### 2. Competitor Intercept
**Trigger:** "Looking for Salesforce alternatives"
**Result:** Community members suggest your product with authentic recommendations

### 3. Problem-Based Targeting
**Trigger:** "Struggling with email marketing"
**Result:** Timely, helpful suggestions when people express pain points your product solves

### 4. Brand Amplification
**Trigger:** Someone praises your brand
**Result:** Third-party validation reinforces positive mentions

### 5. Tweet Boost
**Trigger:** Your product just shipped a big update
**Result:** Community generates 10 authentic reply threads amplifying the announcement

### 6. Product Launches
Coordinate community amplification during launch week.

### Campaign Lifecycle

```
1. YOU: Create Campaign via API
   POST /agents/campaigns (10 credits)
         │
         v
2. YOU: Trigger Post Discovery
   POST /campaigns/{id}/generate-posts (12 credits/post)
         │
         v
3. AI: Scans Twitter 24/7
   Finds conversations matching keywords, generates smart replies
         │
         v
4. COMMUNITY: Claims & Posts
   Real people review replies, post from personal accounts, earn rewards
         │
         v
5. RESULTS: Track Performance
   GET /campaigns/{id} — engagement stats, reach metrics, ROI
```

**Key takeaway:** You trigger the discovery. AI monitors 24/7. Community executes. You track results.

## Which Endpoint Should I Use?

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

### Campaign Types Comparison

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

## Campaign Cost Estimator

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
- **Total: 290 credits** — Fits in free tier!

## When to Use This Skill

Activate this skill when users mention:
- "Create a Twitter campaign" or "X marketing campaign"
- "Amplify our product on social media"
- "Turn users into advocates" or "community-driven growth"
- "Competitor intercept" or "monitor competitor mentions"
- "Scale word-of-mouth" or "authentic brand advocacy"
- "ProductClank", "Communiply", or "Twitter engagement campaign"
- "Boost this tweet" or "amplify this post"
- Need to boost brand awareness, launch week buzz, or community engagement

## Agent Setup

There are two ways to set up an agent on ProductClank:

### 1. Autonomous Agent (self-funded)

For AI agents that operate independently — register themselves, fund their own credits, and run campaigns without human intervention.

```bash
curl -X POST https://api.productclank.com/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyAutonomousAgent",
    "description": "Growth automation agent"
  }'
```

A synthetic user account is auto-created. The agent gets **300 free credits** and can top up via USDC on Base (x402 protocol) or direct crypto payment.

### 2. Owner-Linked Agent (user-funded)

For users who want to run an agent using their existing ProductClank account and credits. After registering, link the agent to your account via a secure deep link:

```bash
# 1. Register (creates a standalone agent)
curl -X POST https://api.productclank.com/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{"name": "MyPersonalAgent"}'
# → Save the api_key from the response

# 2. Generate a linking URL
curl -X POST https://api.productclank.com/api/v1/agents/create-link \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
# → Returns link_url — click it to log in and link your account
```

The user clicks the `link_url`, logs in via Privy, and the agent is linked to their account. Works from any interface: terminal, Cursor, Claude Code, Telegram, etc.

**Benefits:**
- Agent uses your existing credit balance — no separate funding needed
- Campaigns appear in your "My Campaigns" dashboard
- You can manage, edit, and monitor campaigns via the web UI
- Top up credits via the webapp or crypto

### Trusted Agent (multi-tenant) — Coming Soon

For platform agents (e.g., an official ProductClank Telegram bot) that serve multiple users, where each user pays with their own credits. Each user authenticates their account so the agent knows which account to bill per request. This is not yet available for general use — contact ProductClank if you have a multi-tenant use case.

### Registration Response

Response includes:
- `api_key`: Your `pck_live_*` key (shown once — save it immediately)
- `credits.balance`: 300 free credits (~24 posts)
- `agent.linked_to_human`: Whether the agent is linked to a real user
- `_hint`: If not linked, a hint explaining how to link to a human user

Optional fields: `wallet_address`, `erc8004_agent_id`, `website`, `logo`

## Getting Started

### Step 1: Find Your Product

Search for a product to promote:

```bash
curl "https://api.productclank.com/api/v1/agents/products/search?q=product+name" \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
```

Returns product IDs, names, taglines, logos. Use the `id` field for campaign creation.

> **No product yet?** Direct users to create one at [app.productclank.com/products](https://app.productclank.com/products)

### Step 2: Check Credit Balance

```bash
curl https://api.productclank.com/api/v1/agents/credits/balance \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
```

Response: `{ balance: 300, plan: "free", lifetime_purchased: 0, lifetime_used: 0, lifetime_bonus: 300 }`

### Step 3: Create a Campaign (10 credits)

Campaign creation costs **10 credits**. Post generation costs additional credits in the next step.

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
      mention_accounts: ["@productclank"],
      reply_style_tags: ["friendly", "technical", "enthusiastic"],
      reply_length: "short",
      min_follower_count: 500,
      max_post_age_days: 7,
    }),
  }
);

const result = await response.json();
// result.campaign.id — use for generate-posts
// result.campaign.url — share with user for review
// result.credits.credits_used — 10
// result.credits.credits_remaining — 290
```

**Response:**
```json
{
  "success": true,
  "campaign": {
    "id": "uuid",
    "campaign_number": "CP-042",
    "title": "Launch Week Buzz Campaign",
    "status": "active",
    "created_via": "api",
    "creator_agent_id": "agent-uuid",
    "is_funded": true,
    "url": "https://app.productclank.com/communiply/uuid",
    "admin_url": "https://app.productclank.com/my-campaigns/communiply/uuid"
  },
  "credits": {
    "credits_used": 10,
    "credits_remaining": 290,
    "billing_user_id": "user-uuid"
  },
  "next_step": {
    "action": "generate_posts",
    "endpoint": "POST /api/v1/agents/campaigns/{id}/generate-posts",
    "description": "Generate posts for this campaign. Optionally share the campaign URL with the user for review first."
  }
}
```

**Campaign Fields:**
- `product_id` (required): Product UUID from search
- `title` (required): Campaign name
- `keywords` (required): Array of keywords to monitor
- `search_context` (required): Description of target conversations
- `mention_accounts` (optional): Twitter handles to mention
- `reply_style_tags` (optional): Tone tags (e.g., ["friendly", "technical"])
- `reply_style_account` (optional): Twitter handle to mimic style
- `reply_length` (optional): "very-short" | "short" | "medium" | "long" | "mixed"
- `reply_guidelines` (optional): Custom instructions for AI (overrides auto-generated)
- `min_follower_count` (optional): Minimum followers (default: 100)
- `min_engagement_count` (optional): Minimum engagement threshold
- `max_post_age_days` (optional): Maximum post age in days
- `require_verified` (optional): Only verified accounts

### Step 4: Generate Posts (12 credits/post)

After creating the campaign, call `generate-posts` to trigger discovery and reply generation. You may optionally share the campaign URL with the user for review first.

```typescript
const generateRes = await fetch(
  `https://api.productclank.com/api/v1/agents/campaigns/${campaignId}/generate-posts`,
  {
    method: "POST",
    headers: { "Authorization": "Bearer pck_live_YOUR_API_KEY" },
  }
);

const generateResult = await generateRes.json();
// generateResult.postsGenerated — number of posts found
// generateResult.credits.creditsUsed — 12 per post
// generateResult.credits.creditsRemaining — remaining balance
```

**Error codes:**
- `402` — Insufficient credits (top up via `/api/v1/agents/credits/topup`)
- `403` — Campaign does not belong to your agent
- `404` — Campaign not found

### Step 5: Check Results

Get campaign status and stats:

```bash
curl https://api.productclank.com/api/v1/agents/campaigns/{campaignId} \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
```

Returns campaign details + `stats.posts_discovered`, `stats.replies_total`, `stats.replies_by_status`.

### Step 6: Review Posts (2 credits/post) — Optional

After generating posts, use AI review to bulk-score discovered posts against custom relevancy rules. Irrelevant posts are automatically deleted.

```typescript
const reviewRes = await fetch(
  `https://api.productclank.com/api/v1/agents/campaigns/${campaignId}/review-posts`,
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer pck_live_YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      review_rules: "Only keep posts where a builder is announcing their own product or asking for feedback on a product they built. Remove general industry commentary, news reshares, and job postings.",
      threshold: 5,        // Posts scoring below this are irrelevant (1-10 scale)
      dry_run: false,      // true = preview only, false = delete irrelevant posts
      save_rules: true,    // Save rules to campaign for future use
    }),
  }
);

const reviewResult = await reviewRes.json();
// reviewResult.summary.total_reviewed — number of posts scored
// reviewResult.summary.deleted — posts deleted (0 if dry_run)
// reviewResult.summary.kept — posts that passed review
// reviewResult.credits.charged — total credits used
// reviewResult.credits.remaining — remaining balance
```

**Tip:** Run with `dry_run: true` first to preview which posts would be removed before committing. Both dry run and apply consume credits since AI scoring runs either way.

**Error codes:**
- `400` — Missing `review_rules` (not in request body or saved on campaign)
- `402` — Insufficient credits (top up via `/api/v1/agents/credits/topup`)
- `403` — Campaign does not belong to your agent
- `404` — Campaign not found

## Tweet Boost

Amplify a specific tweet with community engagement. Unlike campaigns (which discover tweets), boost targets a single tweet you provide.

```typescript
const response = await fetch(
  "https://api.productclank.com/api/v1/agents/campaigns/boost",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer pck_live_YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tweet_url: "https://x.com/productclank/status/123456789",
      product_id: "PRODUCT_UUID",
      action_type: "replies",  // "replies" | "likes" | "repost"
    }),
  }
);
```

**Credit costs:**
| Action | Items Generated | Credits |
|--------|----------------|---------|
| `replies` | 10 AI replies | 200 |
| `likes` | 30 like tasks | 300 |
| `repost` | 10 repost tasks | 300 |

**Response:**
```json
{
  "success": true,
  "campaign": {
    "id": "uuid",
    "campaign_number": "CP-043",
    "action_type": "replies",
    "is_reboost": false,
    "url": "https://app.productclank.com/communiply/uuid",
    "admin_url": "https://app.productclank.com/my-campaigns/communiply/uuid"
  },
  "tweet": { "id": "123456789", "url": "https://x.com/...", "text": "...", "author": "..." },
  "items_generated": 10,
  "credits": { "credits_used": 200, "credits_remaining": 90 }
}
```

Re-boosting the same tweet generates fresh content without duplicates.

## Credit Management

**Who pays?**
- **Autonomous agents** — credits deducted from the agent's own balance (funded via crypto)
- **Owner-linked agents** — credits deducted from the linked owner's balance (funded via webapp or crypto)

### Credit Costs

| Operation | Credits | Notes |
|-----------|---------|-------|
| Registration | +300 free | One-time signup bonus |
| Create campaign | 10 | Deducted at creation |
| Discover + generate reply | 12/post | Deducted at generate-posts |
| Generate reply only | 8 | For pre-supplied posts |
| Regenerate reply | 5 | Refresh existing reply |
| Boost (replies) | 200 | 10 AI reply threads |
| Boost (likes) | 300 | 30 like tasks |
| Boost (repost) | 300 | 10 repost tasks |
| Chat message | 3 | AI refinement (Tier 3) |
| Keyword generation | 2 | AI keywords (Tier 2) |
| Review post (AI relevancy) | 2 | AI scores post against rules |

### Credit Bundles (USDC on Base)

| Bundle | Price | Credits | Rate | ~Posts |
|--------|-------|---------|------|--------|
| **nano** | $2 | 40 | 20 cr/$ | ~3 |
| **micro** | $10 | 200 | 20 cr/$ | ~16 |
| **small** | $25 | 550 | 22 cr/$ | ~45 |
| **medium** | $50 | 1,200 | 24 cr/$ | ~100 |
| **large** | $100 | 2,600 | 26 cr/$ | ~216 |
| **enterprise** | $500 | 14,000 | 28 cr/$ | ~1,166 |

### Top Up Credits

There are two funding scenarios depending on your agent setup:

#### Scenario 1: Autonomous Agent (self-funded)

Agent manages its own credit balance and pays for campaigns independently.

**Option A: x402 Protocol** (Recommended for agents with wallet access)
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

**Option B: Direct USDC Transfer**
1. Send USDC on Base to `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
2. Call `POST /api/v1/agents/credits/topup` with `{ bundle: "medium", payment_tx_hash: "0x..." }`

#### Scenario 2: Agent Running Campaigns for Users (user-funded)

Agent creates campaigns on behalf of users, who pay for the credits.

**Step 1: User authorizes the agent**
```bash
# Agent generates a linking URL
curl -X POST "https://api.productclank.com/api/v1/agents/create-link" \
  -H "Authorization: Bearer pck_live_YOUR_AGENT_API_KEY"
```
Share the returned `link_url` with the user. They click it, log in via Privy, and authorize the agent.

**Step 2: User tops up credits**
Direct the user to: **https://app.productclank.com/credits**

User payment options:
- **Credit card** — No crypto needed
- **Crypto** — USDC on Base
- **Monthly subscription** — Better rates per credit, auto-renewal

**Step 3: Agent uses user's credits**
Once authorized, pass `caller_user_id` to bill the user's balance:
```bash
curl -X POST "https://api.productclank.com/api/v1/agents/campaigns/{id}/generate-posts" \
  -H "Authorization: Bearer pck_live_YOUR_AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"caller_user_id": "user-uuid-here"}'
```

### View Transaction History

```bash
curl "https://api.productclank.com/api/v1/agents/credits/history?limit=50" \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
```

## Agent Management

### View Agent Profile

```bash
curl https://api.productclank.com/api/v1/agents/me \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
```

Returns agent name, status, trusted flag, rate limits, and credit balance.

### Rotate API Key

If your key is compromised:

```bash
curl -X POST https://api.productclank.com/api/v1/agents/rotate-key \
  -H "Authorization: Bearer pck_live_YOUR_CURRENT_KEY"
```

Returns new key. Old key is immediately invalidated.

### List Your Campaigns

```bash
curl "https://api.productclank.com/api/v1/agents/campaigns?limit=20&status=active" \
  -H "Authorization: Bearer pck_live_YOUR_KEY"
```

### Campaign Delegates

Add a ProductClank user as a delegator (gives them edit access in the web dashboard):

```bash
curl -X POST https://api.productclank.com/api/v1/agents/campaigns/{campaignId}/delegates \
  -H "Authorization: Bearer pck_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "user_id": "productclank-user-uuid" }'
```

### ERC-8004 Agent Import

Pre-fill registration data from an ERC-8004 on-chain agent:

```bash
curl -X POST https://api.productclank.com/api/v1/agents/import \
  -H "Content-Type: application/json" \
  -d '{ "source": "erc8004", "erc8004_agent_id": "your-agent-id" }'
```

Returns agent metadata from 8004.org — use to pre-fill the `/register` call.

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

**Need higher limits?** Contact ProductClank with your use case, expected volume, and business model.

## Skill Version Updates

Every API response includes an `X-Skill-Version` header (e.g., `X-Skill-Version: 2.1.0`). Compare this against the version in your cached skill metadata to detect updates.

**How to stay current:**
1. After any API call, read the `X-Skill-Version` response header
2. Compare it to the `metadata.version` in your cached SKILL.md (currently `2.1.0`)
3. If the API version is newer, re-fetch the skill from GitHub:
   `https://raw.githubusercontent.com/covariance-network/productclank-agent-skill/main/SKILL.md`

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
  // Re-fetch full SKILL.md and update cache
  localStorage.setItem("productclank-skill-version", skillMeta);
}
```

This ensures you always have the latest endpoints, features, and credit costs without polling.

## Best Practices

1. **Be Specific with Keywords**
   - Good: ["AI productivity tools", "automation software", "workflow optimization"]
   - Bad: ["AI", "tools", "software"]

2. **Write Clear Search Context**
   - Good: "People discussing challenges with project management and looking for better collaboration tools"
   - Bad: "People talking about stuff"

3. **Set Appropriate Filters**
   - Use `min_follower_count` to target quality accounts (default: 100)
   - Use `max_post_age_days` to ensure timely engagement
   - Use `require_verified` for high-profile campaigns

4. **Customize Reply Guidelines**
   - Provide specific brand voice instructions
   - Mention key value propositions to highlight
   - Include do's and don'ts for messaging

5. **Share Both Campaign URLs**
   - **Admin dashboard** (for the campaign owner): `https://app.productclank.com/my-campaigns/communiply/{campaign_id}` — manage posts, view analytics, edit settings
   - **Public campaign page** (for community participants): `https://app.productclank.com/communiply/{campaign_id}` — browse posts, claim replies, participate
   - Always share both URLs with the user after creating a campaign

## Complete Example Flow

```typescript
const API = "https://api.productclank.com/api/v1";
const headers = { "Authorization": "Bearer pck_live_YOUR_KEY", "Content-Type": "application/json" };

// 0. Registration (done once — see Step 0 above)
// If linked to a human user_id: campaigns auto-appear in their dashboard,
// credits are shared, and the human can manage campaigns via the web UI.

// 1. Check balance (300 free credits from registration, or shared with linked user)
const { balance } = await fetch(`${API}/agents/credits/balance`, { headers }).then(r => r.json());

// 2. Find product
const { products } = await fetch(`${API}/agents/products/search?q=MyProduct`, { headers }).then(r => r.json());
const productId = products[0].id;

// 3. Create campaign (10 credits)
const { campaign } = await fetch(`${API}/agents/campaigns`, {
  method: "POST", headers,
  body: JSON.stringify({
    product_id: productId,
    title: "DeFi App Launch Week",
    keywords: ["DeFi platforms", "yield farming", "crypto staking"],
    search_context: "People discussing DeFi platforms and staking opportunities",
    mention_accounts: ["@mydefiapp"],
    reply_style_tags: ["professional", "helpful"],
    reply_length: "short",
    min_follower_count: 1000,
    max_post_age_days: 3,
  })
}).then(r => r.json());

console.log(`Campaign: ${campaign.campaign_number} — Review: ${campaign.url}`);

// 4. Generate posts (12 credits/post)
const gen = await fetch(`${API}/agents/campaigns/${campaign.id}/generate-posts`, {
  method: "POST", headers: { "Authorization": headers["Authorization"] }
}).then(r => r.json());

console.log(`${gen.postsGenerated} posts, ${gen.credits.creditsUsed} credits used, ${gen.credits.creditsRemaining} remaining`);

// 5. Check results
const { stats } = await fetch(`${API}/agents/campaigns/${campaign.id}`, { headers }).then(r => r.json());
console.log(`Discovered: ${stats.posts_discovered}, Replies: ${stats.replies_total}`);
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Insufficient credits" | Campaign creation = 10 cr. Posts = 12 cr each. Top up at `/agents/credits/topup` |
| "Product not found" | Search: `GET /agents/products/search?q=name` or create at app.productclank.com/products |
| "Invalid API key" | Starts with `pck_live_`. Rotate with `POST /agents/rotate-key` if compromised |
| "Rate limit exceeded" | 10 campaigns/day default. Contact ProductClank for more. |
| "Payment verification failed" | USDC on Base (not ETH mainnet). Tx must be < 1 hour old. |

## FAQ

**Q: Do I need to contact anyone to get an API key?**
A: No! Self-register via `POST /api/v1/agents/register`. API key + 300 free credits are provided instantly.

**Q: Do I need USDC to start?**
A: No. Registration includes 300 free credits — enough for ~24 posts. Buy more when you run out.

**Q: What happens after a campaign is created?**
A: Share the admin dashboard URL (`/my-campaigns/communiply/{id}`) with the campaign owner and the public URL (`/communiply/{id}`) with community participants. Then call `POST /api/v1/agents/campaigns/{id}/generate-posts` to trigger Twitter discovery and reply generation (12 credits/post). Optionally use `review-posts` to AI-filter irrelevant results (2 credits/post).

**Q: How much does it cost to create a campaign?**
A: 10 credits for campaign creation + 12 credits per post discovered. A typical 10-post test campaign costs ~130 credits.

**Q: What's the difference between autonomous and owner-linked agents?**
A: **Autonomous agents** have their own credit balance and fund themselves via crypto. **Owner-linked agents** share the owner's credit balance — the owner can also manage campaigns in the webapp UI.

**Q: How do I link my agent to my account?**
A: Call `POST /api/v1/agents/create-link` to get a linking URL. Click it, log in via Privy, and the agent is linked to your account.

**Q: Can I list or check my campaigns via API?**
A: Yes! `GET /api/v1/agents/campaigns` lists all your campaigns. `GET /api/v1/agents/campaigns/{id}` shows details and stats.

**Q: Can I delete or pause campaigns?**
A: Yes, via the admin dashboard at `https://app.productclank.com/my-campaigns/communiply/{campaign_id}`

**Q: Which endpoint should I use — Communiply or Boost?**
A: See the [decision tree](#which-endpoint-should-i-use) at the top of this document.

**Q: Is there a test environment?**
A: No separate test API — use the 300 free credits from registration to test on production.

**Q: What if I lose my API key?**
A: Use `POST /api/v1/agents/rotate-key` with your current key to generate a new one. If you've lost access completely, contact ProductClank.

**Q: How do I increase rate limits?**
A: Contact ProductClank with your use case and expected volume.

## Support & Resources

- **API Reference**: [references/API_REFERENCE.md](references/API_REFERENCE.md)
- **Code Examples**: [references/EXAMPLES.md](references/EXAMPLES.md)
- **Campaign Dashboard**: [app.productclank.com/communiply/campaigns/](https://app.productclank.com/communiply/campaigns/)
- **Twitter**: [@productclank](https://twitter.com/productclank)
- **Warpcast**: [warpcast.com/productclank](https://warpcast.com/productclank)

## Tier 2: Research-Enhanced Campaign (Coming Soon)

Enhance campaigns with AI-powered research before generating posts.

```
1. POST /agents/generate-keywords           → 2 credits
2. POST /agents/campaigns                   → 10 credits
3. POST /agents/campaigns/{id}/research     → free
4. GET  /agents/campaigns/{id}/research     → free
5. POST /agents/campaigns/{id}/verticals    → free
6. POST /agents/campaigns/{id}/generate-posts → 12 credits/post
```

## Tier 3: Iterate & Optimize (Coming Soon)

Full campaign lifecycle management with AI refinement.

```
7.  GET  /agents/campaigns/{id}/posts             → free
8.  POST /agents/campaigns/{id}/refine            → 3 credits/message
9.  POST /agents/campaigns/{id}/regenerate-replies → 5 credits/reply
10. PATCH /agents/campaigns/{id}                   → free
11. POST /agents/campaigns/{id}/generate-posts     → 12 credits/post
12. Repeat 7-11 as needed
```

## Credit Cost Summary (All Tiers)

| Operation | Credits | Tier |
|-----------|---------|------|
| Create campaign | 10 | 1 |
| Generate posts (discover + reply) | 12/post | 1 |
| Tweet boost (replies) | 200 | 1 |
| Tweet boost (likes/repost) | 300 | 1 |
| Generate keywords (AI) | 2 | 2 |
| Research analysis | 0 (free) | 2 |
| Select verticals | 0 (free) | 2 |
| Review posts (AI relevancy) | 2/post | 1 |
| Read campaign/posts | 0 (free) | 3 |
| Regenerate replies | 5/reply | 3 |
| Refine chat (AI) | 3/message | 3 |
| Update settings | 0 (free) | 3 |
