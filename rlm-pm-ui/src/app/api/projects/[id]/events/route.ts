import { NextRequest } from "next/server";
import { db, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import { fileWatcher, FileChangeEvent } from "@/lib/watcher";

// GET /api/projects/[id]/events - SSE endpoint for real-time updates
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Get project from database
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .get();

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  // Start watching if not already
  if (!fileWatcher.isWatching(id)) {
    fileWatcher.watchProject(id, project.localPath);
  }

  // Create SSE stream
  const encoder = new TextEncoder();
  let isConnected = true;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connected message
      const message = `data: ${JSON.stringify({ type: "connected", projectId: id })}\n\n`;
      controller.enqueue(encoder.encode(message));

      // Listen for file changes
      const handleChange = (event: FileChangeEvent) => {
        if (!isConnected) return;
        if (event.projectId !== id) return;

        try {
          const message = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(message));
        } catch (err) {
          console.error("Error sending SSE message:", err);
        }
      };

      fileWatcher.on("change", handleChange);

      // Send heartbeat every 30 seconds to keep connection alive
      const heartbeatInterval = setInterval(() => {
        if (!isConnected) {
          clearInterval(heartbeatInterval);
          return;
        }
        try {
          const heartbeat = `data: ${JSON.stringify({ type: "heartbeat", timestamp: new Date().toISOString() })}\n\n`;
          controller.enqueue(encoder.encode(heartbeat));
        } catch {
          clearInterval(heartbeatInterval);
        }
      }, 30000);

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        isConnected = false;
        fileWatcher.removeListener("change", handleChange);
        clearInterval(heartbeatInterval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
