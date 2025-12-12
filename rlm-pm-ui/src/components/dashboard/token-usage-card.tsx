"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  FileInput,
  FileOutput,
  Pencil,
  Bot,
  Wrench,
  Calendar,
  DollarSign,
} from "lucide-react";
import { motion } from "motion/react";
import type { RLMTokenUsage } from "@/lib/parser";

interface TokenUsageCardProps {
  tokenUsage: RLMTokenUsage;
  compact?: boolean;
}

function formatCost(cost: number): string {
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

function formatTokens(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
  return tokens.toString();
}

export function TokenUsageCard({ tokenUsage, compact = false }: TokenUsageCardProps) {
  const { estimates, currentSession, captured, dailySummaries, compactEvents } = tokenUsage;

  // Calculate totals
  const totalCapturedCost = captured.reduce((sum, c) => sum + c.actualCost, 0);
  const estimatedCost = estimates?.estimatedCost || 0;
  const estimatedTokens = estimates?.totalEstimatedTokens || 0;
  const hasCompactWarning = currentSession?.contextCompactWarning || compactEvents.length > 0;

  // Get last 7 days of daily data
  const recentDays = dailySummaries.slice(0, 7);
  const weekTotalCost = recentDays.reduce((sum, d) => sum + d.totalCost, 0);

  if (compact) {
    return (
      <Card className="border-neutral-200/60 dark:border-neutral-800/60">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Token Usage</span>
            </div>
            <div className="flex items-center gap-3">
              {estimatedTokens > 0 && (
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Est. Session</p>
                  <p className="text-sm font-semibold">{formatTokens(estimatedTokens)}</p>
                </div>
              )}
              {totalCapturedCost > 0 && (
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Total Cost</p>
                  <p className="text-sm font-semibold text-emerald-600">{formatCost(totalCapturedCost)}</p>
                </div>
              )}
            </div>
          </div>
          {hasCompactWarning && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Context compaction detected</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-neutral-200/60 dark:border-neutral-800/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" />
            Token Usage
          </CardTitle>
          {hasCompactWarning && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Compaction
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Session Estimates */}
        {estimates && (
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Current Session (Estimated)
              </span>
              <span className="text-xs text-neutral-500">
                {formatCost(estimatedCost)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <FileInput className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-neutral-500">Input</p>
                  <p className="text-sm font-medium">{formatTokens(estimates.inputTokens)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileOutput className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="text-xs text-neutral-500">Output</p>
                  <p className="text-sm font-medium">{formatTokens(estimates.outputTokens)}</p>
                </div>
              </div>
            </div>

            {/* Operation counts */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-500">
              <div className="flex items-center gap-1">
                <FileInput className="h-3 w-3" />
                <span>{estimates.operationCounts.reads} reads</span>
              </div>
              <div className="flex items-center gap-1">
                <Pencil className="h-3 w-3" />
                <span>{estimates.operationCounts.writes + estimates.operationCounts.edits} writes</span>
              </div>
              <div className="flex items-center gap-1">
                <Bot className="h-3 w-3" />
                <span>{estimates.operationCounts.subagents} agents</span>
              </div>
              <div className="flex items-center gap-1">
                <Wrench className="h-3 w-3" />
                <span>{estimates.operationCounts.tools} tools</span>
              </div>
            </div>
          </div>
        )}

        {/* Captured Cost History */}
        {captured.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Captured Costs
            </h4>
            <div className="space-y-2">
              {captured.slice(0, 5).map((cost, index) => (
                <motion.div
                  key={cost.sessionId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-900/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 truncate max-w-[100px]">
                      {cost.sessionId}
                    </span>
                    {cost.wallDuration && (
                      <span className="text-xs text-neutral-400">
                        {cost.wallDuration}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    {formatCost(cost.actualCost)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Summary */}
        {recentDays.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Last 7 Days
            </h4>
            <div className="grid grid-cols-7 gap-1">
              {recentDays.map((day, index) => {
                const maxCost = Math.max(...recentDays.map(d => d.totalCost), 0.01);
                const height = Math.max((day.totalCost / maxCost) * 100, 5);
                return (
                  <div key={day.date} className="flex flex-col items-center">
                    <div className="h-12 w-full flex items-end justify-center">
                      <motion.div
                        className="w-full bg-blue-500 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1">
                      {new Date(day.date).toLocaleDateString("en-US", { weekday: "narrow" })}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>{recentDays.reduce((s, d) => s + d.totalSessions, 0)} sessions</span>
              <span className="font-medium text-emerald-600">{formatCost(weekTotalCost)} total</span>
            </div>
          </div>
        )}

        {/* Context Compaction Events */}
        {compactEvents.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/60">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Context Compaction Events
              </span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {compactEvents.length} compaction event{compactEvents.length !== 1 ? "s" : ""} detected.
              Token estimates may be incomplete for these sessions.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!estimates && captured.length === 0 && dailySummaries.length === 0 && (
          <div className="text-center py-6 text-neutral-500 dark:text-neutral-400">
            <Coins className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No token usage data yet</p>
            <p className="text-xs mt-1 opacity-70">
              Usage will be tracked during Claude Code sessions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
