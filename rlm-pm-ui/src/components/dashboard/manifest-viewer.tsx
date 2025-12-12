"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Bot,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileCode,
  FilePlus,
  FileEdit,
  Clock,
  TestTube2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { RLMManifest } from "@/lib/parser";

interface ManifestViewerProps {
  manifests: RLMManifest[];
  maxItems?: number;
  showTimeline?: boolean;
}

const agentColors: Record<string, string> = {
  coder: "bg-emerald-500",
  tester: "bg-blue-500",
  reviewer: "bg-amber-500",
  architect: "bg-purple-500",
  designer: "bg-pink-500",
  research: "bg-cyan-500",
  verifier: "bg-orange-500",
  unknown: "bg-neutral-500",
};

const statusIcons: Record<string, React.ReactNode> = {
  complete: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  partial: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  failed: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const statusColors: Record<string, string> = {
  complete: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  partial: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timestamp;
  }
}

function formatRelativeTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return "";
  }
}

export function ManifestViewer({
  manifests,
  maxItems = 10,
  showTimeline = true,
}: ManifestViewerProps) {
  const displayManifests = manifests.slice(0, maxItems);

  if (displayManifests.length === 0) {
    return (
      <Card className="border-neutral-200/60 dark:border-neutral-800/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-neutral-500" />
            Sub-Agent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No sub-agent activity recorded yet</p>
            <p className="text-xs mt-1 opacity-70">
              Manifests will appear here when sub-agents complete tasks
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-neutral-200/60 dark:border-neutral-800/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-neutral-500" />
            Sub-Agent Activity
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {manifests.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayManifests.map((manifest, index) => (
            <motion.div
              key={manifest.manifestId}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "relative p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-800/60",
                "bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-900/50 dark:to-neutral-900",
                "hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              )}
            >
              {/* Timeline connector */}
              {showTimeline && index < displayManifests.length - 1 && (
                <div className="absolute left-6 top-full w-0.5 h-3 bg-neutral-200 dark:bg-neutral-700" />
              )}

              <div className="flex items-start gap-3">
                {/* Agent badge */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
                    agentColors[manifest.agent.toLowerCase()] || agentColors.unknown
                  )}
                >
                  {manifest.agent.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100 capitalize">
                      {manifest.agent}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", statusColors[manifest.status])}
                    >
                      <span className="mr-1">{statusIcons[manifest.status]}</span>
                      {manifest.status}
                    </Badge>
                    {manifest.taskId && (
                      <Badge variant="outline" className="text-xs">
                        {manifest.taskId}
                      </Badge>
                    )}
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-auto">
                      {formatRelativeTime(manifest.timestamp)}
                    </span>
                  </div>

                  {/* Action */}
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                    {manifest.action}
                  </p>

                  {/* Files */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {manifest.filesWritten.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FilePlus className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{manifest.filesWritten.length} created</span>
                      </div>
                    )}
                    {manifest.filesModified.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileEdit className="h-3.5 w-3.5 text-blue-500" />
                        <span>{manifest.filesModified.length} modified</span>
                      </div>
                    )}
                    {manifest.testResults && (
                      <div className="flex items-center gap-1">
                        <TestTube2 className="h-3.5 w-3.5 text-purple-500" />
                        <span>
                          {manifest.testResults.passed}/{manifest.testResults.total} tests
                        </span>
                      </div>
                    )}
                    {manifest.duration && (
                      <div className="flex items-center gap-1 ml-auto">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{manifest.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {manifests.length > maxItems && (
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-2">
            Showing {maxItems} of {manifests.length} manifests
          </p>
        )}
      </CardContent>
    </Card>
  );
}
