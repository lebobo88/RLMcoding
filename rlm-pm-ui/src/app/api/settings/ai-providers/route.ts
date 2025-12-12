import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  getAIProviders,
  insertAIProvider,
  updateAIProvider,
  deleteAIProvider,
  setDefaultAIProvider,
  getObservabilitySettings,
  updateObservabilitySettings,
} from "@/lib/db/events";
import { encrypt, decrypt, maskApiKey } from "@/lib/ai/encryption";
import { testProviderConnection, fetchAvailableModels } from "@/lib/ai/providers";
import type { AIProvider } from "@/lib/ai/types";

// Force Node.js runtime for crypto support
export const runtime = "nodejs";

// GET /api/settings/ai-providers - List all providers
export async function GET() {
  try {
    const providers = await getAIProviders();
    const settings = await getObservabilitySettings();

    // Mask API keys for response
    const maskedProviders = providers.map((p) => ({
      ...p,
      apiKeyEncrypted: undefined,
      apiKeyMasked: p.apiKeyEncrypted
        ? maskApiKey(decrypt(p.apiKeyEncrypted))
        : null,
      hasApiKey: !!p.apiKeyEncrypted,
    }));

    return NextResponse.json({
      providers: maskedProviders,
      settings: settings || {
        summarizationEnabled: false,
        defaultProviderId: null,
        maxTokens: 100,
        batchSize: 5,
        batchDelayMs: 2000,
      },
    });
  } catch (error) {
    console.error("Error fetching AI providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI providers" },
      { status: 500 }
    );
  }
}

// POST /api/settings/ai-providers - Create new provider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Creating AI provider:", { name: body.name, provider: body.provider, model: body.model });

    // Validate required fields
    if (!body.name || !body.provider || !body.model) {
      return NextResponse.json(
        { error: "Missing required fields: name, provider, model" },
        { status: 400 }
      );
    }

    // Encrypt API key if provided
    let apiKeyEncrypted: string | null = null;
    if (body.apiKey) {
      try {
        apiKeyEncrypted = encrypt(body.apiKey);
        console.log("API key encrypted successfully");
      } catch (encryptError) {
        console.error("Encryption failed:", encryptError);
        return NextResponse.json(
          { error: "Failed to encrypt API key" },
          { status: 500 }
        );
      }
    }

    const provider = await insertAIProvider({
      id: uuidv4(),
      name: body.name,
      provider: body.provider,
      model: body.model,
      apiKeyEncrypted,
      baseUrl: body.baseUrl || null,
      enabled: body.enabled !== false,
      isDefault: body.isDefault || false,
    });
    console.log("Provider inserted:", provider.id);

    return NextResponse.json({
      success: true,
      provider: {
        ...provider,
        apiKeyEncrypted: undefined,
        apiKeyMasked: apiKeyEncrypted
          ? maskApiKey(body.apiKey)
          : null,
        hasApiKey: !!apiKeyEncrypted,
      },
    });
  } catch (error) {
    console.error("Error creating AI provider:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create AI provider: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// PUT /api/settings/ai-providers - Update provider or settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle settings update
    if (body.type === "settings") {
      await updateObservabilitySettings({
        summarizationEnabled: body.summarizationEnabled,
        defaultProviderId: body.defaultProviderId,
        maxTokens: body.maxTokens,
        batchSize: body.batchSize,
        batchDelayMs: body.batchDelayMs,
      });
      return NextResponse.json({ success: true });
    }

    // Handle provider update
    if (!body.id) {
      return NextResponse.json(
        { error: "Missing provider ID" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.model !== undefined) updates.model = body.model;
    if (body.baseUrl !== undefined) updates.baseUrl = body.baseUrl;
    if (body.enabled !== undefined) updates.enabled = body.enabled;

    // Handle API key update
    if (body.apiKey !== undefined) {
      updates.apiKeyEncrypted = body.apiKey ? encrypt(body.apiKey) : null;
    }

    // Handle set as default
    if (body.isDefault) {
      await setDefaultAIProvider(body.id);
    } else if (Object.keys(updates).length > 0) {
      await updateAIProvider(body.id, updates);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating AI provider:", error);
    return NextResponse.json(
      { error: "Failed to update AI provider" },
      { status: 500 }
    );
  }
}

// DELETE /api/settings/ai-providers - Delete provider
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing provider ID" },
        { status: 400 }
      );
    }

    await deleteAIProvider(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting AI provider:", error);
    return NextResponse.json(
      { error: "Failed to delete AI provider" },
      { status: 500 }
    );
  }
}
