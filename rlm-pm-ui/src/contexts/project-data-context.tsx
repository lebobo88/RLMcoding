"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";

// Types matching the API response
interface Task {
  id: string;
  title: string;
  description?: string;
  featureId?: string;
  priority?: string;
  status?: string;
  estimatedEffort?: string;
  acceptanceCriteria?: string[];
  dependencies?: string[];
}

interface Feature {
  id: string;
  name: string;
  status?: string;
  priority?: string;
  description?: string;
  hasDesignSpec?: boolean;
  designSpecPath?: string;
}

export interface PhaseInfo {
  phase: string;
  completed: boolean;
  inProgress: boolean;
  artifacts: string[];
}

export interface ProjectSummary {
  totalFeatures: number;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  blockedTasks: number;
  hasPRD: boolean;
  hasConstitution: boolean;
  totalTokensUsed: number;
  hasDesignSystem?: boolean;
  hasDesignTokens?: boolean;
  hasArchitecture?: boolean;
  hasEpics?: boolean;
  hasE2ETests?: boolean;
  e2eTestCount?: number;
  researchSessions?: number;
}

export interface ProjectData {
  prd?: string;
  constitution?: string;
  features: Feature[];
  tasks: {
    active: Task[];
    completed: Task[];
    blocked: Task[];
  };
  summary: ProjectSummary;
  phases?: PhaseInfo[];
  tokenUsage?: Array<{
    sessionId: string;
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
  }>;
}

export interface Project {
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

interface RefreshResult {
  success: boolean;
  message: string;
  phaseChanged: boolean;
  previousPhase?: string;
  newPhase?: string;
  summary?: ProjectSummary;
}

interface ProjectDataContextType {
  // Data
  project: Project | null;
  projectData: ProjectData | null;
  loading: boolean;
  error: string | null;

  // Actions
  refresh: () => Promise<RefreshResult>;
  refreshing: boolean;

  // Helper to manually trigger a data fetch (without refresh API)
  fetchData: () => Promise<void>;
}

const ProjectDataContext = createContext<ProjectDataContextType | null>(null);

export function ProjectDataProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch both project info and project data
  const fetchData = useCallback(async () => {
    if (!projectId) return;

    try {
      setError(null);

      const [projectRes, dataRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/data`),
      ]);

      const [projectJson, dataJson] = await Promise.all([
        projectRes.json(),
        dataRes.json(),
      ]);

      if (projectJson.error) {
        setError(projectJson.error.message);
      } else if (projectJson.data) {
        setProject(projectJson.data);
      }

      if (dataJson.error) {
        setError(dataJson.error.message);
      } else if (dataJson.data) {
        setProjectData(dataJson.data);
      }
    } catch (err) {
      console.error("Failed to fetch project data:", err);
      setError("Failed to fetch project data");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh function that calls the refresh API and re-fetches data
  const refresh = useCallback(async (): Promise<RefreshResult> => {
    if (!projectId) {
      return { success: false, message: "No project ID", phaseChanged: false };
    }

    setRefreshing(true);

    try {
      // Call refresh API
      const res = await fetch(`/api/projects/${projectId}/refresh`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.error) {
        return {
          success: false,
          message: data.error.message,
          phaseChanged: false,
        };
      }

      // Update project with new phase
      if (data.data) {
        setProject((p) => p ? { ...p, currentPhase: data.data.currentPhase } : null);

        // Re-fetch all data to get updated state
        await fetchData();

        return {
          success: true,
          message: data.data.phaseChanged
            ? `Phase changed from "${data.data.previousPhase}" to "${data.data.currentPhase}"`
            : "Project state refreshed - no phase changes detected",
          phaseChanged: data.data.phaseChanged,
          previousPhase: data.data.previousPhase,
          newPhase: data.data.currentPhase,
          summary: data.data.summary,
        };
      }

      return { success: true, message: "Refreshed", phaseChanged: false };
    } catch (err) {
      console.error("Failed to refresh project:", err);
      return {
        success: false,
        message: "Failed to refresh project. Check console for details.",
        phaseChanged: false,
      };
    } finally {
      setRefreshing(false);
    }
  }, [projectId, fetchData]);

  return (
    <ProjectDataContext.Provider
      value={{
        project,
        projectData,
        loading,
        error,
        refresh,
        refreshing,
        fetchData,
      }}
    >
      {children}
    </ProjectDataContext.Provider>
  );
}

export function useProjectData() {
  const context = useContext(ProjectDataContext);
  if (!context) {
    throw new Error("useProjectData must be used within a ProjectDataProvider");
  }
  return context;
}
