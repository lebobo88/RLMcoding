"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Github,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface ProjectCardProps {
  id: string;
  name: string;
  localPath: string;
  githubRepo?: string | null;
  status: string;
  currentPhase?: string | null;
  stats?: {
    totalTasks: number;
    completedTasks: number;
    features: number;
  };
}

const phaseColors: Record<string, string> = {
  discover: "bg-purple-500",
  design: "bg-pink-500",
  specs: "bg-blue-500",
  "feature-design": "bg-indigo-500",
  tasks: "bg-cyan-500",
  implement: "bg-emerald-500",
  quality: "bg-amber-500",
  verify: "bg-orange-500",
  report: "bg-green-500",
};

const phaseLabels: Record<string, string> = {
  discover: "Discovery",
  design: "Design System",
  specs: "Specifications",
  "feature-design": "Feature Design",
  tasks: "Tasks",
  implement: "Implementation",
  quality: "Quality",
  verify: "Verification",
  report: "Report",
};

export function ProjectCard({
  id,
  name,
  localPath,
  githubRepo,
  status,
  currentPhase,
  stats,
}: ProjectCardProps) {
  const progress = stats
    ? Math.round((stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Link href={`/projects/${id}`}>
        <Card className="group relative overflow-hidden border-neutral-200/60 dark:border-neutral-800/60 bg-gradient-to-b from-white to-neutral-50/50 dark:from-neutral-900 dark:to-neutral-950/50 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg transition-all duration-300 cursor-pointer">
          {/* Status indicator bar */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-1",
              status === "active"
                ? "bg-emerald-500"
                : status === "archived"
                  ? "bg-neutral-400"
                  : "bg-blue-500"
            )}
          />

          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <FolderGit2 className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {name}
                  </CardTitle>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
                    {localPath}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Current Phase */}
            {currentPhase && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Current Phase:
                </span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-white text-xs",
                    phaseColors[currentPhase] || "bg-neutral-500"
                  )}
                >
                  {phaseLabels[currentPhase] || currentPhase}
                </Badge>
              </div>
            )}

            {/* Progress bar */}
            {stats && stats.totalTasks > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Progress
                  </span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {progress}%
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Stats */}
            {stats && (
              <div className="flex items-center gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {stats.completedTasks}/{stats.totalTasks} tasks
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {stats.features} features
                  </span>
                </div>
                {githubRepo && (
                  <div className="flex items-center gap-1.5 text-xs ml-auto">
                    <Github className="h-3.5 w-3.5 text-neutral-500" />
                    <span className="text-neutral-500 dark:text-neutral-400 truncate max-w-[100px]">
                      {githubRepo}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
