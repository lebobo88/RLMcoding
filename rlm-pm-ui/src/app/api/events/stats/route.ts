import { NextRequest, NextResponse } from "next/server";
import { getEventStats, getRecentSessions } from "@/lib/db/events";

// GET /api/events/stats - Get aggregated event statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("project_id") || undefined;

    const [stats, recentSessions] = await Promise.all([
      getEventStats(projectId),
      getRecentSessions(10),
    ]);

    return NextResponse.json({
      stats: {
        totalEvents: stats?.totalEvents || 0,
        uniqueSessions: stats?.uniqueSessions || 0,
        uniqueAgents: stats?.uniqueAgents || 0,
        totalTokensEstimated: stats?.totalTokensEstimated || 0,
        avgDurationMs: stats?.avgDurationMs || 0,
      },
      recentSessions,
    });
  } catch (error) {
    console.error("Error fetching event stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch event stats" },
      { status: 500 }
    );
  }
}
