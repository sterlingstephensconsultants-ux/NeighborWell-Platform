import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import {
  actionEvents,
  auditReceipts,
  consentGrants,
  documents,
  organizations,
  participants,
} from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";
const RECIPIENT_ID = "org_bay_community_alliance";
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
async function identityId(value: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value.trim().toLowerCase()),
  );
  return `usr_${Array.from(new Uint8Array(bytes))
    .slice(0, 16)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;
}
async function contextFor(email: string) {
  const db = await getDb();
  const userId = await identityId(email);
  const [participant] = await db
    .select()
    .from(participants)
    .where(eq(participants.ownerUserId, userId))
    .limit(1);
  return { db, userId, participant };
}
async function receipt(
  db: Awaited<ReturnType<typeof getDb>>,
  userId: string,
  grantId: string,
  action: string,
  status: string,
  summary: string,
) {
  const eventId = `evt_${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  await db.insert(actionEvents).values({
    id: eventId,
    actorUserId: userId,
    subjectType: "consent_grant",
    subjectId: grantId,
    action,
    status,
    purpose: "resident_authorization",
    payloadJson: JSON.stringify({ residentInitiated: true }),
  });
  const receiptHash = await identityId(`${eventId}:${now}:${summary}`);
  const receiptId = `rcp_${crypto.randomUUID()}`;
  await db.insert(auditReceipts).values({
    id: receiptId,
    actionEventId: eventId,
    receiptHash,
    policyVersion: "consent-2.0",
    summary,
  });
  return receiptId;
}

export async function GET() {
  const auth = await getChatGPTUser();
  if (!auth) return json({ error: "Sign in required." }, 401);
  const { db, participant } = await contextFor(auth.email);
  if (!participant) return json({ grants: [] });
  const grants = await db
    .select()
    .from(consentGrants)
    .where(eq(consentGrants.participantId, participant.id))
    .orderBy(desc(consentGrants.createdAt));
  const now = Date.now();
  return json({
    grants: grants.map((grant) => ({
      ...grant,
      fields: JSON.parse(grant.fieldsJson),
      documentIds: JSON.parse(grant.documentIdsJson),
      effectiveStatus:
        grant.status === "active" && Date.parse(grant.expiresAt) <= now
          ? "expired"
          : grant.status,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await getChatGPTUser();
  if (!auth) return json({ error: "Sign in required." }, 401);
  const body = (await request.json()) as {
    fields?: string[];
    documentIds?: string[];
    days?: number;
  };
  const fields = [...new Set(body.fields ?? [])].slice(0, 20);
  const documentIds = [...new Set(body.documentIds ?? [])].slice(0, 20);
  const days = Math.min(90, Math.max(1, Math.round(body.days ?? 30)));
  if (!fields.length && !documentIds.length)
    return json({ error: "Select at least one field or document." }, 400);
  const { db, userId, participant } = await contextFor(auth.email);
  if (!participant)
    return json({ error: "Complete My Story enrollment first." }, 409);
  if (documentIds.length) {
    const owned = await db
      .select({ id: documents.id, scanStatus: documents.scanStatus })
      .from(documents)
      .where(eq(documents.participantId, participant.id));
    const allowed = new Set(
      owned
        .filter((item) => item.scanStatus === "baseline_security_check_passed")
        .map((item) => item.id),
    );
    if (documentIds.some((id) => !allowed.has(id)))
      return json({ error: "A selected document is unavailable or blocked." }, 422);
  }
  await db
    .insert(organizations)
    .values({
      id: RECIPIENT_ID,
      name: "Bay Community Alliance",
      type: "service_provider",
    })
    .onConflictDoNothing();
  const grantId = `cgr_${crypto.randomUUID()}`;
  const expiresAt = new Date(Date.now() + days * 86400000).toISOString();
  await db.insert(consentGrants).values({
    id: grantId,
    participantId: participant.id,
    recipientOrganizationId: RECIPIENT_ID,
    purpose: "Housing stabilization screening and coordination",
    fieldsJson: JSON.stringify(fields),
    documentIdsJson: JSON.stringify(documentIds),
    status: "active",
    expiresAt,
  });
  const receiptId = await receipt(
    db,
    userId,
    grantId,
    "consent.granted",
    "active",
    `Resident authorized ${fields.length} fields and ${documentIds.length} documents for housing stabilization until ${expiresAt}.`,
  );
  return json({ grantId, receiptId, expiresAt, status: "active" }, 201);
}

export async function DELETE(request: Request) {
  const auth = await getChatGPTUser();
  if (!auth) return json({ error: "Sign in required." }, 401);
  const grantId = new URL(request.url).searchParams.get("id");
  if (!grantId) return json({ error: "Consent grant ID is required." }, 400);
  const { db, userId, participant } = await contextFor(auth.email);
  if (!participant) return json({ error: "Consent grant not found." }, 404);
  const [grant] = await db
    .select()
    .from(consentGrants)
    .where(
      and(
        eq(consentGrants.id, grantId),
        eq(consentGrants.participantId, participant.id),
      ),
    )
    .limit(1);
  if (!grant) return json({ error: "Consent grant not found." }, 404);
  const revokedAt = new Date().toISOString();
  await db
    .update(consentGrants)
    .set({ status: "revoked", revokedAt, updatedAt: revokedAt })
    .where(eq(consentGrants.id, grantId));
  const receiptId = await receipt(
    db,
    userId,
    grantId,
    "consent.revoked",
    "revoked",
    `Resident revoked consent grant ${grantId}. Future access is blocked.`,
  );
  return json({ revoked: true, receiptId, revokedAt });
}
