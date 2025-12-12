import { NextRequest, NextResponse } from "next/server";
import { db, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

// POST /api/projects/[id]/execute - Trigger phase execution
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { phase } = body;

    if (!phase) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Phase is required" } },
        { status: 400 }
      );
    }

    // Get project from database
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .get();

    if (!project) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Project not found" } },
        { status: 404 }
      );
    }

    // Create trigger file for the phase
    const triggerDir = path.join(project.localPath, ".rlm-triggers");
    if (!fs.existsSync(triggerDir)) {
      fs.mkdirSync(triggerDir, { recursive: true });
    }

    const triggerFile = path.join(triggerDir, `${phase}.json`);
    const triggerData = {
      phase,
      status: "pending",
      triggeredAt: new Date().toISOString(),
      projectId: id,
    };

    fs.writeFileSync(triggerFile, JSON.stringify(triggerData, null, 2));

    // Update project's current phase
    await db
      .update(projects)
      .set({
        currentPhase: phase,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id));

    return NextResponse.json({
      data: {
        message: `Phase ${phase} triggered`,
        triggerFile,
        phase,
      },
    });
  } catch (error) {
    console.error("Error triggering phase:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to trigger phase" } },
      { status: 500 }
    );
  }
}
