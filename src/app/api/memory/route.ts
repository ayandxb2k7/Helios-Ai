import { db } from "@/db";
import { projectMemory } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return Response.json({ error: "projectId is required" }, { status: 400 });
  }

  try {
    const memories = await db
      .select()
      .from(projectMemory)
      .where(eq(projectMemory.projectId, projectId))
      .orderBy(projectMemory.createdAt);
    return Response.json(memories);
  } catch {
    return Response.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [memory] = await db
      .insert(projectMemory)
      .values({
        projectId: body.projectId,
        category: body.category,
        title: body.title,
        content: body.content,
        metadata: body.metadata || {},
        pinned: body.pinned || false,
      })
      .returning();
    return Response.json(memory, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create memory" }, { status: 500 });
  }
}
