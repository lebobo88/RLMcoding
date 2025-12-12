import type { ObservabilityEvent } from "./db/schema";

// In-memory store for connected SSE clients
type SSEClient = {
  id: string;
  controller: ReadableStreamDefaultController;
  projectId?: string;
  sessionId?: string;
};

const clients: Map<string, SSEClient> = new Map();

// Generate unique client ID
export function generateClientId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Register a new SSE client
export function registerClient(
  id: string,
  controller: ReadableStreamDefaultController,
  filters?: { projectId?: string; sessionId?: string }
): void {
  clients.set(id, {
    id,
    controller,
    projectId: filters?.projectId,
    sessionId: filters?.sessionId,
  });
  console.log(`[SSE] Client registered: ${id}, total clients: ${clients.size}`);
}

// Unregister a client
export function unregisterClient(id: string): void {
  clients.delete(id);
  console.log(`[SSE] Client unregistered: ${id}, total clients: ${clients.size}`);
}

// Broadcast event to all connected clients
export function broadcastEvent(event: ObservabilityEvent): void {
  const encoder = new TextEncoder();
  const data = JSON.stringify(event);
  const message = `data: ${data}\n\n`;

  clients.forEach((client) => {
    // Apply filters if set
    if (client.projectId && event.projectId !== client.projectId) {
      return;
    }
    if (client.sessionId && event.sessionId !== client.sessionId) {
      return;
    }

    try {
      client.controller.enqueue(encoder.encode(message));
    } catch (error) {
      // Client disconnected, clean up
      console.log(`[SSE] Failed to send to client ${client.id}, removing`);
      unregisterClient(client.id);
    }
  });
}

// Send heartbeat to keep connections alive
export function sendHeartbeat(): void {
  const encoder = new TextEncoder();
  const message = `:heartbeat ${Date.now()}\n\n`;

  clients.forEach((client) => {
    try {
      client.controller.enqueue(encoder.encode(message));
    } catch {
      unregisterClient(client.id);
    }
  });
}

// Get connected client count
export function getClientCount(): number {
  return clients.size;
}

// Start heartbeat interval (call from server startup)
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

export function startHeartbeat(intervalMs: number = 30000): void {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  heartbeatInterval = setInterval(sendHeartbeat, intervalMs);
}

export function stopHeartbeat(): void {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}
