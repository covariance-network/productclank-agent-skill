# ProductClank Agent API v1 - Complete Reference

**Base URL:** `https://app.productclank.com/api/v1`

**Live Documentation:** [app.productclank.com/api/v1/docs](https://app.productclank.com/api/v1/docs)

---

## Authentication

All requests require a Bearer API key in the `Authorization` header:

```http
Authorization: Bearer pck_live_<your_api_key>
```

**API Key Format:**
- Production keys: `pck_live_*`
- Test keys: `pck_test_*` (if available)

**Obtaining an API Key:**
Contact the ProductClank team to register your agent and receive a key. Provide:
- Agent name
- Agent description
- Intended use case
- Estimated daily campaign volume

---

## Endpoints

### POST /api/v1/agents/campaigns

Create a new Communiply campaign.

#### Request Headers
```http
Authorization: Bearer pck_live_YOUR_API_KEY
Content-Type: application/json
```

Optional payment headers (for x402 protocol):
```http
PAYMENT-SIGNATURE: <base64-encoded-payment-payload>
```

#### Request Body

**Required Fields:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `product_id` | string (UUID) | Valid product ID from ProductClank | `"abc-123-def-456"` |
| `title` | string | Campaign title | `"Launch Week Buzz"` |
| `keywords` | string[] | Non-empty array of keywords for discovery | `["AI tools", "productivity"]` |
| `search_context` | string | Description of target conversations | `"People discussing AI productivity tools"` |

**Optional Fields:**

| Field | Type | Description | Default | Example |
|-------|------|-------------|---------|---------|
| `mention_accounts` | string[] | Twitter handles to mention | `[]` | `["@productclank", "@founder"]` |
| `reply_style_tags` | string[] | Tone/style tags for AI | `[]` | `["friendly", "technical"]` |
| `reply_style_account` | string | Twitter handle to mimic style | `null` | `"@paulg"` |
| `reply_length` | enum | Reply length preference | `null` | `"very-short" \| "short" \| "medium" \| "long" \| "mixed"` |
| `reply_guidelines` | string | Custom AI generation instructions | Auto-generated | See below |
| `min_follower_count` | number | Minimum followers for target accounts | `100` | `500` |
| `min_engagement_count` | number | Minimum engagement for target posts | `null` | `10` |
| `max_post_age_days` | number | Maximum age of posts to target | `null` | `7` |
| `require_verified` | boolean | Only target verified accounts | `false` | `true` |
| `estimated_posts` | number | Estimated posts for cost calculation | `null` | `50` |
| `payment_tx_hash` | string | USDC transfer tx hash (alternative to x402) | `null` | `"0x..."` |

**Custom Reply Guidelines Example:**
```json
{
  "reply_guidelines": "Reply as a developer who has used our product for 6+ months.\nFocus on: ease of integration, excellent documentation, responsive support.\nAvoid: marketing speak, over-promising, comparing to competitors directly.\nMention @productclank naturally when relevant.\nInclude our website (https://productclank.com) if it adds value."
}
```

**Complete Request Example:**
```json
{
  "product_id": "abc-123-def-456",
  "title": "DeFi Launch Week Campaign",
  "keywords": [
    "DeFi platforms",
    "yield farming",
    "decentralized finance",
    "crypto staking"
  ],
  "search_context": "People discussing DeFi platforms, yield farming strategies, and looking for better staking opportunities",
  "mention_accounts": ["@mydefiapp", "@founder"],
  "reply_style_tags": ["professional", "technical", "helpful"],
  "reply_style_account": "@VitalikButerin",
  "reply_length": "short",
  "reply_guidelines": "Focus on security and transparency. Mention our audited smart contracts.",
  "min_follower_count": 1000,
  "min_engagement_count": 5,
  "max_post_age_days": 3,
  "require_verified": false,
  "estimated_posts": 50
}
```

#### Response Codes

**200 OK - Success**
Campaign created successfully.

```json
{
  "success": true,
  "campaign": {
    "id": "campaign-uuid",
    "campaign_number": "CP-042",
    "title": "DeFi Launch Week Campaign",
    "status": "active",
    "created_via": "api",
    "creator_agent_id": "agent-uuid",
    "is_funded": true
  },
  "payment": {
    "method": "x402",
    "amount_usdc": 499,
    "network": "base",
    "payer": "0xAgentWalletAddress",
    "tx_hash": "0x..." // only for direct_transfer method
  }
}
```

**402 Payment Required**
Insufficient credits. Top up required to create campaign.

```json
{
  "success": false,
  "error": "insufficient_credits",
  "message": "Insufficient credits to create campaign",
  "required_credits": 600,
  "available_credits": 50,
  "estimated_cost_breakdown": {
    "post_discovery_and_reply": {
      "credits_per_post": 12,
      "estimated_posts": 50,
      "total_credits": 600
    }
  },
  "topup_options": [
    {
      "bundle": "nano",
      "credits": 50,
      "price_usdc": 2
    },
    {
      "bundle": "small",
      "credits": 550,
      "price_usdc": 25,
      "recommended": true
    },
    {
      "bundle": "medium",
      "credits": 1200,
      "price_usdc": 50
    }
  ],
  "payment_methods": {
    "x402": {
      "description": "x402 protocol payment (recommended for wallets with private key access)",
      "config": {
        "scheme": "exact",
        "network": "eip155:8453",
        "payTo": "0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68",
        "amount": "25000000",
        "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "maxTimeoutSeconds": 300,
        "extra": {
          "name": "USD Coin",
          "version": "2"
        }
      }
    },
    "direct_transfer": {
      "description": "Send USDC directly to payment address, then re-submit with payment_tx_hash in request body",
      "pay_to": "0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68",
      "amount_usdc": 25,
      "network": "Base (chain ID 8453)",
      "asset": "USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)"
    }
  }
}
```

**400 Bad Request - Validation Error**
Missing or invalid fields.

```json
{
  "success": false,
  "error": "validation_error",
  "message": "Missing required fields: product_id, title, keywords (non-empty), search_context"
}
```

```json
{
  "success": false,
  "error": "validation_error",
  "message": "Insufficient credits. Required: 600 credits, Available: 50 credits"
}
```

**401 Unauthorized**
Invalid or missing API key.

```json
{
  "success": false,
  "error": "unauthorized",
  "message": "Invalid API key"
}
```

```json
{
  "success": false,
  "error": "unauthorized",
  "message": "Missing Authorization header"
}
```

**404 Not Found**
Product not found.

```json
{
  "success": false,
  "error": "not_found",
  "message": "Product not found"
}
```

**429 Rate Limited**
Daily campaign limit exceeded.

```json
{
  "success": false,
  "error": "rate_limit_exceeded",
  "message": "Daily campaign creation limit exceeded (10/day)"
}
```

**500 Internal Server Error**
Server error during campaign creation.

```json
{
  "success": false,
  "error": "creation_failed",
  "message": "Failed to create campaign",
  "details": "Error details here"
}
```

---

## Payment Methods

### 1. x402 Protocol Payment (Recommended)

Uses the [x402 payment protocol](https://www.x402.org/) for atomic USDC payments on Base.

**Requirements:**
- Wallet with private key access (EOA)
- USDC balance on Base (chain ID 8453)
- Wallet must support `signTypedData` (EIP-712)

**Not Compatible With:**
- Smart contract wallets (Gnosis Safe, Argent, etc.)
- MPC wallets without EIP-712 support
- Custodial wallets without private key access

**How It Works:**
1. Send POST request normally (no payment header)
2. Receive 402 response with `PAYMENT-REQUIRED` header
3. Client signs EIP-3009 `TransferWithAuthorization` (EIP-712 typed data)
4. Retry request with `PAYMENT-SIGNATURE` header containing base64-encoded payload
5. Server verifies signature, creates campaign, settles payment atomically

**Using @x402/fetch (Automatic):**

```typescript
import { wrapFetchWithPayment } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
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
      "Authorization": "Bearer pck_live_YOUR_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ /* campaign data */ })
  }
);
```

`@x402/fetch` automatically handles the 402 response, signs the payment, and retries.

### 2. Direct USDC Transfer

For wallets without private key access (smart contracts, MPC, custodial).

**Requirements:**
- Ability to send USDC on Base
- Transaction confirmation time < 1 hour
- Exact credit bundle amount

**Flow:**
1. Check credit balance using GET /credits/balance endpoint
2. If insufficient, send USDC on Base to: `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
   - Token: USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
   - Network: Base (chain ID 8453)
   - Amount: Exact credit bundle price (e.g., $25 for small bundle = 550 credits)
3. Wait for transaction confirmation
4. Top up credits using POST /credits/topup with `payment_tx_hash`
5. Create campaign (credits will be deducted automatically)

**Example:**

```typescript
// Step 1: Check credit balance
const balanceResponse = await fetch(
  "https://app.productclank.com/api/v1/credits/balance",
  {
    headers: {
      "Authorization": "Bearer pck_live_YOUR_KEY"
    }
  }
);
const { credits } = await balanceResponse.json();

// Step 2: If insufficient, send USDC via your wallet (Bankr, Safe, etc.)
// For small bundle: $25 USDC = 550 credits
const txHash = "0xabc123...";

// Step 3: Top up credits with tx hash
const topupResponse = await fetch(
  "https://app.productclank.com/api/v1/credits/topup",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer pck_live_YOUR_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      bundle: "small", // or nano, micro, medium, large, enterprise
      payment_tx_hash: txHash
    })
  }
);

// Step 4: Create campaign (credits deducted automatically)
const response = await fetch(
  "https://app.productclank.com/api/v1/agents/campaigns",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer pck_live_YOUR_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      product_id: "...",
      title: "...",
      keywords: ["..."],
      search_context: "...",
      estimated_posts: 50
    })
  }
);
```

**Validation:**
- Transaction must be confirmed on Base
- Must be a USDC transfer to payment address
- Amount must match exact credit bundle price
- Transaction must be recent (< 1 hour)
- Each tx hash can only be used once (prevents replay)

### 3. Trusted Agent Bypass

Whitelisted agents skip payment entirely.

**Eligibility:**
- First-party ProductClank agents
- Testing/development agents
- Partnership agreements

**Contact ProductClank to request trusted status.**

---

## Credit System & Pricing

### Credit Bundles

| Bundle | Credits | Price (USDC) | Base Units (6 decimals) | Best For |
|--------|---------|--------------|-------------------------|----------|
| `nano` | 50 | $2 | 2000000 | Testing and small experiments |
| `micro` | 200 | $10 | 10000000 | Single campaign trial |
| `small` | 550 | $25 | 25000000 | 1-2 medium campaigns |
| `medium` | 1,200 | $50 | 50000000 | Multiple campaigns |
| `large` | 2,600 | $100 | 100000000 | Heavy usage |
| `enterprise` | 14,000 | $500 | 500000000 | Agency/high volume |

### Operation Costs

| Operation | Credits | Description |
|-----------|---------|-------------|
| Post Discovery + Reply | 12 | AI finds post and generates contextual reply |
| Reply Only | 8 | Generate reply for your provided post |
| Regenerate Reply | 5 | Generate alternative reply for existing post |
| Tweet Boost | 80 | Amplify your own tweet via community replies |

### Example Campaign Costs

- **Small campaign** (30-40 posts): ~360-480 credits → `small` bundle ($25)
- **Medium campaign** (80-100 posts): ~960-1,200 credits → `medium` bundle ($50)
- **Large campaign** (200+ posts): ~2,400+ credits → `large` bundle ($100)

All payments are in USDC on Base network (chain ID 8453).

**Payment Address:** `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
**USDC Contract:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

---

## Credit Management Endpoints

### GET /api/v1/credits/balance

Check your current credit balance.

#### Request Headers
```http
Authorization: Bearer pck_live_YOUR_API_KEY
```

#### Response
```json
{
  "success": true,
  "credits": 550,
  "last_topup": "2026-02-20T15:30:00Z",
  "total_spent": 1450
}
```

### POST /api/v1/credits/topup

Top up credits with a credit bundle purchase.

#### Request Headers
```http
Authorization: Bearer pck_live_YOUR_API_KEY
Content-Type: application/json
```

#### Request Body
```json
{
  "bundle": "small",
  "payment_tx_hash": "0x..." // Optional for x402
}
```

#### Response
```json
{
  "success": true,
  "credits_added": 550,
  "new_balance": 1100,
  "bundle": "small",
  "amount_usdc": 25,
  "tx_hash": "0x..."
}
```

### GET /api/v1/credits/history

View your credit transaction history.

#### Request Headers
```http
Authorization: Bearer pck_live_YOUR_API_KEY
```

#### Query Parameters
- `limit` (optional): Number of transactions to return (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)

#### Response
```json
{
  "success": true,
  "transactions": [
    {
      "id": "tx-123",
      "type": "topup",
      "credits": 550,
      "amount_usdc": 25,
      "bundle": "small",
      "timestamp": "2026-02-20T15:30:00Z",
      "tx_hash": "0x..."
    },
    {
      "id": "tx-124",
      "type": "campaign_creation",
      "credits": -600,
      "campaign_id": "campaign-uuid",
      "campaign_number": "CP-042",
      "timestamp": "2026-02-20T16:00:00Z"
    }
  ],
  "total": 127,
  "limit": 50,
  "offset": 0
}
```

---

## Rate Limits

**Default:** 10 campaigns per day per agent
**Custom Limits:** Contact ProductClank for higher limits

Rate limit resets at 00:00 UTC daily.

**When Rate Limited:**
- Wait until next day (00:00 UTC)
- Contact ProductClank to increase limit
- Use multiple API keys if approved

---

## Agent Registration

To use the Agent API, you must register your agent with ProductClank.

**Registration Process:**
1. Contact ProductClank team via:
   - Email: [Contact form on website]
   - Twitter: [@productclank](https://twitter.com/productclank)
   - Warpcast: [warpcast.com/productclank](https://warpcast.com/productclank)

2. Provide agent details:
   - Agent name
   - Agent description
   - Intended use case
   - Wallet address (for payments)
   - Estimated daily volume

3. Receive API key and agent configuration:
   - API key (`pck_live_*`)
   - Rate limit (default: 10/day)
   - Trusted status (if applicable)

---

## Campaign Lifecycle

After successful creation, campaigns go through these stages:

1. **Active** — Campaign is live, AI discovering conversations
2. **Discovering** — AI actively scraping Twitter for opportunities
3. **Generating** — AI creating contextual replies for discovered posts
4. **Live** — Reply opportunities available to community members
5. **Engaging** — Community claiming and executing replies
6. **Completed** — Campaign reached goal or time limit

**Typical Timeline:**
- Discovery: 1-24 hours (depends on keyword volume)
- Reply Generation: 2-6 hours
- Community Engagement: Ongoing (30 days default)

---

## Best Practices

### Keywords
- **Be specific**: `["AI productivity tools", "workflow automation"]` > `["AI", "tools"]`
- **Use 3-7 keywords**: Sweet spot for quality discovery
- **Include long-tail**: `["how to automate workflows"]` captures high-intent searches

### Search Context
- **Describe ideal conversations**: "People discussing challenges with X and looking for Y"
- **Include pain points**: "Users frustrated with slow customer support tools"
- **Mention goals**: "Looking to improve team collaboration and reduce meetings"

### Filters
- **min_follower_count**: 500-1000 for quality, 100-500 for volume
- **max_post_age_days**: 3-7 for timely engagement, 14+ for evergreen topics
- **require_verified**: Use for high-profile campaigns targeting influencers

### Reply Guidelines
- **Provide brand voice examples**: "Reply like Paul Graham — thoughtful, direct, helpful"
- **List key value props**: "Mention our 24/7 support, 99.9% uptime, and SOC2 compliance"
- **Set boundaries**: "Don't make pricing promises or commit to features not yet shipped"

### Credit Management
- **Check balance first**: Always verify you have sufficient credits before creating campaigns
- **Estimate costs**: Use `estimated_posts` field to get cost breakdown before committing
- **Buy in bulk**: Larger bundles offer better value per credit
- **Monitor usage**: Review /credits/history regularly to track spending patterns

### Bundle Selection
- **nano ($2/50cr)**: Testing, proof-of-concept, 4 posts
- **micro ($10/200cr)**: Single small campaign, ~16 posts
- **small ($25/550cr)**: 1-2 medium campaigns, ~45 posts
- **medium ($50/1200cr)**: Multiple campaigns, ~100 posts
- **large ($100/2600cr)**: Heavy monthly usage, ~216 posts
- **enterprise ($500/14000cr)**: Agency/high-volume operations, ~1,166 posts

---

## Error Handling

### Payment Errors

**"Insufficient credits"**
- Check your balance: GET /credits/balance
- Top up credits: POST /credits/topup
- Use recommended bundle from error response
- Ensure payment tx is confirmed on Base

**"Payment verification failed"**
- Check USDC balance
- Verify wallet has sufficient funds + gas
- For direct transfer: ensure tx hash is confirmed
- For x402: ensure wallet supports `signTypedData`

**"This transaction has already been used"**
- Each tx hash can only be used once for top-ups
- Send a new USDC transfer for each bundle purchase

### Product Errors

**"Product not found"**
- Verify `product_id` exists on ProductClank
- Visit [app.productclank.com/products](https://app.productclank.com/products) to browse
- Contact ProductClank if your product needs to be added

### Rate Limit Errors

**"Daily campaign creation limit exceeded"**
- Wait until 00:00 UTC for reset
- Contact ProductClank for higher limits
- Consider using multiple campaigns across days

---

## Support & Resources

- **Live API Docs**: [app.productclank.com/api/v1/docs](https://app.productclank.com/api/v1/docs)
- **Campaign Dashboard**: [app.productclank.com/communiply/campaigns/](https://app.productclank.com/communiply/campaigns/)
- **Website**: [productclank.com](https://www.productclank.com)
- **Twitter**: [@productclank](https://twitter.com/productclank)
- **Warpcast**: [warpcast.com/productclank](https://warpcast.com/productclank)

For API support, agent registration, or technical issues, contact ProductClank via the channels above.
