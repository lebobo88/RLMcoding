import { NextRequest, NextResponse } from "next/server";
import { db, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import { existsSync, mkdirSync, cpSync, readdirSync, statSync } from "fs";
import path from "path";

// Get the RLM framework source directory
const getRLMSourcePath = () => {
  const possiblePaths = [
    path.join(process.cwd(), ".."),
    path.join(process.cwd(), "../.."),
    "c:\\AiAppDeployments\\RLMcoding",
    "/home/user/RLMcoding",
  ];

  for (const p of possiblePaths) {
    if (existsSync(path.join(p, "RLM", "prompts")) && existsSync(path.join(p, ".claude", "commands"))) {
      return p;
    }
  }

  return null;
};

// Copy directory recursively
function copyDirRecursive(src: string, dest: string, excludePatterns: string[] = [], overwrite = false) {
  if (!existsSync(src)) return { copied: 0, skipped: 0 };

  mkdirSync(dest, { recursive: true });

  let copied = 0;
  let skipped = 0;

  const entries = readdirSync(src);
  for (const entry of entries) {
    if (excludePatterns.some(pattern => entry.includes(pattern))) continue;

    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);

    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      const result = copyDirRecursive(srcPath, destPath, excludePatterns, overwrite);
      copied += result.copied;
      skipped += result.skipped;
    } else {
      if (!existsSync(destPath) || overwrite) {
        cpSync(srcPath, destPath);
        copied++;
      } else {
        skipped++;
      }
    }
  }

  return { copied, skipped };
}

// POST /api/projects/[id]/sync-framework - Sync RLM framework files to project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const overwrite = body.overwrite === true;

    // Get project
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

    const basePath = project.localPath;
    const sourcePath = getRLMSourcePath();

    if (!sourcePath) {
      return NextResponse.json(
        { error: { code: "SOURCE_NOT_FOUND", message: "RLM framework source not found" } },
        { status: 500 }
      );
    }

    if (!existsSync(basePath)) {
      return NextResponse.json(
        { error: { code: "PROJECT_PATH_NOT_FOUND", message: "Project directory does not exist" } },
        { status: 400 }
      );
    }

    console.log(`Syncing RLM framework from ${sourcePath} to ${basePath} (overwrite: ${overwrite})`);

    const results = {
      copied: 0,
      skipped: 0,
      directories: [] as string[],
    };

    // Create base directories
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

    // Copy RLM framework directories
    const rlmDirsToCopy = ["prompts", "templates", "agents", "config", "docs"];
    for (const dir of rlmDirsToCopy) {
      const srcDir = path.join(sourcePath, "RLM", dir);
      const destDir = path.join(basePath, "RLM", dir);
      if (existsSync(srcDir)) {
        const result = copyDirRecursive(srcDir, destDir, [".db", ".db-shm", ".db-wal"], overwrite);
        results.copied += result.copied;
        results.skipped += result.skipped;
        results.directories.push(`RLM/${dir}`);
      }
    }

    // Copy .claude directory
    const claudeSrcDir = path.join(sourcePath, ".claude");
    const claudeDestDir = path.join(basePath, ".claude");
    if (existsSync(claudeSrcDir)) {
      const result = copyDirRecursive(claudeSrcDir, claudeDestDir, ["settings.local.json"], overwrite);
      results.copied += result.copied;
      results.skipped += result.skipped;
      results.directories.push(".claude");
    }

    // Copy CLAUDE.md
    const claudeMdSrc = path.join(sourcePath, "CLAUDE.md");
    const claudeMdDest = path.join(basePath, "CLAUDE.md");
    if (existsSync(claudeMdSrc)) {
      if (!existsSync(claudeMdDest) || overwrite) {
        cpSync(claudeMdSrc, claudeMdDest);
        results.copied++;
      } else {
        results.skipped++;
      }
    }

    // Copy RLM root files
    const rlmRootFiles = ["START-HERE.md", "README.md"];
    for (const file of rlmRootFiles) {
      const srcFile = path.join(sourcePath, "RLM", file);
      const destFile = path.join(basePath, "RLM", file);
      if (existsSync(srcFile)) {
        if (!existsSync(destFile) || overwrite) {
          cpSync(srcFile, destFile);
          results.copied++;
        } else {
          results.skipped++;
        }
      }
    }

    return NextResponse.json({
      data: {
        message: `Framework sync complete`,
        copied: results.copied,
        skipped: results.skipped,
        directories: results.directories,
        overwrite,
      }
    });
  } catch (error) {
    console.error("Error syncing framework:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: { code: "SYNC_ERROR", message: `Failed to sync framework: ${errorMessage}` } },
      { status: 500 }
    );
  }
}
