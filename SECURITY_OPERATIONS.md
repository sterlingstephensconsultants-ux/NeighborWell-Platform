# NeighborWell Security Operations

## Implemented lifecycle controls

- Assignment history records every referral reassignment, the prior and new membership, the responsible user, reason, organization, and effective period.
- Access reviews require a named reviewer, decision, rationale, review date, and next review date.
- Security sessions store only token hashes and support expiration, idle timeout, revocation, assurance levels, and recent reauthentication for sensitive actions.
- Rate-limit buckets are scoped to a hashed subject and operation and return a deterministic retry interval.
- Administrative recovery requires two independent approvals; requesters cannot approve their own request.
- Security alerts support repeated cross-tenant attempts, revoked-session use, and rate-limit abuse.

## Operational thresholds

| Control | Default |
| --- | --- |
| Session idle timeout | 30 minutes |
| Sensitive-action reauthentication | 10 minutes |
| Recovery approvals | 2 independent approvers |
| Recovery request lifetime | Set by service; maximum 24 hours recommended |
| Cross-tenant alert | 3 denials in 15 minutes |
| Rate-limit alert | 5 blocks in 15 minutes |

## Required deployment wiring

1. Apply `drizzle/0002_security_lifecycle.sql` before enabling lifecycle endpoints.
2. Store session tokens only in secure, HTTP-only, SameSite cookies; persist only their hashes.
3. Use a shared durable rate-limit store in production. Never rely on process memory.
4. Require phishing-resistant reauthentication for recovery execution and role changes.
5. Emit an authorization receipt for allowed and denied sensitive operations.
6. Route high and critical alerts to the incident queue and on-call owner.
7. Never place participant data, document names, email addresses, tokens, or consent contents in alert summaries.

## Incident response sequence

1. Triage and classify the alert.
2. Preserve audit receipts and relevant immutable evidence.
3. Revoke affected sessions and suspend compromised memberships.
4. Contain cross-tenant exposure before investigating root cause.
5. Determine notification duties with privacy and legal leadership.
6. Restore service through an approved recovery request when needed.
7. Document corrective actions and validate them with regression tests.

## Release gates

Real participant data must not be enabled until migration validation, threat modeling, privacy-impact review, access-control testing, dependency scanning, penetration testing, backup restoration, and an incident-response exercise are complete.
