import { NextRequest, NextResponse } from "next/server";
import { db, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import { readProjectData } from "@/lib/parser";
import * as fs from "fs";
import * as path from "path";

interface PhaseInfo {
  phase: string;
  completed: boolean;
  inProgress: boolean;
  artifacts: string[];
}

// GET /api/projects/[id]/data - Get project RLM data (tasks, features, etc.)
export async function GET(
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

    // Read project data from local files
    const projectData = readProjectData(project.localPath);

    // Read checkpoint data if it exists
    let phases: PhaseInfo[] = [];
    let checkpointSummary = null;
    const checkpointPath = path.join(project.localPath, "RLM", "progress", "checkpoint.json");
    if (fs.existsSync(checkpointPath)) {
      try {
        const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, "utf-8"));
        phases = checkpoint.phases || [];
        checkpointSummary = checkpoint.summary;
      } catch {
        // Ignore parse errors
      }
    }

    // Calculate summary statistics
    const allTasks = [
      ...projectData.tasks.active,
      ...projectData.tasks.completed,
      ...projectData.tasks.blocked,
    ];
    const totalTasks = allTasks.length;

    // Calculate completed tasks from multiple sources:
    // 1. Tasks physically in completed/ folder
    // 2. Tasks with status "completed" in active/ folder
    // 3. When all features are verified in status.json
    let completedTasks = projectData.tasks.completed.length;

    // Add tasks with "completed" status in active folder
    const completedInActive = projectData.tasks.active.filter(
      (t) => t.status === "completed"
    ).length;
    completedTasks += completedInActive;

    // Check if all features are verified in progress/status.json
    const progressFeatures = projectData.progress?.features || {};
    const verifiedFeatureCount = Object.values(progressFeatures).filter(
      (f) => f.status === "verified" || f.status === "complete" || f.status === "completed"
    ).length;
    const totalFeaturesInProgress = Object.keys(progressFeatures).length;

    // Also check overallStatus and summary from newer status.json format
    const overallStatusVerified = projectData.progress?.overallStatus === "verified";
    const summaryComplete = projectData.progress?.summary &&
      projectData.progress.summary.total &&
      projectData.progress.summary.verified === projectData.progress.summary.total;

    const allFeaturesVerified =
      overallStatusVerified ||
      summaryComplete ||
      (totalFeaturesInProgress > 0 && verifiedFeatureCount === totalFeaturesInProgress);

    // If all features are verified, all tasks are complete
    if (allFeaturesVerified && totalTasks > 0) {
      completedTasks = totalTasks;
    }

    const activeTasks = allFeaturesVerified ? 0 : projectData.tasks.active.length - completedInActive;

    // Build base summary
    const baseSummary = {
      totalFeatures: projectData.features.length,
      totalTasks,
      activeTasks,
      completedTasks,
      blockedTasks: projectData.tasks.blocked.length,
      hasPRD: !!projectData.prd,
      hasConstitution: !!projectData.constitution,
      totalTokensUsed: projectData.tokenUsage.reduce(
        (sum, t) => sum + t.totalTokens,
        0
      ),
    };

    // Merge with checkpoint summary, but always use our calculated task counts
    const summary = {
      ...baseSummary,
      ...(checkpointSummary || {}),
      // Always override with our accurate calculations
      activeTasks,
      completedTasks,
      totalTasks,
    };

    return NextResponse.json({
      data: {
        ...projectData,
        summary,
        phases,
      },
    });
  } catch (error) {
    console.error("Error fetching project data:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to fetch project data" } },
      { status: 500 }
    );
  }
}
