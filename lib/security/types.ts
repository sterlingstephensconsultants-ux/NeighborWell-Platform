export type SecurityRole =
  | "participant"
  | "navigator"
  | "provider_supervisor"
  | "network_analyst"
  | "governance_administrator"
  | "accountability_auditor";

export type SecurityPurpose =
  | "self_service"
  | "service_coordination"
  | "program_oversight"
  | "network_analysis"
  | "governance_review"
  | "independent_audit";

export type SecurityAction =
  | "participant.profile.read.own"
  | "participant.profile.update.own"
  | "participant.document.list.own"
  | "participant.document.upload.own"
  | "participant.document.read.own"
  | "participant.consent.list.own"
  | "participant.consent.create.own"
  | "participant.consent.revoke.own"
  | "participant.referral.read.own"
  | "navigator.participant.read.assigned"
  | "navigator.referral.create.authorized"
  | "navigator.document.list.consented"
  | "navigator.document.read.consented"
  | "navigator.note.create.assigned"
  | "provider.referral.read.organization"
  | "provider.referral.update.organization"
  | "provider.document.list.consented"
  | "provider.document.read.consented"
  | "provider.capacity.update.organization"
  | "supervisor.assignment.manage.organization"
  | "supervisor.access.review.organization"
  | "admin.account.manage"
  | "admin.role.assign"
  | "admin.organization.verify"
  | "admin.record.restore"
  | "admin.security.review"
  | "auditor.audit.read"
  | "auditor.authorization.review";

export type SecurityResourceType =
  | "participant"
  | "document"
  | "consent_grant"
  | "referral"
  | "provider_capacity"
  | "aggregate_outcome"
  | "policy_version"
  | "audit_receipt"
  | "account"
  | "organization";

export type SecurityActor = {
  userId: string;
  role: SecurityRole;
  accountStatus: string;
  organizationId?: string;
  membershipId?: string;
  membershipStatus?: string;
};

export type SecurityResource = {
  id: string;
  type: SecurityResourceType;
  ownerUserId?: string | null;
  participantId?: string | null;
  organizationId?: string | null;
  assignedMembershipId?: string | null;
  status?: string | null;
  securityStatus?: string | null;
};

export type ConsentEvidence = {
  id: string;
  participantId: string;
  recipientOrganizationId: string;
  purpose: string;
  fields: string[];
  documentIds: string[];
  status: string;
  expiresAt: string;
  revokedAt?: string | null;
};

export type AuthorizationRequest = {
  actor: SecurityActor;
  action: SecurityAction;
  purpose: SecurityPurpose;
  resource: SecurityResource;
  consent?: ConsentEvidence | null;
  requestedFields?: string[];
  consentPurpose?: string;
  privacyThresholdMet?: boolean;
  now?: Date;
};

export type AuthorizationDecisionCode =
  | "allowed"
  | "account_inactive"
  | "membership_inactive"
  | "permission_denied"
  | "purpose_denied"
  | "ownership_denied"
  | "organization_denied"
  | "assignment_denied"
  | "consent_missing"
  | "consent_inactive"
  | "consent_expired"
  | "consent_revoked"
  | "consent_subject_mismatch"
  | "consent_recipient_mismatch"
  | "consent_purpose_mismatch"
  | "consent_scope_denied"
  | "resource_blocked"
  | "privacy_threshold_denied";

export type AuthorizationDecision = {
  allowed: boolean;
  code: AuthorizationDecisionCode;
  reason: string;
  controls: string[];
  policyVersion: string;
};
