"use client";

import { useState } from "react";
import type { ObservabilityEvent } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Pencil,
  Eye,
  Play,
  Square,
  Bot,
  Minimize2,
  Clock,
} from "lucide-react";

interface EventCardProps {
  event: ObservabilityEvent;
  compact?: boolean;
}

// Event type to icon mapping
const EVENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  session_start: Play,
  session_end: Square,
  subagent_start: Bot,
  subagent_end: Bot,
  subagent_complete: Bot,
  file_read: Eye,
  file_write: FileText,
  file_edit: Pencil,
  context_compact: Minimize2,
};

// Event type to color mapping
const EVENT_COLORS: Record<string, string> = {
  session_start: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  session_end: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  subagent_start: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  subagent_end: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  subagent_complete: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  file_read: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  file_write: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  file_edit: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  context_compact: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
};

// Format event type for display
function formatEventType(eventType: string): string {
  return eventType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Format timestamp for display
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// Format relative time
function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export function EventCard({ event, compact = false }: EventCardProps) {
  const [expanded, setExpanded] = useState(false);

  const Icon = EVENT_ICONS[event.eventType] || Clock;
  const colorClass = EVENT_COLORS[event.eventType] || "bg-gray-100 text-gray-800";

  // Parse details JSON if present
  let details: Record<string, unknown> | null = null;
  if (event.detailsJson) {
    try {
      details = JSON.parse(event.detailsJson);
    } catch {
      // Ignore parse errors
    }
  }

  if (compact) {
    return (
      <div
        className="flex items-center gap-2 p-2 rounded border hover:bg-muted/50 transition-colors"
        style={{ borderLeftColor: event.color || undefined, borderLeftWidth: event.color ? 3 : 1 }}
      >
        <Icon className="h-3 w-3 text-muted-foreground" />
        <Badge variant="secondary" className={`text-xs ${colorClass}`}>
          {formatEventType(event.eventType)}
        </Badge>
        <span className="text-xs text-muted-foreground truncate flex-1">
          {event.summary || event.toolName || ""}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(event.timestamp)}
        </span>
      </div>
    );
  }

  return (
    <div
      className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
      style={{ borderLeftColor: event.color || undefined, borderLeftWidth: event.color ? 4 : 1 }}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary" className={colorClass}>
            {formatEventType(event.eventType)}
          </Badge>
          {event.toolName && event.toolName !== event.eventType && (
            <span className="text-sm text-muted-foreground">{event.toolName}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatTime(event.timestamp)}</span>
          {(event.tokensEstimated ?? 0) > 0 && (
            <Badge variant="outline" className="text-xs">
              ~{event.tokensEstimated} tokens
            </Badge>
          )}
          {(event.durationMs ?? 0) > 0 && (
            <Badge variant="outline" className="text-xs">
              {event.durationMs}ms
            </Badge>
          )}
        </div>
      </div>

      {/* Summary/Content Row */}
      {event.summary && (
        <p className="mt-2 text-sm">{event.summary}</p>
      )}

      {/* Agent/Session Info */}
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        {event.agentId && (
          <span>
            Agent: <span className="font-mono">{event.agentId}</span>
          </span>
        )}
        {event.sessionId && (
          <span>
            Session: <span className="font-mono">{event.sessionId.slice(0, 12)}...</span>
          </span>
        )}
      </div>

      {/* Expandable Details */}
      {details && Object.keys(details).length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            Details
          </button>
          {expanded && (
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
