import { NextRequest, NextResponse } from "next/server";
import {
  insertEvent,
  getEvents,
  getEventStats,
  getRecentSessions,
} from "@/lib/db/events";
import type { NewObservabilityEvent } from "@/lib/db/schema";
import { broadcastEvent } from "@/lib/websocket-server";

// POST /api/events - Receive events from hooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.id || !body.timestamp || !body.event_type) {
      return NextResponse.json(
        { error: "Missing required fields: id, timestamp, event_type" },
        { status: 400 }
      );
    }

    // Map incoming event to database schema
    const event: NewObservabilityEvent = {
      id: body.id,
      timestamp: body.timestamp,
      sessionId: body.session_id || null,
      agentId: body.agent_id || null,
      projectId: body.project_id || null,
      eventType: body.event_type,
      toolName: body.tool_name || null,
      summary: body.summary || null,
      detailsJson: body.details_json || null,
      tokensEstimated: body.tokens_estimated || 0,
      durationMs: body.duration_ms || 0,
      color: body.color || null,
    };

    // Insert into database
    const inserted = await insertEvent(event);

    // Broadcast to WebSocket clients
    try {
      broadcastEvent(inserted);
    } catch {
      // WebSocket may not be available, continue anyway
    }

    return NextResponse.json({ success: true, id: inserted.id });
  } catch (error) {
    console.error("Error inserting event:", error);
    return NextResponse.json(
      { error: "Failed to insert event" },
      { status: 500 }
    );
  }
}

// GET /api/events - Query events with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const sessionId = searchParams.get("session_id") || undefined;
    const projectId = searchParams.get("project_id") || undefined;
    const eventType = searchParams.get("event_type") || undefined;
    const agentId = searchParams.get("agent_id") || undefined;
    const startTime = searchParams.get("start_time") || undefined;
    const endTime = searchParams.get("end_time") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 100;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : 0;

    const events = await getEvents({
      sessionId,
      projectId,
      eventType,
      agentId,
      startTime,
      endTime,
      limit,
      offset,
    });

    return NextResponse.json({ events, count: events.length });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
