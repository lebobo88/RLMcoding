"use client";

import { useEffect, useState, useCallback } from "react";

interface FileChangeEvent {
  type: "add" | "change" | "unlink" | "connected" | "heartbeat";
  path?: string;
  projectId: string;
  timestamp: string;
}

interface UseProjectEventsOptions {
  onFileChange?: (event: FileChangeEvent) => void;
  enabled?: boolean;
}

export function useProjectEvents(
  projectId: string,
  options: UseProjectEventsOptions = {}
) {
  const { onFileChange, enabled = true } = options;
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<FileChangeEvent | null>(null);

  const connect = useCallback(() => {
    if (!enabled || !projectId) return;

    const eventSource = new EventSource(`/api/projects/${projectId}/events`);

    eventSource.onopen = () => {
      console.log("[SSE] Connected to project events");
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: FileChangeEvent = JSON.parse(event.data);
        setLastEvent(data);

        if (data.type === "connected") {
          console.log("[SSE] Subscription confirmed");
        } else if (data.type === "heartbeat") {
          // Just keep-alive
        } else {
          console.log(`[SSE] File ${data.type}: ${data.path}`);
          onFileChange?.(data);
        }
      } catch (err) {
        console.error("[SSE] Error parsing event:", err);
      }
    };

    eventSource.onerror = (error) => {
      console.error("[SSE] Connection error:", error);
      setConnected(false);
      eventSource.close();

      // Reconnect after 5 seconds
      setTimeout(() => {
        console.log("[SSE] Attempting to reconnect...");
        connect();
      }, 5000);
    };

    return () => {
      eventSource.close();
      setConnected(false);
    };
  }, [projectId, enabled, onFileChange]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return {
    connected,
    lastEvent,
  };
}
