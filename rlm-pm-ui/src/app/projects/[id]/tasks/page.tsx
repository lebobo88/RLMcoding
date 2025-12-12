"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ListTodo,
  Play,
  CheckCircle,
  AlertTriangle,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import ParticleButton from "@/components/kokonutui/particle-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useProjectData } from "@/contexts/project-data-context";

interface Task {
  id: string;
  title: string;
  description?: string;
  featureId?: string;
  priority?: "high" | "medium" | "low" | string;
  status?: string;
  estimatedHours?: number;
  estimatedEffort?: string;
  tags?: string[];
  acceptanceCriteria?: string[];
  dependencies?: string[];
}

type ColumnType = "active" | "in_progress" | "blocked" | "completed";

export default function TasksPage() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const { projectData, loading } = useProjectData();
  const tasks = projectData?.tasks || { active: [], completed: [], blocked: [] };
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<string | null>(filterParam);

  // Get tasks with "completed" status that are still in active folder
  const completedInActive = tasks.active.filter((t) => t.status === "completed");

  // Organize tasks into columns
  const columns: { id: ColumnType; title: string; icon: React.ReactNode; tasks: Task[]; color: string }[] = [
    {
      id: "active",
      title: "To Do",
      icon: <Clock className="h-4 w-4" />,
      // Exclude both in_progress and completed tasks
      tasks: tasks.active.filter((t) => t.status !== "in_progress" && t.status !== "completed"),
      color: "blue",
    },
    {
      id: "in_progress",
      title: "In Progress",
      icon: <Play className="h-4 w-4" />,
      tasks: tasks.active.filter((t) => t.status === "in_progress"),
      color: "amber",
    },
    {
      id: "blocked",
      title: "Blocked",
      icon: <AlertTriangle className="h-4 w-4" />,
      tasks: tasks.blocked,
      color: "red",
    },
    {
      id: "completed",
      title: "Completed",
      icon: <CheckCircle className="h-4 w-4" />,
      // Include tasks from completed folder AND tasks in active with completed status
      tasks: [...tasks.completed, ...completedInActive],
      color: "green",
    },
  ];

  // Apply filter
  const filteredColumns = filter
    ? columns.filter((c) => c.id === filter)
    : columns;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalTasks =
    tasks.active.length + tasks.completed.length + tasks.blocked.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-amber-500" />
            Tasks
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {totalTasks} total tasks across all statuses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <button
              onClick={() => setFilter(null)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                !filter
                  ? "bg-white dark:bg-neutral-700 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-neutral-700/50"
              )}
            >
              All
            </button>
            {columns.map((col) => (
              <button
                key={col.id}
                onClick={() => setFilter(col.id)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  filter === col.id
                    ? "bg-white dark:bg-neutral-700 shadow-sm"
                    : "hover:bg-white/50 dark:hover:bg-neutral-700/50"
                )}
              >
                {col.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredColumns.map((column) => (
          <TaskColumn
            key={column.id}
            title={column.title}
            icon={column.icon}
            tasks={column.tasks}
            color={column.color}
            onTaskClick={setSelectedTask}
          />
        ))}
      </div>

      {/* Task Detail Drawer */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskColumn({
  title,
  icon,
  tasks,
  color,
  onTaskClick,
}: {
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
  color: string;
  onTaskClick: (task: Task) => void;
}) {
  const colorClasses: Record<string, string> = {
    blue: "border-blue-200 dark:border-blue-800",
    amber: "border-amber-200 dark:border-amber-800",
    red: "border-red-200 dark:border-red-800",
    green: "border-green-200 dark:border-green-800",
  };

  const headerColors: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
  };

  return (
    <div
      className={cn(
        "rounded-xl border-2 bg-white dark:bg-neutral-900 overflow-hidden",
        colorClasses[color]
      )}
    >
      {/* Column Header */}
      <div className={cn("px-4 py-3 flex items-center gap-2", headerColors[color])}>
        {icon}
        <span className="font-semibold">{title}</span>
        <span className="ml-auto text-sm opacity-70">{tasks.length}</span>
      </div>

      {/* Tasks List */}
      <div className="p-2 space-y-2 max-h-[60vh] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 dark:text-neutral-500 text-sm">
            No tasks
          </div>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TaskCard task={task} onClick={() => onTaskClick(task)} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const priorityColors: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-blue-500",
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors group"
    >
      <div className="flex items-start gap-2">
        <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", priorityColors[task.priority || "medium"])} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{task.id}</span>
            {task.featureId && (
              <Badge variant="outline" className="text-xs py-0">
                {task.featureId}
              </Badge>
            )}
          </div>
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-xs bg-neutral-200 dark:bg-neutral-700 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}

function TaskDrawer({ task, onClose }: { task: Task; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Badge
                variant={
                  task.priority === "high"
                    ? "destructive"
                    : task.priority === "medium"
                      ? "default"
                      : "secondary"
                }
                className="mb-2"
              >
                {task.priority || "medium"} priority
              </Badge>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {task.title}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {task.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Description
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {task.description}
              </p>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            {task.featureId && (
              <div>
                <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  Feature
                </h3>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {task.featureId}
                </p>
              </div>
            )}
            {task.estimatedHours && (
              <div>
                <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  Estimate
                </h3>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {task.estimatedHours}h
                </p>
              </div>
            )}
            <div>
              <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Status
              </h3>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                {(task.status || "active").replace("_", " ")}
              </p>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
            <ParticleButton className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Start Implementation
            </ParticleButton>
            <ParticleButton variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              View in IDE
            </ParticleButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}
