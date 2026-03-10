# Changelog

All notable changes to the ProductClank Agent Skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-03-10

### Changed - Progressive Disclosure Restructure
- **BREAKING**: SKILL.md completely rewritten following Anthropic's official skill spec (from `anthropics/claude-code` plugin-dev)
- Reduced SKILL.md from 4,122 words to 1,076 words (spec target: 1,500-2,000)
- Frontmatter `description` rewritten in third person with specific trigger phrases
- Writing style changed from second person to imperative/infinitive form
- Detailed content moved to reference files (progressive disclosure):
  - `references/FAQ.md` — 12 Q&A pairs (was inline in SKILL.md)
  - `references/FUNDING.md` — Credit bundles, payment scenarios, tier roadmap (was inline)
  - Code examples remain in `references/EXAMPLES.md`
  - Full endpoint docs remain in `references/API_REFERENCE.md`
- SKILL.md now includes explicit "Additional Resources" section pointing to bundled files

### Added
- **5 new endpoints** documented in API_REFERENCE.md (were in codebase but undocumented):
  - `GET /agents/by-user` — List agents linked to a user (public)
  - `POST /agents/authorize` — Grant agent authorization to bill user credits (trusted only)
  - `DELETE /agents/authorize` — Revoke agent authorization (trusted only)
  - `POST /agents/telegram/create-link` — Generate Telegram linking token (trusted only)
  - `GET /agents/telegram/lookup` — Look up user by Telegram ID (trusted only)
- `review-posts` added to API_REFERENCE.md endpoint overview table (was documented below but missing from table)
- Total documented endpoints: 19 (was 14)

---

## [2.1.0] - 2026-03-08

### Added - Owner-Linked Agents & Onboarding UX
- **Agent-to-user linking endpoint**: `POST /api/v1/agents/create-link` — generates a short-lived deep link so users can link an agent to their ProductClank account via Privy login
- **Owner-linked agent setup path**: Agents can now operate using a real user's credit balance instead of self-funding. Link via deep link from any interface (terminal, Cursor, Claude Code, Telegram)
- **Decision tree in README**: "Which endpoint should I use?" flowchart helping agents choose between Communiply campaigns and Tweet Boost
- **Campaign cost estimator**: Shows exactly what 300 free credits can buy (small/medium/full test, boost)
- **Funding scenarios documentation**: Two clear paths — autonomous (self-funded) vs owner-linked (user-funded), with step-by-step instructions for each
- **Launch campaign use case**: New use case showing how to run campaigns with community rewards
- **Common mistakes section**: Onboarding improvements to reduce first-time errors
- **Agent authorization step**: Documented `caller_user_id` delegation flow for user-funded campaigns

### Changed
- **BREAKING**: Restructured Agent Setup section in SKILL.md around two setup paths (Autonomous vs Owner-Linked) instead of a single registration flow
- Rewrote README.md funding section with credit card option via webapp
- Updated FAQ with autonomous vs owner-linked agent distinction
- Bumped README version to 2.1.0

---

## [2.0.0] - 2026-03-08

### Changed - Major Documentation Restructure
- **BREAKING**: SKILL.md restructured around agent setup paths (Autonomous, Owner-Linked, Trusted) — agents loading this skill will see a different document structure
- Bumped SKILL.md metadata version from 1.3.0 to 2.0.0

---

## [1.3.0] - 2026-03-06

### Added - Review Posts & Skill Versioning
- **Review posts endpoint**: `POST /api/v1/agents/campaigns/{id}/review-posts` — AI-powered relevancy scoring against custom rules (2 credits/post). Bulk-scores discovered posts and deletes irrelevant ones
  - Supports `dry_run` mode to preview results before committing
  - Supports `save_rules` to persist review rules on the campaign
  - Supports `threshold` (1-10 scale) for relevancy cutoff
- **Admin URL in campaign responses**: All campaign response objects now include `admin_url` (`/my-campaigns/communiply/{id}`) alongside the existing public `url` (`/communiply/{id}`)
- **Skill version update mechanism**: API responses now include `X-Skill-Version` header. Agents can compare against cached SKILL.md version and re-fetch from GitHub when outdated
- **`user_id` linking flow documentation**: Documented how agents can register with `user_id` to link to an existing ProductClank account at registration time
- **Helper scripts**: `scripts/review-posts.mjs` for AI post review

### Changed
- Updated credit cost tables to include review-posts (2 credits/post)
- Synced README with latest SKILL.md features
- Bumped version references to 1.3.0

---

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

### Changed - Credit-Based Pricing
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

### Planned
- **Tier 2: Research-Enhanced Campaigns** — AI keyword generation, research analysis, smart targeting
- **Tier 3: Iterate & Optimize** — Read results, AI refinement chat, regenerate replies, full campaign lifecycle
- **Trusted Agent (multi-tenant)** — Platform agents serving multiple users with per-user billing
- Webhook support for campaign events
- Bulk campaign creation support
- Campaign templates for common use cases

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
