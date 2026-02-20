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
  selected_package: "test", // $0.01 for testing
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

  if (!["test", "starter", "growth", "scale"].includes(data.selected_package)) {
    errors.push("selected_package must be one of: test, starter, growth, scale");
  }

  return errors;
}

// Create campaign using x402 protocol
async function createCampaignWithX402(data) {
  console.log("💳 Using x402 protocol payment...");

  const account = privateKeyToAccount(PRIVATE_KEY);
  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });

  const x402Fetch = wrapFetchWithPayment(fetch, walletClient);

  const response = await x402Fetch(`${API_BASE_URL}/agents/campaigns`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

// Create campaign using direct USDC transfer
async function createCampaignWithDirectTransfer(data) {
  console.log("💸 Using direct USDC transfer...");
  console.log(`📜 Transaction hash: ${PAYMENT_TX_HASH}`);

  const response = await fetch(`${API_BASE_URL}/agents/campaigns`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      payment_tx_hash: PAYMENT_TX_HASH,
    }),
  });

  return response.json();
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
  console.log("📋 Campaign Details:");
  console.log(`   - Title: ${campaignData.title}`);
  console.log(`   - Keywords: ${campaignData.keywords.join(", ")}`);
  console.log(`   - Package: ${campaignData.selected_package}`);
  console.log("");

  // Create campaign
  console.log("🔨 Creating campaign...");
  try {
    let result;

    if (PAYMENT_TX_HASH) {
      result = await createCampaignWithDirectTransfer(campaignData);
    } else {
      result = await createCampaignWithX402(campaignData);
    }

    // Handle response
    if (result.success) {
      console.log("\n✅ Campaign Created Successfully!\n");
      console.log("📋 Campaign Details:");
      console.log(`   - ID: ${result.campaign.campaign_number}`);
      console.log(`   - Title: ${result.campaign.title}`);
      console.log(`   - Status: ${result.campaign.status}`);
      console.log(`   - Funded: ${result.campaign.is_funded ? 'Yes' : 'No'}`);
      console.log("");
      console.log("💰 Payment:");
      console.log(`   - Method: ${result.payment.method}`);
      console.log(`   - Amount: $${result.payment.amount_usdc} USDC`);
      console.log(`   - Network: Base`);
      if (result.payment.payer) {
        console.log(`   - Payer: ${result.payment.payer}`);
      }
      if (result.payment.tx_hash) {
        console.log(`   - Tx Hash: ${result.payment.tx_hash}`);
      }
      console.log("");
      console.log("🔗 View Campaign:");
      console.log(`   https://app.productclank.com/communiply/campaigns/${result.campaign.id}`);
      console.log("");
      console.log("🎯 Next Steps:");
      console.log("   1. AI is discovering relevant conversations");
      console.log("   2. Generating contextual replies for opportunities");
      console.log("   3. Community can claim and execute replies");
      console.log("   4. Track engagement in real-time via dashboard");
      console.log("");
    } else {
      console.error(`\n❌ Campaign Creation Failed\n`);
      console.error(`Error: ${result.error}`);
      console.error(`Message: ${result.message}`);

      if (result.error === "payment_required" && result.payment_methods) {
        console.error("\n💡 Payment Required:");
        console.error(`   Amount: $${result.amount_usdc} USDC`);
        console.error(`   Package: ${result.package}`);
        console.error("\n   Payment Options:");
        console.error("   1. x402 Protocol:");
        console.error("      - Set AGENT_PRIVATE_KEY environment variable");
        console.error("      - Ensure wallet has USDC on Base");
        console.error("   2. Direct Transfer:");
        console.error(`      - Send ${result.amount_usdc} USDC to ${result.payment_methods.direct_transfer.pay_to}`);
        console.error(`      - Network: ${result.payment_methods.direct_transfer.network}`);
        console.error("      - Set PAYMENT_TX_HASH with your transaction hash");
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
