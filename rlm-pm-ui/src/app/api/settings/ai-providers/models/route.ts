import { NextRequest, NextResponse } from "next/server";
import { fetchAvailableModels } from "@/lib/ai/providers";
import { PROVIDER_MODELS } from "@/lib/ai/types";
import type { AIProvider } from "@/lib/ai/types";

// Force Node.js runtime for fetch support
export const runtime = "nodejs";

// GET /api/settings/ai-providers/models - Get available models for a provider
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider") as AIProvider;
    const baseUrl = searchParams.get("base_url") || undefined;
    const apiKey = searchParams.get("api_key") || undefined;

    if (!provider) {
      return NextResponse.json(
        { error: "Missing provider parameter" },
        { status: 400 }
      );
    }

    // Check if this provider has a static model list
    const staticModels = PROVIDER_MODELS[provider];
    if (staticModels !== "auto") {
      return NextResponse.json({ models: staticModels, source: "static" });
    }

    // Fetch models dynamically
    try {
      const models = await fetchAvailableModels(provider, { apiKey, baseUrl });
      return NextResponse.json({
        models,
        source: "dynamic",
      });
    } catch (error) {
      return NextResponse.json({
        models: [],
        source: "error",
        error: error instanceof Error ? error.message : "Failed to fetch models",
      });
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}
