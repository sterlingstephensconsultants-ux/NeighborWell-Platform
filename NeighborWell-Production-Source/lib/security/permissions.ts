import type {
  SecurityAction,
  SecurityPurpose,
  SecurityRole,
} from "./types";

export const SECURITY_POLICY_VERSION = "neighborwell-security-1.0";

export const rolePurposes: Readonly<Record<SecurityRole, readonly SecurityPurpose[]>> = {
  participant: ["self_service"],
  navigator: ["service_coordination"],
  provider_supervisor: ["service_coordination", "program_oversight"],
  network_analyst: ["network_analysis"],
  governance_administrator: ["governance_review"],
  accountability_auditor: ["independent_audit"],
};

export const rolePermissions: Readonly<Record<SecurityRole, readonly SecurityAction[]>> = {
  participant: [
    "participant.profile.read.own",
    "participant.profile.update.own",
    "participant.document.list.own",
    "participant.document.upload.own",
    "participant.document.read.own",
    "participant.consent.list.own",
    "participant.consent.create.own",
    "participant.consent.revoke.own",
    "participant.referral.read.own",
  ],
  navigator: [
    "navigator.participant.read.assigned",
    "navigator.referral.create.authorized",
    "navigator.document.list.consented",
    "navigator.document.read.consented",
    "navigator.note.create.assigned",
  ],
  provider_supervisor: [
    "provider.referral.read.organization",
    "provider.referral.update.organization",
    "provider.document.list.consented",
    "provider.document.read.consented",
    "provider.capacity.update.organization",
    "supervisor.assignment.manage.organization",
    "supervisor.access.review.organization",
  ],
  network_analyst: [],
  governance_administrator: [
    "admin.account.manage",
    "admin.role.assign",
    "admin.organization.verify",
    "admin.record.restore",
    "admin.security.review",
  ],
  accountability_auditor: [
    "auditor.audit.read",
    "auditor.authorization.review",
  ],
};

export const consentRequiredActions = new Set<SecurityAction>([
  "navigator.participant.read.assigned",
  "navigator.referral.create.authorized",
  "navigator.document.list.consented",
  "navigator.document.read.consented",
  "provider.document.list.consented",
  "provider.document.read.consented",
]);

export const assignmentRequiredActions = new Set<SecurityAction>([
  "navigator.participant.read.assigned",
  "navigator.document.list.consented",
  "navigator.document.read.consented",
  "navigator.note.create.assigned",
]);

export const organizationRequiredActions = new Set<SecurityAction>([
  ...consentRequiredActions,
  "provider.referral.read.organization",
  "provider.referral.update.organization",
  "provider.capacity.update.organization",
  "supervisor.assignment.manage.organization",
  "supervisor.access.review.organization",
]);
