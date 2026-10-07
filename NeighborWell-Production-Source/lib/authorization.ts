// Compatibility facade for existing imports. New code should import from
// lib/security so both NeighborWell and future products can share the engine.
export type NeighborWellRole =
  | "resident"
  | "navigator"
  | "provider_supervisor"
  | "network_analyst"
  | "governance_administrator"
  | "accountability_auditor";

export type NeighborWellPurpose =
  | "self_service"
  | "service_coordination"
  | "program_oversight"
  | "network_analysis"
  | "governance_review"
  | "independent_audit";

export type ProtectedResource =
  | "resident_profile"
  | "resident_contact"
  | "resident_document"
  | "consent_receipt"
  | "referral"
  | "provider_capacity"
  | "aggregate_outcome"
  | "policy_version"
  | "audit_receipt";

export type AuthorizationContext = {
  userId: string;
  role: NeighborWellRole;
  purpose: NeighborWellPurpose;
  organizationId: string;
  resourceOrganizationId?: string;
  residentId?: string;
  subjectResidentId?: string;
  consentedFields?: ProtectedResource[];
  privacyThresholdMet?: boolean;
};

export type AuthorizationDecision = {
  allowed: boolean;
  reason: string;
  controls: string[];
};

const rolePurposes: Record<NeighborWellRole, NeighborWellPurpose[]> = {
  resident: ["self_service"],
  navigator: ["service_coordination"],
  provider_supervisor: ["service_coordination", "program_oversight"],
  network_analyst: ["network_analysis"],
  governance_administrator: ["governance_review"],
  accountability_auditor: ["independent_audit"],
};

const purposeResources: Record<NeighborWellPurpose, ProtectedResource[]> = {
  self_service: ["resident_profile", "resident_contact", "consent_receipt", "referral", "audit_receipt"],
  service_coordination: ["resident_profile", "resident_contact", "resident_document", "consent_receipt", "referral", "provider_capacity"],
  program_oversight: ["referral", "provider_capacity", "aggregate_outcome"],
  network_analysis: ["provider_capacity", "aggregate_outcome", "policy_version"],
  governance_review: ["consent_receipt", "aggregate_outcome", "policy_version", "audit_receipt"],
  independent_audit: ["aggregate_outcome", "policy_version", "audit_receipt"],
};

const identityResources: ProtectedResource[] = ["resident_profile", "resident_contact"];

export function authorize(
  context: AuthorizationContext,
  resource: ProtectedResource,
): AuthorizationDecision {
  const controls = ["authenticated identity", "active role", "declared purpose"];

  if (!rolePurposes[context.role].includes(context.purpose)) {
    return deny("The active role is not approved for the declared purpose.", controls);
  }

  if (!purposeResources[context.purpose].includes(resource)) {
    return deny("The requested information is not necessary for this purpose.", controls);
  }

  if (context.role === "resident") {
    controls.push("resident ownership");
    if (!context.residentId || context.residentId !== context.subjectResidentId) {
      return deny("Residents may access only their own records.", controls);
    }
  }

  if (context.purpose === "service_coordination") {
    controls.push("organization boundary", "active consent scope");
    if (context.organizationId !== context.resourceOrganizationId) {
      return deny("The record is outside the user’s organization assignment.", controls);
    }
    if (identityResources.includes(resource) && !context.consentedFields?.includes(resource)) {
      return deny("Active resident consent does not include this information.", controls);
    }
  }

  if (["network_analysis", "independent_audit"].includes(context.purpose)) {
    controls.push("identity suppression", "minimum group threshold");
    if (identityResources.includes(resource)) {
      return deny("Identity-level resident information is excluded from this purpose.", controls);
    }
    if (resource === "aggregate_outcome" && !context.privacyThresholdMet) {
      return deny("The minimum privacy threshold has not been met.", controls);
    }
  }

  return { allowed: true, reason: "Access is necessary, scoped, and policy-compliant.", controls };
}

export {
  authorize as authorizeSecurityRequest,
} from "./security/authorization";
export type {
  AuthorizationRequest as SecurityAuthorizationRequest,
  SecurityAction,
  SecurityActor,
  SecurityResource,
  SecurityRole,
} from "./security/types";

function deny(reason: string, controls: string[]): AuthorizationDecision {
  return { allowed: false, reason, controls };
}
