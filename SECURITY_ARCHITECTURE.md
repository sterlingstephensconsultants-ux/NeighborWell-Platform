# NeighborWell Security and Authorization Architecture

## Scope

NeighborWell remains an independent participant-centered resource platform. It adopts SSCOP's security proficiency without importing SSCOP's consulting workflows, billing, visual design, or client-engagement model.

## Enforcement principles

1. Authentication identifies the actor; it does not authorize access.
2. Every protected service operation names an explicit action and purpose.
3. Authorization is enforced on the server before protected data is returned or changed.
4. Roles grant action permissions, not unrestricted record visibility.
5. Participant ownership, organization scope, assignment scope, consent, expiration, revocation, field/document scope, and security status are evaluated independently.
6. Administrators do not receive participant-record access by default.
7. Allowed and denied sensitive access decisions generate audit events and immutable receipts.
8. NeighborWell and SSCOP retain separate accounts, databases, sessions, encryption keys, audit ledgers, and retention policies.

## Roles

| Role | Primary boundary |
| --- | --- |
| Participant | Own records only |
| Navigator | Assigned referrals within one active organization membership |
| Provider supervisor | Consented provider records within the supervisor's organization |
| Network analyst | Privacy-protected aggregate information |
| Governance administrator | Accounts, organizations, security policy, and recovery; no default case access |
| Accountability auditor | Read-only audit and authorization review |

## Authorization decision order

1. Active account
2. Active organization membership when applicable
3. Action permission
4. Approved purpose
5. Participant ownership for `.own` actions
6. Organization boundary
7. Navigator assignment
8. Active, unexpired, unrevoked consent
9. Consent participant, recipient, purpose, field, and document scope
10. Resource security status
11. Aggregate privacy threshold when applicable

The engine returns a stable decision code, human-readable reason, evaluated controls, and policy version. API responses may expose a safe decision code but must not reveal sensitive record details.

## Current Phase 1 integration

- Product-neutral permission registry and authorization engine
- NeighborWell role and action matrix
- Account, membership, ownership, organization, assignment, and consent enforcement
- Document security-status enforcement
- Standardized allow/deny audit receipts
- Participant document-download enforcement
- Provider document-download enforcement
- Automated authorization tests for ownership, cross-organization access, assignment, consent, account status, scope, and quarantine

## Next implementation phases

1. Apply the engine to enrollment, consent, referral, provider-list, administrative, export, and reporting endpoints.
2. Add explicit staff assignment history and access-review records.
3. Add session revocation, reauthentication for sensitive actions, and rate limiting.
4. Add administrative recovery with two-person approval and immutable restoration receipts.
5. Add cross-tenant integration tests and security-event monitoring.
6. Complete threat modeling, privacy impact assessment, penetration testing, and incident-response exercises before real participant deployment.
