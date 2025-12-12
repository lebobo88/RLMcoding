import { NextRequest, NextResponse } from "next/server";
import { db, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { readProjectData } from "@/lib/parser";
import {
  analyzeProjectPhases,
  generateComprehensiveSummary,
  PHASES,
} from "@/lib/phase-analyzer";

// POST /api/projects/import - Import an existing RLM project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { localPath, name, githubRepo, githubBranch } = body;

    if (!localPath) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Local path is required" } },
        { status: 400 }
      );
    }

    // Normalize path
    const normalizedPath = path.normalize(localPath);

    // Check if path exists
    if (!fs.existsSync(normalizedPath)) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Path does not exist" } },
        { status: 404 }
      );
    }

    // Check if it's an RLM project (has RLM folder)
    const rlmPath = path.join(normalizedPath, "RLM");
    if (!fs.existsSync(rlmPath)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PROJECT",
            message: "No RLM folder found. This doesn't appear to be an RLM project.",
          },
        },
        { status: 400 }
      );
    }

    // Check if project already exists with this path
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.localPath, normalizedPath))
      .get();

    if (existing) {
      return NextResponse.json(
        {
          error: {
            code: "DUPLICATE",
            message: "A project with this path already exists",
          },
        },
        { status: 409 }
      );
    }

    // Read all project data using the parser
    const projectData = readProjectData(normalizedPath);

    // Detect project name from PRD or folder name
    let projectName = name;
    if (!projectName && projectData.prd) {
      const titleMatch = projectData.prd.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        projectName = titleMatch[1].trim();
      }
    }
    if (!projectName) {
      projectName = path.basename(normalizedPath);
    }

    // Analyze project state and detect current phase using shared analyzer
    const phaseAnalysis = analyzeProjectPhases(projectData);
    let currentPhase = phaseAnalysis.currentPhase;

    // Generate comprehensive summary
    const summary = generateComprehensiveSummary(projectData);

    // Create or update checkpoint.json with detected state
    const checkpointPath = path.join(rlmPath, "progress", "checkpoint.json");
    const progressDir = path.join(rlmPath, "progress");

    if (!fs.existsSync(progressDir)) {
      fs.mkdirSync(progressDir, { recursive: true });
    }

    // Check existing checkpoint for explicit current phase
    if (fs.existsSync(checkpointPath)) {
      try {
        const existingCheckpoint = JSON.parse(
          fs.readFileSync(checkpointPath, "utf-8")
        );
        if (
          existingCheckpoint.currentPhase &&
          PHASES.includes(existingCheckpoint.currentPhase)
        ) {
          // Use checkpoint phase if it's further along
          const checkpointIndex = PHASES.indexOf(existingCheckpoint.currentPhase);
          const detectedIndex = PHASES.indexOf(currentPhase as typeof PHASES[number]);
          if (checkpointIndex > detectedIndex) {
            currentPhase = existingCheckpoint.currentPhase;
          }
        }
      } catch {
        // Ignore parse errors
      }
    }

    const checkpoint = {
      currentPhase,
      phases: phaseAnalysis.phases,
      importedAt: new Date().toISOString(),
      summary,
    };

    fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2));

    // Create project record
    const id = uuidv4();
    await db.insert(projects).values({
      id,
      name: projectName,
      localPath: normalizedPath,
      githubRepo: githubRepo || null,
      githubBranch: githubBranch || "main",
      status: "active",
      currentPhase,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Get the created project with full data
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .get();

    return NextResponse.json({
      data: {
        ...project,
        // Include comprehensive summary for immediate UI update
        summary,
        phases: phaseAnalysis.phases,
        // Include key counts for notifications
        featureCount: summary.totalFeatures,
        taskCount: summary.totalTasks,
        hasSpecs: projectData.features.length > 0,
        hasPRD: summary.hasPRD,
        hasConstitution: summary.hasConstitution,
        // Additional comprehensive info
        hasDesignSystem: summary.hasDesignSystem,
        hasArchitecture: summary.hasArchitecture,
        researchSessions: summary.researchSessions,
        hasE2ETests: summary.hasE2ETests,
      },
    });
  } catch (error) {
    console.error("Error importing project:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to import project" } },
      { status: 500 }
    );
  }
}
