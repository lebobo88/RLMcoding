"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  FileMinus2,
  Bot,
  Activity,
} from "lucide-react";
import { motion } from "motion/react";
import type { RLMSubAgentReliability } from "@/lib/parser";

interface SubAgentReliabilityCardProps {
  reliability: RLMSubAgentReliability;
  compact?: boolean;
}

const agentColors: Record<string, string> = {
  coder: "bg-emerald-500",
  tester: "bg-blue-500",
  reviewer: "bg-amber-500",
  architect: "bg-purple-500",
  designer: "bg-pink-500",
  research: "bg-cyan-500",
  verifier: "bg-orange-500",
};

export function SubAgentReliabilityCard({
  reliability,
  compact = false,
}: SubAgentReliabilityCardProps) {
  const { totalManifests, byAgent, byStatus, filesVerified, filesMissing } = reliability;

  // Calculate reliability score
  const totalFiles = filesVerified + filesMissing;
  const reliabilityScore = totalFiles > 0 ? Math.round((filesVerified / totalFiles) * 100) : 100;
  const completionRate = totalManifests > 0
    ? Math.round((byStatus.complete / totalManifests) * 100)
    : 100;

  // Determine health status
  const healthStatus = reliabilityScore >= 95 && completionRate >= 90
    ? "excellent"
    : reliabilityScore >= 80 && completionRate >= 70
      ? "good"
      : reliabilityScore >= 60 && completionRate >= 50
        ? "fair"
        : "poor";

  const healthColors = {
    excellent: "text-emerald-500",
    good: "text-blue-500",
    fair: "text-amber-500",
    poor: "text-red-500",
  };

  const healthBadgeColors = {
    excellent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    good: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    fair: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    poor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  if (compact) {
    return (
      <Card className="border-neutral-200/60 dark:border-neutral-800/60">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className={cn("h-4 w-4", healthColors[healthStatus])} />
              <span className="text-sm font-medium">Sub-Agent Reliability</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={cn("text-xs", healthBadgeColors[healthStatus])}>
                {reliabilityScore}% verified
              </Badge>
            </div>
          </div>
          {filesMissing > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{filesMissing} files missing verification</span>
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
            <Shield className={cn("h-5 w-5", healthColors[healthStatus])} />
            Sub-Agent Reliability
          </CardTitle>
          <Badge variant="secondary" className={cn("capitalize", healthBadgeColors[healthStatus])}>
            {healthStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-neutral-500">Completion Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {completionRate}%
              </span>
            </div>
            <Progress value={completionRate} className="mt-2 h-1.5" />
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-neutral-500">File Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {reliabilityScore}%
              </span>
            </div>
            <Progress value={reliabilityScore} className="mt-2 h-1.5" />
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
            <Bot className="h-4 w-4 text-neutral-500" />
            Manifest Status ({totalManifests} total)
          </h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm">
                <span className="font-medium">{byStatus.complete}</span>
                <span className="text-neutral-500 ml-1">complete</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm">
                <span className="font-medium">{byStatus.partial}</span>
                <span className="text-neutral-500 ml-1">partial</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm">
                <span className="font-medium">{byStatus.failed}</span>
                <span className="text-neutral-500 ml-1">failed</span>
              </span>
            </div>
          </div>
        </div>

        {/* Agent Breakdown */}
        {Object.keys(byAgent).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              By Agent
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(byAgent)
                .sort(([, a], [, b]) => b - a)
                .map(([agent, count]) => (
                  <motion.div
                    key={agent}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5"
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        agentColors[agent.toLowerCase()] || "bg-neutral-400"
                      )}
                    />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 capitalize">
                      {agent}
                    </span>
                    <Badge variant="secondary" className="text-xs h-5">
                      {count}
                    </Badge>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* File Verification Details */}
        <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            File Verification
          </h4>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-emerald-500" />
              <span>
                <span className="font-medium">{filesVerified}</span>
                <span className="text-neutral-500 ml-1">verified</span>
              </span>
            </div>
            {filesMissing > 0 && (
              <div className="flex items-center gap-1.5">
                <FileMinus2 className="h-4 w-4 text-red-500" />
                <span>
                  <span className="font-medium">{filesMissing}</span>
                  <span className="text-neutral-500 ml-1">missing</span>
                </span>
              </div>
            )}
          </div>
          {filesMissing > 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              Some files reported by sub-agents were not found. This may indicate incomplete operations.
            </p>
          )}
        </div>

        {/* Empty State */}
        {totalManifests === 0 && (
          <div className="text-center py-6 text-neutral-500 dark:text-neutral-400">
            <Shield className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No sub-agent activity recorded</p>
            <p className="text-xs mt-1 opacity-70">
              Reliability metrics will appear as sub-agents complete tasks
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
