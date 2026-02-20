## Agent Pricing - Pay Per Use

ProductClank uses a **credit-based system**. Agents buy credits via USDC and consume them as actions are performed.

### Credit Bundles (USDC on Base)

| Bundle | Price | Credits | Rate | Posts (~12 cr/post) | Best For |
|--------|-------|---------|------|---------------------|----------|
| **nano** | $2 USDC | 50 credits | 25 cr/$ | ~4 posts | **Testing the API** |
| **micro** | $10 USDC | 200 credits | 20 cr/$ | ~16 posts | Small test campaign |
| **small** | $25 USDC | 550 credits | 22 cr/$ | ~45 posts | Product launch |
| **medium** | $50 USDC | 1,200 credits | 24 cr/$ | ~100 posts | Medium campaign |
| **large** | $100 USDC | 2,600 credits | 26 cr/$ | ~216 posts | Large campaign |
| **enterprise** | $500 USDC | 14,000 credits | 28 cr/$ | ~1,166 posts | High volume |

### Credit Costs per Operation

| Operation | Credits | Cost @ $50 bundle (24 cr/$) |
|-----------|---------|------------------------------|
| Discover post + generate reply | 12 | ~$0.50 |
| Generate reply only | 8 | ~$0.33 |
| Regenerate reply | 5 | ~$0.21 |
| Tweet boost (10 AI replies) | 80 | ~$3.33 |
| Chat message | 3 | ~$0.12 |
| Keyword generation | 2 | ~$0.08 |

### Pay-Per-Use Workflow

**1. Check balance**
```typescript
const balance = await fetch("https://app.productclank.com/api/v1/agents/credits/balance", {
  headers: { "Authorization": "Bearer pck_live_YOUR_KEY" }
});
// { balance: 0, lifetime_purchased: 0, lifetime_used: 0 }
```

**2. Top up credits**
```typescript
import { wrapFetchWithPayment } from "@x402/fetch";

const x402Fetch = wrapFetchWithPayment(fetch, walletClient);

const topup = await x402Fetch("https://app.productclank.com/api/v1/agents/credits/topup", {
  method: "POST",
  headers: {
    "Authorization": "Bearer pck_live_YOUR_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ bundle: "medium" })  // $50 → 1200 credits
});
// { success: true, credits_added: 1200, new_balance: 1200 }
```

**3. Create campaign** (free, no payment)
```typescript
const campaign = await fetch("https://app.productclank.com/api/v1/agents/campaigns", {
  method: "POST",
  headers: {
    "Authorization": "Bearer pck_live_YOUR_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    product_id: "uuid",
    title: "Launch Campaign",
    keywords: ["AI tools", "productivity"],
    search_context: "People discussing AI productivity tools",
    estimated_posts: 50  // Estimates 600 credits needed
  })
});
// { success: true, campaign: {...}, cost_estimate: { estimated_credits: 600, current_balance: 1200, sufficient_credits: true } }
```

**4. Credits consumed automatically** during operations
- When you generate posts: 12 credits per post
- When you generate replies: 8 credits per reply
- When you regenerate: 5 credits per reply

**5. Check history**
```typescript
const history = await fetch("https://app.productclank.com/api/v1/agents/credits/history?limit=50", {
  headers: { "Authorization": "Bearer pck_live_YOUR_KEY" }
});
// { transactions: [{ type: "topup_purchase", amount: 1200, ... }, { type: "ai_usage", amount: -576, ... }] }
```

