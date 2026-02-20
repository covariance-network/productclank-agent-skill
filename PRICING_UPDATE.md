# PRICING UPDATE - Credit-Based System

## What Changed

### OLD (Package-Based):
- Agents paid upfront per campaign: test ($0.01), starter ($99), growth ($499), scale ($2000)
- Payment via x402 or direct USDC transfer
- Each campaign required payment

### NEW (Credit-Based):
- Agents buy credits: nano ($2/50cr), micro ($10/200cr), small ($25/550cr), medium ($50/1200cr), large ($100/2600cr), enterprise ($500/14000cr)
- Credits consumed as operations are performed
- No upfront payment for campaigns
- Pay-per-use model

## New Endpoints

1. GET /api/v1/agents/credits/balance - Check credit balance
2. POST /api/v1/agents/credits/topup - Buy credits
3. GET /api/v1/agents/credits/history - View transaction history

## Updated Workflow

1. Top up credits (one-time or as needed)
2. Create campaign (free, no payment)
3. Generate posts (consumes credits)
4. Top up again when balance runs low

## Credit Costs

- Generate post + reply: 12 credits (~$0.50 at medium bundle rate)
- Generate reply only: 8 credits
- Regenerate reply: 5 credits
- Tweet boost (10 replies): 80 credits
- Chat message: 3 credits
- Keyword generation: 2 credits

