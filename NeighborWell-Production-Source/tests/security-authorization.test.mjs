import test from "node:test";
import assert from "node:assert/strict";
import { authorize } from "../lib/security/authorization.ts";

const future = "2099-01-01T00:00:00.000Z";
const baseDocument = {
  id: "doc_1",
  type: "document",
  participantId: "par_1",
  organizationId: "org_1",
  assignedMembershipId: "mem_1",
  status: "private",
  securityStatus: "baseline_security_check_passed",
};
const baseConsent = {
  id: "cgr_1",
  participantId: "par_1",
  recipientOrganizationId: "org_1",
  purpose: "Housing stabilization screening and coordination",
  fields: ["preferred_name"],
  documentIds: ["doc_1"],
  status: "active",
  expiresAt: future,
  revokedAt: null,
};

test("participant can read an owned security-cleared document", () => {
  const decision = authorize({
    actor: { userId: "usr_1", role: "participant", accountStatus: "active" },
    action: "participant.document.read.own",
    purpose: "self_service",
    resource: { ...baseDocument, ownerUserId: "usr_1" },
  });
  assert.equal(decision.allowed, true);
});

test("participant cannot read another participant's document", () => {
  const decision = authorize({
    actor: { userId: "usr_2", role: "participant", accountStatus: "active" },
    action: "participant.document.read.own",
    purpose: "self_service",
    resource: { ...baseDocument, ownerUserId: "usr_1" },
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.code, "ownership_denied");
});

test("navigator needs active membership, organization, assignment, and consent", () => {
  const decision = authorize({
    actor: {
      userId: "usr_nav",
      role: "navigator",
      accountStatus: "active",
      organizationId: "org_1",
      membershipId: "mem_1",
      membershipStatus: "active",
    },
    action: "navigator.document.read.consented",
    purpose: "service_coordination",
    resource: baseDocument,
    consent: baseConsent,
    consentPurpose: baseConsent.purpose,
  });
  assert.equal(decision.allowed, true);
});

test("navigator is denied when the referral is assigned to someone else", () => {
  const decision = authorize({
    actor: {
      userId: "usr_nav",
      role: "navigator",
      accountStatus: "active",
      organizationId: "org_1",
      membershipId: "mem_other",
      membershipStatus: "active",
    },
    action: "navigator.document.read.consented",
    purpose: "service_coordination",
    resource: baseDocument,
    consent: baseConsent,
  });
  assert.equal(decision.code, "assignment_denied");
});

test("provider supervisor is denied across organization boundaries", () => {
  const decision = authorize({
    actor: {
      userId: "usr_supervisor",
      role: "provider_supervisor",
      accountStatus: "active",
      organizationId: "org_2",
      membershipId: "mem_2",
      membershipStatus: "active",
    },
    action: "provider.document.read.consented",
    purpose: "service_coordination",
    resource: baseDocument,
    consent: baseConsent,
  });
  assert.equal(decision.code, "organization_denied");
});

test("revoked consent blocks provider access", () => {
  const decision = authorize({
    actor: {
      userId: "usr_supervisor",
      role: "provider_supervisor",
      accountStatus: "active",
      organizationId: "org_1",
      membershipId: "mem_1",
      membershipStatus: "active",
    },
    action: "provider.document.read.consented",
    purpose: "service_coordination",
    resource: baseDocument,
    consent: { ...baseConsent, status: "revoked", revokedAt: "2026-01-01T00:00:00.000Z" },
  });
  assert.equal(decision.code, "consent_revoked");
});

test("consent cannot authorize a document outside its scope", () => {
  const decision = authorize({
    actor: {
      userId: "usr_supervisor",
      role: "provider_supervisor",
      accountStatus: "active",
      organizationId: "org_1",
      membershipId: "mem_1",
      membershipStatus: "active",
    },
    action: "provider.document.read.consented",
    purpose: "service_coordination",
    resource: { ...baseDocument, id: "doc_2" },
    consent: baseConsent,
  });
  assert.equal(decision.code, "consent_scope_denied");
});

test("inactive accounts are denied before resource evaluation", () => {
  const decision = authorize({
    actor: { userId: "usr_1", role: "participant", accountStatus: "suspended" },
    action: "participant.document.read.own",
    purpose: "self_service",
    resource: { ...baseDocument, ownerUserId: "usr_1" },
  });
  assert.equal(decision.code, "account_inactive");
});

test("documents that fail the security gate cannot be retrieved", () => {
  const decision = authorize({
    actor: { userId: "usr_1", role: "participant", accountStatus: "active" },
    action: "participant.document.read.own",
    purpose: "self_service",
    resource: {
      ...baseDocument,
      ownerUserId: "usr_1",
      securityStatus: "quarantined",
    },
  });
  assert.equal(decision.code, "resource_blocked");
});
