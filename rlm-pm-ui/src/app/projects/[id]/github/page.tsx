"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  GitBranch,
  GitCommit,
  RefreshCw,
  Upload,
  Download,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import ParticleButton from "@/components/kokonutui/particle-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useProjectData } from "@/contexts/project-data-context";

interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  staged: number;
  modified: number;
  untracked: number;
  lastCommit?: {
    sha: string;
    message: string;
    author: string;
    date: string;
  };
}

interface SyncEvent {
  id: number;
  direction: "push" | "pull";
  filesChanged: string[];
  commitSha: string;
  timestamp: string;
}

export default function GitHubPage() {
  const params = useParams();
  const { project, loading: projectLoading, fetchData } = useProjectData();
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([]);
  const [statusLoading, setStatusLoading] = useState(true);
  const [syncing, setSyncing] = useState<"push" | "pull" | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [newRepo, setNewRepo] = useState("");
  const [newBranch, setNewBranch] = useState("main");
  const [pat, setPat] = useState("");

  // Initialize form values when project loads
  useEffect(() => {
    if (project) {
      setNewRepo(project.githubRepo || "");
      setNewBranch(project.githubBranch || "main");
    }
  }, [project]);

  // Fetch github-specific status data
  useEffect(() => {
    fetch(`/api/projects/${params.id}/github/status`)
      .then((r) => r.json())
      .then((statusRes) => {
        if (statusRes.data) {
          setGitStatus(statusRes.data.status);
          setSyncEvents(statusRes.data.events || []);
        }
        setStatusLoading(false);
      });
  }, [params.id]);

  const loading = projectLoading || statusLoading;

  const handlePush = async () => {
    setSyncing("push");
    try {
      await fetch(`/api/projects/${params.id}/github/push`, {
        method: "POST",
      });
      // Refresh status
      const res = await fetch(`/api/projects/${params.id}/github/status`);
      const data = await res.json();
      if (data.data) {
        setGitStatus(data.data.status);
        setSyncEvents(data.data.events || []);
      }
    } catch (err) {
      console.error("Push failed:", err);
    } finally {
      setSyncing(null);
    }
  };

  const handlePull = async () => {
    setSyncing("pull");
    try {
      await fetch(`/api/projects/${params.id}/github/pull`, {
        method: "POST",
      });
      // Refresh status
      const res = await fetch(`/api/projects/${params.id}/github/status`);
      const data = await res.json();
      if (data.data) {
        setGitStatus(data.data.status);
        setSyncEvents(data.data.events || []);
      }
    } catch (err) {
      console.error("Pull failed:", err);
    } finally {
      setSyncing(null);
    }
  };

  const handleSaveConfig = async () => {
    try {
      await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubRepo: newRepo || null,
          githubBranch: newBranch,
        }),
      });
      // Store PAT securely (in a real app, this would use a secure storage)
      if (pat) {
        localStorage.setItem(`github_pat_${params.id}`, pat);
      }
      // Refresh context to get updated project data
      await fetchData();
      setConfigOpen(false);
    } catch (err) {
      console.error("Failed to save config:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const isConnected = !!project?.githubRepo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-purple-500" />
            GitHub Sync
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Bi-directional sync with GitHub repository
          </p>
        </div>
        <Dialog open={configOpen} onOpenChange={setConfigOpen}>
          <DialogTrigger asChild>
            <ParticleButton variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </ParticleButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>GitHub Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="repo">Repository</Label>
                <Input
                  id="repo"
                  placeholder="owner/repo"
                  value={newRepo}
                  onChange={(e) => setNewRepo(e.target.value)}
                />
                <p className="text-xs text-neutral-500">
                  e.g., username/my-project
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  placeholder="main"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pat">Personal Access Token</Label>
                <Input
                  id="pat"
                  type="password"
                  placeholder="ghp_xxxx..."
                  value={pat}
                  onChange={(e) => setPat(e.target.value)}
                />
                <p className="text-xs text-neutral-500">
                  Required for private repos. Token needs repo scope.
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <ParticleButton
                  variant="outline"
                  onClick={() => setConfigOpen(false)}
                >
                  Cancel
                </ParticleButton>
                <ParticleButton onClick={handleSaveConfig}>
                  Save Configuration
                </ParticleButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Connection Status */}
      <div
        className={cn(
          "p-6 rounded-xl border-2",
          isConnected
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "p-3 rounded-full",
                isConnected
                  ? "bg-green-100 dark:bg-green-800/50"
                  : "bg-neutral-100 dark:bg-neutral-800"
              )}
            >
              {isConnected ? (
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-6 w-6 text-neutral-400" />
              )}
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                {isConnected ? "Connected" : "Not Connected"}
              </p>
              {isConnected ? (
                <a
                  href={`https://github.com/${project?.githubRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {project?.githubRepo}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Configure a GitHub repository to enable sync
                </p>
              )}
            </div>
          </div>
          {isConnected && (
            <Badge variant="outline" className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {project?.githubBranch || "main"}
            </Badge>
          )}
        </div>
      </div>

      {isConnected && (
        <>
          {/* Sync Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Push to GitHub
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Upload local changes to remote
                  </p>
                </div>
              </div>
              {gitStatus && gitStatus.ahead > 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">
                  {gitStatus.ahead} commit{gitStatus.ahead > 1 ? "s" : ""} ahead
                </p>
              )}
              <ParticleButton
                className="w-full"
                onClick={handlePush}
                disabled={syncing !== null}
              >
                {syncing === "push" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Pushing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Push Changes
                  </>
                )}
              </ParticleButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Pull from GitHub
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Download remote changes
                  </p>
                </div>
              </div>
              {gitStatus && gitStatus.behind > 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">
                  {gitStatus.behind} commit{gitStatus.behind > 1 ? "s" : ""}{" "}
                  behind
                </p>
              )}
              <ParticleButton
                variant="outline"
                className="w-full"
                onClick={handlePull}
                disabled={syncing !== null}
              >
                {syncing === "pull" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Pulling...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Pull Changes
                  </>
                )}
              </ParticleButton>
            </motion.div>
          </div>

          {/* Git Status */}
          {gitStatus && (
            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <GitCommit className="h-5 w-5" />
                Working Directory Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatusItem label="Branch" value={gitStatus.branch} />
                <StatusItem label="Staged" value={gitStatus.staged} />
                <StatusItem label="Modified" value={gitStatus.modified} />
                <StatusItem label="Untracked" value={gitStatus.untracked} />
                <StatusItem
                  label="Sync"
                  value={`+${gitStatus.ahead} / -${gitStatus.behind}`}
                />
              </div>
              {gitStatus.lastCommit && (
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                    Last Commit
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded font-mono">
                      {gitStatus.lastCommit.sha.slice(0, 7)}
                    </code>
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                      {gitStatus.lastCommit.message}
                    </span>
                    <span className="text-xs text-neutral-500 ml-auto">
                      {new Date(gitStatus.lastCommit.date).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sync History */}
          <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Sync History
            </h3>
            {syncEvents.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
                No sync events yet
              </p>
            ) : (
              <div className="space-y-3">
                {syncEvents.slice(0, 10).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                  >
                    <div
                      className={cn(
                        "p-1.5 rounded-full",
                        event.direction === "push"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-green-100 dark:bg-green-900/30"
                      )}
                    >
                      {event.direction === "push" ? (
                        <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 capitalize">
                        {event.direction}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {event.filesChanged?.length || 0} files •{" "}
                        {event.commitSha?.slice(0, 7)}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatusItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
      <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
        {value}
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
    </div>
  );
}
