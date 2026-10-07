import { and, eq, gt, inArray } from "drizzle-orm";
import { getDb } from "../../../../db";
import {
  consentGrants,
  documents,
  memberships,
  organizations,
  participants,
} from "../../../../db/schema";
import { getChatGPTUser } from "../../../chatgpt-auth";

export const dynamic = "force-dynamic";
const providerRoles = ["navigator", "provider_supervisor"];
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
  if (!auth) return json({ error: "Provider sign-in required." }, 401);
  const db = await getDb();
  const userId = await identityId(auth.email);
  const assignments = await db
    .select({ membership: memberships, organization: organizations })
    .from(memberships)
    .innerJoin(organizations, eq(memberships.organizationId, organizations.id))
    .where(
      and(
        eq(memberships.userId, userId),
        eq(memberships.status, "active"),
        inArray(memberships.role, providerRoles),
      ),
    );
  if (!assignments.length)
    return json(
      { error: "No active provider assignment permits document review." },
      403,
    );
  const organizationIds = assignments.map((item) => item.membership.organizationId);
  const grants = await db
    .select()
    .from(consentGrants)
    .where(
      and(
        inArray(consentGrants.recipientOrganizationId, organizationIds),
        eq(consentGrants.status, "active"),
        gt(consentGrants.expiresAt, new Date().toISOString()),
      ),
    );
  const authorized = grants.flatMap((grant) =>
    (JSON.parse(grant.documentIdsJson) as string[]).map((documentId) => ({
      documentId,
      grant,
    })),
  );
  if (!authorized.length)
    return json({ assignments: assignments.map((x) => x.organization.name), documents: [] });
  const rows = await db
    .select({ document: documents, participant: participants })
    .from(documents)
    .innerJoin(participants, eq(documents.participantId, participants.id))
    .where(inArray(documents.id, authorized.map((item) => item.documentId)));
  return json({
    assignments: assignments.map((x) => x.organization.name),
    documents: rows.flatMap(({ document, participant }) => {
      const authorization = authorized.find((item) => item.documentId === document.id);
      if (!authorization || document.scanStatus !== "baseline_security_check_passed") return [];
      return [{
        id: document.id,
        grantId: authorization.grant.id,
        name: document.name,
        mimeType: document.mimeType,
        sizeBytes: document.sizeBytes,
        participantName: participant.preferredName,
        purpose: authorization.grant.purpose,
        expiresAt: authorization.grant.expiresAt,
      }];
    }),
  });
}
