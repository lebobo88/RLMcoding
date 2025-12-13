"use client";

import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  BarChart3,
  Coins,
  TrendingUp,
  CheckCircle,
  Activity,
  Bot,
  AlertTriangle,
  FileInput,
  FileOutput,
  DollarSign,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useProjectData, TokenUsage, SubAgentReliability } from "@/contexts/project-data-context";
import { ActivityPulse } from "@/components/dashboard/activity-pulse";

export default function AnalyticsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { projectData, loading } = useProjectData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const tokenUsage = projectData?.tokenUsage;
  const subAgentReliability = projectData?.subAgentReliability;
  const totalTokens = projectData?.summary?.totalTokensUsed || 0;

  // Calculate tokens from new format
  const inputTokens = tokenUsage?.estimates?.inputTokens || 0;
  const outputTokens = tokenUsage?.estimates?.outputTokens || 0;
  const estimatedCost = tokenUsage?.estimates?.estimatedCost || 0;

  // Calculate total captured cost
  const totalCapturedCost = tokenUsage?.captured?.reduce((sum, c) => sum + c.actualCost, 0) || 0;

  // Get operation counts
  const operationCounts = tokenUsage?.estimates?.operationCounts || {
    reads: 0, writes: 0, edits: 0, subagents: 0, tools: 0
  };

  // Daily summaries for chart
  const dailySummaries = tokenUsage?.dailySummaries || [];

  // Legacy token data for backwards compatibility
  const legacyUsage = tokenUsage?.legacy || [];

  // Get tokens by agent from sub-agent reliability data
  const tokensByAgent = subAgentReliability?.byAgent || {};

  // Get tokens by session from daily summaries and captured data
  const tokensBySession: Record<string, number> = {};
  for (const captured of tokenUsage?.captured || []) {
    if (captured.estimatedTokensFromCost) {
      tokensBySession[captured.sessionId] = captured.estimatedTokensFromCost;
    }
  }
  for (const legacy of legacyUsage) {
    tokensBySession[legacy.sessionId] = legacy.totalTokens;
  }

  // Velocity metrics
  const completedTasks = projectData?.summary?.completedTasks || 0;
  const totalTasks = projectData?.summary?.totalTasks || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Sub-agent reliability metrics
  const reliabilityScore = subAgentReliability && (subAgentReliability.filesVerified + subAgentReliability.filesMissing) > 0
    ? Math.round((subAgentReliability.filesVerified / (subAgentReliability.filesVerified + subAgentReliability.filesMissing)) * 100)
    : 100;

  const hasCompactWarning = tokenUsage?.currentSession?.contextCompactWarning || (tokenUsage?.compactEvents?.length || 0) > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-500" />
          Analytics
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Token usage and project velocity metrics
        </p>
      </div>

      {/* Activity Pulse - Real-time events */}
      {/* Note: projectId filter removed - events use folder name, not DB UUID */}
      <ActivityPulse maxEvents={100} showFilters />

      {/* Context Warning */}
      {hasCompactWarning && (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
              Context Compaction Detected
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Token estimates may be incomplete for sessions where context was summarized.
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Tokens"
          value={formatNumber(totalTokens)}
          icon={<Coins className="h-5 w-5" />}
          color="purple"
        />
        <StatCard
          label="Captured Cost"
          value={totalCapturedCost > 0 ? `$${totalCapturedCost.toFixed(2)}` : `~$${estimatedCost.toFixed(2)}`}
          icon={<DollarSign className="h-5 w-5" />}
          color="green"
          subtitle={totalCapturedCost > 0 ? "Actual" : "Estimated"}
        />
        <StatCard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon={<CheckCircle className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          label="Sub-Agent Reliability"
          value={`${reliabilityScore}%`}
          icon={<Bot className="h-5 w-5" />}
          color="amber"
          subtitle={`${subAgentReliability?.totalManifests || 0} manifests`}
        />
      </div>

      {/* Token Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Agent */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Token Usage by Agent
          </h3>
          <div className="space-y-4">
            {Object.entries(tokensByAgent).length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
                No token usage data yet
              </p>
            ) : (
              Object.entries(tokensByAgent)
                .sort(([, a], [, b]) => b - a)
                .map(([agent, tokens]) => {
                  const percentage = totalTokens > 0 ? (tokens / totalTokens) * 100 : 0;
                  return (
                    <div key={agent}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 capitalize">
                          {agent}
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {formatNumber(tokens)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* By Session */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Token Usage by Session
          </h3>
          <div className="space-y-3">
            {Object.entries(tokensBySession).length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
                No session data yet
              </p>
            ) : (
              Object.entries(tokensBySession)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 7)
                .map(([session, tokens]) => {
                  const maxTokens = Math.max(...Object.values(tokensBySession));
                  const percentage = maxTokens > 0 ? (tokens / maxTokens) * 100 : 0;
                  return (
                    <div key={session} className="flex items-center gap-4">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400 w-32 truncate" title={session}>
                        {session.slice(0, 12)}...
                      </span>
                      <div className="flex-1">
                        <div
                          className="h-6 bg-blue-500 rounded"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 w-20 text-right">
                        {formatNumber(tokens)}
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Token Breakdown */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Token Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800">
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {formatNumber(inputTokens)}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Input Tokens
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              ${(inputTokens * 0.000003).toFixed(4)}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800">
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {formatNumber(outputTokens)}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Output Tokens
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              ${(outputTokens * 0.000015).toFixed(4)}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatNumber(totalTokens)}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Total Tokens
            </p>
            <p className="text-xs text-blue-500 mt-1">${estimatedCost}</p>
          </div>
        </div>
      </div>

      {/* Velocity Metrics */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Project Velocity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              Task Completion
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Progress value={completionRate} className="h-3" />
              </div>
              <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {completionRate}%
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              Avg Tokens per Task
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {completedTasks > 0
                ? formatNumber(Math.round(totalTokens / completedTasks))
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              Efficiency Rating
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {getEfficiencyRating(totalTokens, completedTasks)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: "purple" | "green" | "blue" | "amber";
  subtitle?: string;
}) {
  const colorClasses = {
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {value}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
          {subtitle && (
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function getEfficiencyRating(tokens: number, tasks: number): string {
  if (tasks === 0) return "N/A";
  const tokensPerTask = tokens / tasks;
  if (tokensPerTask < 10000) return "Excellent";
  if (tokensPerTask < 25000) return "Good";
  if (tokensPerTask < 50000) return "Average";
  return "Needs Review";
}
