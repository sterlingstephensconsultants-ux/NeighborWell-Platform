import test from "node:test";
import assert from "node:assert/strict";
import { validateSession } from "../lib/security/session.ts";
import { evaluateRateLimit } from "../lib/security/rate-limit.ts";
import { evaluateRecovery } from "../lib/security/recovery.ts";
import { detectSecurityAlert } from "../lib/security/monitoring.ts";

const now = new Date("2026-10-07T18:00:00.000Z");

test("active session is accepted", () => {
  const decision = validateSession({
    authenticatedAt: "2026-10-07T17:55:00.000Z",
    lastSeenAt: "2026-10-07T17:59:00.000Z",
    expiresAt: "2026-10-07T19:00:00.000Z",
    assuranceLevel: "standard",
  }, { now });
  assert.deepEqual(decision, { allowed: true, code: "session_valid" });
});

test("revoked and idle sessions are rejected", () => {
  assert.equal(validateSession({
    authenticatedAt: "2026-10-07T17:55:00.000Z",
    lastSeenAt: "2026-10-07T17:59:00.000Z",
    expiresAt: "2026-10-07T19:00:00.000Z",
    revokedAt: "2026-10-07T17:58:00.000Z",
    assuranceLevel: "phishing_resistant",
  }, { now }).code, "session_revoked");
  assert.equal(validateSession({
    authenticatedAt: "2026-10-07T16:00:00.000Z",
    lastSeenAt: "2026-10-07T17:00:00.000Z",
    expiresAt: "2026-10-07T19:00:00.000Z",
    assuranceLevel: "standard",
  }, { now }).code, "session_idle");
});

test("sensitive recovery actions require recent strong authentication", () => {
  const stale = validateSession({
    authenticatedAt: "2026-10-07T17:30:00.000Z",
    lastSeenAt: "2026-10-07T17:59:00.000Z",
    expiresAt: "2026-10-07T19:00:00.000Z",
    assuranceLevel: "reauthenticated",
  }, { now, sensitiveAction: true });
  assert.equal(stale.code, "reauthentication_required");
  const fresh = validateSession({
    authenticatedAt: "2026-10-07T17:55:00.000Z",
    lastSeenAt: "2026-10-07T17:59:00.000Z",
    expiresAt: "2026-10-07T19:00:00.000Z",
    assuranceLevel: "phishing_resistant",
  }, { now, sensitiveAction: true });
  assert.equal(fresh.allowed, true);
});

test("rate limiter blocks requests beyond policy and supplies retry time", () => {
  const policy = { limit: 2, windowSeconds: 60, blockSeconds: 120 };
  const first = evaluateRateLimit(null, policy, now);
  const second = evaluateRateLimit(first.nextState, policy, new Date(now.getTime() + 1000));
  const third = evaluateRateLimit(second.nextState, policy, new Date(now.getTime() + 2000));
  assert.equal(first.allowed, true);
  assert.equal(second.remaining, 0);
  assert.equal(third.allowed, false);
  assert.equal(third.retryAfterSeconds, 120);
});

test("recovery requires two independent approvals", () => {
  const base = {
    requestedByUserId: "usr_requester",
    status: "pending",
    expiresAt: "2026-10-08T18:00:00.000Z",
  };
  assert.equal(evaluateRecovery({ ...base, approvals: [] }, now).code, "second_approval_required");
  assert.equal(evaluateRecovery({
    ...base,
    approvals: [
      { approverUserId: "usr_a", decision: "approved" },
      { approverUserId: "usr_b", decision: "approved" },
    ],
  }, now).code, "recovery_ready");
});

test("requester cannot approve their own recovery", () => {
  const decision = evaluateRecovery({
    requestedByUserId: "usr_requester",
    status: "pending",
    expiresAt: "2026-10-08T18:00:00.000Z",
    approvals: [
      { approverUserId: "usr_requester", decision: "approved" },
      { approverUserId: "usr_b", decision: "approved" },
    ],
  }, now);
  assert.equal(decision.code, "separation_of_duties_failed");
});

test("monitoring elevates repeated cross-tenant attempts", () => {
  const signals = [0, 1, 2].map((offset) => ({
    category: "authorization_denial",
    actorUserId: "usr_bad",
    organizationId: "org_1",
    code: "organization_denied",
    occurredAt: new Date(now.getTime() - offset * 60_000).toISOString(),
  }));
  const alert = detectSecurityAlert(signals, now);
  assert.equal(alert?.severity, "critical");
  assert.equal(alert?.category, "repeated_cross_tenant_access");
});
