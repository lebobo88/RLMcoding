"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Search,
  Palette,
  FileText,
  PenTool,
  ListTodo,
  Code,
  ShieldCheck,
  CheckCircle,
  FileBarChart,
  ChevronRight,
  Play,
  FileCheck,
} from "lucide-react";
import ParticleButton from "@/components/kokonutui/particle-button";

export interface PhaseInfo {
  phase: string;
  completed: boolean;
  inProgress: boolean;
  artifacts: string[];
}

const phases = [
  {
    id: "discover",
    name: "Discovery",
    shortName: "1. Discover",
    icon: Search,
    description: "Research and requirements gathering",
    outputs: ["PRD.md", "constitution.md"],
  },
  {
    id: "design-system",
    name: "Design System",
    shortName: "2. Design",
    icon: Palette,
    description: "Design tokens and component library",
    outputs: ["design-system.md", "tokens.json"],
  },
  {
    id: "specs",
    name: "Specifications",
    shortName: "3. Specs",
    icon: FileText,
    description: "Technical specifications",
    outputs: ["features/", "architecture/"],
  },
  {
    id: "feature-design",
    name: "Feature Design",
    shortName: "4. Feature",
    icon: PenTool,
    description: "UI/UX design for each feature",
    outputs: ["feature-design-spec.md"],
  },
  {
    id: "tasks",
    name: "Task Breakdown",
    shortName: "5. Tasks",
    icon: ListTodo,
    description: "Break features into tasks",
    outputs: ["tasks/active/"],
  },
  {
    id: "implement",
    name: "Implementation",
    shortName: "6. Implement",
    icon: Code,
    description: "TDD implementation",
    outputs: ["Source code", "Tests"],
  },
  {
    id: "quality",
    name: "Quality",
    shortName: "7. Quality",
    icon: ShieldCheck,
    description: "Design QA, code review, tests",
    outputs: ["QA report", "Coverage"],
  },
  {
    id: "verify",
    name: "Verification",
    shortName: "8. Verify",
    icon: CheckCircle,
    description: "E2E testing per feature",
    outputs: ["E2E tests", "Accessibility"],
  },
  {
    id: "report",
    name: "Report",
    shortName: "9. Report",
    icon: FileBarChart,
    description: "Project completion summary",
    outputs: ["Final report"],
  },
];

type PhaseStatus = "completed" | "current" | "pending" | "blocked";

interface PipelineViewProps {
  currentPhase: string | null;
  phaseStatus?: Record<string, PhaseStatus>;
  phaseInfo?: PhaseInfo[];
  onPhaseClick?: (phaseId: string) => void;
  onRunPhase?: (phaseId: string) => void;
}

export function PipelineView({
  currentPhase,
  phaseStatus = {},
  phaseInfo = [],
  onPhaseClick,
  onRunPhase,
}: PipelineViewProps) {
  // Create a map of phase info for quick lookup
  const phaseInfoMap = new Map(phaseInfo.map((p) => [p.phase, p]));

  const getPhaseStatus = (phaseId: string): PhaseStatus => {
    // First check explicit phaseStatus prop
    if (phaseStatus[phaseId]) return phaseStatus[phaseId];

    // Then check phaseInfo from checkpoint
    const info = phaseInfoMap.get(phaseId);
    if (info) {
      if (info.completed) return "completed";
      if (info.inProgress) return "current";
    }

    // Fall back to position-based detection
    const currentIndex = phases.findIndex((p) => p.id === currentPhase);
    const phaseIndex = phases.findIndex((p) => p.id === phaseId);

    if (phaseIndex < currentIndex) return "completed";
    if (phaseIndex === currentIndex) return "current";
    return "pending";
  };

  const getPhaseArtifacts = (phaseId: string): string[] => {
    const info = phaseInfoMap.get(phaseId);
    return info?.artifacts || [];
  };

  const statusColors: Record<PhaseStatus, string> = {
    completed:
      "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400",
    current:
      "bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/20",
    pending:
      "bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400",
    blocked:
      "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400",
  };

  const iconColors: Record<PhaseStatus, string> = {
    completed: "text-green-600 dark:text-green-400",
    current: "text-blue-600 dark:text-blue-400",
    pending: "text-neutral-400 dark:text-neutral-500",
    blocked: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="space-y-6">
      {/* Compact Pipeline Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase.id);
          const Icon = phase.icon;

          return (
            <div key={phase.id} className="flex items-center">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onPhaseClick?.(phase.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:scale-105",
                  statusColors[status]
                )}
              >
                <Icon className={cn("h-4 w-4", iconColors[status])} />
                <span className="text-xs font-medium whitespace-nowrap">
                  {phase.shortName}
                </span>
                {status === "completed" && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
              </motion.button>
              {index < phases.length - 1 && (
                <ChevronRight className="h-4 w-4 text-neutral-300 dark:text-neutral-700 mx-1 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Phase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase.id);
          const Icon = phase.icon;

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-4 rounded-xl border-2 transition-all",
                statusColors[status],
                status === "current" && "shadow-lg"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      status === "completed" &&
                        "bg-green-200 dark:bg-green-800/50",
                      status === "current" && "bg-blue-200 dark:bg-blue-800/50",
                      status === "pending" &&
                        "bg-neutral-200 dark:bg-neutral-700",
                      status === "blocked" && "bg-red-200 dark:bg-red-800/50"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", iconColors[status])} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{phase.name}</h3>
                    <p className="text-xs opacity-70">{phase.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium opacity-70">
                  {getPhaseArtifacts(phase.id).length > 0 ? "Discovered:" : "Outputs:"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {getPhaseArtifacts(phase.id).length > 0 ? (
                    // Show discovered artifacts from import
                    getPhaseArtifacts(phase.id).map((artifact) => (
                      <span
                        key={artifact}
                        className="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-1"
                      >
                        <FileCheck className="h-3 w-3" />
                        {artifact}
                      </span>
                    ))
                  ) : (
                    // Show expected outputs
                    phase.outputs.map((output) => (
                      <span
                        key={output}
                        className="px-2 py-0.5 text-xs rounded-full bg-black/5 dark:bg-white/10"
                      >
                        {output}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {status === "current" && onRunPhase && (
                <div className="mt-4 pt-3 border-t border-current/20">
                  <ParticleButton
                    size="sm"
                    className="w-full"
                    onClick={() => onRunPhase(phase.id)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Run Phase
                  </ParticleButton>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
