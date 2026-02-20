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
| `selected_package` | enum | Package tier | `"test" \| "starter" \| "growth" \| "scale"` |

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
  "selected_package": "growth",
  "mention_accounts": ["@mydefiapp", "@founder"],
  "reply_style_tags": ["professional", "technical", "helpful"],
  "reply_style_account": "@VitalikButerin",
  "reply_length": "short",
  "reply_guidelines": "Focus on security and transparency. Mention our audited smart contracts.",
  "min_follower_count": 1000,
  "min_engagement_count": 5,
  "max_post_age_days": 3,
  "require_verified": false
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
Payment needed to create campaign. This is normal on first request without payment.

```json
{
  "success": false,
  "error": "payment_required",
  "message": "Payment required to create campaign",
  "amount_usdc": 499,
  "package": "growth",
  "payment_methods": {
    "x402": {
      "description": "x402 protocol payment (recommended for wallets with private key access)",
      "config": {
        "scheme": "exact",
        "network": "eip155:8453",
        "payTo": "0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68",
        "amount": "499000000",
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
      "amount_usdc": 499,
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
  "message": "Invalid selected_package. Must be one of: test, starter, growth, scale"
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
- Exact package amount or higher

**Flow:**
1. Send USDC on Base to: `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
   - Token: USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
   - Network: Base (chain ID 8453)
   - Amount: Exact package price or higher
2. Wait for transaction confirmation
3. Send POST request with `payment_tx_hash` in request body

**Example:**

```typescript
// Step 1: Send USDC via your wallet (Bankr, Safe, etc.)
const txHash = "0xabc123...";

// Step 2: Create campaign with tx hash
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
      selected_package: "starter",
      payment_tx_hash: txHash // Include tx hash
    })
  }
);
```

**Validation:**
- Transaction must be confirmed on Base
- Must be a USDC transfer to payment address
- Amount >= package price
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

## Packages & Pricing

| Package | Price (USDC) | Base Units (6 decimals) | Description |
|---------|--------------|-------------------------|-------------|
| `test` | $0.01 | 10000 | For development and testing |
| `starter` | $99 | 99000000 | Small campaign |
| `growth` | $499 | 499000000 | Medium campaign |
| `scale` | $2,000 | 2000000000 | Large campaign |

All payments are in USDC on Base network (chain ID 8453).

**Payment Address:** `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
**USDC Contract:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

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

### Package Selection
- **test ($0.01)**: Development, testing, proof-of-concept
- **starter ($99)**: Product launches, single campaigns, testing strategy
- **growth ($499)**: Sustained campaigns, ongoing brand advocacy
- **scale ($2000)**: Enterprise campaigns, high-volume engagement

---

## Error Handling

### Payment Errors

**"Payment verification failed"**
- Check USDC balance
- Verify wallet has sufficient funds + gas
- For direct transfer: ensure tx hash is confirmed
- For x402: ensure wallet supports `signTypedData`

**"This transaction has already been used"**
- Each tx hash can only be used once
- Send a new USDC transfer for each campaign

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
