"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ObservabilityEvent } from "@/lib/db/schema";

interface UseEventStreamOptions {
  projectId?: string;
  sessionId?: string;
  maxEvents?: number;
  autoReconnect?: boolean;
  reconnectDelay?: number;
}

interface UseEventStreamReturn {
  events: ObservabilityEvent[];
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  clientId: string | null;
  clearEvents: () => void;
  reconnect: () => void;
}

export function useEventStream(
  options: UseEventStreamOptions = {}
): UseEventStreamReturn {
  const {
    projectId,
    sessionId,
    maxEvents = 100,
    autoReconnect = true,
    reconnectDelay = 5000,
  } = options;

  const [events, setEvents] = useState<ObservabilityEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    // Build URL with filters
    const params = new URLSearchParams();
    if (projectId) params.set("project_id", projectId);
    if (sessionId) params.set("session_id", sessionId);

    const url = `/api/events/stream${params.toString() ? `?${params}` : ""}`;

    setIsConnecting(true);
    setError(null);

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      if (!mountedRef.current) return;
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      if (!mountedRef.current) return;

      try {
        const data = JSON.parse(event.data);

        // Handle connection message
        if (data.type === "connected") {
          setClientId(data.clientId);
          return;
        }

        // Handle regular event
        setEvents((prev) => {
          const newEvents = [data, ...prev];
          // Keep only maxEvents
          return newEvents.slice(0, maxEvents);
        });
      } catch (e) {
        console.error("Failed to parse event:", e);
      }
    };

    eventSource.onerror = () => {
      if (!mountedRef.current) return;

      setIsConnected(false);
      setIsConnecting(false);
      setError(new Error("Connection lost"));
      eventSource.close();
      eventSourceRef.current = null;

      // Auto-reconnect if enabled
      if (autoReconnect && mountedRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            connect();
          }
        }, reconnectDelay);
      }
    };
  }, [projectId, sessionId, maxEvents, autoReconnect, reconnectDelay]);

  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [disconnect, connect]);

  // Connect on mount and when filters change
  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    events,
    isConnected,
    isConnecting,
    error,
    clientId,
    clearEvents,
    reconnect,
  };
}

// Hook to fetch historical events
export function useHistoricalEvents(options: {
  projectId?: string;
  sessionId?: string;
  eventType?: string;
  limit?: number;
}) {
  const [events, setEvents] = useState<ObservabilityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.projectId) params.set("project_id", options.projectId);
      if (options.sessionId) params.set("session_id", options.sessionId);
      if (options.eventType) params.set("event_type", options.eventType);
      if (options.limit) params.set("limit", options.limit.toString());

      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data.events);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [options.projectId, options.sessionId, options.eventType, options.limit]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, refetch: fetchEvents };
}

// Hook to fetch event stats
export function useEventStats(projectId?: string) {
  const [stats, setStats] = useState<{
    totalEvents: number;
    uniqueSessions: number;
    uniqueAgents: number;
    totalTokensEstimated: number;
    avgDurationMs: number;
  } | null>(null);
  const [recentSessions, setRecentSessions] = useState<
    Array<{
      sessionId: string;
      projectId: string;
      eventCount: number;
      firstEvent: string;
      lastEvent: string;
      totalTokens: number;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (projectId) params.set("project_id", projectId);

      const response = await fetch(`/api/events/stats?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data.stats);
      setRecentSessions(data.recentSessions);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, recentSessions, isLoading, error, refetch: fetchStats };
}
