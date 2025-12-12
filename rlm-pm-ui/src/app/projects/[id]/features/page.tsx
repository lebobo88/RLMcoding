"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Layers,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  FileText,
  ListTodo,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useProjectData } from "@/contexts/project-data-context";

interface Feature {
  id: string;
  name: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed" | "verified" | string;
  priority?: "high" | "medium" | "low" | string;
  acceptanceCriteria?: string[];
  linkedTasks?: string[];
}

interface Task {
  id: string;
  title: string;
  status: string;
  featureId?: string;
}

export default function FeaturesPage() {
  const { projectData, loading } = useProjectData();
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  // Cast to Feature type which includes optional acceptanceCriteria and linkedTasks
  const features = (projectData?.features || []) as Feature[];

  const toggleExpand = (featureId: string) => {
    setExpandedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
  };

  // Get tasks for a feature
  const getFeatureTasks = (featureId: string): Task[] => {
    if (!projectData) return [];
    const allTasks: Task[] = [
      // For active tasks, use the actual status from the task (may be "completed" in frontmatter)
      ...projectData.tasks.active.map((t) => ({ ...t, status: t.status || "active" })),
      // Tasks in completed folder are always completed
      ...projectData.tasks.completed.map((t) => ({ ...t, status: "completed" })),
      // Tasks in blocked folder are always blocked
      ...projectData.tasks.blocked.map((t) => ({ ...t, status: "blocked" })),
    ];
    return allTasks.filter((t) => t.featureId === featureId);
  };

  // Calculate feature progress
  const getFeatureProgress = (featureId: string) => {
    const tasks = getFeatureTasks(featureId);
    if (tasks.length === 0) return 0;
    // Count tasks that are completed (either in completed folder or have status "completed")
    const completed = tasks.filter((t) => t.status === "completed").length;
    return Math.round((completed / tasks.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Layers className="h-6 w-6 text-purple-500" />
            Features
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {features.length} features defined
          </p>
        </div>
      </div>

      {/* Features List */}
      {features.length === 0 ? (
        <div className="text-center py-20">
          <div className="p-4 rounded-full bg-neutral-100 dark:bg-neutral-800 w-fit mx-auto mb-4">
            <Layers className="h-8 w-8 text-neutral-400" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            No features yet
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Run the specs phase to generate features
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {features.map((feature, index) => {
            const isExpanded = expandedFeatures.has(feature.id);
            const tasks = getFeatureTasks(feature.id);
            const progress = getFeatureProgress(feature.id);

            return (
              <motion.div
                key={`${feature.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
              >
                {/* Feature Header */}
                <button
                  onClick={() => toggleExpand(feature.id)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-neutral-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                        {feature.id}
                      </span>
                      <StatusBadge status={feature.status || "pending"} />
                      {feature.priority && (
                        <Badge
                          variant={
                            feature.priority === "high"
                              ? "destructive"
                              : feature.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {feature.priority}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {feature.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Progress
                      </p>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {progress}%
                      </p>
                    </div>
                    <div className="w-24">
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="p-4 space-y-4">
                      {/* Description */}
                      {feature.description && (
                        <div>
                          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Description
                          </h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {feature.description}
                          </p>
                        </div>
                      )}

                      {/* Acceptance Criteria */}
                      {feature.acceptanceCriteria && feature.acceptanceCriteria.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Acceptance Criteria
                          </h4>
                          <ul className="space-y-1">
                            {feature.acceptanceCriteria.map((criterion, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {criterion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Linked Tasks */}
                      {tasks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                            <ListTodo className="h-4 w-4" />
                            Linked Tasks ({tasks.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {tasks.map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                              >
                                <TaskStatusIcon status={task.status} />
                                <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                                  {task.title}
                                </span>
                                <span className="text-xs text-neutral-500 ml-auto">
                                  {task.id}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Pending",
      className: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    },
    completed: {
      label: "Completed",
      className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    },
    verified: {
      label: "Verified",
      className: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    },
  };

  const { label, className } = config[status] || config.pending;

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", className)}>
      {label}
    </span>
  );
}

function TaskStatusIcon({ status }: { status: string }) {
  if (status === "completed") {
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
  if (status === "blocked") {
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  }
  return <Clock className="h-4 w-4 text-amber-500" />;
}
