"use client";

import { useState, useMemo } from "react";
import { useEventStream, useEventStats } from "@/hooks/useEventStream";
import { EventCard } from "./event-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Filter,
  RefreshCw,
  Wifi,
  WifiOff,
  Trash2,
} from "lucide-react";

interface ActivityPulseProps {
  projectId?: string;
  maxEvents?: number;
  showFilters?: boolean;
  compact?: boolean;
}

const EVENT_TYPES = [
  { value: "", label: "All Events" },
  { value: "session_start", label: "Session Start" },
  { value: "session_end", label: "Session End" },
  { value: "subagent_start", label: "Sub-agent Start" },
  { value: "subagent_end", label: "Sub-agent End" },
  { value: "subagent_complete", label: "Sub-agent Complete" },
  { value: "file_read", label: "File Read" },
  { value: "file_write", label: "File Write" },
  { value: "file_edit", label: "File Edit" },
  { value: "context_compact", label: "Context Compact" },
];

export function ActivityPulse({
  projectId,
  maxEvents = 50,
  showFilters = true,
  compact = false,
}: ActivityPulseProps) {
  const [filterEventType, setFilterEventType] = useState("");
  const [filterSessionId, setFilterSessionId] = useState("");

  const {
    events,
    isConnected,
    isConnecting,
    error,
    clearEvents,
    reconnect,
  } = useEventStream({
    projectId,
    maxEvents,
  });

  const { stats } = useEventStats(projectId);

  // Filter events locally
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filterEventType && event.eventType !== filterEventType) {
        return false;
      }
      if (filterSessionId && event.sessionId !== filterSessionId) {
        return false;
      }
      return true;
    });
  }, [events, filterEventType, filterSessionId]);

  // Get unique session IDs for filter dropdown
  const uniqueSessionIds = useMemo(() => {
    const sessionIds = new Set(events.map((e) => e.sessionId).filter(Boolean));
    return Array.from(sessionIds);
  }, [events]);

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Activity Pulse</h3>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge variant="outline" className="text-xs text-green-600">
                <Wifi className="h-3 w-3 mr-1" />
                Live
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-red-600">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No events yet
            </p>
          ) : (
            filteredEvents.slice(0, 5).map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))
          )}
        </div>

        {stats && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Total Events:</span>
              <span>{stats.totalEvents}</span>
            </div>
            <div className="flex justify-between">
              <span>Sessions:</span>
              <span>{stats.uniqueSessions}</span>
            </div>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Activity Pulse</h3>
          {isConnecting && (
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge variant="outline" className="text-green-600">
              <Wifi className="h-3 w-3 mr-1" />
              Live
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-red-600 cursor-pointer"
              onClick={reconnect}
            >
              <WifiOff className="h-3 w-3 mr-1" />
              Reconnect
            </Badge>
          )}

          <button
            onClick={clearEvents}
            className="p-1 hover:bg-muted rounded"
            title="Clear events"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-50 dark:bg-red-950 text-red-600 text-sm rounded">
          {error.message}
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </div>
          <select
            value={filterEventType}
            onChange={(e) => setFilterEventType(e.target.value)}
            className="text-sm border rounded px-2 py-1 bg-background"
          >
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {uniqueSessionIds.length > 0 && (
            <select
              value={filterSessionId}
              onChange={(e) => setFilterSessionId(e.target.value)}
              className="text-sm border rounded px-2 py-1 bg-background"
            >
              <option value="">All Sessions</option>
              {uniqueSessionIds.map((sessionId) => (
                <option key={sessionId} value={sessionId!}>
                  {sessionId?.slice(0, 20)}...
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Stats Bar */}
      {stats && (
        <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">{stats.totalEvents}</span> events
          </div>
          <div>
            <span className="font-medium">{stats.uniqueSessions}</span> sessions
          </div>
          <div>
            <span className="font-medium">{stats.uniqueAgents}</span> agents
          </div>
          <div>
            <span className="font-medium">
              {((stats.totalTokensEstimated || 0) / 1000).toFixed(1)}k
            </span>{" "}
            tokens
          </div>
        </div>
      )}

      {/* Event Feed */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No events yet</p>
            <p className="text-xs mt-1">
              Events will appear here in real-time
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs text-muted-foreground">
        <span>Showing {filteredEvents.length} events</span>
        <span>
          {events.length >= maxEvents
            ? `Oldest events will be removed (max ${maxEvents})`
            : ""}
        </span>
      </div>
    </Card>
  );
}
