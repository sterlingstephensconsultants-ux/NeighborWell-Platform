import { getDb } from "../../db";
import { actionEvents, auditReceipts } from "../../db/schema";
import { stableIdentityId } from "./identity";
import type { AuthorizationDecision, SecurityAction, SecurityPurpose } from "./types";

type Database = Awaited<ReturnType<typeof getDb>>;

export async function recordAuthorizationDecision(input: {
  db: Database;
  actorUserId: string;
  organizationId?: string | null;
  resourceType: string;
  resourceId?: string | null;
  action: SecurityAction;
  purpose: SecurityPurpose;
  decision: AuthorizationDecision;
  consentGrantId?: string | null;
}) {
  const eventId = `evt_${crypto.randomUUID()}`;
  const createdAt = new Date().toISOString();
  const summary = `${input.action}: ${input.decision.reason}`;
  await input.db.insert(actionEvents).values({
    id: eventId,
    actorUserId: input.actorUserId,
    organizationId: input.organizationId ?? null,
    subjectType: input.resourceType,
    subjectId: input.resourceId ?? null,
    action: input.action,
    status: input.decision.allowed ? "allowed" : "denied",
    purpose: input.purpose,
    payloadJson: JSON.stringify({
      decisionCode: input.decision.code,
      controls: input.decision.controls,
      consentGrantId: input.consentGrantId ?? null,
    }),
  });
  const receiptHash = await stableIdentityId(
    `${eventId}:${createdAt}:${input.decision.policyVersion}:${summary}`,
  );
  const receiptId = `rcp_${crypto.randomUUID()}`;
  await input.db.insert(auditReceipts).values({
    id: receiptId,
    actionEventId: eventId,
    receiptHash,
    policyVersion: input.decision.policyVersion,
    summary,
  });
  return { eventId, receiptId };
}
