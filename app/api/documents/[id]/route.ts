import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { documents, participants, users } from "../../../../db/schema";
import { authorize } from "../../../../lib/security/authorization";
import { recordAuthorizationDecision } from "../../../../lib/security/audit";
import { stableIdentityId } from "../../../../lib/security/identity";
import { getChatGPTUser } from "../../../chatgpt-auth";

export const dynamic = "force-dynamic";
const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getChatGPTUser();
  if (!auth) return json({ error: "Sign in required." }, 401);
  const { id } = await context.params;
  const db = await getDb();
  const userId = await stableIdentityId(auth.email);
  const [account] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const [record] = await db
    .select({ document: documents, participant: participants })
    .from(documents)
    .innerJoin(participants, eq(documents.participantId, participants.id))
    .where(eq(documents.id, id))
    .limit(1);
  if (!record) return json({ error: "Document not found." }, 404);

  const decision = authorize({
    actor: { userId, role: "participant", accountStatus: account?.status ?? "inactive" },
    action: "participant.document.read.own",
    purpose: "self_service",
    resource: {
      id: record.document.id,
      type: "document",
      ownerUserId: record.participant.ownerUserId,
      participantId: record.participant.id,
      status: record.document.status,
      securityStatus: record.document.scanStatus,
    },
  });
  await recordAuthorizationDecision({
    db,
    actorUserId: userId,
    resourceType: "document",
    resourceId: record.document.id,
    action: "participant.document.read.own",
    purpose: "self_service",
    decision,
  });
  if (!decision.allowed)
    return json({ error: "Document access is denied.", decisionCode: decision.code }, 403);

  const { env } = await import("cloudflare:workers");
  const object = await (env as unknown as { DOCUMENTS: R2Bucket }).DOCUMENTS.get(record.document.storageKey);
  if (!object) return json({ error: "Stored document is unavailable." }, 404);
  const safeName = record.document.name.replace(/[\r\n"\\]/g, "_");
  return new Response(object.body, { headers: {
    "Cache-Control": "private, no-store, max-age=0",
    "Content-Disposition": `attachment; filename="${safeName}"`,
    "Content-Length": String(record.document.sizeBytes),
    "Content-Type": record.document.mimeType,
    "X-Content-Type-Options": "nosniff",
  }});
}
