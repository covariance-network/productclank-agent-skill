# ProductClank Agent API - Code Examples

Practical code examples for common use cases when creating Communiply campaigns via the ProductClank Agent API.

---

## Table of Contents

1. [Basic Campaign Creation (x402)](#basic-campaign-creation-x402)
2. [Campaign with Direct USDC Transfer](#campaign-with-direct-usdc-transfer)
3. [Advanced Campaign with Custom Guidelines](#advanced-campaign-with-custom-guidelines)
4. [Competitor Intercept Campaign](#competitor-intercept-campaign)
5. [Product Launch Campaign](#product-launch-campaign)
6. [Error Handling & Retry Logic](#error-handling--retry-logic)
7. [Testing with Test Package](#testing-with-test-package)
8. [TypeScript Types](#typescript-types)

---

## Basic Campaign Creation (Credit-Based)

The simplest way to create a campaign using the credit-based system.

```typescript
import { wrapFetchWithPayment } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

async function createBasicCampaign() {
  // Setup wallet for x402 payment (if needed for top-up)
  const account = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY);
  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });

  const x402Fetch = wrapFetchWithPayment(fetch, walletClient);

  try {
    // Step 1: Check credit balance
    const balanceResponse = await fetch(
      "https://app.productclank.com/api/v1/credits/balance",
      {
        headers: {
          "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
        },
      }
    );
    const { credits } = await balanceResponse.json();
    console.log(`💳 Current balance: ${credits} credits`);

    // Step 2: Top up if needed (estimated 50 posts × 12 credits = 600 credits)
    if (credits < 600) {
      console.log(`⚠️  Insufficient credits. Topping up with 'small' bundle...`);
      const topupResponse = await x402Fetch(
        "https://app.productclank.com/api/v1/credits/topup",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bundle: "small", // $25 for 550 credits
          }),
        }
      );
      const topupResult = await topupResponse.json();
      console.log(`✅ Topped up: +${topupResult.credits_added} credits`);
    }

    // Step 3: Create campaign (credits deducted automatically)
    const response = await fetch(
      "https://app.productclank.com/api/v1/agents/campaigns",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: "your-product-uuid",
          title: "Launch Week Campaign",
          keywords: ["productivity tools", "task management", "team collaboration"],
          search_context: "People discussing productivity tools and team collaboration challenges",
          estimated_posts: 50, // Optional: for cost estimation
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Campaign created: ${result.campaign.campaign_number}`);
      console.log(`📊 Dashboard: https://app.productclank.com/communiply/campaigns/${result.campaign.id}`);
      console.log(`💰 Credits used: ~${50 * 12} (estimated)`);
      return result.campaign;
    } else {
      console.error(`❌ Error: ${result.error} - ${result.message}`);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Failed to create campaign:", error);
    throw error;
  }
}

// Usage
createBasicCampaign()
  .then(campaign => console.log("Campaign:", campaign))
  .catch(err => console.error("Error:", err));
```

**Dependencies:**
```bash
npm install @x402/fetch viem
```

**Environment Variables:**
```bash
AGENT_PRIVATE_KEY=0x...
PRODUCTCLANK_API_KEY=pck_live_...
```

---

## Credit Top-Up with Direct USDC Transfer

For wallets without private key access (smart contracts, MPC wallets, Bankr, etc.).

```typescript
import { ethers } from "ethers";

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const PAYMENT_ADDRESS = "0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68";
const USDC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)"
];

async function topUpCreditsWithDirectTransfer() {
  // Step 1: Check current balance
  const balanceResponse = await fetch(
    "https://app.productclank.com/api/v1/credits/balance",
    {
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
      },
    }
  );
  const { credits } = await balanceResponse.json();
  console.log(`💳 Current balance: ${credits} credits`);

  // Step 2: Send USDC transfer for credit bundle
  const provider = new ethers.providers.JsonRpcProvider(
    "https://base.llamarpc.com" // Base RPC
  );
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  const usdc = new ethers.Contract(USDC_ADDRESS, USDC_ABI, wallet);

  const bundlePrice = 25; // Small bundle: $25 = 550 credits
  const amount = ethers.utils.parseUnits(bundlePrice.toString(), 6); // USDC has 6 decimals

  console.log(`💸 Sending ${bundlePrice} USDC to payment address for credit top-up...`);
  const tx = await usdc.transfer(PAYMENT_ADDRESS, amount);
  console.log(`⏳ Waiting for confirmation... Tx: ${tx.hash}`);

  await tx.wait();
  console.log(`✅ Transfer confirmed: ${tx.hash}`);

  // Step 3: Top up credits with tx hash
  const topupResponse = await fetch(
    "https://app.productclank.com/api/v1/credits/topup",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bundle: "small", // $25 for 550 credits
        payment_tx_hash: tx.hash,
      }),
    }
  );

  const topupResult = await topupResponse.json();

  if (topupResult.success) {
    console.log(`✅ Credits topped up!`);
    console.log(`   Added: ${topupResult.credits_added} credits`);
    console.log(`   New balance: ${topupResult.new_balance} credits`);
    return topupResult;
  } else {
    console.error(`❌ Error: ${topupResult.error}`);
    throw new Error(topupResult.message);
  }

  // Step 4: Now create campaign
  const campaignResponse = await fetch(
    "https://app.productclank.com/api/v1/agents/campaigns",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: "your-product-uuid",
        title: "DeFi App Launch",
        keywords: ["DeFi", "yield farming", "crypto staking"],
        search_context: "People discussing DeFi platforms and yield opportunities",
        estimated_posts: 40,
      }),
    }
  );

  const result = await campaignResponse.json();

  if (result.success) {
    console.log(`✅ Campaign created: ${result.campaign.campaign_number}`);
    return result.campaign;
  } else {
    console.error(`❌ Error: ${result.error}`);
    throw new Error(result.message);
  }
}
```

---

## Advanced Campaign with Custom Guidelines

Highly customized campaign with specific filters and reply instructions.

```typescript
async function createAdvancedCampaign() {
  const x402Fetch = setupX402Fetch(); // See basic example

  const response = await x402Fetch(
    "https://app.productclank.com/api/v1/agents/campaigns",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: "your-product-uuid",
        title: "Enterprise Security Product Launch",

        // Discovery settings
        keywords: [
          "enterprise security",
          "SOC2 compliance",
          "data protection",
          "GDPR compliance",
          "security audit"
        ],
        search_context: "CISOs and security teams discussing compliance challenges, data protection requirements, and security audit preparation",

        // Reply customization
        mention_accounts: ["@yourproduct", "@cto_handle"],
        reply_style_tags: ["professional", "technical", "authoritative"],
        reply_style_account: "@briankrebs", // Security expert style
        reply_length: "medium",

        // Custom AI instructions
        reply_guidelines: `
You are a security engineer who has used our product for 2+ years.

**Focus on:**
- Our SOC2 Type II certification
- Automated compliance workflows (saves 20+ hours/month)
- Real-time security monitoring
- Excellent documentation and support

**Avoid:**
- Overselling or making promises
- Directly comparing to competitors
- Discussing pricing (direct them to sales)
- Mentioning unreleased features

**Mention @yourproduct naturally when relevant.**
**Include our website (https://yourproduct.com) only if it adds value.**

Tone: Professional, helpful, technically accurate. Never salesy.
        `.trim(),

        // Quality filters
        min_follower_count: 2000, // Target established accounts
        min_engagement_count: 10, // High-engagement posts only
        max_post_age_days: 3, // Recent conversations
        require_verified: false, // Most security pros aren't verified

        // Cost estimation
        estimated_posts: 80, // ~960 credits needed
      }),
    }
  );

  const result = await response.json();

  if (result.success) {
    console.log(`
✅ Advanced Campaign Created

📋 Details:
   - Title: ${result.campaign.title}
   - Campaign #: ${result.campaign.campaign_number}
   - Estimated cost: ~960 credits (80 posts × 12)

🎯 Targeting:
   - 5 keywords (enterprise security space)
   - Accounts with 2000+ followers
   - Posts with 10+ engagement
   - Last 3 days only

📊 View Dashboard:
   https://app.productclank.com/communiply/campaigns/${result.campaign.id}
    `);

    return result.campaign;
  } else {
    throw new Error(result.message);
  }
}
```

---

## Competitor Intercept Campaign

Target conversations mentioning competitors.

```typescript
async function createCompetitorInterceptCampaign() {
  const x402Fetch = setupX402Fetch();

  const response = await x402Fetch(
    "https://app.productclank.com/api/v1/agents/campaigns",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: "your-product-uuid",
        title: "Competitor Intercept - Alternatives Campaign",

        keywords: [
          "Competitor1 alternative",
          "switching from Competitor2",
          "better than Competitor3",
          "Competitor4 pricing too high",
          "looking for Competitor5 replacement"
        ],

        search_context: "People actively looking for alternatives to our competitors, frustrated with pricing, features, or support",

        mention_accounts: ["@yourproduct"],
        reply_style_tags: ["helpful", "empathetic", "solution-oriented"],
        reply_length: "short",

        reply_guidelines: `
Reply as a user who recently switched from [competitor] to our product.

**Share your experience:**
- What frustrated you about [competitor]
- What made you switch to us
- Specific features/benefits you love now

**Be authentic:**
- Don't bash competitors
- Share genuine experience
- Offer to help if they have questions

**Example tone:**
"I was in the same boat last month. Switched to @yourproduct and haven't looked back. Their [feature] alone saved me hours/week. Happy to share my migration process if helpful!"

Keep it conversational, not salesy.
        `.trim(),

        min_follower_count: 500,
        max_post_age_days: 2, // Strike while the iron is hot
        estimated_posts: 60, // ~720 credits
      }),
    }
  );

  return response.json();
}
```

---

## Product Launch Campaign

Coordinated campaign for product launch week.

```typescript
async function createLaunchWeekCampaign() {
  const x402Fetch = setupX402Fetch();

  const response = await x402Fetch(
    "https://app.productclank.com/api/v1/agents/campaigns",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: "your-product-uuid",
        title: "Launch Week 2026 - Community Amplification",

        keywords: [
          "new AI tools",
          "product launch",
          "Show HN",
          "Product Hunt",
          "indie hacker tools",
          "startup tools 2026"
        ],

        search_context: "People discussing new product launches, sharing cool tools they found, and looking for recommendations in the AI/productivity space",

        mention_accounts: ["@yourproduct", "@founder"],
        reply_style_tags: ["excited", "friendly", "genuine"],
        reply_length: "mixed",

        reply_guidelines: `
You're an early beta user who's been using the product for 3 months.

**Launch week focus:**
- Share what you've built with it
- Mention it launched today/this week
- Highlight 1-2 unique features
- Offer to answer questions

**Example angles:**
- "Just saw @yourproduct launched today! Been using the beta for months..."
- "This reminds me of @yourproduct which just launched. They solve this exact problem by..."
- "Perfect timing - @yourproduct literally just released a feature for this yesterday..."

**Include launch link:** https://yourproduct.com/launch

Be genuinely enthusiastic but not pushy. Share real value.
        `.trim(),

        min_follower_count: 200, // Cast wider net for launch
        max_post_age_days: 1, // Today's conversations only
        estimated_posts: 200, // ~2400 credits - large campaign
      }),
    }
  );

  const result = await response.json();

  if (result.success) {
    console.log(`
🚀 LAUNCH WEEK CAMPAIGN LIVE!

Campaign: ${result.campaign.campaign_number}
Estimated cost: ~2400 credits (200 posts × 12)
Dashboard: https://app.productclank.com/communiply/campaigns/${result.campaign.id}

🎯 Targeting fresh conversations about:
   - New AI tools
   - Product launches
   - Show HN / Product Hunt
   - Startup tools

✅ Community is now discovering and amplifying your launch!
    `);

    return result.campaign;
  } else {
    throw new Error(result.message);
  }
}
```

---

## Error Handling & Retry Logic

Robust error handling with retries.

```typescript
async function createCampaignWithRetry(
  campaignData: CampaignRequest,
  maxRetries = 3
) {
  const x402Fetch = setupX402Fetch();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}...`);

      const response = await x402Fetch(
        "https://app.productclank.com/api/v1/agents/campaigns",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(campaignData),
        }
      );

      const result = await response.json();

      // Success
      if (result.success) {
        console.log(`✅ Success on attempt ${attempt}`);
        return result.campaign;
      }

      // Handle specific errors
      switch (result.error) {
        case "rate_limit_exceeded":
          console.error("❌ Rate limit exceeded. Try again tomorrow.");
          throw new Error("RATE_LIMIT"); // Don't retry

        case "insufficient_credits":
          console.error("❌ Insufficient credits. Top up required.");
          console.error(`   Required: ${result.required_credits} credits`);
          console.error(`   Available: ${result.available_credits} credits`);
          throw new Error("INSUFFICIENT_CREDITS"); // Don't retry

        case "unauthorized":
          console.error("❌ Invalid API key");
          throw new Error("UNAUTHORIZED"); // Don't retry

        case "not_found":
          console.error("❌ Product not found");
          throw new Error("NOT_FOUND"); // Don't retry

        case "validation_error":
          console.error(`❌ Validation error: ${result.message}`);
          throw new Error("VALIDATION_ERROR"); // Don't retry

        default:
          // Retry on network errors, 500s, etc.
          console.warn(`⚠️  Attempt ${attempt} failed: ${result.error}`);
          if (attempt === maxRetries) {
            throw new Error(result.message);
          }

          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Don't retry on known errors
      if (
        error.message === "RATE_LIMIT" ||
        error.message === "INSUFFICIENT_CREDITS" ||
        error.message === "UNAUTHORIZED" ||
        error.message === "NOT_FOUND" ||
        error.message === "VALIDATION_ERROR"
      ) {
        throw error;
      }

      console.warn(`⚠️  Network error, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Usage
try {
  const campaign = await createCampaignWithRetry({
    product_id: "...",
    title: "...",
    keywords: ["..."],
    search_context: "...",
    estimated_posts: 50,
  });
  console.log("Campaign created:", campaign);
} catch (error) {
  console.error("Failed after retries:", error);
}
```

---

## Testing with Nano Bundle

Use the nano bundle ($2/50 credits) for development and testing.

```typescript
async function createTestCampaign() {
  // Step 1: Top up with nano bundle if needed
  const balanceResponse = await fetch(
    "https://app.productclank.com/api/v1/credits/balance",
    {
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
      },
    }
  );
  const { credits } = await balanceResponse.json();

  if (credits < 50) {
    const x402Fetch = setupX402Fetch();
    await x402Fetch(
      "https://app.productclank.com/api/v1/credits/topup",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bundle: "nano", // $2 for 50 credits
        }),
      }
    );
    console.log("✅ Topped up with nano bundle (50 credits)");
  }

  // Step 2: Create small test campaign
  const response = await fetch(
    "https://app.productclank.com/api/v1/agents/campaigns",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: "your-product-uuid",
        title: "[TEST] Development Campaign",
        keywords: ["test keyword"],
        search_context: "Test search context for development",
        estimated_posts: 4, // 4 posts × 12 credits = 48 credits

        // Minimal settings for testing
        reply_length: "short",
        min_follower_count: 100,
      }),
    }
  );

  const result = await response.json();

  console.log("Test campaign created:", result);
  console.log("Credits used: ~48 (4 posts × 12)");
  return result;
}

// Check credit usage
async function checkCreditHistory() {
  const response = await fetch(
    "https://app.productclank.com/api/v1/credits/history?limit=10",
    {
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
      },
    }
  );
  const history = await response.json();
  console.log("Recent credit transactions:", history.transactions);
}
```

---

## TypeScript Types

Type definitions for type-safe development.

```typescript
// Campaign Request Types
interface CampaignRequest {
  product_id: string; // UUID
  title: string;
  keywords: string[]; // Non-empty
  search_context: string;
  estimated_posts?: number; // Optional: for cost estimation
  mention_accounts?: string[];
  reply_style_tags?: string[];
  reply_style_account?: string;
  reply_length?: "very-short" | "short" | "medium" | "long" | "mixed";
  reply_guidelines?: string;
  min_follower_count?: number;
  min_engagement_count?: number;
  max_post_age_days?: number;
  require_verified?: boolean;
  payment_tx_hash?: string; // For direct transfer (credit top-up)
}

// Credit Bundle Types
type CreditBundle = "nano" | "micro" | "small" | "medium" | "large" | "enterprise";

interface CreditTopupRequest {
  bundle: CreditBundle;
  payment_tx_hash?: string; // Optional for x402
}

interface CreditBalance {
  success: true;
  credits: number;
  last_topup: string; // ISO timestamp
  total_spent: number;
}

interface CreditTopupResponse {
  success: true;
  credits_added: number;
  new_balance: number;
  bundle: CreditBundle;
  amount_usdc: number;
  tx_hash?: string;
}

// Success Response
interface CampaignSuccessResponse {
  success: true;
  campaign: {
    id: string;
    campaign_number: string; // e.g. "CP-042"
    title: string;
    status: "active";
    created_via: "api";
    creator_agent_id: string;
    is_funded: boolean;
  };
  payment: {
    method: "x402" | "direct_transfer" | "trusted";
    amount_usdc: number;
    network: "base";
    payer: string | null;
    tx_hash?: string; // Only for direct_transfer
  };
}

// Error Response
interface CampaignErrorResponse {
  success: false;
  error:
    | "insufficient_credits"
    | "validation_error"
    | "unauthorized"
    | "not_found"
    | "rate_limit_exceeded"
    | "payment_invalid"
    | "creation_failed"
    | "internal_error";
  message: string;
  required_credits?: number;
  available_credits?: number;
  estimated_cost_breakdown?: {
    post_discovery_and_reply: {
      credits_per_post: number;
      estimated_posts: number;
      total_credits: number;
    };
  };
  topup_options?: Array<{
    bundle: CreditBundle;
    credits: number;
    price_usdc: number;
    recommended?: boolean;
  }>;
  payment_methods?: {
    x402: {
      description: string;
      config: X402Config;
    };
    direct_transfer: {
      description: string;
      pay_to: string;
      amount_usdc: number;
      network: string;
      asset: string;
    };
  };
}

type CampaignResponse = CampaignSuccessResponse | CampaignErrorResponse;

// Helper function with types
async function createCampaign(
  data: CampaignRequest
): Promise<CampaignSuccessResponse["campaign"]> {
  const x402Fetch = setupX402Fetch();

  const response = await x402Fetch(
    "https://app.productclank.com/api/v1/agents/campaigns",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result: CampaignResponse = await response.json();

  if (!result.success) {
    throw new Error(`Campaign creation failed: ${result.message}`);
  }

  return result.campaign;
}
```

---

## Helper Utilities

Useful helper functions.

```typescript
// Validate campaign data before sending
function validateCampaignData(data: Partial<CampaignRequest>): string[] {
  const errors: string[] = [];

  if (!data.product_id?.trim()) {
    errors.push("product_id is required");
  }

  if (!data.title?.trim()) {
    errors.push("title is required");
  }

  if (!data.keywords || data.keywords.length === 0) {
    errors.push("keywords must be a non-empty array");
  }

  if (!data.search_context?.trim()) {
    errors.push("search_context is required");
  }

  return errors;
}

// Usage
const errors = validateCampaignData(campaignData);
if (errors.length > 0) {
  console.error("Validation errors:", errors);
  throw new Error(errors.join(", "));
}

// Calculate bundle details
function getBundleDetails(bundle: CreditBundle): { credits: number; price: number } {
  const bundles = {
    nano: { credits: 50, price: 2 },
    micro: { credits: 200, price: 10 },
    small: { credits: 550, price: 25 },
    medium: { credits: 1200, price: 50 },
    large: { credits: 2600, price: 100 },
    enterprise: { credits: 14000, price: 500 },
  };
  return bundles[bundle];
}

// Estimate campaign cost
function estimateCampaignCost(estimatedPosts: number): number {
  const CREDITS_PER_POST = 12; // Discovery + Reply
  return estimatedPosts * CREDITS_PER_POST;
}

// Recommend bundle based on estimated posts
function recommendBundle(estimatedPosts: number): CreditBundle {
  const creditsNeeded = estimateCampaignCost(estimatedPosts);

  if (creditsNeeded <= 50) return "nano";
  if (creditsNeeded <= 200) return "micro";
  if (creditsNeeded <= 550) return "small";
  if (creditsNeeded <= 1200) return "medium";
  if (creditsNeeded <= 2600) return "large";
  return "enterprise";
}

// Format campaign URL
function getCampaignDashboardUrl(campaignId: string): string {
  return `https://app.productclank.com/communiply/campaigns/${campaignId}`;
}
```

---

## Complete End-to-End Example

Full workflow from user input to campaign creation.

```typescript
import { wrapFetchWithPayment } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

async function main() {
  // 1. Setup x402 payment
  const account = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY!);
  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });
  const x402Fetch = wrapFetchWithPayment(fetch, walletClient);

  // 2. Gather campaign requirements (from user input, LLM, etc.)
  const campaignData: CampaignRequest = {
    product_id: "abc-123-def-456",
    title: "AI Agents Launch Week",
    keywords: [
      "AI agents",
      "autonomous agents",
      "agent frameworks",
      "AI automation"
    ],
    search_context: "Developers and founders discussing AI agents, autonomous systems, and agent frameworks",
    estimated_posts: 80, // Estimate for cost calculation
    mention_accounts: ["@myaiagent", "@founder"],
    reply_style_tags: ["technical", "enthusiastic", "helpful"],
    reply_length: "short",
    min_follower_count: 500,
    max_post_age_days: 3,
  };

  // 3. Validate
  const errors = validateCampaignData(campaignData);
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }

  // 4. Check credit balance and top up if needed
  console.log("Checking credit balance...");
  const balanceResponse = await fetch(
    "https://app.productclank.com/api/v1/credits/balance",
    {
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
      },
    }
  );
  const { credits } = await balanceResponse.json();
  const estimatedCost = estimateCampaignCost(campaignData.estimated_posts || 50);

  console.log(`Current balance: ${credits} credits`);
  console.log(`Estimated cost: ${estimatedCost} credits`);

  if (credits < estimatedCost) {
    const recommendedBundle = recommendBundle(campaignData.estimated_posts || 50);
    const bundleDetails = getBundleDetails(recommendedBundle);
    console.log(`Topping up with ${recommendedBundle} bundle (+${bundleDetails.credits} credits)...`);

    await x402Fetch(
      "https://app.productclank.com/api/v1/credits/topup",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bundle: recommendedBundle,
        }),
      }
    );
    console.log("✅ Credits topped up successfully");
  }

  // 5. Create campaign
  console.log("Creating campaign...");
  const response = await fetch(
    "https://app.productclank.com/api/v1/agents/campaigns",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PRODUCTCLANK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    }
  );

  const result: CampaignResponse = await response.json();

  // 6. Handle response
  if (!result.success) {
    throw new Error(`Failed: ${result.message}`);
  }

  // 7. Return results to user
  console.log(`
✅ Campaign Created Successfully!

📋 Campaign Details:
   - ID: ${result.campaign.campaign_number}
   - Title: ${result.campaign.title}
   - Status: ${result.campaign.status}
   - Estimated Cost: ~${estimatedCost} credits

🔗 View Campaign:
   ${getCampaignDashboardUrl(result.campaign.id)}

🎯 What Happens Next:
   1. AI discovers relevant conversations matching your keywords
   2. Generates contextual replies for each opportunity (12 credits/post)
   3. Community members browse and claim reply opportunities
   4. They post replies from their personal accounts
   5. You track engagement and ROI in real-time

Your campaign is now live and actively working! 🚀
  `);

  return result.campaign;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
```

---

For more examples and use cases, see:
- [SKILL.md](../SKILL.md) - Main skill documentation
- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API reference
- [scripts/create-campaign.mjs](../scripts/create-campaign.mjs) - Ready-to-use script
