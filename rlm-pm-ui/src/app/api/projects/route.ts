import { NextRequest, NextResponse } from "next/server";
import { db, projects, NewProject } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync, cpSync, writeFileSync, readdirSync, statSync } from "fs";
import path from "path";

// Get the RLM framework source directory (where the app is running from)
const getRLMSourcePath = () => {
  // In development, we're in rlm-pm-ui, RLM framework is in parent
  // This assumes rlm-pm-ui is inside RLMcoding
  const possiblePaths = [
    path.join(process.cwd(), ".."), // Parent of rlm-pm-ui
    path.join(process.cwd(), "../.."), // Two levels up
    "c:\\AiAppDeployments\\RLMcoding", // Hardcoded fallback for Windows
    "/home/user/RLMcoding", // Linux fallback
  ];

  for (const p of possiblePaths) {
    if (existsSync(path.join(p, "RLM", "prompts")) && existsSync(path.join(p, ".claude", "commands"))) {
      return p;
    }
  }

  return null;
};

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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: { code: "DB_ERROR", message: `Failed to create project: ${errorMessage}` } },
      { status: 500 }
    );
  }
}

// Helper function to copy directory recursively, excluding certain patterns
function copyDirRecursive(src: string, dest: string, excludePatterns: string[] = []) {
  if (!existsSync(src)) return;

  mkdirSync(dest, { recursive: true });

  const entries = readdirSync(src);
  for (const entry of entries) {
    // Skip excluded patterns
    if (excludePatterns.some(pattern => entry.includes(pattern))) continue;

    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);

    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, destPath, excludePatterns);
    } else {
      cpSync(srcPath, destPath);
    }
  }
}

// Helper function to create RLM folder structure and copy framework files
function createRLMStructure(basePath: string) {
  const sourcePath = getRLMSourcePath();

  // Create base directories that might not be copied
  const rlmDirs = [
    "RLM/specs",
    "RLM/specs/features",
    "RLM/specs/architecture",
    "RLM/specs/design",
    "RLM/specs/design/tokens",
    "RLM/specs/epics",
    "RLM/specs/research",
    "RLM/tasks/active",
    "RLM/tasks/completed",
    "RLM/tasks/blocked",
    "RLM/progress/logs",
    "RLM/progress/token-usage",
    "RLM/progress/bundles",
    "RLM/progress/manifests",
    "RLM/progress/events",
    "RLM/research/project",
    "RLM/research/sessions",
  ];

  for (const dir of rlmDirs) {
    const fullPath = path.join(basePath, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  }

  // If we found the RLM source, copy the framework files
  if (sourcePath) {
    console.log(`Copying RLM framework from ${sourcePath} to ${basePath}`);

    // Copy RLM framework directories (prompts, templates, agents, config, docs)
    const rlmDirsToCopy = ["prompts", "templates", "agents", "config", "docs"];
    for (const dir of rlmDirsToCopy) {
      const srcDir = path.join(sourcePath, "RLM", dir);
      const destDir = path.join(basePath, "RLM", dir);
      if (existsSync(srcDir)) {
        copyDirRecursive(srcDir, destDir, [".db", ".db-shm", ".db-wal"]);
      }
    }

    // Copy .claude directory (commands, agents, hooks, scripts)
    const claudeSrcDir = path.join(sourcePath, ".claude");
    const claudeDestDir = path.join(basePath, ".claude");
    if (existsSync(claudeSrcDir)) {
      copyDirRecursive(claudeSrcDir, claudeDestDir, ["settings.local.json"]);
    }

    // Copy CLAUDE.md
    const claudeMdSrc = path.join(sourcePath, "CLAUDE.md");
    const claudeMdDest = path.join(basePath, "CLAUDE.md");
    if (existsSync(claudeMdSrc) && !existsSync(claudeMdDest)) {
      cpSync(claudeMdSrc, claudeMdDest);
    }

    // Copy RLM root files
    const rlmRootFiles = ["START-HERE.md", "README.md"];
    for (const file of rlmRootFiles) {
      const srcFile = path.join(sourcePath, "RLM", file);
      const destFile = path.join(basePath, "RLM", file);
      if (existsSync(srcFile) && !existsSync(destFile)) {
        cpSync(srcFile, destFile);
      }
    }
  } else {
    console.warn("RLM source path not found, creating minimal structure only");
  }

  // Create initial progress tracking files
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
    {
      path: "RLM/progress/cc-config.json",
      content: JSON.stringify(
        {
          parallel: { limit: 10 },
          automation: { level: "auto" },
          reporting: { mode: "both" },
          context_management: {
            auto_checkpoint: { enabled: true },
            smart_truncation: { enabled: true },
          },
        },
        null,
        2
      ),
    },
  ];

  for (const file of initialFiles) {
    const fullPath = path.join(basePath, file.path);
    if (!existsSync(fullPath)) {
      writeFileSync(fullPath, file.content, "utf-8");
    }
  }
}
