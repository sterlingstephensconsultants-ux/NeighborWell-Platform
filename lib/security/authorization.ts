import {
  assignmentRequiredActions,
  consentRequiredActions,
  organizationRequiredActions,
  rolePermissions,
  rolePurposes,
  SECURITY_POLICY_VERSION,
} from "./permissions";
import type {
  AuthorizationDecision,
  AuthorizationDecisionCode,
  AuthorizationRequest,
} from "./types";

const ACTIVE = "active";
const PASSING_DOCUMENT_SECURITY_STATUSES = new Set([
  "baseline_security_check_passed",
  "malware_scan_passed",
]);

export function authorize(request: AuthorizationRequest): AuthorizationDecision {
  const controls = ["authenticated identity", "active account", "least privilege"];
  const { actor, action, purpose, resource } = request;

  if (actor.accountStatus !== ACTIVE)
    return deny("account_inactive", "The user account is not active.", controls);

  if (actor.role !== "participant") {
    controls.push("active membership");
    if (actor.membershipStatus !== ACTIVE)
      return deny("membership_inactive", "The organization membership is not active.", controls);
  }

  controls.push("action permission");
  if (!rolePermissions[actor.role].includes(action))
    return deny("permission_denied", "The active role does not permit this action.", controls);

  controls.push("declared purpose");
  if (!rolePurposes[actor.role].includes(purpose))
    return deny("purpose_denied", "The active role is not approved for this purpose.", controls);

  if (action.endsWith(".own")) {
    controls.push("participant ownership");
    if (!resource.ownerUserId || resource.ownerUserId !== actor.userId)
      return deny("ownership_denied", "Participants may access only their own records.", controls);
  }

  if (organizationRequiredActions.has(action)) {
    controls.push("organization scope");
    const allowedOrganization = request.consent?.recipientOrganizationId ?? resource.organizationId;
    if (!actor.organizationId || actor.organizationId !== allowedOrganization)
      return deny("organization_denied", "The resource is outside the user’s organization scope.", controls);
  }

  if (assignmentRequiredActions.has(action)) {
    controls.push("assignment scope");
    if (!actor.membershipId || resource.assignedMembershipId !== actor.membershipId)
      return deny("assignment_denied", "The resource is not assigned to this navigator.", controls);
  }

  if (consentRequiredActions.has(action)) {
    const consentDecision = validateConsent(request, controls);
    if (consentDecision) return consentDecision;
  }

  if (resource.type === "document") {
    controls.push("document security status");
    if (!resource.securityStatus || !PASSING_DOCUMENT_SECURITY_STATUSES.has(resource.securityStatus))
      return deny("resource_blocked", "Document access is blocked by security policy.", controls);
  }

  if (
    (purpose === "network_analysis" || purpose === "independent_audit") &&
    resource.type === "aggregate_outcome"
  ) {
    controls.push("minimum privacy threshold");
    if (!request.privacyThresholdMet)
      return deny("privacy_threshold_denied", "The minimum privacy threshold has not been met.", controls);
  }

  return {
    allowed: true,
    code: "allowed",
    reason: "Access is necessary, scoped, and policy-compliant.",
    controls,
    policyVersion: SECURITY_POLICY_VERSION,
  };
}

function validateConsent(
  request: AuthorizationRequest,
  controls: string[],
): AuthorizationDecision | null {
  controls.push("active, purpose-bound consent");
  const consent = request.consent;
  if (!consent) return deny("consent_missing", "Active participant consent was not found.", controls);
  if (consent.revokedAt) return deny("consent_revoked", "Participant consent has been revoked.", controls);
  if (consent.status !== ACTIVE)
    return deny("consent_inactive", "Participant consent is not active.", controls);
  const expiresAt = Date.parse(consent.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= (request.now ?? new Date()).getTime())
    return deny("consent_expired", "Participant consent has expired.", controls);
  if (!request.resource.participantId || consent.participantId !== request.resource.participantId)
    return deny("consent_subject_mismatch", "Consent does not belong to this participant.", controls);
  if (!request.actor.organizationId || consent.recipientOrganizationId !== request.actor.organizationId)
    return deny("consent_recipient_mismatch", "Consent was not granted to this organization.", controls);
  if (request.consentPurpose && consent.purpose !== request.consentPurpose)
    return deny("consent_purpose_mismatch", "Consent was granted for a different purpose.", controls);

  if (
    request.resource.type === "document" &&
    !consent.documentIds.includes(request.resource.id)
  )
    return deny("consent_scope_denied", "Consent does not include this document.", controls);

  if (
    request.requestedFields?.some((field) => !consent.fields.includes(field))
  )
    return deny("consent_scope_denied", "Consent does not include every requested field.", controls);

  return null;
}

function deny(
  code: AuthorizationDecisionCode,
  reason: string,
  controls: string[],
): AuthorizationDecision {
  return {
    allowed: false,
    code,
    reason,
    controls: [...controls],
    policyVersion: SECURITY_POLICY_VERSION,
  };
}
