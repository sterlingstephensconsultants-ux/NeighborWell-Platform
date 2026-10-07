import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import {
  actionEvents,
  auditReceipts,
  documents,
  participants,
} from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["application/pdf", "image/jpeg", "image/png"]);
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
async function identityId(email: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(email.trim().toLowerCase()),
  );
  return `usr_${Array.from(new Uint8Array(bytes))
    .slice(0, 16)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;
}
async function ownedParticipant(email: string) {
  const db = await getDb();
  const userId = await identityId(email);
  const [participant] = await db
    .select()
    .from(participants)
    .where(eq(participants.ownerUserId, userId))
    .limit(1);
  return { db, userId, participant };
}
function validSignature(type: string, bytes: Uint8Array) {
  if (type === "application/pdf")
    return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  if (type === "image/png")
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  if (type === "image/jpeg")
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  return false;
}

function baselineSecurityCheck(type: string, bytes: Uint8Array) {
  const sample = new TextDecoder("latin1").decode(bytes);
  if (sample.includes("EICAR-STANDARD-ANTIVIRUS-TEST-FILE"))
    return { safe: false, reason: "Known antivirus test signature detected." };
  if (
    type === "application/pdf" &&
    ["/JavaScript", "/JS", "/Launch", "/EmbeddedFile"].some((token) =>
      sample.includes(token),
    )
  )
    return {
      safe: false,
      reason: "Active or embedded PDF content is not accepted.",
    };
  return { safe: true, reason: "Signature and active-content checks passed." };
}

export async function GET() {
  const auth = await getChatGPTUser();
  if (!auth) return json({ error: "Sign in required." }, 401);
  const { db, participant } = await ownedParticipant(auth.email);
  if (!participant) return json({ documents: [] });
  const rows = await db
    .select({
      id: documents.id,
      name: documents.name,
      mimeType: documents.mimeType,
      sizeBytes: documents.sizeBytes,
      scanStatus: documents.scanStatus,
      status: documents.status,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(eq(documents.participantId, participant.id))
    .orderBy(desc(documents.createdAt));
  return json({ documents: rows });
}

export async function POST(request: Request) {
  const auth = await getChatGPTUser();
  if (!auth)
    return json({ error: "Sign in required before uploading documents." }, 401);
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return json({ error: "A document file is required." }, 400);
  if (!ALLOWED.has(file.type))
    return json({ error: "Only PDF, JPEG, and PNG files are accepted." }, 415);
  if (file.size <= 0 || file.size > MAX_BYTES)
    return json({ error: "The file must be between 1 byte and 10 MB." }, 413);
  const content = new Uint8Array(await file.arrayBuffer());
  if (!validSignature(file.type, content))
    return json(
      { error: "The file contents do not match the declared file type." },
      415,
    );
  const securityCheck = baselineSecurityCheck(file.type, content);
  if (!securityCheck.safe)
    return json({ error: securityCheck.reason }, 422);
  const { db, userId, participant } = await ownedParticipant(auth.email);
  if (!participant)
    return json(
      { error: "Complete My Story enrollment before adding documents." },
      409,
    );
  const documentId = `doc_${crypto.randomUUID()}`;
  const storageKey = `participants/${participant.id}/${documentId}`;
  const { env } = await import("cloudflare:workers");
  const bucket = (env as unknown as { DOCUMENTS: R2Bucket }).DOCUMENTS;
  if (!bucket)
    return json({ error: "Private document storage is not configured." }, 503);
  await bucket.put(storageKey, content, {
    httpMetadata: { contentType: file.type },
    customMetadata: {
      documentId,
      participantId: participant.id,
      originalName: file.name,
    },
  });
  await db
    .insert(documents)
    .values({
      id: documentId,
      participantId: participant.id,
      storageKey,
      name: file.name.slice(0, 180),
      mimeType: file.type,
      sizeBytes: file.size,
      scanStatus: "baseline_security_check_passed",
      status: "private",
    });
  const eventId = `evt_${crypto.randomUUID()}`;
  const receiptId = `rcp_${crypto.randomUUID()}`;
  const createdAt = new Date().toISOString();
  const summary = `Private document ${documentId} uploaded after baseline security checks passed.`;
  await db
    .insert(actionEvents)
    .values({
      id: eventId,
      actorUserId: userId,
      subjectType: "document",
      subjectId: documentId,
      action: "document.uploaded",
      status: "stored_private",
      purpose: "self_service",
      payloadJson: JSON.stringify({
        mimeType: file.type,
        sizeBytes: file.size,
        baselineCheck: securityCheck.reason,
        sharingAuthorized: false,
      }),
    });
  const receiptHash = await identityId(`${eventId}:${createdAt}:${summary}`);
  await db
    .insert(auditReceipts)
    .values({
      id: receiptId,
      actionEventId: eventId,
      receiptHash,
      policyVersion: "document-1.0",
      summary,
    });
  return json(
    {
      document: {
        id: documentId,
        name: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        scanStatus: "baseline_security_check_passed",
        status: "private",
        createdAt,
      },
      receiptId,
    },
    201,
  );
}
