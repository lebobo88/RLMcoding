// AI Event Summarization Service

import { createProviderClient } from "./providers";
import { decrypt } from "./encryption";
import {
  getDefaultAIProvider,
  getObservabilitySettings,
  getUnsummarizedEvents,
  updateEventSummary,
} from "../db/events";
import type { ObservabilityEvent } from "../db/schema";

// Generate a summary for a single event
export async function summarizeEvent(
  event: ObservabilityEvent
): Promise<string> {
  const provider = await getDefaultAIProvider();
  if (!provider) {
    throw new Error("No AI provider configured for summarization");
  }

  // Decrypt API key if present
  const apiKey = provider.apiKeyEncrypted
    ? decrypt(provider.apiKeyEncrypted)
    : undefined;

  const client = createProviderClient(provider.provider as Parameters<typeof createProviderClient>[0], {
    apiKey,
    baseUrl: provider.baseUrl || undefined,
    model: provider.model,
  });

  // Build prompt
  const eventDetails = event.detailsJson
    ? JSON.parse(event.detailsJson)
    : {};

  const prompt = `Summarize this Claude Code agent event in one short sentence (max 100 chars):

Event Type: ${event.eventType}
Tool: ${event.toolName || "N/A"}
Agent: ${event.agentId || "primary"}
Details: ${JSON.stringify(eventDetails, null, 2)}

Respond with ONLY the summary sentence, no quotes or explanation.`;

  const response = await client.chat({
    messages: [
      {
        role: "system",
        content:
          "You are a concise summarizer. Generate very short, action-focused summaries of Claude Code agent events. Use present tense verbs. Max 100 characters.",
      },
      { role: "user", content: prompt },
    ],
    maxTokens: 50,
    temperature: 0.3,
  });

  // Clean up the response
  let summary = response.content.trim();

  // Remove quotes if present
  if ((summary.startsWith('"') && summary.endsWith('"')) ||
      (summary.startsWith("'") && summary.endsWith("'"))) {
    summary = summary.slice(1, -1);
  }

  // Truncate if too long
  if (summary.length > 100) {
    summary = summary.slice(0, 97) + "...";
  }

  return summary;
}

// Batch summarize unsummarized events
export async function processSummarizationBatch(): Promise<number> {
  const settings = await getObservabilitySettings();

  if (!settings?.summarizationEnabled) {
    return 0;
  }

  const batchSize = settings.batchSize || 5;
  const events = await getUnsummarizedEvents(batchSize);

  if (events.length === 0) {
    return 0;
  }

  let summarized = 0;

  for (const event of events) {
    try {
      const summary = await summarizeEvent(event);
      await updateEventSummary(event.id, summary);
      summarized++;
    } catch (error) {
      console.error(`Failed to summarize event ${event.id}:`, error);
      // Continue with other events
    }
  }

  return summarized;
}

// Background summarization worker
let summarizationInterval: ReturnType<typeof setInterval> | null = null;

export function startSummarizationWorker(intervalMs?: number): void {
  if (summarizationInterval) {
    clearInterval(summarizationInterval);
  }

  // Default to settings or 2 seconds
  const interval = intervalMs || 2000;

  summarizationInterval = setInterval(async () => {
    try {
      await processSummarizationBatch();
    } catch (error) {
      console.error("Summarization worker error:", error);
    }
  }, interval);

  console.log(`Summarization worker started (interval: ${interval}ms)`);
}

export function stopSummarizationWorker(): void {
  if (summarizationInterval) {
    clearInterval(summarizationInterval);
    summarizationInterval = null;
    console.log("Summarization worker stopped");
  }
}

// Check if summarization is ready (provider configured)
export async function isSummarizationReady(): Promise<{
  ready: boolean;
  reason?: string;
}> {
  const settings = await getObservabilitySettings();

  if (!settings?.summarizationEnabled) {
    return { ready: false, reason: "Summarization is disabled" };
  }

  const provider = await getDefaultAIProvider();

  if (!provider) {
    return { ready: false, reason: "No AI provider configured" };
  }

  if (!provider.enabled) {
    return { ready: false, reason: "Default AI provider is disabled" };
  }

  return { ready: true };
}
