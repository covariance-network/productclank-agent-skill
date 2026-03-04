# Changelog

All notable changes to the ProductClank Agent Skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-03-04

### Added - New Endpoints & Documentation Overhaul
- **Self-registration endpoint**: `POST /api/v1/agents/register` — agents can now self-register and receive API key + 300 free credits instantly (no manual approval needed)
- **Product search endpoint**: `GET /api/v1/agents/products/search?q=` — search products by name, tagline, or UUID to get product_id for campaigns
- **Agent profile endpoint**: `GET /api/v1/agents/me` — view agent profile, rate limits, trusted status, and credit balance
- **Campaign list endpoint**: `GET /api/v1/agents/campaigns` — list all campaigns created by the agent with pagination and status filtering
- **Campaign detail endpoint**: `GET /api/v1/agents/campaigns/{id}` — get campaign details, settings, and stats (posts discovered, replies by status)
- **API key rotation endpoint**: `POST /api/v1/agents/rotate-key` — rotate compromised API keys (old key immediately invalidated)
- **Tweet boost endpoint**: `POST /api/v1/agents/campaigns/boost` — boost a specific tweet with community replies (200 cr), likes (300 cr), or reposts (300 cr)
- **Delegates endpoint**: `POST /api/v1/agents/campaigns/{id}/delegates` — add ProductClank users as campaign delegators for web dashboard access
- **ERC-8004 import endpoint**: `POST /api/v1/agents/import` — pre-fill registration from on-chain agent identity

### Changed
- **BREAKING**: Campaign creation now costs 10 credits (previously documented as free)
- Updated all response shapes to match actual API responses (removed `cost_estimate`, `estimated_posts`, `payment` objects that didn't exist)
- Corrected nano bundle from 50 credits to 40 credits in all documentation
- Rewrote QUICKSTART.md with self-registration as Step 1 (was previously "contact team")
- Rewrote SKILL.md with accurate endpoint documentation and response shapes
- Rewrote API_REFERENCE.md with all 14 endpoints fully documented
- Updated README.md FAQ to reflect self-registration and free credits

### Removed
- Removed `estimated_posts` field from campaign creation docs (not implemented in API)
- Removed `cost_estimate` object from campaign creation response docs (not in actual response)
- Removed `payment` object from campaign creation response docs (credits system, not per-campaign payment)
- Removed legacy `route.ts.legacy` file from API codebase
- Removed "contact team for API key" instructions (replaced with self-registration)

---

## [1.1.0] - 2026-02-20

### Changed - Credit-Based Pricing 🔄
- **BREAKING**: Replaced campaign packages with credit-based pay-per-use system
- Agents buy credits ($2-$500), consume as operations performed (12 cr/post)
- No upfront payment for campaigns - credits deducted during generation
- Lower barrier to entry: $2 test bundle vs $99 minimum

### Added
- Credit bundles: nano ($2), micro ($10), small ($25), medium ($50), large ($100), enterprise ($500)
- `GET /api/v1/agents/credits/balance` - Check balance
- `POST /api/v1/agents/credits/topup` - Buy credits (x402/direct USDC)
- `GET /api/v1/agents/credits/history` - Transaction history

### Removed
- Campaign package payments (selected_package field removed)
- Payment requirement from POST /api/v1/agents/campaigns

---

## [1.0.0] - 2026-02-20

### Added
- Initial release of ProductClank Agent Skill
- Support for creating Communiply campaigns via Agent API
- Two payment methods: x402 protocol and direct USDC transfers
- Complete API documentation in `references/API_REFERENCE.md`
- Practical code examples in `references/EXAMPLES.md`
- Helper script for quick campaign creation (`scripts/create-campaign.mjs`)
- Comprehensive SKILL.md with:
  - What Communiply is and how it works
  - When AI agents should use this skill
  - Step-by-step campaign creation instructions
  - All use cases (competitor intercept, problem-based targeting, brand amplification, product launches)
  - Error handling and troubleshooting
- Four package tiers: test ($0.01), starter ($99), growth ($499), scale ($2000)
- Rate limiting: 10 campaigns/day default
- Links to web UI for campaign management

### Technical Details
- API Base URL: `https://api.productclank.com/api/v1`
- Payment Network: Base (chain ID 8453)
- Payment Token: USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
- Payment Address: `0x876Be690234aaD9C7ae8bb02c6900f5844aCaF68`
- x402 Protocol: v2 with EIP-3009 `TransferWithAuthorization`
- Agent Skills Spec: v1 (Anthropic)

### Documentation
- Complete README.md with quick start guide
- FAQ section
- TypeScript type definitions
- Validation and testing guidelines

---

## Upcoming

### Planned for v1.1.0
- Support for campaign management (pause, resume, delete) via API
- Webhook support for campaign events
- Campaign analytics API endpoints
- Bulk campaign creation support

### Under Consideration
- Support for additional payment networks (Ethereum, Polygon, etc.)
- Support for other payment tokens (ETH, native tokens)
- Campaign templates for common use cases
- Advanced filtering options (location, language, sentiment)

---

## Versioning

This skill follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

---

## Support

For issues, questions, or feature requests:
- GitHub Issues: [covariance-network/productclank-agent-skill/issues](https://github.com/covariance-network/productclank-agent-skill/issues)
- Twitter: [@productclank](https://twitter.com/productclank)
- Warpcast: [warpcast.com/productclank](https://warpcast.com/productclank)
