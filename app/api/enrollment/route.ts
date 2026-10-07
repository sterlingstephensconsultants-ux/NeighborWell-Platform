import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import {
  actionEvents,
  auditReceipts,
  enrollments,
  participants,
  users,
} from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

type EnrollmentPayload = {
  preferred?: string;
  legal?: string;
  language?: string;
  contact?: string;
  story?: string;
  needs?: string[];
  goals?: string[];
  urgent?: string;
  consent?: boolean;
  accuracy?: boolean;
  status?: "draft" | "completed";
};
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

export async function GET() {
  const auth = await getChatGPTUser();
  if (!auth)
    return json(
      {
        authenticated: false,
        error: "Sign in is required to recover a private enrollment.",
      },
      401,
    );
  const db = await getDb();
  const userId = await identityId(auth.email);
  const [participant] = await db
    .select()
    .from(participants)
    .where(eq(participants.ownerUserId, userId))
    .limit(1);
  if (!participant) return json({ authenticated: true, enrollment: null });
  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.participantId, participant.id))
    .orderBy(desc(enrollments.updatedAt), desc(enrollments.version))
    .limit(1);
  return json({
    authenticated: true,
    participant: {
      preferred: participant.preferredName,
      legal: participant.legalName,
      language: participant.language,
      contact: participant.contactPreference,
    },
    enrollment: enrollment
      ? {
          story: enrollment.story,
          needs: JSON.parse(enrollment.needsJson),
          goals: JSON.parse(enrollment.goalsJson),
          urgent: enrollment.urgentContext,
          status: enrollment.status,
          version: enrollment.version,
        }
      : null,
  });
}

export async function PUT(request: Request) {
  const auth = await getChatGPTUser();
  if (!auth)
    return json(
      {
        authenticated: false,
        error:
          "Sign in is required before NeighborWell stores enrollment information.",
      },
      401,
    );
  const data = (await request.json()) as EnrollmentPayload;
  if (!data.preferred?.trim() || !data.story?.trim())
    return json({ error: "Preferred name and story are required." }, 400);
  if (data.status === "completed" && (!data.consent || !data.accuracy))
    return json(
      { error: "Enrollment consent and accuracy confirmation are required." },
      400,
    );
  const db = await getDb();
  const userId = await identityId(auth.email);
  const participantId = `par_${userId.slice(4)}`;
  await db
    .insert(users)
    .values({
      id: userId,
      email: auth.email.toLowerCase(),
      displayName: auth.displayName,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        displayName: auth.displayName,
        updatedAt: new Date().toISOString(),
      },
    });
  await db
    .insert(participants)
    .values({
      id: participantId,
      ownerUserId: userId,
      preferredName: data.preferred.trim(),
      legalName: data.legal?.trim() || null,
      language: data.language || "English",
      contactPreference: data.contact || "Secure message",
    })
    .onConflictDoUpdate({
      target: participants.id,
      set: {
        preferredName: data.preferred.trim(),
        legalName: data.legal?.trim() || null,
        language: data.language || "English",
        contactPreference: data.contact || "Secure message",
        updatedAt: new Date().toISOString(),
      },
    });
  const [existing] = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.participantId, participantId),
        eq(enrollments.status, "draft"),
      ),
    )
    .orderBy(desc(enrollments.version))
    .limit(1);
  const enrollmentId = existing?.id ?? `enr_${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const values = {
    participantId,
    story: data.story.trim(),
    needsJson: JSON.stringify(data.needs ?? []),
    goalsJson: JSON.stringify(data.goals ?? []),
    urgentContext: data.urgent?.trim() || null,
    status: data.status ?? "draft",
    consentedAt: data.status === "completed" ? now : null,
    updatedAt: now,
  };
  if (existing)
    await db
      .update(enrollments)
      .set(values)
      .where(eq(enrollments.id, existing.id));
  else await db.insert(enrollments).values({ id: enrollmentId, ...values });
  let receiptId: string | null = null;
  if (data.status === "completed") {
    const eventId = `evt_${crypto.randomUUID()}`;
    receiptId = `rcp_${crypto.randomUUID()}`;
    const summary = `Participant completed enrollment version ${existing?.version ?? 1} with explicit record-creation consent.`;
    await db
      .insert(actionEvents)
      .values({
        id: eventId,
        actorUserId: userId,
        subjectType: "enrollment",
        subjectId: enrollmentId,
        action: "enrollment.completed",
        status: "recorded",
        purpose: "self_service",
        payloadJson: JSON.stringify({
          accuracyConfirmed: true,
          sharingAuthorized: false,
        }),
      });
    const receiptHash = await identityId(`${eventId}:${now}:${summary}`);
    await db
      .insert(auditReceipts)
      .values({
        id: receiptId,
        actionEventId: eventId,
        receiptHash,
        policyVersion: "enrollment-1.0",
        summary,
      });
  }
  return json({
    saved: true,
    status: data.status ?? "draft",
    enrollmentId,
    receiptId,
    updatedAt: now,
  });
}
