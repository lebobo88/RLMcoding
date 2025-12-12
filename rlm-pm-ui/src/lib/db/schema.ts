import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// Projects table
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  localPath: text("local_path").notNull().unique(),
  githubRepo: text("github_repo"),
  githubBranch: text("github_branch").default("main"),
  status: text("status").default("active"), // active, archived
  currentPhase: text("current_phase"), // discover, specs, tasks, implement, etc.
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Sync history
export const syncEvents = sqliteTable("sync_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: text("project_id").references(() => projects.id),
  direction: text("direction"), // push, pull
  filesChanged: text("files_changed"), // JSON array of paths
  commitSha: text("commit_sha"),
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Token usage (aggregated from RLM files)
export const tokenUsage = sqliteTable("token_usage", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: text("project_id").references(() => projects.id),
  sessionId: text("session_id"),
  date: text("date"),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  taskId: text("task_id"),
  agent: text("agent"),
});

// Activity log
export const activityLog = sqliteTable("activity_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: text("project_id").references(() => projects.id),
  action: text("action"), // phase_started, task_completed, sync, etc.
  details: text("details"), // JSON
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Observability events table
export const observabilityEvents = sqliteTable(
  "observability_events",
  {
    id: text("id").primaryKey(),
    timestamp: text("timestamp").notNull(),
    sessionId: text("session_id"),
    agentId: text("agent_id"),
    projectId: text("project_id"),
    eventType: text("event_type").notNull(),
    toolName: text("tool_name"),
    summary: text("summary"),
    detailsJson: text("details_json"),
    tokensEstimated: integer("tokens_estimated").default(0),
    durationMs: integer("duration_ms").default(0),
    color: text("color"),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("idx_events_session").on(table.sessionId),
    index("idx_events_timestamp").on(table.timestamp),
    index("idx_events_project").on(table.projectId),
    index("idx_events_type").on(table.eventType),
  ]
);

// AI Provider configurations table
export const aiProviderConfigs = sqliteTable("ai_provider_configs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(), // anthropic, openai, google, deepseek, openrouter, ollama, lmstudio, openai-compatible
  model: text("model").notNull(),
  apiKeyEncrypted: text("api_key_encrypted"), // AES-256 encrypted
  baseUrl: text("base_url"),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()),
});

// Observability settings table
export const observabilitySettings = sqliteTable("observability_settings", {
  id: text("id").primaryKey().default("default"),
  summarizationEnabled: integer("summarization_enabled", { mode: "boolean" }).default(false),
  defaultProviderId: text("default_provider_id"),
  maxTokens: integer("max_tokens").default(100),
  batchSize: integer("batch_size").default(5),
  batchDelayMs: integer("batch_delay_ms").default(2000),
  updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()),
});

// Types
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type SyncEvent = typeof syncEvents.$inferSelect;
export type NewSyncEvent = typeof syncEvents.$inferInsert;
export type TokenUsage = typeof tokenUsage.$inferSelect;
export type NewTokenUsage = typeof tokenUsage.$inferInsert;
export type ActivityLogEntry = typeof activityLog.$inferSelect;
export type NewActivityLogEntry = typeof activityLog.$inferInsert;
export type ObservabilityEvent = typeof observabilityEvents.$inferSelect;
export type NewObservabilityEvent = typeof observabilityEvents.$inferInsert;
export type AIProviderConfig = typeof aiProviderConfigs.$inferSelect;
export type NewAIProviderConfig = typeof aiProviderConfigs.$inferInsert;
export type ObservabilitySettings = typeof observabilitySettings.$inferSelect;
export type NewObservabilitySettings = typeof observabilitySettings.$inferInsert;
