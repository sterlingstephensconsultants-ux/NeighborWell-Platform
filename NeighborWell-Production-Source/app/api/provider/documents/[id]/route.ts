import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { consentGrants, documents, memberships, referrals, users } from "../../../../../db/schema";
import { authorize } from "../../../../../lib/security/authorization";
import { recordAuthorizationDecision } from "../../../../../lib/security/audit";
import { stableIdentityId } from "../../../../../lib/security/identity";
import type { ConsentEvidence, SecurityAction, SecurityRole } from "../../../../../lib/security/types";
import { getChatGPTUser } from "../../../../chatgpt-auth";

export const dynamic = "force-dynamic";
const providerRoles = ["navigator", "provider_supervisor"] as const;
const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function parseStringArray(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : [];
  } catch {
    return [];
  }
}

function consentEvidence(grant: typeof consentGrants.$inferSelect): ConsentEvidence {
  return {
    id: grant.id,
    participantId: grant.participantId,
    recipientOrganizationId: grant.recipientOrganizationId,
    purpose: grant.purpose,
    fields: parseStringArray(grant.fieldsJson),
    documentIds: parseStringArray(grant.documentIdsJson),
    status: grant.status,
    expiresAt: grant.expiresAt,
    revokedAt: grant.revokedAt,
  };
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getChatGPTUser();
  if (!auth) return json({ error: "Provider sign-in required." }, 401);
  const { id } = await context.params;
  const db = await getDb();
  const userId = await stableIdentityId(auth.email);
  const [account] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const assignments = await db.select().from(memberships).where(and(
    eq(memberships.userId, userId),
    inArray(memberships.role, [...providerRoles]),
  ));
  if (!assignments.length) return json({ error: "No provider assignment permits document review." }, 403);

  const [document] = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  if (!document) return json({ error: "Document not found." }, 404);
  const grants = await db.select().from(consentGrants).where(and(
    eq(consentGrants.participantId, document.participantId),
    inArray(consentGrants.recipientOrganizationId, assignments.map((item) => item.organizationId)),
  ));
  const grant = grants.find((item) => parseStringArray(item.documentIdsJson).includes(document.id));
  const [referral] = grant
    ? await db.select().from(referrals).where(eq(referrals.consentGrantId, grant.id)).limit(1)
    : [];

  let evaluated: {
    assignment: typeof memberships.$inferSelect;
    action: SecurityAction;
    decision: ReturnType<typeof authorize>;
  } | undefined;

  for (const assignment of assignments) {
    const role = assignment.role as SecurityRole;
    const action: SecurityAction = role === "navigator"
      ? "navigator.document.read.consented"
      : "provider.document.read.consented";
    const decision = authorize({
      actor: {
        userId,
        role,
        accountStatus: account?.status ?? "inactive",
        organizationId: assignment.organizationId,
        membershipId: assignment.id,
        membershipStatus: assignment.status,
      },
      action,
      purpose: "service_coordination",
      resource: {
        id: document.id,
        type: "document",
        participantId: document.participantId,
        organizationId: assignment.organizationId,
        assignedMembershipId: referral?.ownerMembershipId,
        status: document.status,
        securityStatus: document.scanStatus,
      },
      consent: grant ? consentEvidence(grant) : null,
      consentPurpose: grant?.purpose,
    });
    evaluated = { assignment, action, decision };
    if (decision.allowed) break;
  }

  if (!evaluated) return json({ error: "Access denied by security policy." }, 403);
  await recordAuthorizationDecision({
    db,
    actorUserId: userId,
    organizationId: evaluated.assignment.organizationId,
    resourceType: "document",
    resourceId: document.id,
    action: evaluated.action,
    purpose: "service_coordination",
    decision: evaluated.decision,
    consentGrantId: grant?.id,
  });
  if (!evaluated.decision.allowed)
    return json({
      error: "Access denied by participant consent and assignment policy.",
      decisionCode: evaluated.decision.code,
    }, 403);

  const { env } = await import("cloudflare:workers");
  const object = await (env as unknown as { DOCUMENTS: R2Bucket }).DOCUMENTS.get(document.storageKey);
  if (!object) return json({ error: "Stored document is unavailable." }, 404);
  const safeName = document.name.replace(/[\r\n"\\]/g, "_");
  return new Response(object.body, { headers: {
    "Cache-Control": "private, no-store, max-age=0",
    "Content-Disposition": `inline; filename="${safeName}"`,
    "Content-Type": document.mimeType,
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  }});
}
