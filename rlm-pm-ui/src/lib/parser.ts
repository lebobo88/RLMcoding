import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import path from "path";

// Types for parsed RLM data
export interface RLMTask {
  id: string;
  title: string;
  featureId?: string;
  type?: string;
  status: "pending" | "active" | "blocked" | "completed";
  priority?: string;
  estimatedEffort?: string;
  description?: string;
  acceptanceCriteria?: string[];
  dependencies?: string[];
  filePath: string;
}

export interface RLMFeature {
  id: string;
  name: string;
  status?: string;
  priority?: string;
  description?: string;
  userStories?: string[];
  filePath: string;
  tasks?: RLMTask[];
  hasDesignSpec?: boolean;
  designSpecPath?: string;
}

export interface RLMProgress {
  // Overall status (from newer status.json format)
  overallStatus?: string;
  lastUpdated?: string;

  // Task-level tracking
  tasks?: Record<string, { status: string; progress?: number }>;

  // Feature-level tracking (supports both formats)
  features?: Record<string, {
    status: string;
    name?: string;
    tasksTotal?: number;
    tasksCompleted?: number;
  }>;

  // Summary from newer status.json format
  summary?: {
    verified?: number;
    total?: number;
    tests?: number;
  };

  // Metrics (from older format)
  metrics?: {
    totalTasks: number;
    completed: number;
    inProgress: number;
    blocked: number;
    pending: number;
  };
}

// Legacy token usage format (for backwards compatibility)
export interface RLMTokenUsageLegacy {
  sessionId: string;
  date: string;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  tasksCompleted: number;
}

// Token operation tracked by hooks
export interface RLMTokenOperation {
  timestamp: string;
  operation: "read" | "write" | "edit" | "subagent" | "tool";
  file?: string;
  estimatedTokens: number;
  details?: string;
}

// Context compaction event
export interface RLMCompactEvent {
  timestamp: string;
  contextPercentage?: number;
  reason: string;
  sessionId?: string;
}

// Estimated token data (from estimation hooks)
export interface RLMTokenEstimates {
  sessionId: string;
  startedAt: string;
  lastUpdated: string;
  totalEstimatedTokens: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  operations: RLMTokenOperation[];
  operationCounts: {
    reads: number;
    writes: number;
    edits: number;
    subagents: number;
    tools: number;
  };
}

// Captured token data (from /cost command post-session)
export interface RLMTokenCaptured {
  sessionId: string;
  capturedAt: string;
  actualCost: number;
  apiDuration?: string;
  wallDuration?: string;
  linesAdded?: number;
  linesRemoved?: number;
  estimatedTokensFromCost?: number;
}

// Daily summary of token usage
export interface RLMTokenDaily {
  date: string;
  sessions: Array<{
    sessionId: string;
    cost: number;
    duration?: string;
  }>;
  totalCost: number;
  totalSessions: number;
}

// Current session metadata
export interface RLMCurrentSession {
  sessionId: string;
  startedAt: string;
  contextCompactWarning?: boolean;
  lastActivity?: string;
}

// Enhanced token usage combining all sources
export interface RLMTokenUsage {
  // Current session estimates
  estimates?: RLMTokenEstimates;
  // Current session metadata
  currentSession?: RLMCurrentSession;
  // Captured post-session data
  captured: RLMTokenCaptured[];
  // Daily summaries
  dailySummaries: RLMTokenDaily[];
  // Compact events
  compactEvents: RLMCompactEvent[];
  // Legacy format for backwards compatibility
  legacy: RLMTokenUsageLegacy[];
}

// Design System types
export interface RLMDesignSystem {
  exists: boolean;
  filePath?: string;
  philosophy?: string;
  animationTier?: string;
  framework?: string;
}

export interface RLMDesignTokens {
  exists: boolean;
  tokenFiles: string[];
  formats: string[]; // e.g., ['json', 'css', 'tailwind']
}

export interface RLMUXResearch {
  exists: boolean;
  filePath?: string;
  hasPersonas?: boolean;
  hasJourneyMaps?: boolean;
}

export interface RLMComponentSpec {
  id: string;
  name: string;
  filePath: string;
}

export interface RLMDesign {
  designSystem?: RLMDesignSystem;
  tokens?: RLMDesignTokens;
  uxResearch?: RLMUXResearch;
  components: RLMComponentSpec[];
}

// Architecture types
export interface RLMArchitectureDoc {
  name: string;
  type: string; // 'overview', 'adr', 'diagram', etc.
  filePath: string;
}

export interface RLMArchitecture {
  exists: boolean;
  documents: RLMArchitectureDoc[];
  hasOverview: boolean;
  hasADRs: boolean;
}

// Epics/Sprint planning
export interface RLMEpic {
  id: string;
  name: string;
  filePath: string;
}

export interface RLMEpics {
  exists: boolean;
  epics: RLMEpic[];
  hasBreakdown: boolean;
}

// Research sessions
export interface RLMResearchSession {
  id: string;
  type: string; // 'DISC', 'RESEARCH', etc.
  timestamp: string;
  filePath: string;
  files: string[];
}

export interface RLMResearch {
  sessions: RLMResearchSession[];
  projectResearch: boolean;
  projectResearchPath?: string;
}

// Quality reports
export interface RLMQAReport {
  exists: boolean;
  filePath?: string;
  score?: number;
  passed?: number;
  total?: number;
  timestamp?: string;
}

export interface RLMReviewReport {
  exists: boolean;
  filePath?: string;
  issues?: number;
  criticalIssues?: number;
  timestamp?: string;
}

export interface RLMMetrics {
  exists: boolean;
  filePath?: string;
  velocity?: number;
  coverage?: number;
  data?: Record<string, unknown>;
}

export interface RLMCheckpoint {
  exists: boolean;
  filePath?: string;
  currentPhase?: string;
  lastRefreshed?: string;
  data?: Record<string, unknown>;
}

export interface RLMFinalReport {
  exists: boolean;
  filePath?: string;
}

// E2E Tests
export interface RLME2ETests {
  exists: boolean;
  testFiles: string[];
  fixtureFiles: string[];
  featureFiles: string[];
}

// Configuration
export interface RLMConfig {
  exists: boolean;
  filePath?: string;
  version?: string;
  automationLevel?: string;
  data?: Record<string, unknown>;
}

// Sub-agent completion manifest
export interface RLMManifest {
  manifestId: string;
  agent: string;
  taskId?: string;
  featureId?: string;
  timestamp: string;
  action: string;
  status: "complete" | "partial" | "failed";
  filesWritten: string[];
  filesModified: string[];
  filesDeleted?: string[];
  testResults?: {
    passed: number;
    failed: number;
    skipped: number;
    total: number;
  };
  duration?: string;
  notes?: string;
  filePath: string;
}

// Sub-agent reliability tracking
export interface RLMSubAgentReliability {
  manifests: RLMManifest[];
  totalManifests: number;
  byAgent: Record<string, number>;
  byStatus: {
    complete: number;
    partial: number;
    failed: number;
  };
  filesVerified: number;
  filesMissing: number;
}

// Main project data interface - comprehensive
export interface RLMProjectData {
  prd?: string;
  constitution?: string;
  features: RLMFeature[];
  tasks: {
    active: RLMTask[];
    completed: RLMTask[];
    blocked: RLMTask[];
  };
  progress?: RLMProgress;
  tokenUsage: RLMTokenUsage;
  currentPhase?: string;

  // Comprehensive additions
  design?: RLMDesign;
  architecture?: RLMArchitecture;
  epics?: RLMEpics;
  research?: RLMResearch;
  qaReport?: RLMQAReport;
  reviewReport?: RLMReviewReport;
  metrics?: RLMMetrics;
  checkpoint?: RLMCheckpoint;
  finalReport?: RLMFinalReport;
  e2eTests?: RLME2ETests;
  config?: RLMConfig;

  // Sub-agent reliability (v2.7.1)
  subAgentReliability?: RLMSubAgentReliability;
}

// Parse YAML frontmatter from content
function parseYamlFrontmatter(content: string): Record<string, unknown> | null {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return null;

  const frontmatter: Record<string, unknown> = {};
  const lines = frontmatterMatch[1].split("\n");

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      // Handle arrays like dependencies: []
      if (value === "[]") {
        frontmatter[key] = [];
      } else if (value.startsWith("[") && value.endsWith("]")) {
        // Parse simple arrays like [item1, item2]
        frontmatter[key] = value
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        frontmatter[key] = value;
      }
    }
  }

  return frontmatter;
}

// Parse a markdown task file (supports both YAML frontmatter and markdown list format)
export function parseTaskFile(filePath: string): RLMTask | null {
  try {
    if (!existsSync(filePath)) return null;

    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    const task: Partial<RLMTask> = {
      filePath,
      acceptanceCriteria: [],
      dependencies: [],
    };

    // First try to parse YAML frontmatter (newer RLM format)
    const frontmatter = parseYamlFrontmatter(content);
    if (frontmatter) {
      if (frontmatter.id) task.id = String(frontmatter.id);
      if (frontmatter.title) task.title = String(frontmatter.title);
      if (frontmatter.feature) task.featureId = String(frontmatter.feature);
      if (frontmatter.type) task.type = String(frontmatter.type);
      if (frontmatter.priority) task.priority = String(frontmatter.priority);
      if (frontmatter.estimated_tokens) task.estimatedEffort = String(frontmatter.estimated_tokens);
      if (frontmatter.status) {
        const status = String(frontmatter.status).toLowerCase();
        task.status = ["pending", "active", "blocked", "completed"].includes(status)
          ? (status as RLMTask["status"])
          : "pending";
      }
      if (Array.isArray(frontmatter.dependencies)) {
        task.dependencies = frontmatter.dependencies.map(String);
      }
    }

    let currentSection = "";

    for (const line of lines) {
      const trimmed = line.trim();

      // Parse title from first H1 (fallback if not in frontmatter)
      if (!task.title && (trimmed.startsWith("# Task:") || trimmed.startsWith("# TASK-") || trimmed.startsWith("# "))) {
        task.title = trimmed.replace(/^#\s*(Task:\s*)?/, "").replace(/^TASK-\d+:\s*/, "").trim();
      }

      // Parse metadata fields (markdown list format - older RLM format)
      if (!frontmatter) {
        if (trimmed.startsWith("- Task ID:") || trimmed.startsWith("- **Task ID:**")) {
          task.id = extractValue(trimmed);
        } else if (trimmed.startsWith("- Feature:") || trimmed.startsWith("- **Feature:**")) {
          task.featureId = extractValue(trimmed);
        } else if (trimmed.startsWith("- Type:") || trimmed.startsWith("- **Type:**")) {
          task.type = extractValue(trimmed);
        } else if (trimmed.startsWith("- Status:") || trimmed.startsWith("- **Status:**")) {
          const status = extractValue(trimmed).toLowerCase();
          task.status = ["pending", "active", "blocked", "completed"].includes(status)
            ? (status as RLMTask["status"])
            : "pending";
        } else if (trimmed.startsWith("- Priority:") || trimmed.startsWith("- **Priority:**")) {
          task.priority = extractValue(trimmed);
        } else if (trimmed.startsWith("- Estimated Effort:")) {
          task.estimatedEffort = extractValue(trimmed);
        }
      }

      // Track sections
      if (trimmed.startsWith("## ")) {
        currentSection = trimmed.replace("## ", "").toLowerCase();
      }

      // Parse acceptance criteria
      if (currentSection.includes("acceptance") && trimmed.startsWith("- [")) {
        task.acceptanceCriteria?.push(trimmed.replace(/^- \[.\]\s*/, ""));
      }

      // Parse dependencies (only if not from frontmatter)
      if (!frontmatter && currentSection.includes("dependencies") && trimmed.startsWith("- ")) {
        task.dependencies?.push(trimmed.replace(/^- /, ""));
      }

      // Parse description
      if (currentSection === "description" && trimmed && !trimmed.startsWith("#")) {
        task.description = (task.description || "") + trimmed + "\n";
      }
    }

    // Extract ID from filename if not found in content
    if (!task.id) {
      const filename = path.basename(filePath, ".md");
      if (filename.startsWith("TASK-")) {
        task.id = filename;
      }
    }

    // If no title found, use ID as title
    if (!task.title && task.id) {
      task.title = task.id;
    }

    if (!task.id) return null;

    return task as RLMTask;
  } catch (error) {
    console.error(`Error parsing task file ${filePath}:`, error);
    return null;
  }
}

// Parse a feature spec file
export function parseFeatureFile(filePath: string): RLMFeature | null {
  try {
    if (!existsSync(filePath)) return null;

    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    const feature: Partial<RLMFeature> = {
      filePath,
      userStories: [],
    };

    let currentSection = "";

    for (const line of lines) {
      const trimmed = line.trim();

      // Parse title
      if (trimmed.startsWith("# Feature Specification:") || trimmed.startsWith("# ")) {
        feature.name = trimmed.replace(/^#\s*(Feature Specification:\s*)?/, "").trim();
      }

      // Parse metadata
      if (trimmed.startsWith("## Feature ID:") || trimmed.includes("Feature ID:")) {
        feature.id = extractValue(trimmed);
      } else if (trimmed.startsWith("- Status:") || trimmed.startsWith("## Status:")) {
        feature.status = extractValue(trimmed);
      } else if (trimmed.startsWith("- Priority:") || trimmed.startsWith("## Priority:")) {
        feature.priority = extractValue(trimmed);
      }

      // Track sections
      if (trimmed.startsWith("## ")) {
        currentSection = trimmed.replace("## ", "").toLowerCase();
      }

      // Parse user stories
      if (currentSection.includes("user stories") && trimmed.startsWith("### ")) {
        feature.userStories?.push(trimmed.replace("### ", ""));
      }

      // Parse description/overview
      if (currentSection === "overview" && trimmed && !trimmed.startsWith("#")) {
        feature.description = (feature.description || "") + trimmed + "\n";
      }
    }

    // Extract ID from folder name if not found
    if (!feature.id) {
      const dirName = path.basename(path.dirname(filePath));
      if (dirName.startsWith("FTR-")) {
        feature.id = dirName;
      }
    }

    if (!feature.id) return null;

    return feature as RLMFeature;
  } catch (error) {
    console.error(`Error parsing feature file ${filePath}:`, error);
    return null;
  }
}

// Read all tasks from a directory
export function readTasksFromDir(dirPath: string): RLMTask[] {
  try {
    if (!existsSync(dirPath)) return [];

    const files = readdirSync(dirPath).filter((f) => f.endsWith(".md"));
    const tasks: RLMTask[] = [];

    for (const file of files) {
      const task = parseTaskFile(path.join(dirPath, file));
      if (task) tasks.push(task);
    }

    return tasks;
  } catch (error) {
    console.error(`Error reading tasks from ${dirPath}:`, error);
    return [];
  }
}

// Read all features from specs directory
export function readFeatures(specsPath: string): RLMFeature[] {
  try {
    const featuresDir = path.join(specsPath, "features");
    if (!existsSync(featuresDir)) return [];

    const features: RLMFeature[] = [];
    const entries = readdirSync(featuresDir);

    for (const entry of entries) {
      const entryPath = path.join(featuresDir, entry);
      if (statSync(entryPath).isDirectory() && entry.startsWith("FTR-")) {
        const specPath = path.join(entryPath, "spec.md");
        if (existsSync(specPath)) {
          const feature = parseFeatureFile(specPath);
          if (feature) features.push(feature);
        }
      }
    }

    return features;
  } catch (error) {
    console.error(`Error reading features:`, error);
    return [];
  }
}

// Read progress/status.json
export function readProgress(progressPath: string): RLMProgress | undefined {
  try {
    const statusPath = path.join(progressPath, "status.json");
    if (!existsSync(statusPath)) return undefined;

    const content = readFileSync(statusPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading progress:`, error);
    return undefined;
  }
}

// Read token estimates (from estimation hooks)
export function readTokenEstimates(tokenUsagePath: string): RLMTokenEstimates | undefined {
  try {
    const estimatesPath = path.join(tokenUsagePath, "token-estimates.json");
    if (!existsSync(estimatesPath)) return undefined;

    const content = readFileSync(estimatesPath, "utf-8");
    const data = JSON.parse(content);

    return {
      sessionId: data.session_id || data.sessionId || "unknown",
      startedAt: data.started_at || data.startedAt || "",
      lastUpdated: data.last_updated || data.lastUpdated || "",
      totalEstimatedTokens: data.total_estimated_tokens || data.totalEstimatedTokens || 0,
      inputTokens: data.input_tokens || data.inputTokens || 0,
      outputTokens: data.output_tokens || data.outputTokens || 0,
      estimatedCost: data.estimated_cost || data.estimatedCost || 0,
      operations: (data.operations || []).map((op: Record<string, unknown>) => ({
        timestamp: op.timestamp as string || "",
        operation: op.operation as string || "tool",
        file: op.file as string,
        estimatedTokens: op.estimated_tokens as number || op.estimatedTokens as number || 0,
        details: op.details as string,
      })),
      operationCounts: {
        reads: data.operation_counts?.reads || data.operationCounts?.reads || 0,
        writes: data.operation_counts?.writes || data.operationCounts?.writes || 0,
        edits: data.operation_counts?.edits || data.operationCounts?.edits || 0,
        subagents: data.operation_counts?.subagents || data.operationCounts?.subagents || 0,
        tools: data.operation_counts?.tools || data.operationCounts?.tools || 0,
      },
    };
  } catch {
    return undefined;
  }
}

// Read current session metadata
export function readCurrentSession(tokenUsagePath: string): RLMCurrentSession | undefined {
  try {
    const sessionPath = path.join(tokenUsagePath, "current-session.json");
    if (!existsSync(sessionPath)) return undefined;

    const content = readFileSync(sessionPath, "utf-8");
    const data = JSON.parse(content);

    return {
      sessionId: data.session_id || data.sessionId || "unknown",
      startedAt: data.started_at || data.startedAt || "",
      contextCompactWarning: data.context_compact_warning || data.contextCompactWarning || false,
      lastActivity: data.last_activity || data.lastActivity,
    };
  } catch {
    return undefined;
  }
}

// Read captured post-session cost data
export function readCapturedCosts(tokenUsagePath: string): RLMTokenCaptured[] {
  try {
    if (!existsSync(tokenUsagePath)) return [];

    const files = readdirSync(tokenUsagePath).filter(
      (f) => f.startsWith("cost-") && f.endsWith(".json")
    );
    const captured: RLMTokenCaptured[] = [];

    for (const file of files) {
      try {
        const content = readFileSync(path.join(tokenUsagePath, file), "utf-8");
        const data = JSON.parse(content);

        captured.push({
          sessionId: data.session_id || data.sessionId || file.replace(/^cost-|\.json$/g, ""),
          capturedAt: data.captured_at || data.capturedAt || "",
          actualCost: data.actual_cost || data.actualCost || data.cost || 0,
          apiDuration: data.api_duration || data.apiDuration,
          wallDuration: data.wall_duration || data.wallDuration,
          linesAdded: data.lines_added || data.linesAdded,
          linesRemoved: data.lines_removed || data.linesRemoved,
          estimatedTokensFromCost: data.estimated_tokens_from_cost || data.estimatedTokensFromCost,
        });
      } catch {
        // Skip invalid files
      }
    }

    return captured;
  } catch {
    return [];
  }
}

// Read daily token summaries
export function readDailySummaries(tokenUsagePath: string): RLMTokenDaily[] {
  try {
    if (!existsSync(tokenUsagePath)) return [];

    const files = readdirSync(tokenUsagePath).filter(
      (f) => f.startsWith("daily-") && f.endsWith(".json")
    );
    const summaries: RLMTokenDaily[] = [];

    for (const file of files) {
      try {
        const content = readFileSync(path.join(tokenUsagePath, file), "utf-8");
        const data = JSON.parse(content);

        summaries.push({
          date: data.date || file.replace(/^daily-|\.json$/g, ""),
          sessions: (data.sessions || []).map((s: Record<string, unknown>) => ({
            sessionId: s.session_id as string || s.sessionId as string || "",
            cost: s.cost as number || 0,
            duration: s.duration as string,
          })),
          totalCost: data.total_cost || data.totalCost || 0,
          totalSessions: data.total_sessions || data.totalSessions || (data.sessions?.length || 0),
        });
      } catch {
        // Skip invalid files
      }
    }

    // Sort by date descending
    return summaries.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

// Read context compaction events
export function readCompactEvents(tokenUsagePath: string): RLMCompactEvent[] {
  try {
    const compactPath = path.join(tokenUsagePath, "compact-events.json");
    if (!existsSync(compactPath)) return [];

    const content = readFileSync(compactPath, "utf-8");
    const data = JSON.parse(content);

    if (Array.isArray(data)) {
      return data.map((event: Record<string, unknown>) => ({
        timestamp: event.timestamp as string || "",
        contextPercentage: event.context_percentage as number || event.contextPercentage as number,
        reason: event.reason as string || "unknown",
        sessionId: event.session_id as string || event.sessionId as string,
      }));
    } else if (data.events && Array.isArray(data.events)) {
      return data.events.map((event: Record<string, unknown>) => ({
        timestamp: event.timestamp as string || "",
        contextPercentage: event.context_percentage as number || event.contextPercentage as number,
        reason: event.reason as string || "unknown",
        sessionId: event.session_id as string || event.sessionId as string,
      }));
    }

    return [];
  } catch {
    return [];
  }
}

// Read legacy token usage format (for backwards compatibility)
export function readLegacyTokenUsage(tokenUsagePath: string): RLMTokenUsageLegacy[] {
  try {
    if (!existsSync(tokenUsagePath)) return [];

    const files = readdirSync(tokenUsagePath).filter(
      (f) => f.endsWith(".json") &&
        f !== "session-template.json" &&
        !f.startsWith("token-") &&
        !f.startsWith("current-") &&
        !f.startsWith("daily-") &&
        !f.startsWith("cost-") &&
        !f.startsWith("compact-")
    );
    const usage: RLMTokenUsageLegacy[] = [];

    for (const file of files) {
      try {
        const content = readFileSync(path.join(tokenUsagePath, file), "utf-8");
        const data = JSON.parse(content);

        // Only include if it looks like legacy format
        if (data.summary?.total_tokens || data.tasks_completed) {
          usage.push({
            sessionId: data.session_id || file.replace(".json", ""),
            date: data.started_at || "",
            totalTokens: data.summary?.total_tokens || 0,
            inputTokens: data.summary?.input_tokens || 0,
            outputTokens: data.summary?.output_tokens || 0,
            tasksCompleted: data.tasks_completed?.length || 0,
          });
        }
      } catch {
        // Skip invalid files
      }
    }

    return usage;
  } catch {
    return [];
  }
}

// Read all token usage data (combines all formats)
export function readTokenUsage(tokenUsagePath: string): RLMTokenUsage {
  return {
    estimates: readTokenEstimates(tokenUsagePath),
    currentSession: readCurrentSession(tokenUsagePath),
    captured: readCapturedCosts(tokenUsagePath),
    dailySummaries: readDailySummaries(tokenUsagePath),
    compactEvents: readCompactEvents(tokenUsagePath),
    legacy: readLegacyTokenUsage(tokenUsagePath),
  };
}

// Read PRD content
export function readPRD(specsPath: string): string | undefined {
  try {
    const prdPath = path.join(specsPath, "PRD.md");
    if (!existsSync(prdPath)) return undefined;
    return readFileSync(prdPath, "utf-8");
  } catch (error) {
    return undefined;
  }
}

// Read constitution content
export function readConstitution(specsPath: string): string | undefined {
  try {
    const constPath = path.join(specsPath, "constitution.md");
    if (!existsSync(constPath)) return undefined;
    return readFileSync(constPath, "utf-8");
  } catch (error) {
    return undefined;
  }
}

// Read Design System
export function readDesignSystem(specsPath: string): RLMDesignSystem {
  const designSystemPath = path.join(specsPath, "design", "design-system.md");
  if (!existsSync(designSystemPath)) {
    return { exists: false };
  }

  try {
    const content = readFileSync(designSystemPath, "utf-8");
    const result: RLMDesignSystem = {
      exists: true,
      filePath: designSystemPath,
    };

    // Try to extract design philosophy and animation tier
    const philosophyMatch = content.match(/Design Philosophy[:\s]*(\w+)/i);
    if (philosophyMatch) result.philosophy = philosophyMatch[1];

    const animationMatch = content.match(/Animation Tier[:\s]*(\w+)/i);
    if (animationMatch) result.animationTier = animationMatch[1];

    const frameworkMatch = content.match(/Framework[:\s]*([^\n]+)/i);
    if (frameworkMatch) result.framework = frameworkMatch[1].trim();

    return result;
  } catch {
    return { exists: false };
  }
}

// Read Design Tokens
export function readDesignTokens(specsPath: string): RLMDesignTokens {
  const tokensPath = path.join(specsPath, "design", "tokens");
  if (!existsSync(tokensPath)) {
    return { exists: false, tokenFiles: [], formats: [] };
  }

  try {
    const files = readdirSync(tokensPath);
    const tokenFiles: string[] = [];
    const formats: string[] = [];

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      tokenFiles.push(file);

      if (ext === ".json" && !formats.includes("json")) formats.push("json");
      if (ext === ".css" && !formats.includes("css")) formats.push("css");
      if (ext === ".ts" && !formats.includes("typescript")) formats.push("typescript");
      if (ext === ".js" && !formats.includes("javascript")) formats.push("javascript");
      if (file.includes("tailwind") && !formats.includes("tailwind")) formats.push("tailwind");
      if (file.includes("mui") && !formats.includes("mui")) formats.push("mui");
      if (file.includes("chakra") && !formats.includes("chakra")) formats.push("chakra");
    }

    return {
      exists: tokenFiles.length > 0,
      tokenFiles,
      formats,
    };
  } catch {
    return { exists: false, tokenFiles: [], formats: [] };
  }
}

// Read UX Research
export function readUXResearch(specsPath: string): RLMUXResearch {
  const uxResearchPath = path.join(specsPath, "design", "ux-research.md");
  if (!existsSync(uxResearchPath)) {
    return { exists: false };
  }

  try {
    const content = readFileSync(uxResearchPath, "utf-8");
    return {
      exists: true,
      filePath: uxResearchPath,
      hasPersonas: content.toLowerCase().includes("persona"),
      hasJourneyMaps: content.toLowerCase().includes("journey"),
    };
  } catch {
    return { exists: false };
  }
}

// Read Component Specs
export function readComponentSpecs(specsPath: string): RLMComponentSpec[] {
  const componentsPath = path.join(specsPath, "design", "components");
  if (!existsSync(componentsPath)) {
    return [];
  }

  try {
    const files = readdirSync(componentsPath).filter((f) => f.endsWith(".md"));
    return files.map((file) => ({
      id: path.basename(file, ".md"),
      name: path.basename(file, ".md").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      filePath: path.join(componentsPath, file),
    }));
  } catch {
    return [];
  }
}

// Read full Design data
export function readDesign(specsPath: string): RLMDesign {
  return {
    designSystem: readDesignSystem(specsPath),
    tokens: readDesignTokens(specsPath),
    uxResearch: readUXResearch(specsPath),
    components: readComponentSpecs(specsPath),
  };
}

// Read Architecture documentation
export function readArchitecture(specsPath: string): RLMArchitecture {
  const archPath = path.join(specsPath, "architecture");
  if (!existsSync(archPath)) {
    return { exists: false, documents: [], hasOverview: false, hasADRs: false };
  }

  try {
    const documents: RLMArchitectureDoc[] = [];
    let hasOverview = false;
    let hasADRs = false;

    const processDir = (dirPath: string, prefix: string = "") => {
      const entries = readdirSync(dirPath);
      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry);
        const stat = statSync(entryPath);

        if (stat.isDirectory()) {
          if (entry.toLowerCase() === "decisions" || entry.toLowerCase() === "adrs") {
            hasADRs = true;
            processDir(entryPath, `${prefix}${entry}/`);
          } else {
            processDir(entryPath, `${prefix}${entry}/`);
          }
        } else if (entry.endsWith(".md")) {
          const name = path.basename(entry, ".md");
          let type = "document";

          if (name.toLowerCase().includes("overview")) {
            type = "overview";
            hasOverview = true;
          } else if (name.toLowerCase().startsWith("adr-") || prefix.includes("decision")) {
            type = "adr";
            hasADRs = true;
          } else if (name.toLowerCase().includes("diagram")) {
            type = "diagram";
          }

          documents.push({
            name,
            type,
            filePath: entryPath,
          });
        }
      }
    };

    processDir(archPath);

    return {
      exists: documents.length > 0,
      documents,
      hasOverview,
      hasADRs,
    };
  } catch {
    return { exists: false, documents: [], hasOverview: false, hasADRs: false };
  }
}

// Read Epics
export function readEpics(specsPath: string): RLMEpics {
  const epicsPath = path.join(specsPath, "epics");
  if (!existsSync(epicsPath)) {
    return { exists: false, epics: [], hasBreakdown: false };
  }

  try {
    const files = readdirSync(epicsPath);
    const epics: RLMEpic[] = [];
    let hasBreakdown = false;

    for (const file of files) {
      if (file.endsWith(".md")) {
        const filePath = path.join(epicsPath, file);
        const name = path.basename(file, ".md");

        if (name.toLowerCase() === "breakdown") {
          hasBreakdown = true;
        } else {
          epics.push({
            id: name,
            name: name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            filePath,
          });
        }
      }
    }

    return {
      exists: epics.length > 0 || hasBreakdown,
      epics,
      hasBreakdown,
    };
  } catch {
    return { exists: false, epics: [], hasBreakdown: false };
  }
}

// Read Research Sessions
export function readResearch(rlmPath: string): RLMResearch {
  const researchPath = path.join(rlmPath, "research");
  const sessions: RLMResearchSession[] = [];
  let projectResearch = false;
  let projectResearchPath: string | undefined;

  // Check for project research
  const projectResearchDir = path.join(researchPath, "project");
  if (existsSync(projectResearchDir)) {
    projectResearch = true;
    projectResearchPath = projectResearchDir;
  }

  // Check for sessions
  const sessionsPath = path.join(researchPath, "sessions");
  if (existsSync(sessionsPath)) {
    try {
      const sessionDirs = readdirSync(sessionsPath);
      for (const dir of sessionDirs) {
        const sessionPath = path.join(sessionsPath, dir);
        if (statSync(sessionPath).isDirectory()) {
          // Parse session ID format: TYPE-YYYYMMDDHHMMSS
          const match = dir.match(/^([A-Z]+)-(\d{14})$/);
          const files = existsSync(sessionPath)
            ? readdirSync(sessionPath).filter((f) => !statSync(path.join(sessionPath, f)).isDirectory())
            : [];

          sessions.push({
            id: dir,
            type: match ? match[1] : "UNKNOWN",
            timestamp: match ? match[2] : "",
            filePath: sessionPath,
            files,
          });
        }
      }
    } catch {
      // Ignore errors
    }
  }

  return {
    sessions,
    projectResearch,
    projectResearchPath,
  };
}

// Read QA Report
export function readQAReport(progressPath: string): RLMQAReport {
  const qaPath = path.join(progressPath, "qa-report.json");
  if (!existsSync(qaPath)) {
    return { exists: false };
  }

  try {
    const content = readFileSync(qaPath, "utf-8");
    const data = JSON.parse(content);
    return {
      exists: true,
      filePath: qaPath,
      score: data.score,
      passed: data.passed,
      total: data.total,
      timestamp: data.timestamp,
    };
  } catch {
    return { exists: false };
  }
}

// Read Review Report
export function readReviewReport(progressPath: string): RLMReviewReport {
  const reviewPath = path.join(progressPath, "review-report.json");
  if (!existsSync(reviewPath)) {
    return { exists: false };
  }

  try {
    const content = readFileSync(reviewPath, "utf-8");
    const data = JSON.parse(content);
    return {
      exists: true,
      filePath: reviewPath,
      issues: data.issues?.length || data.totalIssues,
      criticalIssues: data.criticalIssues,
      timestamp: data.timestamp,
    };
  } catch {
    return { exists: false };
  }
}

// Read Metrics
export function readMetrics(progressPath: string): RLMMetrics {
  const metricsPath = path.join(progressPath, "metrics.json");
  if (!existsSync(metricsPath)) {
    return { exists: false };
  }

  try {
    const content = readFileSync(metricsPath, "utf-8");
    const data = JSON.parse(content);
    return {
      exists: true,
      filePath: metricsPath,
      velocity: data.velocity,
      coverage: data.coverage,
      data,
    };
  } catch {
    return { exists: false };
  }
}

// Read Checkpoint
export function readCheckpoint(progressPath: string): RLMCheckpoint {
  const checkpointPath = path.join(progressPath, "checkpoint.json");
  if (!existsSync(checkpointPath)) {
    return { exists: false };
  }

  try {
    const content = readFileSync(checkpointPath, "utf-8");
    const data = JSON.parse(content);
    return {
      exists: true,
      filePath: checkpointPath,
      currentPhase: data.currentPhase,
      lastRefreshed: data.lastRefreshed,
      data,
    };
  } catch {
    return { exists: false };
  }
}

// Read Final Report
export function readFinalReport(progressPath: string): RLMFinalReport {
  const reportPath = path.join(progressPath, "final-report.md");
  if (!existsSync(reportPath)) {
    return { exists: false };
  }

  return {
    exists: true,
    filePath: reportPath,
  };
}

// Read E2E Tests
export function readE2ETests(projectPath: string): RLME2ETests {
  const e2ePath = path.join(projectPath, "tests", "e2e");
  if (!existsSync(e2ePath)) {
    return { exists: false, testFiles: [], fixtureFiles: [], featureFiles: [] };
  }

  try {
    const testFiles: string[] = [];
    const fixtureFiles: string[] = [];
    const featureFiles: string[] = [];

    const processDir = (dirPath: string) => {
      const entries = readdirSync(dirPath);
      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry);
        const stat = statSync(entryPath);

        if (stat.isDirectory()) {
          if (entry === "fixtures") {
            const fixtures = readdirSync(entryPath);
            fixtureFiles.push(...fixtures);
          } else if (entry === "features") {
            const features = readdirSync(entryPath);
            featureFiles.push(...features);
          } else {
            processDir(entryPath);
          }
        } else if (entry.includes(".spec.") || entry.includes(".test.")) {
          testFiles.push(entry);
        }
      }
    };

    processDir(e2ePath);

    return {
      exists: testFiles.length > 0 || fixtureFiles.length > 0 || featureFiles.length > 0,
      testFiles,
      fixtureFiles,
      featureFiles,
    };
  } catch {
    return { exists: false, testFiles: [], fixtureFiles: [], featureFiles: [] };
  }
}

// Read Configuration
export function readConfig(progressPath: string): RLMConfig {
  const configPath = path.join(progressPath, "cc-config.json");
  if (!existsSync(configPath)) {
    return { exists: false };
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const data = JSON.parse(content);
    return {
      exists: true,
      filePath: configPath,
      version: data.version,
      automationLevel: data.automation?.level,
      data,
    };
  } catch {
    return { exists: false };
  }
}

// Read sub-agent completion manifests
export function readManifests(progressPath: string): RLMManifest[] {
  const manifestsPath = path.join(progressPath, "manifests");
  if (!existsSync(manifestsPath)) {
    return [];
  }

  try {
    const files = readdirSync(manifestsPath).filter((f) => f.endsWith(".json"));
    const manifests: RLMManifest[] = [];

    for (const file of files) {
      try {
        const filePath = path.join(manifestsPath, file);
        const content = readFileSync(filePath, "utf-8");
        const data = JSON.parse(content);

        manifests.push({
          manifestId: data.manifest_id || data.manifestId || file.replace(".json", ""),
          agent: data.agent || "unknown",
          taskId: data.task_id || data.taskId,
          featureId: data.feature_id || data.featureId,
          timestamp: data.timestamp || "",
          action: data.action || "",
          status: (data.status === "complete" || data.status === "partial" || data.status === "failed")
            ? data.status
            : "complete",
          filesWritten: Array.isArray(data.files_written || data.filesWritten)
            ? (data.files_written || data.filesWritten)
            : [],
          filesModified: Array.isArray(data.files_modified || data.filesModified)
            ? (data.files_modified || data.filesModified)
            : [],
          filesDeleted: Array.isArray(data.files_deleted || data.filesDeleted)
            ? (data.files_deleted || data.filesDeleted)
            : undefined,
          testResults: data.test_results || data.testResults
            ? {
                passed: data.test_results?.passed || data.testResults?.passed || 0,
                failed: data.test_results?.failed || data.testResults?.failed || 0,
                skipped: data.test_results?.skipped || data.testResults?.skipped || 0,
                total: data.test_results?.total || data.testResults?.total || 0,
              }
            : undefined,
          duration: data.duration,
          notes: data.notes,
          filePath,
        });
      } catch {
        // Skip invalid files
      }
    }

    // Sort by timestamp descending (most recent first)
    return manifests.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  } catch {
    return [];
  }
}

// Read sub-agent reliability data (aggregated from manifests)
export function readSubAgentReliability(progressPath: string, projectPath: string): RLMSubAgentReliability {
  const manifests = readManifests(progressPath);

  // Count by agent
  const byAgent: Record<string, number> = {};
  for (const manifest of manifests) {
    byAgent[manifest.agent] = (byAgent[manifest.agent] || 0) + 1;
  }

  // Count by status
  const byStatus = {
    complete: manifests.filter((m) => m.status === "complete").length,
    partial: manifests.filter((m) => m.status === "partial").length,
    failed: manifests.filter((m) => m.status === "failed").length,
  };

  // Verify files exist
  let filesVerified = 0;
  let filesMissing = 0;

  for (const manifest of manifests) {
    const allFiles = [...manifest.filesWritten, ...manifest.filesModified];
    for (const file of allFiles) {
      const fullPath = path.isAbsolute(file) ? file : path.join(projectPath, file);
      if (existsSync(fullPath)) {
        filesVerified++;
      } else {
        filesMissing++;
      }
    }
  }

  return {
    manifests,
    totalManifests: manifests.length,
    byAgent,
    byStatus,
    filesVerified,
    filesMissing,
  };
}

// Check if feature has design spec
export function checkFeatureDesignSpec(specsPath: string, featureId: string): { hasDesignSpec: boolean; designSpecPath?: string } {
  const designSpecPath = path.join(specsPath, "features", featureId, "design-spec.md");
  if (existsSync(designSpecPath)) {
    return { hasDesignSpec: true, designSpecPath };
  }
  return { hasDesignSpec: false };
}

// Main function to read all project data
export function readProjectData(projectPath: string): RLMProjectData {
  const rlmPath = path.join(projectPath, "RLM");
  const specsPath = path.join(rlmPath, "specs");
  const tasksPath = path.join(rlmPath, "tasks");
  const progressPath = path.join(rlmPath, "progress");

  // Read features and enrich with design spec info
  const features = readFeatures(specsPath).map((feature) => {
    const designSpec = checkFeatureDesignSpec(specsPath, feature.id);
    return {
      ...feature,
      hasDesignSpec: designSpec.hasDesignSpec,
      designSpecPath: designSpec.designSpecPath,
    };
  });

  return {
    // Core documents
    prd: readPRD(specsPath),
    constitution: readConstitution(specsPath),
    features,

    // Tasks
    tasks: {
      active: readTasksFromDir(path.join(tasksPath, "active")),
      completed: readTasksFromDir(path.join(tasksPath, "completed")),
      blocked: readTasksFromDir(path.join(tasksPath, "blocked")),
    },

    // Progress tracking
    progress: readProgress(progressPath),
    tokenUsage: readTokenUsage(path.join(progressPath, "token-usage")),

    // Design documentation
    design: readDesign(specsPath),

    // Architecture documentation
    architecture: readArchitecture(specsPath),

    // Epics/Sprint planning
    epics: readEpics(specsPath),

    // Research sessions
    research: readResearch(rlmPath),

    // Quality reports
    qaReport: readQAReport(progressPath),
    reviewReport: readReviewReport(progressPath),

    // Metrics and checkpoint
    metrics: readMetrics(progressPath),
    checkpoint: readCheckpoint(progressPath),
    finalReport: readFinalReport(progressPath),

    // E2E tests
    e2eTests: readE2ETests(projectPath),

    // Configuration
    config: readConfig(progressPath),

    // Sub-agent reliability (v2.7.1)
    subAgentReliability: readSubAgentReliability(progressPath, projectPath),
  };
}

// Helper to extract value from a markdown line
function extractValue(line: string): string {
  // Handle both "- Field: value" and "- **Field:** value" formats
  const match = line.match(/:\s*\**(.+?)\**\s*$/);
  return match ? match[1].trim() : "";
}
