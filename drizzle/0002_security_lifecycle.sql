CREATE TABLE `assignment_history` (
  `id` text PRIMARY KEY NOT NULL,
  `referral_id` text NOT NULL REFERENCES `referrals`(`id`),
  `organization_id` text NOT NULL REFERENCES `organizations`(`id`),
  `previous_membership_id` text REFERENCES `memberships`(`id`),
  `assigned_membership_id` text REFERENCES `memberships`(`id`),
  `changed_by_user_id` text NOT NULL REFERENCES `users`(`id`),
  `reason` text NOT NULL,
  `effective_at` text NOT NULL,
  `ended_at` text,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `assignment_history_referral_idx` ON `assignment_history` (`referral_id`);
--> statement-breakpoint
CREATE INDEX `assignment_history_org_idx` ON `assignment_history` (`organization_id`);
--> statement-breakpoint
CREATE TABLE `access_reviews` (
  `id` text PRIMARY KEY NOT NULL,
  `organization_id` text NOT NULL REFERENCES `organizations`(`id`),
  `membership_id` text NOT NULL REFERENCES `memberships`(`id`),
  `reviewer_user_id` text NOT NULL REFERENCES `users`(`id`),
  `decision` text NOT NULL,
  `reason` text NOT NULL,
  `reviewed_at` text NOT NULL,
  `next_review_at` text NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `access_reviews_org_idx` ON `access_reviews` (`organization_id`);
--> statement-breakpoint
CREATE INDEX `access_reviews_membership_idx` ON `access_reviews` (`membership_id`);
--> statement-breakpoint
CREATE TABLE `security_sessions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`),
  `token_hash` text NOT NULL,
  `assurance_level` text DEFAULT 'standard' NOT NULL,
  `authenticated_at` text NOT NULL,
  `last_seen_at` text NOT NULL,
  `expires_at` text NOT NULL,
  `revoked_at` text,
  `revocation_reason` text,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `security_sessions_token_unique` ON `security_sessions` (`token_hash`);
--> statement-breakpoint
CREATE INDEX `security_sessions_user_idx` ON `security_sessions` (`user_id`);
--> statement-breakpoint
CREATE TABLE `rate_limit_buckets` (
  `id` text PRIMARY KEY NOT NULL,
  `subject_hash` text NOT NULL,
  `operation` text NOT NULL,
  `window_started_at` text NOT NULL,
  `request_count` integer DEFAULT 0 NOT NULL,
  `blocked_until` text,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rate_limit_subject_operation_unique` ON `rate_limit_buckets` (`subject_hash`,`operation`);
--> statement-breakpoint
CREATE TABLE `recovery_requests` (
  `id` text PRIMARY KEY NOT NULL,
  `organization_id` text REFERENCES `organizations`(`id`),
  `subject_type` text NOT NULL,
  `subject_id` text NOT NULL,
  `requested_by_user_id` text NOT NULL REFERENCES `users`(`id`),
  `reason` text NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `requested_at` text NOT NULL,
  `expires_at` text NOT NULL,
  `executed_at` text,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `recovery_requests_subject_idx` ON `recovery_requests` (`subject_type`,`subject_id`);
--> statement-breakpoint
CREATE TABLE `recovery_approvals` (
  `id` text PRIMARY KEY NOT NULL,
  `recovery_request_id` text NOT NULL REFERENCES `recovery_requests`(`id`),
  `approver_user_id` text NOT NULL REFERENCES `users`(`id`),
  `decision` text NOT NULL,
  `rationale` text NOT NULL,
  `decided_at` text NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recovery_approval_request_approver_unique` ON `recovery_approvals` (`recovery_request_id`,`approver_user_id`);
--> statement-breakpoint
CREATE TABLE `security_alerts` (
  `id` text PRIMARY KEY NOT NULL,
  `organization_id` text REFERENCES `organizations`(`id`),
  `actor_user_id` text REFERENCES `users`(`id`),
  `category` text NOT NULL,
  `severity` text NOT NULL,
  `status` text DEFAULT 'open' NOT NULL,
  `summary` text NOT NULL,
  `evidence_json` text DEFAULT '{}' NOT NULL,
  `detected_at` text NOT NULL,
  `acknowledged_at` text,
  `resolved_at` text,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `security_alerts_status_idx` ON `security_alerts` (`status`,`severity`);
--> statement-breakpoint
CREATE INDEX `security_alerts_actor_idx` ON `security_alerts` (`actor_user_id`);
