import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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

// Types
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type SyncEvent = typeof syncEvents.$inferSelect;
export type NewSyncEvent = typeof syncEvents.$inferInsert;
export type TokenUsage = typeof tokenUsage.$inferSelect;
export type NewTokenUsage = typeof tokenUsage.$inferInsert;
export type ActivityLogEntry = typeof activityLog.$inferSelect;
export type NewActivityLogEntry = typeof activityLog.$inferInsert;
