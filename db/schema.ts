import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};
export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("active"),
  ...timestamps,
});
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    displayName: text("display_name"),
    status: text("status").notNull().default("active"),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)],
);
export const memberships = sqliteTable(
  "memberships",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    role: text("role").notNull(),
    status: text("status").notNull().default("active"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("membership_user_org_role_unique").on(
      t.userId,
      t.organizationId,
      t.role,
    ),
  ],
);
export const participants = sqliteTable(
  "participants",
  {
    id: text("id").primaryKey(),
    ownerUserId: text("owner_user_id").references(() => users.id),
    preferredName: text("preferred_name").notNull(),
    legalName: text("legal_name"),
    language: text("language").notNull().default("English"),
    contactPreference: text("contact_preference").notNull(),
    status: text("status").notNull().default("active"),
    ...timestamps,
  },
  (t) => [index("participants_owner_idx").on(t.ownerUserId)],
);
export const enrollments = sqliteTable(
  "enrollments",
  {
    id: text("id").primaryKey(),
    participantId: text("participant_id")
      .notNull()
      .references(() => participants.id),
    story: text("story").notNull(),
    needsJson: text("needs_json").notNull().default("[]"),
    goalsJson: text("goals_json").notNull().default("[]"),
    urgentContext: text("urgent_context"),
    consentedAt: text("consented_at"),
    status: text("status").notNull().default("draft"),
    version: integer("version").notNull().default(1),
    ...timestamps,
  },
  (t) => [index("enrollments_participant_idx").on(t.participantId)],
);
export const programs = sqliteTable(
  "programs",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    name: text("name").notNull(),
    category: text("category").notNull(),
    geography: text("geography").notNull(),
    capacity: integer("capacity").notNull().default(0),
    verificationStatus: text("verification_status").notNull().default("review"),
    sourceVersion: text("source_version"),
    reviewDueAt: text("review_due_at"),
    ...timestamps,
  },
  (t) => [index("programs_org_idx").on(t.organizationId)],
);
export const consentGrants = sqliteTable(
  "consent_grants",
  {
    id: text("id").primaryKey(),
    participantId: text("participant_id")
      .notNull()
      .references(() => participants.id),
    recipientOrganizationId: text("recipient_organization_id")
      .notNull()
      .references(() => organizations.id),
    purpose: text("purpose").notNull(),
    fieldsJson: text("fields_json").notNull().default("[]"),
    documentIdsJson: text("document_ids_json").notNull().default("[]"),
    status: text("status").notNull().default("active"),
    expiresAt: text("expires_at").notNull(),
    revokedAt: text("revoked_at"),
    ...timestamps,
  },
  (t) => [index("consent_participant_idx").on(t.participantId)],
);
export const referrals = sqliteTable(
  "referrals",
  {
    id: text("id").primaryKey(),
    participantId: text("participant_id")
      .notNull()
      .references(() => participants.id),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id),
    consentGrantId: text("consent_grant_id")
      .notNull()
      .references(() => consentGrants.id),
    ownerMembershipId: text("owner_membership_id").references(
      () => memberships.id,
    ),
    stage: text("stage").notNull().default("authorized"),
    responseDueAt: text("response_due_at"),
    outcome: text("outcome"),
    ...timestamps,
  },
  (t) => [
    index("referrals_participant_idx").on(t.participantId),
    index("referrals_program_idx").on(t.programId),
  ],
);
export const documents = sqliteTable(
  "documents",
  {
    id: text("id").primaryKey(),
    participantId: text("participant_id")
      .notNull()
      .references(() => participants.id),
    storageKey: text("storage_key").notNull(),
    name: text("name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    scanStatus: text("scan_status").notNull().default("pending"),
    status: text("status").notNull().default("private"),
    ...timestamps,
  },
  (t) => [index("documents_participant_idx").on(t.participantId)],
);
export const communications = sqliteTable(
  "communications",
  {
    id: text("id").primaryKey(),
    participantId: text("participant_id").references(() => participants.id),
    referralId: text("referral_id").references(() => referrals.id),
    channel: text("channel").notNull(),
    direction: text("direction").notNull(),
    templateKey: text("template_key"),
    status: text("status").notNull().default("draft"),
    providerMessageId: text("provider_message_id"),
    failureReason: text("failure_reason"),
    ...timestamps,
  },
  (t) => [index("communications_referral_idx").on(t.referralId)],
);
export const verificationTasks = sqliteTable(
  "verification_tasks",
  {
    id: text("id").primaryKey(),
    programId: text("program_id").references(() => programs.id),
    subjectType: text("subject_type").notNull(),
    subjectId: text("subject_id").notNull(),
    status: text("status").notNull().default("open"),
    assignedMembershipId: text("assigned_membership_id").references(
      () => memberships.id,
    ),
    dueAt: text("due_at"),
    decision: text("decision"),
    ...timestamps,
  },
  (t) => [index("verification_subject_idx").on(t.subjectType, t.subjectId)],
);
export const actionEvents = sqliteTable(
  "action_events",
  {
    id: text("id").primaryKey(),
    actorUserId: text("actor_user_id").references(() => users.id),
    organizationId: text("organization_id").references(() => organizations.id),
    subjectType: text("subject_type").notNull(),
    subjectId: text("subject_id"),
    action: text("action").notNull(),
    status: text("status").notNull(),
    purpose: text("purpose").notNull(),
    payloadJson: text("payload_json").notNull().default("{}"),
    ...timestamps,
  },
  (t) => [index("action_events_subject_idx").on(t.subjectType, t.subjectId)],
);
export const auditReceipts = sqliteTable(
  "audit_receipts",
  {
    id: text("id").primaryKey(),
    actionEventId: text("action_event_id")
      .notNull()
      .references(() => actionEvents.id),
    previousHash: text("previous_hash"),
    receiptHash: text("receipt_hash").notNull(),
    policyVersion: text("policy_version").notNull(),
    summary: text("summary").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    uniqueIndex("audit_receipt_event_unique").on(t.actionEventId),
    uniqueIndex("audit_receipt_hash_unique").on(t.receiptHash),
  ],
);

export const assignmentHistory = sqliteTable(
  "assignment_history",
  {
    id: text("id").primaryKey(),
    referralId: text("referral_id")
      .notNull()
      .references(() => referrals.id),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    previousMembershipId: text("previous_membership_id").references(
      () => memberships.id,
    ),
    assignedMembershipId: text("assigned_membership_id").references(
      () => memberships.id,
    ),
    changedByUserId: text("changed_by_user_id")
      .notNull()
      .references(() => users.id),
    reason: text("reason").notNull(),
    effectiveAt: text("effective_at").notNull(),
    endedAt: text("ended_at"),
    ...timestamps,
  },
  (t) => [
    index("assignment_history_referral_idx").on(t.referralId),
    index("assignment_history_org_idx").on(t.organizationId),
  ],
);

export const accessReviews = sqliteTable(
  "access_reviews",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    membershipId: text("membership_id")
      .notNull()
      .references(() => memberships.id),
    reviewerUserId: text("reviewer_user_id")
      .notNull()
      .references(() => users.id),
    decision: text("decision").notNull(),
    reason: text("reason").notNull(),
    reviewedAt: text("reviewed_at").notNull(),
    nextReviewAt: text("next_review_at").notNull(),
    ...timestamps,
  },
  (t) => [
    index("access_reviews_org_idx").on(t.organizationId),
    index("access_reviews_membership_idx").on(t.membershipId),
  ],
);

export const securitySessions = sqliteTable(
  "security_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    tokenHash: text("token_hash").notNull(),
    assuranceLevel: text("assurance_level").notNull().default("standard"),
    authenticatedAt: text("authenticated_at").notNull(),
    lastSeenAt: text("last_seen_at").notNull(),
    expiresAt: text("expires_at").notNull(),
    revokedAt: text("revoked_at"),
    revocationReason: text("revocation_reason"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("security_sessions_token_unique").on(t.tokenHash),
    index("security_sessions_user_idx").on(t.userId),
  ],
);

export const rateLimitBuckets = sqliteTable(
  "rate_limit_buckets",
  {
    id: text("id").primaryKey(),
    subjectHash: text("subject_hash").notNull(),
    operation: text("operation").notNull(),
    windowStartedAt: text("window_started_at").notNull(),
    requestCount: integer("request_count").notNull().default(0),
    blockedUntil: text("blocked_until"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("rate_limit_subject_operation_unique").on(
      t.subjectHash,
      t.operation,
    ),
  ],
);

export const recoveryRequests = sqliteTable(
  "recovery_requests",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").references(() => organizations.id),
    subjectType: text("subject_type").notNull(),
    subjectId: text("subject_id").notNull(),
    requestedByUserId: text("requested_by_user_id")
      .notNull()
      .references(() => users.id),
    reason: text("reason").notNull(),
    status: text("status").notNull().default("pending"),
    requestedAt: text("requested_at").notNull(),
    expiresAt: text("expires_at").notNull(),
    executedAt: text("executed_at"),
    ...timestamps,
  },
  (t) => [index("recovery_requests_subject_idx").on(t.subjectType, t.subjectId)],
);

export const recoveryApprovals = sqliteTable(
  "recovery_approvals",
  {
    id: text("id").primaryKey(),
    recoveryRequestId: text("recovery_request_id")
      .notNull()
      .references(() => recoveryRequests.id),
    approverUserId: text("approver_user_id")
      .notNull()
      .references(() => users.id),
    decision: text("decision").notNull(),
    rationale: text("rationale").notNull(),
    decidedAt: text("decided_at").notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("recovery_approval_request_approver_unique").on(
      t.recoveryRequestId,
      t.approverUserId,
    ),
  ],
);

export const securityAlerts = sqliteTable(
  "security_alerts",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").references(() => organizations.id),
    actorUserId: text("actor_user_id").references(() => users.id),
    category: text("category").notNull(),
    severity: text("severity").notNull(),
    status: text("status").notNull().default("open"),
    summary: text("summary").notNull(),
    evidenceJson: text("evidence_json").notNull().default("{}"),
    detectedAt: text("detected_at").notNull(),
    acknowledgedAt: text("acknowledged_at"),
    resolvedAt: text("resolved_at"),
    ...timestamps,
  },
  (t) => [
    index("security_alerts_status_idx").on(t.status, t.severity),
    index("security_alerts_actor_idx").on(t.actorUserId),
  ],
);
