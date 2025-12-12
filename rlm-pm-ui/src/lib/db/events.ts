import { db, observabilityEvents, observabilitySettings, aiProviderConfigs } from "./index";
import type { ObservabilityEvent, NewObservabilityEvent, ObservabilitySettings, AIProviderConfig, NewAIProviderConfig } from "./schema";
import { eq, desc, and, gte, lte, sql, like } from "drizzle-orm";

// Event operations
export async function insertEvent(event: NewObservabilityEvent): Promise<ObservabilityEvent> {
  const [inserted] = await db.insert(observabilityEvents).values(event).returning();
  return inserted;
}

export async function getEvents(options?: {
  sessionId?: string;
  projectId?: string;
  eventType?: string;
  agentId?: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
  offset?: number;
}): Promise<ObservabilityEvent[]> {
  const conditions = [];

  if (options?.sessionId) {
    conditions.push(eq(observabilityEvents.sessionId, options.sessionId));
  }
  if (options?.projectId) {
    conditions.push(eq(observabilityEvents.projectId, options.projectId));
  }
  if (options?.eventType) {
    conditions.push(eq(observabilityEvents.eventType, options.eventType));
  }
  if (options?.agentId) {
    conditions.push(eq(observabilityEvents.agentId, options.agentId));
  }
  if (options?.startTime) {
    conditions.push(gte(observabilityEvents.timestamp, options.startTime));
  }
  if (options?.endTime) {
    conditions.push(lte(observabilityEvents.timestamp, options.endTime));
  }

  let query = db
    .select()
    .from(observabilityEvents)
    .orderBy(desc(observabilityEvents.timestamp));

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }
  if (options?.offset) {
    query = query.offset(options.offset) as typeof query;
  }

  return query;
}

export async function getEventById(id: string): Promise<ObservabilityEvent | null> {
  const [event] = await db
    .select()
    .from(observabilityEvents)
    .where(eq(observabilityEvents.id, id))
    .limit(1);
  return event || null;
}

export async function getEventStats(projectId?: string) {
  const conditions = projectId ? [eq(observabilityEvents.projectId, projectId)] : [];

  const result = await db
    .select({
      totalEvents: sql<number>`COUNT(*)`,
      uniqueSessions: sql<number>`COUNT(DISTINCT ${observabilityEvents.sessionId})`,
      uniqueAgents: sql<number>`COUNT(DISTINCT ${observabilityEvents.agentId})`,
      totalTokensEstimated: sql<number>`SUM(${observabilityEvents.tokensEstimated})`,
      avgDurationMs: sql<number>`AVG(${observabilityEvents.durationMs})`,
    })
    .from(observabilityEvents)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return result[0];
}

export async function getRecentSessions(limit: number = 10) {
  const result = await db
    .select({
      sessionId: observabilityEvents.sessionId,
      projectId: observabilityEvents.projectId,
      eventCount: sql<number>`COUNT(*)`,
      firstEvent: sql<string>`MIN(${observabilityEvents.timestamp})`,
      lastEvent: sql<string>`MAX(${observabilityEvents.timestamp})`,
      totalTokens: sql<number>`SUM(${observabilityEvents.tokensEstimated})`,
    })
    .from(observabilityEvents)
    .groupBy(observabilityEvents.sessionId, observabilityEvents.projectId)
    .orderBy(desc(sql`MAX(${observabilityEvents.timestamp})`))
    .limit(limit);

  return result;
}

export async function updateEventSummary(id: string, summary: string): Promise<void> {
  await db
    .update(observabilityEvents)
    .set({ summary })
    .where(eq(observabilityEvents.id, id));
}

export async function getUnsummarizedEvents(limit: number = 10): Promise<ObservabilityEvent[]> {
  return db
    .select()
    .from(observabilityEvents)
    .where(sql`${observabilityEvents.summary} IS NULL`)
    .orderBy(observabilityEvents.timestamp)
    .limit(limit);
}

// AI Provider config operations
export async function getAIProviders(): Promise<AIProviderConfig[]> {
  return db.select().from(aiProviderConfigs).orderBy(aiProviderConfigs.name);
}

export async function getAIProviderById(id: string): Promise<AIProviderConfig | null> {
  const [provider] = await db
    .select()
    .from(aiProviderConfigs)
    .where(eq(aiProviderConfigs.id, id))
    .limit(1);
  return provider || null;
}

export async function getDefaultAIProvider(): Promise<AIProviderConfig | null> {
  const [provider] = await db
    .select()
    .from(aiProviderConfigs)
    .where(and(eq(aiProviderConfigs.isDefault, true), eq(aiProviderConfigs.enabled, true)))
    .limit(1);
  return provider || null;
}

export async function insertAIProvider(provider: NewAIProviderConfig): Promise<AIProviderConfig> {
  const [inserted] = await db.insert(aiProviderConfigs).values(provider).returning();
  return inserted;
}

export async function updateAIProvider(id: string, updates: Partial<NewAIProviderConfig>): Promise<void> {
  await db
    .update(aiProviderConfigs)
    .set({ ...updates, updatedAt: new Date().toISOString() })
    .where(eq(aiProviderConfigs.id, id));
}

export async function deleteAIProvider(id: string): Promise<void> {
  await db.delete(aiProviderConfigs).where(eq(aiProviderConfigs.id, id));
}

export async function setDefaultAIProvider(id: string): Promise<void> {
  // Clear all defaults first
  await db.update(aiProviderConfigs).set({ isDefault: false });
  // Set the new default
  await db.update(aiProviderConfigs).set({ isDefault: true }).where(eq(aiProviderConfigs.id, id));
}

// Observability settings operations
export async function getObservabilitySettings(): Promise<ObservabilitySettings | null> {
  const [settings] = await db
    .select()
    .from(observabilitySettings)
    .where(eq(observabilitySettings.id, "default"))
    .limit(1);
  return settings || null;
}

export async function updateObservabilitySettings(updates: Partial<ObservabilitySettings>): Promise<void> {
  const existing = await getObservabilitySettings();

  if (existing) {
    await db
      .update(observabilitySettings)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(observabilitySettings.id, "default"));
  } else {
    await db.insert(observabilitySettings).values({
      id: "default",
      ...updates,
    });
  }
}
