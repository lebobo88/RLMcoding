import { RLMProjectData } from "./parser";

// 9-phase pipeline in order
export const PHASES = [
  "discover",
  "design-system",
  "specs",
  "feature-design",
  "tasks",
  "implement",
  "quality",
  "verify",
  "report",
] as const;

export type PhaseName = (typeof PHASES)[number];

export interface PhaseStatus {
  phase: string;
  completed: boolean;
  inProgress: boolean;
  artifacts: string[];
}

export interface PhaseAnalysisResult {
  currentPhase: string;
  phases: PhaseStatus[];
}

export interface ComprehensiveSummary {
  // Core counts
  totalFeatures: number;
  totalTasks: number;
  completedTasks: number;
  blockedTasks: number;
  activeTasks: number;

  // Discovery
  hasPRD: boolean;
  hasConstitution: boolean;
  researchSessions: number;

  // Design
  hasDesignSystem: boolean;
  hasDesignTokens: boolean;
  hasUXResearch: boolean;
  componentSpecs: number;
  featuresWithDesign: number;

  // Architecture
  hasArchitecture: boolean;
  architectureDocs: number;
  hasEpics: boolean;

  // Quality
  hasQAReport: boolean;
  hasReviewReport: boolean;
  hasMetrics: boolean;

  // Verification
  hasE2ETests: boolean;
  e2eTestCount: number;

  // Report
  hasFinalReport: boolean;

  // Config
  hasConfig: boolean;
  configVersion?: string;
}

/**
 * Analyze project phases using comprehensive parser data
 */
export function analyzeProjectPhases(
  projectData: RLMProjectData
): PhaseAnalysisResult {
  const phases: PhaseStatus[] = [];
  let currentPhase = "discover";

  // Phase 1: Discovery - PRD, constitution, and research sessions
  const hasPRD = !!projectData.prd;
  const hasConstitution = !!projectData.constitution;
  const hasResearchSessions =
    projectData.research?.sessions && projectData.research.sessions.length > 0;
  const hasProjectResearch = projectData.research?.projectResearch;
  const discoveryComplete = hasPRD && hasConstitution;

  const discoveryArtifacts: string[] = [];
  if (hasPRD) discoveryArtifacts.push("RLM/specs/PRD.md");
  if (hasConstitution) discoveryArtifacts.push("RLM/specs/constitution.md");
  if (hasResearchSessions) {
    discoveryArtifacts.push(
      `RLM/research/sessions/ (${projectData.research!.sessions.length} sessions)`
    );
  }
  if (hasProjectResearch) discoveryArtifacts.push("RLM/research/project/");

  phases.push({
    phase: "discover",
    completed: discoveryComplete,
    inProgress: hasPRD && !hasConstitution,
    artifacts: discoveryArtifacts,
  });

  // Phase 2: Design System - design-system.md, tokens, UX research, component specs
  const hasDesignSystem = projectData.design?.designSystem?.exists || false;
  const hasTokens = projectData.design?.tokens?.exists || false;
  const hasUXResearch = projectData.design?.uxResearch?.exists || false;
  const componentCount = projectData.design?.components?.length || 0;
  const designComplete = hasDesignSystem;

  const designArtifacts: string[] = [];
  if (hasDesignSystem) {
    const philosophy = projectData.design?.designSystem?.philosophy;
    const tier = projectData.design?.designSystem?.animationTier;
    let desc = "RLM/specs/design/design-system.md";
    if (philosophy || tier) {
      const details = [philosophy, tier].filter(Boolean).join(", ");
      desc += ` (${details})`;
    }
    designArtifacts.push(desc);
  }
  if (hasTokens) {
    const formats = projectData.design?.tokens?.formats || [];
    designArtifacts.push(
      `RLM/specs/design/tokens/ (${formats.join(", ") || "various formats"})`
    );
  }
  if (hasUXResearch) {
    const ux = projectData.design?.uxResearch;
    const details = [];
    if (ux?.hasPersonas) details.push("personas");
    if (ux?.hasJourneyMaps) details.push("journeys");
    designArtifacts.push(
      `RLM/specs/design/ux-research.md${details.length ? ` (${details.join(", ")})` : ""}`
    );
  }
  if (componentCount > 0) {
    designArtifacts.push(`RLM/specs/design/components/ (${componentCount} specs)`);
  }

  phases.push({
    phase: "design-system",
    completed: designComplete,
    inProgress: discoveryComplete && !designComplete,
    artifacts: designArtifacts,
  });

  // Phase 3: Specifications - features, architecture, epics
  const hasFeatures = projectData.features.length > 0;
  const hasArchitecture = projectData.architecture?.exists || false;
  const hasEpics = projectData.epics?.exists || false;
  const specsComplete = hasFeatures && hasArchitecture;

  const specsArtifacts: string[] = [];
  if (hasFeatures) {
    specsArtifacts.push(
      `RLM/specs/features/ (${projectData.features.length} features)`
    );
  }
  if (hasArchitecture) {
    const archDocs = projectData.architecture?.documents?.length || 0;
    const archDetails = [];
    if (projectData.architecture?.hasOverview) archDetails.push("overview");
    if (projectData.architecture?.hasADRs) archDetails.push("ADRs");
    specsArtifacts.push(
      `RLM/specs/architecture/ (${archDocs} docs${archDetails.length ? `: ${archDetails.join(", ")}` : ""})`
    );
  }
  if (hasEpics) {
    const epicCount = projectData.epics?.epics?.length || 0;
    const hasBreakdown = projectData.epics?.hasBreakdown;
    specsArtifacts.push(
      `RLM/specs/epics/ (${epicCount} epics${hasBreakdown ? ", breakdown" : ""})`
    );
  }

  phases.push({
    phase: "specs",
    completed: specsComplete,
    inProgress: designComplete && !specsComplete && hasFeatures,
    artifacts: specsArtifacts,
  });

  // Phase 4: Feature Design - design specs per feature
  const featuresWithDesign = projectData.features.filter((f) => f.hasDesignSpec);
  const featureDesignComplete =
    hasFeatures && featuresWithDesign.length === projectData.features.length;

  const featureDesignArtifacts: string[] = [];
  if (featuresWithDesign.length > 0) {
    if (featuresWithDesign.length <= 3) {
      featureDesignArtifacts.push(
        ...featuresWithDesign.map((f) => `${f.id}/design-spec.md`)
      );
    } else {
      featureDesignArtifacts.push(
        `${featuresWithDesign.length}/${projectData.features.length} features with design specs`
      );
    }
  }

  phases.push({
    phase: "feature-design",
    completed: featureDesignComplete,
    inProgress:
      specsComplete && featuresWithDesign.length > 0 && !featureDesignComplete,
    artifacts: featureDesignArtifacts,
  });

  // Phase 5: Tasks - task breakdown
  const hasTasks =
    projectData.tasks.active.length > 0 || projectData.tasks.completed.length > 0;
  const tasksComplete = hasTasks && projectData.tasks.active.length > 0;

  const taskArtifacts: string[] = [];
  if (hasTasks) {
    const parts = [];
    if (projectData.tasks.active.length > 0)
      parts.push(`${projectData.tasks.active.length} active`);
    if (projectData.tasks.completed.length > 0)
      parts.push(`${projectData.tasks.completed.length} completed`);
    if (projectData.tasks.blocked.length > 0)
      parts.push(`${projectData.tasks.blocked.length} blocked`);
    taskArtifacts.push(`RLM/tasks/ (${parts.join(", ")})`);
  }

  phases.push({
    phase: "tasks",
    completed: tasksComplete,
    inProgress: featureDesignComplete && !tasksComplete,
    artifacts: taskArtifacts,
  });

  // Phase 6: Implementation - completed tasks
  // Check completion from multiple sources:
  // 1. Tasks physically in completed/ folder
  // 2. Task status in frontmatter showing "completed"
  // 3. Feature verification status in progress/status.json
  const completedFromFolder = projectData.tasks.completed.length;
  const completedFromStatus = projectData.tasks.active.filter(
    (t) => t.status === "completed"
  ).length;
  const totalCompletedTasks = completedFromFolder + completedFromStatus;
  const hasCompletedTasks = totalCompletedTasks > 0;

  // Check if all features are verified in status.json (overrides task-level tracking)
  const progressFeatures = projectData.progress?.features || {};
  const verifiedFeatureCount = Object.values(progressFeatures).filter(
    (f) => f.status === "verified" || f.status === "complete" || f.status === "completed"
  ).length;
  const totalFeaturesInProgress = Object.keys(progressFeatures).length;

  // Also check overallStatus and summary from newer status.json format
  const overallStatusVerified = projectData.progress?.overallStatus === "verified";
  const summaryComplete = projectData.progress?.summary &&
    projectData.progress.summary.total &&
    projectData.progress.summary.verified === projectData.progress.summary.total;

  const allFeaturesVerified =
    overallStatusVerified ||
    summaryComplete ||
    (totalFeaturesInProgress > 0 && verifiedFeatureCount === totalFeaturesInProgress);

  // Check progress metrics for completion
  const progressMetrics = projectData.progress?.metrics;
  const metricsShowComplete = progressMetrics &&
    progressMetrics.totalTasks > 0 &&
    progressMetrics.completed === progressMetrics.totalTasks;

  // All tasks complete if:
  // - All features verified in status.json, OR
  // - Metrics show 100% complete, OR
  // - No active/blocked tasks and we have completed tasks
  const allTasksComplete =
    allFeaturesVerified ||
    metricsShowComplete ||
    (hasTasks &&
      projectData.tasks.active.length === 0 &&
      projectData.tasks.blocked.length === 0 &&
      hasCompletedTasks);

  const implementArtifacts: string[] = [];
  if (allFeaturesVerified) {
    implementArtifacts.push(`${verifiedFeatureCount} features verified`);
  }
  if (totalCompletedTasks > 0) {
    implementArtifacts.push(`${totalCompletedTasks} tasks implemented`);
  }
  if (projectData.tasks.blocked.length > 0) {
    implementArtifacts.push(`${projectData.tasks.blocked.length} tasks blocked`);
  }

  phases.push({
    phase: "implement",
    completed: allTasksComplete,
    inProgress: tasksComplete && (hasCompletedTasks || verifiedFeatureCount > 0) && !allTasksComplete,
    artifacts: implementArtifacts,
  });

  // Phase 7: Quality - QA report, review report, metrics
  const hasQAReports = projectData.qaReport?.exists || false;
  const hasReviewReports = projectData.reviewReport?.exists || false;
  const hasMetrics = projectData.metrics?.exists || false;
  const qualityComplete = hasQAReports || hasReviewReports;

  const qualityArtifacts: string[] = [];
  if (hasQAReports) {
    const qa = projectData.qaReport;
    let desc = "RLM/progress/qa-report.json";
    if (qa?.score !== undefined) desc += ` (score: ${qa.score}%)`;
    else if (qa?.passed !== undefined && qa?.total !== undefined)
      desc += ` (${qa.passed}/${qa.total} passed)`;
    qualityArtifacts.push(desc);
  }
  if (hasReviewReports) {
    const review = projectData.reviewReport;
    let desc = "RLM/progress/review-report.json";
    if (review?.issues !== undefined) {
      desc += ` (${review.issues} issues`;
      if (review?.criticalIssues !== undefined && review.criticalIssues > 0) {
        desc += `, ${review.criticalIssues} critical`;
      }
      desc += ")";
    }
    qualityArtifacts.push(desc);
  }
  if (hasMetrics) {
    const metrics = projectData.metrics;
    const details = [];
    if (metrics?.velocity !== undefined) details.push(`velocity: ${metrics.velocity}`);
    if (metrics?.coverage !== undefined)
      details.push(`coverage: ${metrics.coverage}%`);
    qualityArtifacts.push(
      `RLM/progress/metrics.json${details.length ? ` (${details.join(", ")})` : ""}`
    );
  }

  phases.push({
    phase: "quality",
    completed: qualityComplete,
    inProgress: allTasksComplete && !qualityComplete,
    artifacts: qualityArtifacts,
  });

  // Phase 8: Verification - E2E tests
  const hasE2ETests = projectData.e2eTests?.exists || false;
  const verifyComplete = hasE2ETests && qualityComplete;

  const verifyArtifacts: string[] = [];
  if (hasE2ETests) {
    const e2e = projectData.e2eTests;
    const parts = [];
    if (e2e?.testFiles && e2e.testFiles.length > 0)
      parts.push(`${e2e.testFiles.length} tests`);
    if (e2e?.fixtureFiles && e2e.fixtureFiles.length > 0)
      parts.push(`${e2e.fixtureFiles.length} fixtures`);
    if (e2e?.featureFiles && e2e.featureFiles.length > 0)
      parts.push(`${e2e.featureFiles.length} features`);
    verifyArtifacts.push(
      `tests/e2e/${parts.length ? ` (${parts.join(", ")})` : ""}`
    );
  }

  phases.push({
    phase: "verify",
    completed: verifyComplete,
    inProgress: qualityComplete && !verifyComplete,
    artifacts: verifyArtifacts,
  });

  // Phase 9: Report - final report
  const hasReport = projectData.finalReport?.exists || false;

  phases.push({
    phase: "report",
    completed: hasReport,
    inProgress: verifyComplete && !hasReport,
    artifacts: hasReport ? ["RLM/progress/final-report.md"] : [],
  });

  // Determine current phase (first incomplete phase after completed ones)
  for (let i = 0; i < phases.length; i++) {
    if (!phases[i].completed) {
      currentPhase = phases[i].phase;
      break;
    }
    if (i === phases.length - 1) {
      currentPhase = "report";
    }
  }

  return { currentPhase, phases };
}

/**
 * Generate comprehensive summary from project data
 */
export function generateComprehensiveSummary(
  projectData: RLMProjectData
): ComprehensiveSummary {
  const featuresWithDesign = projectData.features.filter(
    (f) => f.hasDesignSpec
  ).length;

  // Calculate total tasks
  const totalTasks =
    projectData.tasks.active.length +
    projectData.tasks.completed.length +
    projectData.tasks.blocked.length;

  // Calculate completed tasks from multiple sources:
  // 1. Tasks physically in completed/ folder
  // 2. Tasks with status "completed" in active/ folder (YAML frontmatter)
  // 3. When all features are verified in status.json, all tasks are complete
  let completedTasks = projectData.tasks.completed.length;

  // Add tasks with "completed" status in active folder
  const completedInActive = projectData.tasks.active.filter(
    (t) => t.status === "completed"
  ).length;
  completedTasks += completedInActive;

  // Check if all features are verified in progress/status.json
  const progressFeatures = projectData.progress?.features || {};
  const verifiedFeatureCount = Object.values(progressFeatures).filter(
    (f) => f.status === "verified" || f.status === "complete" || f.status === "completed"
  ).length;
  const totalFeaturesInProgress = Object.keys(progressFeatures).length;

  // Also check overallStatus and summary from newer status.json format
  const overallStatusVerified = projectData.progress?.overallStatus === "verified";
  const summaryComplete = projectData.progress?.summary &&
    projectData.progress.summary.total &&
    projectData.progress.summary.verified === projectData.progress.summary.total;

  const allFeaturesVerified =
    overallStatusVerified ||
    summaryComplete ||
    (totalFeaturesInProgress > 0 && verifiedFeatureCount === totalFeaturesInProgress);

  // If all features are verified, all tasks are complete
  if (allFeaturesVerified && totalTasks > 0) {
    completedTasks = totalTasks;
  }

  return {
    // Core counts
    totalFeatures: projectData.features.length,
    totalTasks,
    completedTasks,
    blockedTasks: projectData.tasks.blocked.length,
    activeTasks: allFeaturesVerified ? 0 : projectData.tasks.active.length - completedInActive,

    // Discovery
    hasPRD: !!projectData.prd,
    hasConstitution: !!projectData.constitution,
    researchSessions: projectData.research?.sessions?.length || 0,

    // Design
    hasDesignSystem: projectData.design?.designSystem?.exists || false,
    hasDesignTokens: projectData.design?.tokens?.exists || false,
    hasUXResearch: projectData.design?.uxResearch?.exists || false,
    componentSpecs: projectData.design?.components?.length || 0,
    featuresWithDesign,

    // Architecture
    hasArchitecture: projectData.architecture?.exists || false,
    architectureDocs: projectData.architecture?.documents?.length || 0,
    hasEpics: projectData.epics?.exists || false,

    // Quality
    hasQAReport: projectData.qaReport?.exists || false,
    hasReviewReport: projectData.reviewReport?.exists || false,
    hasMetrics: projectData.metrics?.exists || false,

    // Verification
    hasE2ETests: projectData.e2eTests?.exists || false,
    e2eTestCount: projectData.e2eTests?.testFiles?.length || 0,

    // Report
    hasFinalReport: projectData.finalReport?.exists || false,

    // Config
    hasConfig: projectData.config?.exists || false,
    configVersion: projectData.config?.version,
  };
}
