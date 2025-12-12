"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/dashboard/project-card";
import ParticleButton from "@/components/kokonutui/particle-button";
import Loader from "@/components/kokonutui/loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, FolderOpen, Zap, CheckCircle2, AlertCircle, Upload, X, FileText, ListTodo, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";

interface ImportedProjectInfo {
  name: string;
  currentPhase: string;
  summary: {
    totalFeatures: number;
    totalTasks: number;
    completedTasks: number;
    hasPRD: boolean;
    hasConstitution: boolean;
  };
}

interface Project {
  id: string;
  name: string;
  localPath: string;
  githubRepo: string | null;
  githubBranch: string | null;
  status: string;
  currentPhase: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProjectWithStats extends Project {
  stats?: {
    totalTasks: number;
    completedTasks: number;
    features: number;
  };
}

export default function Dashboard() {
  const [projects, setProjects] = useState<ProjectWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectPath, setNewProjectPath] = useState("");
  const [newProjectGithub, setNewProjectGithub] = useState("");

  // Import state
  const [importPath, setImportPath] = useState("");
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState<ImportedProjectInfo | null>(null);

  // Auto-dismiss import success notification
  useEffect(() => {
    if (importSuccess) {
      const timer = setTimeout(() => setImportSuccess(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [importSuccess]);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      const json = await res.json();

      if (json.error) {
        setError(json.error.message);
        return;
      }

      // Fetch stats for each project
      const projectsWithStats = await Promise.all(
        json.data.map(async (project: Project) => {
          try {
            const dataRes = await fetch(`/api/projects/${project.id}/data`);
            const dataJson = await dataRes.json();
            if (dataJson.data?.summary) {
              return {
                ...project,
                stats: {
                  totalTasks: dataJson.data.summary.totalTasks,
                  completedTasks: dataJson.data.summary.completedTasks,
                  features: dataJson.data.summary.totalFeatures,
                },
              };
            }
          } catch {
            // Ignore stats fetch errors
          }
          return project;
        })
      );

      setProjects(projectsWithStats);
    } catch (err) {
      setError("Failed to fetch projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName,
          localPath: newProjectPath,
          githubRepo: newProjectGithub || null,
        }),
      });

      const json = await res.json();

      if (json.error) {
        setError(json.error.message);
        return;
      }

      // Refresh projects and close dialog
      await fetchProjects();
      setDialogOpen(false);
      setNewProjectName("");
      setNewProjectPath("");
      setNewProjectGithub("");
    } catch (err) {
      setError("Failed to create project");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleImportProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setImporting(true);
    setError(null);

    try {
      const res = await fetch("/api/projects/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          localPath: importPath,
        }),
      });

      const json = await res.json();

      if (json.error) {
        setError(json.error.message);
        return;
      }

      // Set import success info for notification
      if (json.data) {
        setImportSuccess({
          name: json.data.name,
          currentPhase: json.data.currentPhase,
          summary: {
            totalFeatures: json.data.featureCount || json.data.summary?.totalFeatures || 0,
            totalTasks: json.data.taskCount || json.data.summary?.totalTasks || 0,
            completedTasks: json.data.summary?.completedTasks || 0,
            hasPRD: json.data.hasPRD || false,
            hasConstitution: json.data.hasConstitution || false,
          },
        });
      }

      // Refresh projects and close dialog
      await fetchProjects();
      setDialogOpen(false);
      setImportPath("");
    } catch (err) {
      setError("Failed to import project");
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  // Calculate overall stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalTasks = projects.reduce((sum, p) => sum + (p.stats?.totalTasks || 0), 0);
  const completedTasks = projects.reduce(
    (sum, p) => sum + (p.stats?.completedTasks || 0),
    0
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  RLM Project Manager
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  AI-Powered Development Workflow
                </p>
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <ParticleButton
                  variant="default"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Project
                </ParticleButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Project</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="create" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="create" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create New
                    </TabsTrigger>
                    <TabsTrigger value="import" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Import Existing
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="create">
                    <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                          id="name"
                          placeholder="My Awesome Project"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="path">Local Path</Label>
                        <Input
                          id="path"
                          placeholder="C:\Projects\my-project"
                          value={newProjectPath}
                          onChange={(e) => setNewProjectPath(e.target.value)}
                          required
                        />
                        <p className="text-xs text-neutral-500">
                          RLM folder structure will be created here
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub Repository (Optional)</Label>
                        <Input
                          id="github"
                          placeholder="owner/repo"
                          value={newProjectGithub}
                          onChange={(e) => setNewProjectGithub(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <ParticleButton
                          type="button"
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancel
                        </ParticleButton>
                        <ParticleButton type="submit" disabled={creating}>
                          {creating ? "Creating..." : "Create Project"}
                        </ParticleButton>
                      </div>
                    </form>
                  </TabsContent>
                  <TabsContent value="import">
                    <form onSubmit={handleImportProject} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="import-path">Project Path</Label>
                        <Input
                          id="import-path"
                          placeholder="C:\Projects\existing-rlm-project"
                          value={importPath}
                          onChange={(e) => setImportPath(e.target.value)}
                          required
                        />
                        <p className="text-xs text-neutral-500">
                          Path to an existing folder with an RLM/ directory
                        </p>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <ParticleButton
                          type="button"
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancel
                        </ParticleButton>
                        <ParticleButton type="submit" disabled={importing}>
                          {importing ? "Importing..." : "Import Project"}
                        </ParticleButton>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Import Success Notification */}
        <AnimatePresence>
          {importSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Project Imported Successfully
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      &quot;{importSuccess.name}&quot; has been added to your projects.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                        <Layers className="h-3.5 w-3.5" />
                        <span>Phase: {importSuccess.currentPhase}</span>
                      </div>
                      {importSuccess.summary.hasPRD && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                          <FileText className="h-3.5 w-3.5" />
                          <span>PRD Found</span>
                        </div>
                      )}
                      {importSuccess.summary.totalFeatures > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                          <FolderOpen className="h-3.5 w-3.5" />
                          <span>{importSuccess.summary.totalFeatures} Features</span>
                        </div>
                      )}
                      {importSuccess.summary.totalTasks > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                          <ListTodo className="h-3.5 w-3.5" />
                          <span>{importSuccess.summary.completedTasks}/{importSuccess.summary.totalTasks} Tasks</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setImportSuccess(null)}
                  className="p-1 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 text-green-600 dark:text-green-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            label="Total Projects"
            value={totalProjects}
            icon={<FolderOpen className="h-5 w-5" />}
            color="blue"
          />
          <StatCard
            label="Active Projects"
            value={activeProjects}
            icon={<Zap className="h-5 w-5" />}
            color="emerald"
          />
          <StatCard
            label="Total Tasks"
            value={totalTasks}
            icon={<AlertCircle className="h-5 w-5" />}
            color="amber"
          />
          <StatCard
            label="Completed Tasks"
            value={completedTasks}
            icon={<CheckCircle2 className="h-5 w-5" />}
            color="green"
          />
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="p-4 rounded-full bg-neutral-100 dark:bg-neutral-800 w-fit mx-auto mb-4">
              <FolderOpen className="h-8 w-8 text-neutral-400" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              No projects yet
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              Create your first RLM project to get started
            </p>
            <ParticleButton onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </ParticleButton>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                localPath={project.localPath}
                githubRepo={project.githubRepo}
                status={project.status}
                currentPhase={project.currentPhase}
                stats={project.stats}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "emerald" | "amber" | "green";
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
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
    </div>
  );
}
