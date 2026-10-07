import { sql } from "drizzle-orm";
import { getDb } from "../../../../db";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const db = await getDb();
    await db.run(sql`select 1`);
    return Response.json({
      status: "ready",
      database: "connected",
      externalActions: "draft_only",
    });
  } catch (error) {
    return Response.json(
      {
        status: "setup_required",
        database: "unavailable",
        externalActions: "draft_only",
        detail:
          error instanceof Error ? error.message : "Unexpected database error",
      },
      { status: 503 },
    );
  }
}
