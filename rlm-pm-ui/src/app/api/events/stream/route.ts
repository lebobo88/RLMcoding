import { NextRequest } from "next/server";
import {
  generateClientId,
  registerClient,
  unregisterClient,
  startHeartbeat,
} from "@/lib/websocket-server";

// Start heartbeat when module loads
startHeartbeat(30000);

// GET /api/events/stream - Server-Sent Events stream for real-time updates
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("project_id") || undefined;
  const sessionId = searchParams.get("session_id") || undefined;

  const clientId = generateClientId();

  const stream = new ReadableStream({
    start(controller) {
      // Register client with filters
      registerClient(clientId, controller, { projectId, sessionId });

      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "connected", clientId })}\n\n`
        )
      );
    },
    cancel() {
      // Clean up when client disconnects
      unregisterClient(clientId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
