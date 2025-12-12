import { NextRequest, NextResponse } from "next/server";
import { db, projects, NewProject } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync } from "fs";
import path from "path";

// GET /api/projects - List all projects
export async function GET() {
  try {
    const allProjects = await db.select().from(projects).all();
    return NextResponse.json({ data: allProjects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: { code: "DB_ERROR", message: "Failed to fetch projects" } },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, localPath, githubRepo, githubBranch } = body;

    // Validate required fields
    if (!name || !localPath) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Name and local path are required",
            details: [
              ...(!name ? [{ field: "name", message: "Name is required" }] : []),
              ...(!localPath
                ? [{ field: "localPath", message: "Local path is required" }]
                : []),
            ],
          },
        },
        { status: 400 }
      );
    }

    // Check if path already exists in database
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.localPath, localPath))
      .get();

    if (existing) {
      return NextResponse.json(
        {
          error: {
            code: "CONFLICT",
            message: "A project with this path already exists",
          },
        },
        { status: 409 }
      );
    }

    // Create RLM folder structure if it doesn't exist
    const rlmPath = path.join(localPath, "RLM");
    if (!existsSync(rlmPath)) {
      createRLMStructure(localPath);
    }

    // Create project in database
    const newProject: NewProject = {
      id: randomUUID(),
      name,
      localPath,
      githubRepo: githubRepo || null,
      githubBranch: githubBranch || "main",
      status: "active",
      currentPhase: "discover",
    };

    await db.insert(projects).values(newProject);

    // Fetch the created project
    const created = await db
      .select()
      .from(projects)
      .where(eq(projects.id, newProject.id))
      .get();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: { code: "DB_ERROR", message: "Failed to create project" } },
      { status: 500 }
    );
  }
}

// Helper function to create RLM folder structure
function createRLMStructure(basePath: string) {
  const rlmDirs = [
    "RLM",
    "RLM/specs",
    "RLM/specs/features",
    "RLM/specs/architecture",
    "RLM/specs/design",
    "RLM/specs/design/tokens",
    "RLM/specs/epics",
    "RLM/tasks",
    "RLM/tasks/active",
    "RLM/tasks/completed",
    "RLM/tasks/blocked",
    "RLM/progress",
    "RLM/progress/logs",
    "RLM/progress/token-usage",
    "RLM/progress/bundles",
    "RLM/research",
    "RLM/research/project",
    "RLM/research/sessions",
    "RLM/templates",
    "RLM/agents",
    "RLM/prompts",
  ];

  for (const dir of rlmDirs) {
    const fullPath = path.join(basePath, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  }

  // Create initial files
  const initialFiles = [
    {
      path: "RLM/progress/status.json",
      content: JSON.stringify(
        {
          lastUpdate: new Date().toISOString(),
          tasks: {},
          features: {},
          metrics: {
            totalTasks: 0,
            completed: 0,
            inProgress: 0,
            blocked: 0,
            pending: 0,
          },
        },
        null,
        2
      ),
    },
    {
      path: "RLM/progress/checkpoint.json",
      content: JSON.stringify(
        {
          version: "1.0",
          project_id: null,
          checkpoints: [],
          current_generation: 0,
          all_features: [],
          all_tasks: [],
          last_updated: new Date().toISOString(),
        },
        null,
        2
      ),
    },
  ];

  const fs = require("fs");
  for (const file of initialFiles) {
    const fullPath = path.join(basePath, file.path);
    if (!existsSync(fullPath)) {
      fs.writeFileSync(fullPath, file.content, "utf-8");
    }
  }
}
