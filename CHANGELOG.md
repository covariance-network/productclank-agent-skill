# Changelog

All notable changes to the ProductClank Agent Skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- API Base URL: `https://app.productclank.com/api/v1`
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
