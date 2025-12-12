"use client";

import { motion } from "motion/react";
import {
  BarChart3,
  Coins,
  TrendingUp,
  CheckCircle,
  Activity,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useProjectData } from "@/contexts/project-data-context";

interface TokenUsage {
  sessionId: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  agent?: string;
  taskId?: string;
}

export default function AnalyticsPage() {
  const { projectData, loading } = useProjectData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const tokenUsage = (projectData?.tokenUsage || []) as TokenUsage[];
  const totalTokens = projectData?.summary?.totalTokensUsed || 0;

  // Group by agent
  const tokensByAgent = tokenUsage.reduce(
    (acc, t) => {
      const agent = t.agent || "unknown";
      acc[agent] = (acc[agent] || 0) + t.totalTokens;
      return acc;
    },
    {} as Record<string, number>
  );

  // Group by session (using sessionId as a pseudo-date grouping)
  const tokensBySession = tokenUsage.reduce(
    (acc, t) => {
      const session = t.sessionId || "unknown";
      acc[session] = (acc[session] || 0) + t.totalTokens;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate costs (approximate)
  const inputTokens = tokenUsage.reduce((sum, t) => sum + t.inputTokens, 0);
  const outputTokens = tokenUsage.reduce((sum, t) => sum + t.outputTokens, 0);
  const estimatedCost = (inputTokens * 0.000003 + outputTokens * 0.000015).toFixed(2);

  // Velocity metrics
  const completedTasks = projectData?.summary?.completedTasks || 0;
  const totalTasks = projectData?.summary?.totalTasks || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Tokens"
          value={formatNumber(totalTokens)}
          icon={<Coins className="h-5 w-5" />}
          color="purple"
        />
        <StatCard
          label="Est. Cost"
          value={`$${estimatedCost}`}
          icon={<TrendingUp className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon={<CheckCircle className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          label="Active Sessions"
          value={Object.keys(tokensBySession).length}
          icon={<Activity className="h-5 w-5" />}
          color="amber"
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
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: "purple" | "green" | "blue" | "amber";
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
