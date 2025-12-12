import { NextRequest, NextResponse } from "next/server";
import { db, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import { readProjectData } from "@/lib/parser";
import {
  analyzeProjectPhases,
  generateComprehensiveSummary,
} from "@/lib/phase-analyzer";

// POST /api/projects/[id]/refresh - Re-analyze project and update checkpoint
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const rlmPath = path.join(project.localPath, "RLM");

    // Verify RLM folder still exists
    if (!fs.existsSync(rlmPath)) {
      return NextResponse.json(
        { error: { code: "INVALID_PROJECT", message: "RLM folder not found" } },
        { status: 400 }
      );
    }

    // Read all project data using the parser
    const projectData = readProjectData(project.localPath);

    // Analyze project state and detect current phase using shared analyzer
    const phaseAnalysis = analyzeProjectPhases(projectData);
    const currentPhase = phaseAnalysis.currentPhase;

    // Generate comprehensive summary using shared function
    const summary = generateComprehensiveSummary(projectData);

    // Update checkpoint.json with fresh analysis
    const checkpointPath = path.join(rlmPath, "progress", "checkpoint.json");
    const progressDir = path.join(rlmPath, "progress");

    if (!fs.existsSync(progressDir)) {
      fs.mkdirSync(progressDir, { recursive: true });
    }

    const checkpoint = {
      currentPhase,
      phases: phaseAnalysis.phases,
      lastRefreshed: new Date().toISOString(),
      summary,
    };

    fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2));

    // Update project's currentPhase in database if it changed
    if (project.currentPhase !== currentPhase) {
      await db
        .update(projects)
        .set({ currentPhase, updatedAt: new Date() })
        .where(eq(projects.id, id));
    }

    return NextResponse.json({
      data: {
        currentPhase,
        previousPhase: project.currentPhase,
        phaseChanged: project.currentPhase !== currentPhase,
        summary,
        phases: phaseAnalysis.phases,
        refreshedAt: checkpoint.lastRefreshed,
      },
    });
  } catch (error) {
    console.error("Error refreshing project:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to refresh project" } },
      { status: 500 }
    );
  }
}
