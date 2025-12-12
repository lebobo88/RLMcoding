"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PipelineView } from "@/components/pipeline/pipeline-view";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Settings, CheckCircle, AlertCircle, X, RefreshCw } from "lucide-react";
import ParticleButton from "@/components/kokonutui/particle-button";
import { useProjectData } from "@/contexts/project-data-context";

interface ExecutionResult {
  success: boolean;
  message: string;
  phase: string;
  triggerFile?: string;
}

interface RefreshResult {
  success: boolean;
  message: string;
  phaseChanged: boolean;
  previousPhase?: string;
  newPhase?: string;
  summary?: {
    totalFeatures: number;
    totalTasks: number;
    completedTasks: number;
  };
}

export default function PipelinePage() {
  const params = useParams();
  const { project, projectData, refresh, refreshing } = useProjectData();
  const [executing, setExecuting] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [refreshResult, setRefreshResult] = useState<RefreshResult | null>(null);

  // Set initial selected phase when project loads
  useEffect(() => {
    if (project?.currentPhase && !selectedPhase) {
      setSelectedPhase(project.currentPhase);
    }
  }, [project?.currentPhase, selectedPhase]);

  // Auto-dismiss notifications
  useEffect(() => {
    if (executionResult) {
      const timer = setTimeout(() => setExecutionResult(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [executionResult]);

  useEffect(() => {
    if (refreshResult) {
      const timer = setTimeout(() => setRefreshResult(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [refreshResult]);

  const handleRefresh = async () => {
    setRefreshResult(null);
    setExecutionResult(null);

    const result = await refresh();

    setRefreshResult({
      success: result.success,
      message: result.message,
      phaseChanged: result.phaseChanged,
      previousPhase: result.previousPhase,
      newPhase: result.newPhase,
      summary: result.summary,
    });

    // Update selected phase if it changed
    if (result.phaseChanged && result.newPhase) {
      setSelectedPhase(result.newPhase);
    }
  };

  const handleRunPhase = async (phaseId: string) => {
    setExecuting(true);
    setExecutionResult(null);
    try {
      const res = await fetch(`/api/projects/${params.id}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: phaseId }),
      });
      const data = await res.json();
      if (data.data) {
        setExecutionResult({
          success: true,
          message: data.data.message,
          phase: phaseId,
          triggerFile: data.data.triggerFile,
        });
        // Refresh to get updated state after execution
        await refresh();
      } else if (data.error) {
        setExecutionResult({
          success: false,
          message: data.error.message,
          phase: phaseId,
        });
      }
    } catch (err) {
      console.error("Failed to execute phase:", err);
      setExecutionResult({
        success: false,
        message: "Failed to execute phase. Check console for details.",
        phase: phaseId,
      });
    } finally {
      setExecuting(false);
    }
  };

  const handlePhaseClick = (phaseId: string) => {
    setSelectedPhase(phaseId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Pipeline
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            9-phase RLM development workflow
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ParticleButton
            variant="outline"
            size="sm"
            disabled={executing || refreshing}
            onClick={handleRefresh}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Scanning..." : "Refresh"}
          </ParticleButton>
          <ParticleButton variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </ParticleButton>
        </div>
      </div>

      {/* Execution Result Notification */}
      <AnimatePresence>
        {executionResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              executionResult.success
                ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
            }`}
          >
            {executionResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  executionResult.success
                    ? "text-green-900 dark:text-green-100"
                    : "text-red-900 dark:text-red-100"
                }`}
              >
                {executionResult.success ? "Phase Triggered" : "Phase Failed"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  executionResult.success
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {executionResult.message}
              </p>
              {executionResult.triggerFile && (
                <p className="text-xs mt-2 font-mono text-green-600 dark:text-green-400">
                  Trigger: {executionResult.triggerFile}
                </p>
              )}
            </div>
            <button
              onClick={() => setExecutionResult(null)}
              className={`p-1 rounded-lg hover:bg-opacity-20 ${
                executionResult.success
                  ? "hover:bg-green-600 text-green-600 dark:text-green-400"
                  : "hover:bg-red-600 text-red-600 dark:text-red-400"
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refresh Result Notification */}
      <AnimatePresence>
        {refreshResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              refreshResult.success
                ? refreshResult.phaseChanged
                  ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                  : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
            }`}
          >
            {refreshResult.success ? (
              <RefreshCw
                className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  refreshResult.phaseChanged
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  refreshResult.success
                    ? refreshResult.phaseChanged
                      ? "text-blue-900 dark:text-blue-100"
                      : "text-green-900 dark:text-green-100"
                    : "text-red-900 dark:text-red-100"
                }`}
              >
                {refreshResult.success
                  ? refreshResult.phaseChanged
                    ? "Phase Updated"
                    : "Project Refreshed"
                  : "Refresh Failed"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  refreshResult.success
                    ? refreshResult.phaseChanged
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {refreshResult.message}
              </p>
              {refreshResult.summary && (
                <p
                  className={`text-xs mt-2 ${
                    refreshResult.phaseChanged
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {refreshResult.summary.totalFeatures} features, {refreshResult.summary.completedTasks}/{refreshResult.summary.totalTasks} tasks completed
                </p>
              )}
            </div>
            <button
              onClick={() => setRefreshResult(null)}
              className={`p-1 rounded-lg hover:bg-opacity-20 ${
                refreshResult.success
                  ? refreshResult.phaseChanged
                    ? "hover:bg-blue-600 text-blue-600 dark:text-blue-400"
                    : "hover:bg-green-600 text-green-600 dark:text-green-400"
                  : "hover:bg-red-600 text-red-600 dark:text-red-400"
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pipeline View */}
      <PipelineView
        currentPhase={project?.currentPhase || "discover"}
        phaseInfo={projectData?.phases}
        onPhaseClick={handlePhaseClick}
        onRunPhase={handleRunPhase}
      />

      {/* Phase Details Panel */}
      {selectedPhase && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
        >
          <PhaseDetails
            phaseId={selectedPhase}
            projectId={params.id as string}
            isCurrentPhase={selectedPhase === project?.currentPhase}
            onRun={() => handleRunPhase(selectedPhase)}
            executing={executing}
          />
        </motion.div>
      )}
    </div>
  );
}

function PhaseDetails({
  phaseId,
  projectId,
  isCurrentPhase,
  onRun,
  executing,
}: {
  phaseId: string;
  projectId: string;
  isCurrentPhase: boolean;
  onRun: () => void;
  executing: boolean;
}) {
  const phaseInfo: Record<
    string,
    { title: string; description: string; command: string; outputs: string[] }
  > = {
    discover: {
      title: "Discovery Phase",
      description:
        "Research and gather requirements. Generate PRD and constitution documents.",
      command: "/cc-discover",
      outputs: ["RLM/specs/PRD.md", "RLM/specs/constitution.md"],
    },
    "design-system": {
      title: "Design System Phase",
      description:
        "Create design tokens, color palette, typography, and component library.",
      command: "/cc-design system",
      outputs: ["RLM/specs/design/design-system.md", "RLM/specs/design/tokens/"],
    },
    specs: {
      title: "Specifications Phase",
      description: "Generate technical specifications and architecture documents.",
      command: "/cc-create-specs",
      outputs: ["RLM/specs/features/", "RLM/specs/architecture/"],
    },
    "feature-design": {
      title: "Feature Design Phase",
      description: "Create UI/UX design specifications for each feature.",
      command: "/cc-design feature",
      outputs: ["RLM/specs/features/*/design-spec.md"],
    },
    tasks: {
      title: "Task Breakdown Phase",
      description: "Break features into fine-grained implementation tasks.",
      command: "/cc-create-tasks",
      outputs: ["RLM/tasks/active/"],
    },
    implement: {
      title: "Implementation Phase",
      description: "TDD implementation of tasks using design tokens.",
      command: "/cc-implement all",
      outputs: ["Source code", "Test files"],
    },
    quality: {
      title: "Quality Phase",
      description: "Design QA, code review, and test coverage analysis.",
      command: "/cc-design qa && /cc-review && /cc-test",
      outputs: ["QA reports", "Coverage reports"],
    },
    verify: {
      title: "Verification Phase",
      description: "E2E testing per feature with accessibility checks.",
      command: "/cc-verify",
      outputs: ["E2E test results", "Accessibility report"],
    },
    report: {
      title: "Report Phase",
      description: "Generate final project completion summary.",
      command: "Auto-generated",
      outputs: ["Project summary"],
    },
  };

  const info = phaseInfo[phaseId] || {
    title: phaseId,
    description: "",
    command: "",
    outputs: [],
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {info.title}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {info.description}
          </p>
        </div>
        {isCurrentPhase && (
          <ParticleButton onClick={onRun} disabled={executing}>
            {executing ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Run Phase
              </>
            )}
          </ParticleButton>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            Command
          </p>
          <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-lg font-mono">
            {info.command}
          </code>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            Outputs
          </p>
          <div className="flex flex-wrap gap-2">
            {info.outputs.map((output) => (
              <span
                key={output}
                className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded"
              >
                {output}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
