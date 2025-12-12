import { NextRequest, NextResponse } from "next/server";
import { testProviderConnection } from "@/lib/ai/providers";
import { getAIProviderById } from "@/lib/db/events";
import { decrypt } from "@/lib/ai/encryption";
import type { AIProvider } from "@/lib/ai/types";

// Force Node.js runtime for fetch support
export const runtime = "nodejs";

// POST /api/settings/ai-providers/test - Test provider connection
export async function POST(request: NextRequest) {
  console.log("=== TEST CONNECTION API HIT ===");
  try {
    const body = await request.json();
    console.log("Test connection request body:", JSON.stringify(body, null, 2));

    // If providerId is given, fetch the stored provider config including decrypted API key
    if (body.providerId) {
      console.log("Fetching stored provider:", body.providerId);
      const storedProvider = await getAIProviderById(body.providerId);
      if (!storedProvider) {
        console.log("Provider not found:", body.providerId);
        return NextResponse.json(
          { success: false, error: "Provider not found" },
          { status: 404 }
        );
      }

      console.log("Stored provider found:", {
        provider: storedProvider.provider,
        model: storedProvider.model,
        baseUrl: storedProvider.baseUrl,
        hasApiKey: !!storedProvider.apiKeyEncrypted,
      });

      const apiKey = storedProvider.apiKeyEncrypted
        ? decrypt(storedProvider.apiKeyEncrypted)
        : undefined;

      console.log("Testing connection with config:", {
        provider: storedProvider.provider,
        model: storedProvider.model,
        baseUrl: storedProvider.baseUrl,
        hasApiKey: !!apiKey,
      });

      const result = await testProviderConnection(
        storedProvider.provider as AIProvider,
        {
          apiKey,
          baseUrl: storedProvider.baseUrl || undefined,
          model: storedProvider.model,
        }
      );

      console.log("Test result:", result);
      return NextResponse.json(result);
    }

    // Otherwise use provided values directly (for testing before saving)
    if (!body.provider || !body.model) {
      return NextResponse.json(
        { error: "Missing required fields: provider, model" },
        { status: 400 }
      );
    }

    const result = await testProviderConnection(body.provider as AIProvider, {
      apiKey: body.apiKey,
      baseUrl: body.baseUrl,
      model: body.model,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error testing provider connection:", error);
    const errorMessage = error instanceof Error ? error.message : "Connection test failed";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
