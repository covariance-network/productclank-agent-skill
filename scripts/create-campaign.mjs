#!/usr/bin/env node

/**
 * ProductClank Campaign Creation Script
 *
 * A helper script for creating Communiply campaigns via the ProductClank Agent API.
 * Supports both x402 protocol payment and direct USDC transfers.
 *
 * Usage:
 *   node create-campaign.mjs
 *
 * Environment Variables Required:
 *   PRODUCTCLANK_API_KEY - Your API key (pck_live_*)
 *   AGENT_PRIVATE_KEY - Your wallet private key (for x402 payment)
 *
 * OR for direct transfer:
 *   PRODUCTCLANK_API_KEY - Your API key
 *   PAYMENT_TX_HASH - Transaction hash of USDC transfer
 */

import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { wrapFetchWithPayment } from "@x402/fetch";

// Configuration
const API_BASE_URL = "https://app.productclank.com/api/v1";
const API_KEY = process.env.PRODUCTCLANK_API_KEY;
const PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY;
const PAYMENT_TX_HASH = process.env.PAYMENT_TX_HASH;

// Validation
if (!API_KEY) {
  console.error("❌ Error: PRODUCTCLANK_API_KEY environment variable is required");
  console.error("Set it with: export PRODUCTCLANK_API_KEY=pck_live_YOUR_KEY");
  process.exit(1);
}

if (!PRIVATE_KEY && !PAYMENT_TX_HASH) {
  console.error("❌ Error: Either AGENT_PRIVATE_KEY or PAYMENT_TX_HASH is required");
  console.error("For x402 payment: export AGENT_PRIVATE_KEY=0xYOUR_PRIVATE_KEY");
  console.error("For direct transfer: export PAYMENT_TX_HASH=0xYOUR_TX_HASH");
  process.exit(1);
}

// Example campaign data - modify this for your use case
const campaignData = {
  product_id: "YOUR_PRODUCT_UUID", // ⚠️ Replace with your product ID
  title: "Example Campaign",
  keywords: [
    "AI tools",
    "productivity apps",
    "automation software"
  ],
  search_context: "People discussing AI productivity tools and automation challenges",
  estimated_posts: 4, // 4 posts × 12 credits = 48 credits (fits in nano bundle)
  mention_accounts: ["@productclank"],
  reply_style_tags: ["friendly", "helpful"],
  reply_length: "short",
  min_follower_count: 100,
  max_post_age_days: 7,
};

// Validate campaign data
function validateCampaignData(data) {
  const errors = [];

  if (!data.product_id || data.product_id === "YOUR_PRODUCT_UUID") {
    errors.push("product_id must be set to a valid UUID");
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

// Check credit balance
async function checkCreditBalance() {
  const response = await fetch(`${API_BASE_URL}/credits/balance`, {
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
    },
  });
  return response.json();
}

// Top up credits using x402 protocol
async function topUpCreditsWithX402(bundle) {
  console.log(`💳 Topping up credits with ${bundle} bundle using x402 protocol...`);

  const account = privateKeyToAccount(PRIVATE_KEY);
  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });

  const x402Fetch = wrapFetchWithPayment(fetch, walletClient);

  const response = await x402Fetch(`${API_BASE_URL}/credits/topup`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bundle }),
  });

  return response.json();
}

// Create campaign (credits deducted automatically)
async function createCampaign(data) {
  console.log("🔨 Creating campaign...");

  const response = await fetch(`${API_BASE_URL}/agents/campaigns`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

// Top up credits using direct USDC transfer
async function topUpCreditsWithDirectTransfer(bundle) {
  console.log("💸 Using direct USDC transfer for credit top-up...");
  console.log(`📜 Transaction hash: ${PAYMENT_TX_HASH}`);

  const response = await fetch(`${API_BASE_URL}/credits/topup`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bundle,
      payment_tx_hash: PAYMENT_TX_HASH,
    }),
  });

  return response.json();
}

// Recommend bundle based on estimated posts
function recommendBundle(estimatedPosts) {
  const creditsNeeded = estimatedPosts * 12; // 12 credits per post

  if (creditsNeeded <= 50) return "nano";
  if (creditsNeeded <= 200) return "micro";
  if (creditsNeeded <= 550) return "small";
  if (creditsNeeded <= 1200) return "medium";
  if (creditsNeeded <= 2600) return "large";
  return "enterprise";
}

// Get bundle details
function getBundleDetails(bundle) {
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

// Main execution
async function main() {
  console.log("🚀 ProductClank Campaign Creation Script\n");

  // Validate campaign data
  console.log("✅ Validating campaign data...");
  const errors = validateCampaignData(campaignData);
  if (errors.length > 0) {
    console.error("❌ Validation errors:");
    errors.forEach(err => console.error(`   - ${err}`));
    console.error("\n💡 Edit the campaignData object in this script to fix these errors.");
    process.exit(1);
  }

  // Display campaign details
  const estimatedPosts = campaignData.estimated_posts || 50;
  const estimatedCredits = estimatedPosts * 12;
  const recommendedBundle = recommendBundle(estimatedPosts);
  const bundleDetails = getBundleDetails(recommendedBundle);

  console.log("📋 Campaign Details:");
  console.log(`   - Title: ${campaignData.title}`);
  console.log(`   - Keywords: ${campaignData.keywords.join(", ")}`);
  console.log(`   - Estimated Posts: ${estimatedPosts}`);
  console.log(`   - Estimated Credits: ~${estimatedCredits}`);
  console.log(`   - Recommended Bundle: ${recommendedBundle} ($${bundleDetails.price} = ${bundleDetails.credits} credits)`);
  console.log("");

  // Check credit balance
  console.log("💳 Checking credit balance...");
  try {
    const balanceData = await checkCreditBalance();
    console.log(`   Current balance: ${balanceData.credits} credits`);

    // Top up if needed
    if (balanceData.credits < estimatedCredits) {
      console.log(`\n⚠️  Insufficient credits (need ${estimatedCredits}, have ${balanceData.credits})`);
      console.log(`   Topping up with ${recommendedBundle} bundle...`);

      let topupResult;
      if (PAYMENT_TX_HASH) {
        topupResult = await topUpCreditsWithDirectTransfer(recommendedBundle);
      } else {
        topupResult = await topUpCreditsWithX402(recommendedBundle);
      }

      if (topupResult.success) {
        console.log(`\n✅ Credits Topped Up!`);
        console.log(`   Added: ${topupResult.credits_added} credits`);
        console.log(`   New balance: ${topupResult.new_balance} credits`);
        console.log(`   Amount paid: $${topupResult.amount_usdc} USDC`);
        console.log("");
      } else {
        console.error(`\n❌ Top-up Failed: ${topupResult.error}`);
        console.error(`   Message: ${topupResult.message}`);
        process.exit(1);
      }
    } else {
      console.log(`   ✅ Sufficient credits available\n`);
    }

    // Create campaign
    const result = await createCampaign(campaignData);

    // Handle response
    if (result.success) {
      console.log("\n✅ Campaign Created Successfully!\n");
      console.log("📋 Campaign Details:");
      console.log(`   - ID: ${result.campaign.campaign_number}`);
      console.log(`   - Title: ${result.campaign.title}`);
      console.log(`   - Status: ${result.campaign.status}`);
      console.log(`   - Estimated Cost: ~${estimatedCredits} credits`);
      console.log("");
      console.log("🔗 View Campaign:");
      console.log(`   https://app.productclank.com/communiply/campaigns/${result.campaign.id}`);
      console.log("");
      console.log("🎯 Next Steps:");
      console.log("   1. AI is discovering relevant conversations");
      console.log("   2. Generating contextual replies for opportunities (12 credits/post)");
      console.log("   3. Community can claim and execute replies");
      console.log("   4. Track engagement in real-time via dashboard");
      console.log("");
    } else {
      console.error(`\n❌ Campaign Creation Failed\n`);
      console.error(`Error: ${result.error}`);
      console.error(`Message: ${result.message}`);

      if (result.error === "insufficient_credits" && result.topup_options) {
        console.error("\n💡 Insufficient Credits:");
        console.error(`   Required: ${result.required_credits} credits`);
        console.error(`   Available: ${result.available_credits} credits`);
        console.error("\n   Top-up Options:");
        result.topup_options.forEach(option => {
          const marker = option.recommended ? " (recommended)" : "";
          console.error(`   - ${option.bundle}: ${option.credits} credits for $${option.price}${marker}`);
        });
      } else if (result.error === "rate_limit_exceeded") {
        console.error("\n💡 Rate limit exceeded. Try again tomorrow or contact ProductClank for higher limits.");
      } else if (result.error === "unauthorized") {
        console.error("\n💡 Invalid API key. Verify PRODUCTCLANK_API_KEY is correct.");
      } else if (result.error === "not_found") {
        console.error("\n💡 Product not found. Verify product_id exists on ProductClank.");
        console.error("   Visit: https://app.productclank.com/products");
      }

      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\nStack trace:");
    console.error(error.stack);
    process.exit(1);
  }
}

// Run script
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
