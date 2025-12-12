import { NextRequest, NextResponse } from "next/server";
import { db, projects, syncEvents } from "@/lib/db";
import { eq } from "drizzle-orm";
import simpleGit from "simple-git";

// POST /api/projects/[id]/github/push - Push to GitHub
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
      // Initialize repo if not exists
      await git.init();
    }

    // Get status
    const status = await git.status();

    // Add all changes
    const allFiles = [
      ...status.not_added,
      ...status.modified,
      ...status.deleted,
    ];

    if (allFiles.length > 0) {
      await git.add(".");

      // Commit
      const commitMessage = `RLM PM UI sync - ${new Date().toISOString()}`;
      await git.commit(commitMessage);
    }

    // Push
    const branch = project.githubBranch || "main";

    // Check if remote exists
    const remotes = await git.getRemotes();
    const hasOrigin = remotes.some((r) => r.name === "origin");

    if (!hasOrigin) {
      // Add remote
      await git.addRemote("origin", `https://github.com/${project.githubRepo}.git`);
    }

    // Push
    await git.push("origin", branch, ["--set-upstream"]);

    // Get commit SHA
    const log = await git.log({ maxCount: 1 });
    const commitSha = log.latest?.hash || "";

    // Record sync event
    await db.insert(syncEvents).values({
      projectId: id,
      direction: "push",
      filesChanged: JSON.stringify(allFiles),
      commitSha,
      timestamp: new Date(),
    });

    return NextResponse.json({
      data: {
        message: "Push successful",
        filesChanged: allFiles.length,
        commitSha,
      },
    });
  } catch (error) {
    console.error("Error pushing to GitHub:", error);
    return NextResponse.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to push to GitHub",
        },
      },
      { status: 500 }
    );
  }
}
