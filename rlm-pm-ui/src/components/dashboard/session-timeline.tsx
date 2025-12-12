"use client";

import { useMemo } from "react";
import { useHistoricalEvents } from "@/hooks/useEventStream";
import { EventCard } from "./event-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2 } from "lucide-react";

interface SessionTimelineProps {
  sessionId: string;
  projectId?: string;
}

export function SessionTimeline({ sessionId, projectId }: SessionTimelineProps) {
  const { events, isLoading, error, refetch } = useHistoricalEvents({
    sessionId,
    projectId,
    limit: 500,
  });

  // Group events by time chunks (5-minute intervals)
  const groupedEvents = useMemo(() => {
    if (events.length === 0) return [];

    const groups: Array<{
      timestamp: Date;
      label: string;
      events: typeof events;
    }> = [];

    let currentGroup: typeof groups[0] | null = null;

    events.forEach((event) => {
      const eventTime = new Date(event.timestamp);
      const minutes = eventTime.getMinutes();
      const roundedMinutes = Math.floor(minutes / 5) * 5;
      const groupTime = new Date(eventTime);
      groupTime.setMinutes(roundedMinutes, 0, 0);

      const groupLabel = groupTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      if (!currentGroup || currentGroup.label !== groupLabel) {
        currentGroup = {
          timestamp: groupTime,
          label: groupLabel,
          events: [event],
        };
        groups.push(currentGroup);
      } else {
        currentGroup.events.push(event);
      }
    });

    return groups;
  }, [events]);

  // Calculate session stats
  const sessionStats = useMemo(() => {
    if (events.length === 0) return null;

    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const startTime = new Date(sortedEvents[0].timestamp);
    const endTime = new Date(sortedEvents[sortedEvents.length - 1].timestamp);
    const durationMs = endTime.getTime() - startTime.getTime();

    const totalTokens = events.reduce(
      (sum, e) => sum + (e.tokensEstimated || 0),
      0
    );

    const eventTypes = new Map<string, number>();
    events.forEach((e) => {
      eventTypes.set(e.eventType, (eventTypes.get(e.eventType) || 0) + 1);
    });

    return {
      startTime,
      endTime,
      durationMs,
      totalTokens,
      eventCount: events.length,
      eventTypes: Array.from(eventTypes.entries()),
    };
  }, [events]);

  if (isLoading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-red-600 text-sm">
          Failed to load session: {error.message}
        </div>
        <button
          onClick={refetch}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Retry
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      {/* Session Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Session Timeline</h3>
        </div>
        <div className="text-sm text-muted-foreground font-mono">
          {sessionId}
        </div>
      </div>

      {/* Session Stats */}
      {sessionStats && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Start</div>
              <div className="font-medium">
                {sessionStats.startTime.toLocaleTimeString()}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Duration</div>
              <div className="font-medium">
                {Math.floor(sessionStats.durationMs / 60000)}m{" "}
                {Math.floor((sessionStats.durationMs % 60000) / 1000)}s
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Events</div>
              <div className="font-medium">{sessionStats.eventCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Tokens (est.)</div>
              <div className="font-medium">
                {(sessionStats.totalTokens / 1000).toFixed(1)}k
              </div>
            </div>
          </div>

          {/* Event Type Breakdown */}
          <div className="mt-3 flex flex-wrap gap-1">
            {sessionStats.eventTypes.map(([type, count]) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}: {count}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {groupedEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No events found for this session
          </div>
        ) : (
          groupedEvents.map((group, groupIndex) => (
            <div key={groupIndex} className="relative">
              {/* Time Label */}
              <div className="sticky top-0 bg-background z-10 py-1">
                <Badge variant="secondary" className="text-xs">
                  {group.label}
                </Badge>
              </div>

              {/* Events in this time group */}
              <div className="ml-4 border-l-2 border-muted pl-4 space-y-2">
                {group.events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
