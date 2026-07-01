import { db } from "@/db";
import { projects } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allProjects = await db.select().from(projects);
    return Response.json(allProjects);
  } catch {
    return Response.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [project] = await db
      .insert(projects)
      .values({
        name: body.name,
        description: body.description,
        repoUrl: body.repoUrl,
        techStack: body.techStack || [],
        status: "scanning",
      })
      .returning();
    return Response.json(project, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create project" }, { status: 500 });
  }
}
