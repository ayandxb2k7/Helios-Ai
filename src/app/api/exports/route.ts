import { db } from "@/db";
import { projectExports } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return Response.json({ error: "projectId is required" }, { status: 400 });
  }

  try {
    const exports = await db
      .select()
      .from(projectExports)
      .where(eq(projectExports.projectId, projectId))
      .orderBy(projectExports.createdAt);
    return Response.json(exports);
  } catch {
    return Response.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [exportRecord] = await db
      .insert(projectExports)
      .values({
        projectId: body.projectId,
        type: body.type,
        format: body.format,
        content: body.content,
      })
      .returning();
    return Response.json(exportRecord, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create export" }, { status: 500 });
  }
}
