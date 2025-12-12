// AI Provider Types and Configuration

export type AIProvider =
  | "anthropic"
  | "openai"
  | "google"
  | "deepseek"
  | "openrouter"
  | "ollama"
  | "lmstudio"
  | "openai-compatible";

export interface AIProviderConfig {
  id: string;
  name: string;
  provider: AIProvider;
  model: string;
  apiKey?: string; // Decrypted, only in memory
  baseUrl?: string;
  enabled: boolean;
  isDefault: boolean;
}

export interface ObservabilityAIConfig {
  summarizationEnabled: boolean;
  defaultProviderId: string | null;
  maxTokens: number;
  batchSize: number;
  batchDelayMs: number;
}

// Provider metadata for UI
export interface ProviderMetadata {
  id: AIProvider;
  name: string;
  description: string;
  requiresApiKey: boolean;
  requiresBaseUrl: boolean;
  defaultBaseUrl?: string;
  models: string[] | "auto";
  icon?: string;
  hint?: string; // Additional setup instructions
}

// Provider-specific model lists
export const PROVIDER_MODELS: Record<AIProvider, string[] | "auto"> = {
  anthropic: [
    "claude-sonnet-4-5-20250929",
    "claude-haiku-4-5-20251001",
    "claude-opus-4-5-20251101",
  ],
  openai: [
    "gpt-5.2-pro-2025-12-11",
    "gpt-5.2-2025-12-11",
    "gpt-5.1-2025-11-13",
    "gpt-5.1-codex-max",
    "gpt-5.1-codex",
    "gpt-5.1-codex-mini",
    "gpt-5-mini-2025-08-07",
    "gpt-5-nano-2025-08-07",
  ],
  google: [
    "gemini-3-pro-preview",
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
  ],
  deepseek: ["deepseek-chat", "deepseek-reasoner", "deepseek-coder"],
  openrouter: "auto", // Fetch free models from API
  ollama: "auto", // Fetch loaded models from local API
  lmstudio: "auto", // Fetch loaded models from local API
  "openai-compatible": "auto",
};

// Provider metadata for UI rendering
export const PROVIDER_METADATA: ProviderMetadata[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude models from Anthropic",
    requiresApiKey: true,
    requiresBaseUrl: false,
    models: PROVIDER_MODELS.anthropic,
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT models from OpenAI",
    requiresApiKey: true,
    requiresBaseUrl: false,
    models: PROVIDER_MODELS.openai,
  },
  {
    id: "google",
    name: "Google Gemini",
    description: "Gemini models from Google AI",
    requiresApiKey: true,
    requiresBaseUrl: false,
    models: PROVIDER_MODELS.google,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "DeepSeek AI models",
    requiresApiKey: true,
    requiresBaseUrl: false,
    defaultBaseUrl: "https://api.deepseek.com",
    models: PROVIDER_MODELS.deepseek,
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "Free models via OpenRouter",
    requiresApiKey: true,
    requiresBaseUrl: false,
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    models: "auto",
    hint: "Free models require enabling data sharing at openrouter.ai/settings/privacy",
  },
  {
    id: "ollama",
    name: "Ollama",
    description: "Local models via Ollama",
    requiresApiKey: false,
    requiresBaseUrl: true,
    defaultBaseUrl: "http://localhost:11434",
    models: "auto",
  },
  {
    id: "lmstudio",
    name: "LM Studio",
    description: "Local models via LM Studio",
    requiresApiKey: false,
    requiresBaseUrl: true,
    defaultBaseUrl: "http://localhost:1234/v1",
    models: "auto",
  },
  {
    id: "openai-compatible",
    name: "OpenAI Compatible",
    description: "Any OpenAI-compatible API",
    requiresApiKey: true,
    requiresBaseUrl: true,
    models: "auto",
  },
];

// Chat completion request/response types
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface ChatCompletionResponse {
  content: string;
  tokensUsed?: number;
  finishReason?: string;
}

// Provider interface
export interface AIProviderClient {
  provider: AIProvider;
  isAvailable(): Promise<boolean>;
  listModels?(): Promise<string[]>;
  chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
