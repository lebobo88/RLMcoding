// AI Provider Implementations

import type {
  AIProvider,
  AIProviderClient,
  ChatCompletionRequest,
  ChatCompletionResponse,
} from "./types";

// Base class for OpenAI-compatible providers
class OpenAICompatibleProvider implements AIProviderClient {
  provider: AIProvider;
  baseUrl: string;
  apiKey: string;
  model: string;

  constructor(
    provider: AIProvider,
    baseUrl: string,
    apiKey: string,
    model: string
  ) {
    this.provider = provider;
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.apiKey = apiKey;
    this.model = model;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: this.getHeaders(),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data.data?.map((m: { id: string }) => m.id) || [];
    } catch {
      return [];
    }
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        model: this.model,
        messages: request.messages,
        max_tokens: request.maxTokens || 100,
        temperature: request.temperature || 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Chat completion failed: ${error}`);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || "",
      tokensUsed: data.usage?.total_tokens,
      finishReason: data.choices?.[0]?.finish_reason,
    };
  }

  protected getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }
}

// Anthropic Provider
class AnthropicProvider implements AIProviderClient {
  provider: AIProvider = "anthropic";
  apiKey: string;
  model: string;
  baseUrl = "https://api.anthropic.com/v1";

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    // Extract system message if present
    const systemMessage = request.messages.find((m) => m.role === "system");
    const otherMessages = request.messages.filter((m) => m.role !== "system");

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: request.maxTokens || 100,
        system: systemMessage?.content,
        messages: otherMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic chat failed: ${error}`);
    }

    const data = await response.json();
    return {
      content: data.content?.[0]?.text || "",
      tokensUsed:
        (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      finishReason: data.stop_reason,
    };
  }
}

// Google Gemini Provider
class GoogleGeminiProvider implements AIProviderClient {
  provider: AIProvider = "google";
  apiKey: string;
  model: string;
  baseUrl = "https://generativelanguage.googleapis.com/v1beta";

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    // Convert messages to Gemini format
    const contents = request.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const systemInstruction = request.messages.find(
      (m) => m.role === "system"
    )?.content;

    const response = await fetch(
      `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
          generationConfig: {
            maxOutputTokens: request.maxTokens || 100,
            temperature: request.temperature || 0.3,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini chat failed: ${error}`);
    }

    const data = await response.json();
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
      tokensUsed: data.usageMetadata?.totalTokenCount,
      finishReason: data.candidates?.[0]?.finishReason,
    };
  }
}

// OpenAI Provider (handles GPT-5 models with max_completion_tokens)
class OpenAIProvider implements AIProviderClient {
  provider: AIProvider = "openai";
  baseUrl = "https://api.openai.com/v1";
  apiKey: string;
  model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: this.getHeaders(),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data.data?.map((m: { id: string }) => m.id) || [];
    } catch {
      return [];
    }
  }

  // GPT-5.x models (including Codex) use max_completion_tokens
  private usesMaxCompletionTokens(): boolean {
    return this.model.startsWith("gpt-5") || this.model.startsWith("o1") || this.model.startsWith("o3");
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    // Build request body - GPT-5/o1/o3 models use max_completion_tokens, older models use max_tokens
    const body: Record<string, unknown> = {
      model: this.model,
      messages: request.messages,
      temperature: request.temperature || 0.3,
    };

    if (this.usesMaxCompletionTokens()) {
      body.max_completion_tokens = request.maxTokens || 500;
    } else {
      body.max_tokens = request.maxTokens || 500;
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI chat failed: ${error}`);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || "",
      tokensUsed: data.usage?.total_tokens,
      finishReason: data.choices?.[0]?.finish_reason,
    };
  }

  private getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }
}

// DeepSeek Provider (OpenAI-compatible)
class DeepSeekProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string, model: string) {
    super("deepseek", "https://api.deepseek.com/v1", apiKey, model);
  }
}

// OpenRouter Provider (OpenAI-compatible with special headers)
class OpenRouterProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string, model: string) {
    super("openrouter", "https://openrouter.ai/api/v1", apiKey, model);
  }

  protected getHeaders(): Record<string, string> {
    return {
      ...super.getHeaders(),
      "HTTP-Referer": "https://rlm-pm-ui.local",
      "X-Title": "RLM PM UI",
    };
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      return await super.chat(request);
    } catch (error) {
      // Provide more helpful error for OpenRouter data policy issues
      if (error instanceof Error && error.message.includes("data policy")) {
        throw new Error(
          "OpenRouter privacy settings required. Go to https://openrouter.ai/settings/privacy and enable 'Allow free model providers to train on my data' to use free models."
        );
      }
      throw error;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: this.getHeaders(),
      });
      if (!response.ok) return [];
      const data = await response.json();
      // Filter to free models only
      return (
        data.data
          ?.filter(
            (m: { pricing?: { prompt?: string | number } }) =>
              m.pricing?.prompt === "0" || m.pricing?.prompt === 0 || m.pricing?.prompt === "0.00"
          )
          .map((m: { id: string }) => m.id) || []
      );
    } catch {
      return [];
    }
  }
}

// Ollama Provider
class OllamaProvider implements AIProviderClient {
  provider: AIProvider = "ollama";
  baseUrl: string;
  model: string;

  constructor(baseUrl: string, model: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.model = model;
    console.log(`OllamaProvider created with baseUrl: ${this.baseUrl}, model: ${this.model}`);
  }

  async isAvailable(): Promise<boolean> {
    try {
      console.log(`Ollama: checking availability at ${this.baseUrl}/api/tags`);
      const response = await fetch(`${this.baseUrl}/api/tags`);
      console.log(`Ollama availability response status: ${response.status}`);
      return response.ok;
    } catch (error) {
      console.error(`Ollama availability check failed:`, error);
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      console.log(`Ollama: listing models from ${this.baseUrl}/api/tags`);
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        console.log(`Ollama list models failed with status: ${response.status}`);
        return [];
      }
      const data = await response.json();
      console.log(`Ollama models data:`, data);
      return data.models?.map((m: { name: string }) => m.name) || [];
    } catch (error) {
      console.error(`Ollama list models failed:`, error);
      return [];
    }
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    console.log(`Ollama: sending chat to ${this.baseUrl}/api/chat with model ${this.model}`);
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        messages: request.messages,
        stream: false,
        options: {
          num_predict: request.maxTokens || 100,
          temperature: request.temperature || 0.3,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Ollama chat failed with status ${response.status}: ${error}`);
      throw new Error(`Ollama chat failed: ${error}`);
    }

    const data = await response.json();
    console.log(`Ollama chat response:`, data);
    return {
      content: data.message?.content || "",
      tokensUsed: data.eval_count,
      finishReason: data.done ? "stop" : undefined,
    };
  }
}

// LM Studio Provider (OpenAI-compatible)
class LMStudioProvider extends OpenAICompatibleProvider {
  constructor(baseUrl: string, model: string) {
    super("lmstudio", baseUrl || "http://localhost:1234/v1", "", model);
  }

  protected getHeaders(): Record<string, string> {
    // LM Studio doesn't require auth
    return { "Content-Type": "application/json" };
  }
}

// Factory function to create provider client
export function createProviderClient(
  provider: AIProvider,
  config: {
    apiKey?: string;
    baseUrl?: string;
    model: string;
  }
): AIProviderClient {
  switch (provider) {
    case "anthropic":
      return new AnthropicProvider(config.apiKey || "", config.model);

    case "openai":
      return new OpenAIProvider(config.apiKey || "", config.model);

    case "google":
      return new GoogleGeminiProvider(config.apiKey || "", config.model);

    case "deepseek":
      return new DeepSeekProvider(config.apiKey || "", config.model);

    case "openrouter":
      return new OpenRouterProvider(config.apiKey || "", config.model);

    case "ollama":
      return new OllamaProvider(
        config.baseUrl || "http://localhost:11434",
        config.model
      );

    case "lmstudio":
      return new LMStudioProvider(
        config.baseUrl || "http://localhost:1234/v1",
        config.model
      );

    case "openai-compatible":
      return new OpenAICompatibleProvider(
        "openai-compatible",
        config.baseUrl || "",
        config.apiKey || "",
        config.model
      );

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// Fetch available models for auto-detect providers
export async function fetchAvailableModels(
  provider: AIProvider,
  config: { apiKey?: string; baseUrl?: string }
): Promise<string[]> {
  const client = createProviderClient(provider, {
    ...config,
    model: "placeholder",
  });

  if (client.listModels) {
    return client.listModels();
  }

  return [];
}

// Test provider connection
export async function testProviderConnection(
  provider: AIProvider,
  config: { apiKey?: string; baseUrl?: string; model: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Testing provider: ${provider}, model: ${config.model}, baseUrl: ${config.baseUrl}`);
    const client = createProviderClient(provider, config);

    console.log("Checking availability...");
    const available = await client.isAvailable();
    console.log(`Availability result: ${available}`);

    if (!available) {
      return { success: false, error: "Provider not available - could not connect to service" };
    }

    // Try a simple completion with enough tokens for thinking models
    console.log("Attempting test chat...");
    const response = await client.chat({
      messages: [{ role: "user", content: "Reply with just the word: OK" }],
      maxTokens: 500, // Increased for thinking models that use tokens for reasoning
    });
    console.log(`Chat response:`, response);

    // For thinking models, getting a response at all (even empty content)
    // with done=true and tokensUsed > 0 indicates success
    if (response.content || response.tokensUsed) {
      return { success: true };
    }

    return { success: false, error: "No response received from model" };
  } catch (error) {
    console.error("Test connection error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
