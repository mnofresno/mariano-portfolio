# Privacy and Confidentiality Policy

This document defines the privacy and confidentiality rules that must be followed when publishing content on mariano.fresno.ar.

## Non-negotiable Restrictions

### 2.1 Privacy and Confidentiality

All new content must comply with these rules:

1. **No private identifiers**: Do not publish names, logos, domains, screenshots, repositories, people, or internal data from clients or employers without written authorization.

2. **No internal artifacts**: Do not publish fragments of conversations, tickets, logs, contracts, configurations, credentials, private URLs, or identifiable topologies.

3. **No misattribution**: Do not attribute to Mariano a project presented or executed by another person.

4. **No approximate metrics as exact**: Do not publish metrics recalled approximately as if they were exact.

5. **No combinatorial identification**: Do not combine details that, although anonymous separately, could identify an organization.

6. **No unapproved testimonials**: Do not use testimonials without explicit approval from the cited person.

7. **No external data leakage**: Do not send private content to APIs, analytics, models, or external services.

8. **No inferred commercial impact**: Do not infer revenue, savings, or commercial impact without a verifiable source.

## Claim Publication Rules

Each relevant claim must be registered in `content/claims.json` with one of these statuses:

- `verified_public`: Can be published and its source is already public.
- `verified_private`: Backed by evidence but must be published anonymously.
- `needs_confirmation`: Cannot be published until Mariano confirms it.
- `rejected`: Not to be used.

A claim requires the following fields:

```json
{
  "id": "claim-example",
  "statement": "The original claim statement.",
  "status": "verified_public",
  "public_wording": "The anonymized or approved public wording.",
  "source_type": "public_repository",
  "identification_risk": "low",
  "approved_at": "2026-07-12",
  "notes": "Optional notes."
}
```

The UI can only render claims with status `verified_public` or `verified_private`. Tests must fail the build if `needs_confirmation` or `rejected` content appears on a public page.

## Enforcement

The `validate-public-content` script enforces these rules by scanning all public HTML, JSON, TXT, and XML files for:

- Private keys and tokens
- Common credential patterns
- URLs with embedded credentials
- Private IP addresses
- Local file paths from the developer's machine
- `TODO_REQUIRES_MARIANO_APPROVAL` markers
- Unapproved claims

## Review Process

Before each publication, verify:

- [ ] Content does not identify clients, employers, people, or private systems
- [ ] All visible figures are confirmed
- [ ] No screenshots contain names, URLs, data, or private metadata
- [ ] Diagrams have been redrawn and simplified for publication
- [ ] No logs, tokens, headers, IDs, IPs, or local paths
- [ ] Testimonials have written permission
- [ ] Claims are approved in `content/claims.json`
- [ ] `npm run validate:content` passes
- [ ] `npm test -- --runInBand` passes
- [ ] Mariano performed final human review of commercial content