"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import {
  ListTodo,
  Layers,
  Coins,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FileText,
  Workflow,
  Download,
  Loader2,
} from "lucide-react";
import { PipelineView } from "@/components/pipeline/pipeline-view";
import { Progress } from "@/components/ui/progress";
import { useProjectData } from "@/contexts/project-data-context";
import ParticleButton from "@/components/kokonutui/particle-button";
import { ActivityPulse } from "@/components/dashboard/activity-pulse";

export default function ProjectOverview() {
  const params = useParams();
  const { project, projectData: data, loading, syncFramework, syncingFramework } = useProjectData();
  const [syncMessage, setSyncMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const completionPercent = data?.summary
    ? Math.round(
        (data.summary.completedTasks / Math.max(data.summary.totalTasks, 1)) *
          100
      )
    : 0;

  const handleSyncFramework = async (overwrite = false) => {
    setSyncMessage(null);
    const result = await syncFramework(overwrite);
    if (result.success) {
      setSyncMessage({
        type: "success",
        text: overwrite
          ? `${result.copied} files updated`
          : `${result.copied} files copied, ${result.skipped} skipped (already exist)`,
      });
    } else {
      setSyncMessage({ type: "error", text: result.message });
    }
    // Auto-dismiss after 5 seconds
    setTimeout(() => setSyncMessage(null), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Sync Framework Section */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">RLM Framework</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Sync the latest prompts, templates, and commands to this project
            </p>
          </div>
          <div className="flex gap-2">
            <ParticleButton
              onClick={() => handleSyncFramework(false)}
              disabled={syncingFramework}
              variant="outline"
              className="gap-2"
            >
              {syncingFramework ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {syncingFramework ? "Syncing..." : "Sync New"}
            </ParticleButton>
            <ParticleButton
              onClick={() => handleSyncFramework(true)}
              disabled={syncingFramework}
              variant="default"
              className="gap-2"
            >
              {syncingFramework ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Update All
            </ParticleButton>
          </div>
        </div>
        {syncMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 p-2 rounded-lg text-sm ${
              syncMessage.type === "success"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
            }`}
          >
            {syncMessage.text}
          </motion.div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Features"
          value={data?.summary.totalFeatures || 0}
          icon={<Layers className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          label="Total Tasks"
          value={data?.summary.totalTasks || 0}
          icon={<ListTodo className="h-5 w-5" />}
          color="amber"
        />
        <StatCard
          label="Completed"
          value={data?.summary.completedTasks || 0}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          label="Tokens Used"
          value={formatNumber(data?.summary.totalTokensUsed || 0)}
          icon={<Coins className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {completionPercent}%
          </span>
        </div>
        <Progress value={completionPercent} className="h-2" />
      </div>

      {/* Pipeline Mini View */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Workflow className="h-5 w-5 text-blue-500" />
            Pipeline Status
          </h2>
          <Link
            href={`/projects/${params.id}/pipeline`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <PipelineView
          currentPhase={project?.currentPhase || "discover"}
          phaseInfo={data?.phases}
        />
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Tasks */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-amber-500" />
              Active Tasks
            </h3>
            <Link
              href={`/projects/${params.id}/tasks`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {data?.tasks.active
              .filter((task) => task.status !== "completed")
              .slice(0, 5)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                    {task.title}
                  </span>
                  <span className="text-xs text-neutral-500 ml-auto">
                    {task.id}
                  </span>
                </div>
              ))}
            {(!data?.tasks.active || data.tasks.active.filter((t) => t.status !== "completed").length === 0) && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 py-4 text-center">
                No active tasks
              </p>
            )}
          </div>
        </div>

        {/* Project Files */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Key Documents
            </h3>
            <Link
              href={`/projects/${params.id}/specs`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-2">
            <DocItem
              name="PRD.md"
              exists={data?.summary.hasPRD || false}
              href={`/projects/${params.id}/specs?file=PRD.md`}
            />
            <DocItem
              name="constitution.md"
              exists={data?.summary.hasConstitution || false}
              href={`/projects/${params.id}/specs?file=constitution.md`}
            />
            <DocItem
              name="features/"
              exists={(data?.summary.totalFeatures || 0) > 0}
              href={`/projects/${params.id}/features`}
              count={data?.summary.totalFeatures}
            />
          </div>
        </div>
      </div>

      {/* Activity Pulse - Compact View */}
      {/* Note: projectId filter removed - events use folder name, not DB UUID */}
      <ActivityPulse
        maxEvents={20}
        showFilters={false}
        compact
      />

      {/* Blocked Tasks Warning */}
      {(data?.summary?.blockedTasks ?? 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-red-700 dark:text-red-300">
                {data?.summary?.blockedTasks} blocked task
                {(data?.summary?.blockedTasks ?? 0) > 1 ? "s" : ""}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                Review blocked tasks to continue progress
              </p>
            </div>
            <Link
              href={`/projects/${params.id}/tasks?filter=blocked`}
              className="ml-auto px-3 py-1.5 text-sm bg-red-100 dark:bg-red-800/50 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-red-700 dark:text-red-300"
            >
              View
            </Link>
          </div>
        </motion.div>
      )}
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
  value: number | string;
  icon: React.ReactNode;
  color: "blue" | "amber" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
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
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function DocItem({
  name,
  exists,
  href,
  count,
}: {
  name: string;
  exists: boolean;
  href: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
    >
      <div
        className={`w-2 h-2 rounded-full ${exists ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-600"}`}
      />
      <span className="text-sm text-neutral-700 dark:text-neutral-300">
        {name}
      </span>
      {count !== undefined && (
        <span className="text-xs text-neutral-500 ml-auto">
          {count} item{count !== 1 ? "s" : ""}
        </span>
      )}
      {!exists && !count && (
        <span className="text-xs text-neutral-400 ml-auto">Not created</span>
      )}
    </Link>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
