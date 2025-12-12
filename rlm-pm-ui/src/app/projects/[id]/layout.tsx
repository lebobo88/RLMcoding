"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  GitBranch,
  FolderOpen,
  Workflow,
  ListTodo,
  Layers,
  FileText,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectDataProvider, useProjectData } from "@/contexts/project-data-context";

const navItems = [
  { href: "", label: "Overview", icon: FolderOpen },
  { href: "/pipeline", label: "Pipeline", icon: Workflow },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/features", label: "Features", icon: Layers },
  { href: "/specs", label: "Specs", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/github", label: "GitHub", icon: GitBranch },
];

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectDataProvider>
      <ProjectLayoutContent>{children}</ProjectLayoutContent>
    </ProjectDataProvider>
  );
}

function ProjectLayoutContent({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const { project, refresh, refreshing } = useProjectData();

  const handleSync = async () => {
    await refresh();
  };

  const basePath = `/projects/${params.id}`;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {project?.name || "Loading..."}
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-md">
                  {project?.localPath}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {project?.githubRepo && (
                <a
                  href={`https://github.com/${project.githubRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  <GitBranch className="h-4 w-4" />
                  {project.githubRepo}
                </a>
              )}
              <button
                onClick={handleSync}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={cn("h-4 w-4", refreshing && "animate-spin")}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <nav className="flex items-center gap-1 -mb-px overflow-x-auto">
            {navItems.map((item) => {
              const href = `${basePath}${item.href}`;
              const isActive =
                item.href === ""
                  ? pathname === basePath
                  : pathname.startsWith(href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
