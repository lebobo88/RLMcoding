import { NextRequest, NextResponse } from "next/server";
import { db, projects, syncEvents } from "@/lib/db";
import { eq } from "drizzle-orm";
import simpleGit from "simple-git";

// POST /api/projects/[id]/github/pull - Pull from GitHub
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

    if (!project.githubRepo) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "No GitHub repository configured" } },
        { status: 400 }
      );
    }

    // Initialize git
    const git = simpleGit(project.localPath);

    // Check if it's a git repo
    const isRepo = await git.checkIsRepo();

    if (!isRepo) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Not a git repository" } },
        { status: 400 }
      );
    }

    const branch = project.githubBranch || "main";

    // Fetch first
    await git.fetch("origin", branch);

    // Get status before pull
    const statusBefore = await git.status();

    // Pull
    const pullResult = await git.pull("origin", branch);

    // Get commit SHA
    const log = await git.log({ maxCount: 1 });
    const commitSha = log.latest?.hash || "";

    // Record sync event
    const filesChanged = pullResult.files || [];
    await db.insert(syncEvents).values({
      projectId: id,
      direction: "pull",
      filesChanged: JSON.stringify(filesChanged),
      commitSha,
      timestamp: new Date(),
    });

    return NextResponse.json({
      data: {
        message: "Pull successful",
        filesChanged: filesChanged.length,
        commitSha,
        summary: pullResult.summary,
      },
    });
  } catch (error) {
    console.error("Error pulling from GitHub:", error);
    return NextResponse.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to pull from GitHub",
        },
      },
      { status: 500 }
    );
  }
}
