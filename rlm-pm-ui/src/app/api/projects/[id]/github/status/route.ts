import { NextRequest, NextResponse } from "next/server";
import { db, projects, syncEvents } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import simpleGit from "simple-git";

// GET /api/projects/[id]/github/status - Get git status
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

    // Get sync events
    const events = await db
      .select()
      .from(syncEvents)
      .where(eq(syncEvents.projectId, id))
      .orderBy(desc(syncEvents.timestamp))
      .limit(20)
      .all();

    // Initialize git
    const git = simpleGit(project.localPath);

    // Check if it's a git repo
    const isRepo = await git.checkIsRepo();

    if (!isRepo) {
      return NextResponse.json({
        data: {
          status: null,
          events: events.map((e) => ({
            ...e,
            filesChanged: e.filesChanged ? JSON.parse(e.filesChanged) : [],
          })),
          message: "Not a git repository",
        },
      });
    }

    // Get status
    const status = await git.status();

    // Get last commit
    let lastCommit = null;
    try {
      const log = await git.log({ maxCount: 1 });
      if (log.latest) {
        lastCommit = {
          sha: log.latest.hash,
          message: log.latest.message,
          author: log.latest.author_name,
          date: log.latest.date,
        };
      }
    } catch {
      // No commits yet
    }

    return NextResponse.json({
      data: {
        status: {
          branch: status.current || "main",
          ahead: status.ahead,
          behind: status.behind,
          staged: status.staged.length,
          modified: status.modified.length,
          untracked: status.not_added.length,
          lastCommit,
        },
        events: events.map((e) => ({
          ...e,
          filesChanged: e.filesChanged ? JSON.parse(e.filesChanged) : [],
        })),
      },
    });
  } catch (error) {
    console.error("Error getting git status:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to get git status" } },
      { status: 500 }
    );
  }
}
