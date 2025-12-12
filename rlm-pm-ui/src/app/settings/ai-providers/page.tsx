"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Plus,
  Trash2,
  Settings2,
  Check,
  X,
  Loader2,
  Star,
  TestTube,
  Eye,
  EyeOff,
  Pencil,
} from "lucide-react";
import { PROVIDER_METADATA, PROVIDER_MODELS } from "@/lib/ai/types";
import type { AIProvider } from "@/lib/ai/types";

interface ProviderConfig {
  id: string;
  name: string;
  provider: string;
  model: string;
  baseUrl: string | null;
  enabled: boolean;
  isDefault: boolean;
  apiKeyMasked: string | null;
  hasApiKey: boolean;
}

interface ObservabilitySettings {
  summarizationEnabled: boolean;
  defaultProviderId: string | null;
  maxTokens: number;
  batchSize: number;
  batchDelayMs: number;
}

export default function AIProvidersPage() {
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [settings, setSettings] = useState<ObservabilitySettings>({
    summarizationEnabled: false,
    defaultProviderId: null,
    maxTokens: 100,
    batchSize: 5,
    batchDelayMs: 2000,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ProviderConfig | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, { success: boolean; error?: string }>
  >({});

  // Form state for adding/editing provider
  const [formProvider, setFormProvider] = useState({
    name: "",
    provider: "anthropic" as AIProvider,
    model: "",
    apiKey: "",
    baseUrl: "",
    showApiKey: false,
  });
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Fetch providers and settings
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/settings/ai-providers");
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers);
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Failed to fetch AI providers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch models when provider changes
  useEffect(() => {
    const fetchModels = async () => {
      const metadata = PROVIDER_METADATA.find(
        (p) => p.id === formProvider.provider
      );
      if (!metadata) return;

      if (metadata.models === "auto") {
        setIsLoadingModels(true);
        try {
          const params = new URLSearchParams({ provider: formProvider.provider });
          if (formProvider.baseUrl) params.set("base_url", formProvider.baseUrl);
          if (formProvider.apiKey) params.set("api_key", formProvider.apiKey);

          const response = await fetch(
            `/api/settings/ai-providers/models?${params}`
          );
          if (response.ok) {
            const data = await response.json();
            setAvailableModels(data.models);
          }
        } catch {
          setAvailableModels([]);
        } finally {
          setIsLoadingModels(false);
        }
      } else {
        setAvailableModels(metadata.models);
      }
    };

    fetchModels();
  }, [formProvider.provider, formProvider.baseUrl, formProvider.apiKey]);

  // Reset form to defaults
  const resetForm = () => {
    setFormProvider({
      name: "",
      provider: "anthropic",
      model: "",
      apiKey: "",
      baseUrl: "",
      showApiKey: false,
    });
  };

  // Open add form
  const handleOpenAddForm = () => {
    resetForm();
    setEditingProvider(null);
    setShowAddForm(true);
  };

  // Open edit form
  const handleOpenEditForm = (provider: ProviderConfig) => {
    setFormProvider({
      name: provider.name,
      provider: provider.provider as AIProvider,
      model: provider.model,
      apiKey: "", // Don't prefill API key for security
      baseUrl: provider.baseUrl || "",
      showApiKey: false,
    });
    setEditingProvider(provider);
    setShowAddForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingProvider(null);
    resetForm();
  };

  // Add new provider
  const handleAddProvider = async () => {
    try {
      const response = await fetch("/api/settings/ai-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formProvider.name,
          provider: formProvider.provider,
          model: formProvider.model,
          apiKey: formProvider.apiKey || null,
          baseUrl: formProvider.baseUrl || null,
        }),
      });

      if (response.ok) {
        handleCloseForm();
        fetchData();
      }
    } catch (error) {
      console.error("Failed to add provider:", error);
    }
  };

  // Update existing provider
  const handleUpdateProvider = async () => {
    if (!editingProvider) return;

    try {
      const updates: Record<string, unknown> = {
        id: editingProvider.id,
        name: formProvider.name,
        model: formProvider.model,
        baseUrl: formProvider.baseUrl || null,
      };

      // Only update API key if a new one was provided
      if (formProvider.apiKey) {
        updates.apiKey = formProvider.apiKey;
      }

      const response = await fetch("/api/settings/ai-providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        handleCloseForm();
        fetchData();
      }
    } catch (error) {
      console.error("Failed to update provider:", error);
    }
  };

  // Delete provider
  const handleDeleteProvider = async (id: string) => {
    if (!confirm("Are you sure you want to delete this provider?")) return;

    try {
      const response = await fetch(`/api/settings/ai-providers?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete provider:", error);
    }
  };

  // Set default provider
  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch("/api/settings/ai-providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDefault: true }),
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to set default:", error);
    }
  };

  // Test provider connection
  const handleTestConnection = async (provider: ProviderConfig) => {
    setTestingId(provider.id);
    setTestResults((prev) => ({ ...prev, [provider.id]: undefined as unknown as { success: boolean; error?: string } }));

    try {
      // Pass providerId to fetch stored API key from server
      const response = await fetch("/api/settings/ai-providers/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: provider.id,
        }),
      });

      const result = await response.json();
      console.log("Test connection result:", result);
      setTestResults((prev) => ({ ...prev, [provider.id]: result }));
    } catch (error) {
      console.error("Test connection error:", error);
      setTestResults((prev) => ({
        ...prev,
        [provider.id]: { success: false, error: "Test failed" },
      }));
    } finally {
      setTestingId(null);
    }
  };

  // Update settings
  const handleUpdateSettings = async (updates: Partial<ObservabilitySettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    try {
      await fetch("/api/settings/ai-providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "settings", ...newSettings }),
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const selectedMetadata = PROVIDER_METADATA.find(
    (p) => p.id === formProvider.provider
  );

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Providers
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure AI providers for event summarization
          </p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Provider
        </button>
      </div>

      {/* Observability Settings Card */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="h-5 w-5" />
          <h2 className="font-semibold">Summarization Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Enable AI Summarization</div>
              <div className="text-sm text-muted-foreground">
                Generate human-readable summaries for events
              </div>
            </div>
            <button
              onClick={() =>
                handleUpdateSettings({
                  summarizationEnabled: !settings.summarizationEnabled,
                })
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.summarizationEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings.summarizationEnabled
                    ? "translate-x-6"
                    : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {settings.summarizationEnabled && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Max Tokens</label>
                  <input
                    type="number"
                    value={settings.maxTokens}
                    onChange={(e) =>
                      handleUpdateSettings({
                        maxTokens: parseInt(e.target.value) || 100,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Batch Size</label>
                  <input
                    type="number"
                    value={settings.batchSize}
                    onChange={(e) =>
                      handleUpdateSettings({
                        batchSize: parseInt(e.target.value) || 5,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Batch Delay (ms)</label>
                  <input
                    type="number"
                    value={settings.batchDelayMs}
                    onChange={(e) =>
                      handleUpdateSettings({
                        batchDelayMs: parseInt(e.target.value) || 2000,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Provider List */}
      <div className="space-y-3">
        {providers.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No AI providers configured</p>
            <p className="text-sm mt-1">
              Add a provider to enable event summarization
            </p>
          </Card>
        ) : (
          providers.map((provider) => (
            <Card key={provider.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{provider.name}</h3>
                    {provider.isDefault && (
                      <Badge className="bg-primary">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                    {!provider.enabled && (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                    {testResults[provider.id] && (
                      <Badge
                        variant={
                          testResults[provider.id].success
                            ? "outline"
                            : "destructive"
                        }
                        className={
                          testResults[provider.id].success
                            ? "text-green-600"
                            : ""
                        }
                        title={testResults[provider.id].error || ""}
                      >
                        {testResults[provider.id].success ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Connected
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            {testResults[provider.id].error?.slice(0, 30) || "Failed"}
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <span className="font-mono">{provider.provider}</span>
                    {" / "}
                    <span className="font-mono">{provider.model}</span>
                  </div>
                  {provider.baseUrl && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {provider.baseUrl}
                    </div>
                  )}
                  {provider.hasApiKey && (
                    <div className="text-xs text-muted-foreground mt-1">
                      API Key: {provider.apiKeyMasked}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestConnection(provider)}
                    disabled={testingId === provider.id}
                    className="p-2 hover:bg-muted rounded"
                    title="Test connection"
                  >
                    {testingId === provider.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEditForm(provider)}
                    className="p-2 hover:bg-muted rounded"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {!provider.isDefault && (
                    <button
                      onClick={() => handleSetDefault(provider.id)}
                      className="p-2 hover:bg-muted rounded"
                      title="Set as default"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteProvider(provider.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Provider Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6 m-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingProvider ? "Edit AI Provider" : "Add AI Provider"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Provider Type</label>
                <select
                  value={formProvider.provider}
                  onChange={(e) =>
                    setFormProvider({
                      ...formProvider,
                      provider: e.target.value as AIProvider,
                      model: "",
                      baseUrl:
                        PROVIDER_METADATA.find((p) => p.id === e.target.value)
                          ?.defaultBaseUrl || "",
                    })
                  }
                  disabled={!!editingProvider} // Can't change provider type when editing
                  className="w-full mt-1 px-3 py-2 border rounded-lg disabled:opacity-50"
                >
                  {PROVIDER_METADATA.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.description}
                    </option>
                  ))}
                </select>
                {selectedMetadata?.hint && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    ⚠️ {selectedMetadata.hint}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Display Name</label>
                <input
                  type="text"
                  value={formProvider.name}
                  onChange={(e) =>
                    setFormProvider({ ...formProvider, name: e.target.value })
                  }
                  placeholder="My Provider"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>

              {selectedMetadata?.requiresApiKey && (
                <div>
                  <label className="text-sm font-medium">
                    API Key
                    {editingProvider && (
                      <span className="text-muted-foreground font-normal ml-2">
                        (leave empty to keep existing)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={formProvider.showApiKey ? "text" : "password"}
                      value={formProvider.apiKey}
                      onChange={(e) =>
                        setFormProvider({ ...formProvider, apiKey: e.target.value })
                      }
                      placeholder={editingProvider ? "Enter new API key or leave empty" : "sk-..."}
                      className="w-full mt-1 px-3 py-2 border rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormProvider({
                          ...formProvider,
                          showApiKey: !formProvider.showApiKey,
                        })
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                    >
                      {formProvider.showApiKey ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {selectedMetadata?.requiresBaseUrl && (
                <div>
                  <label className="text-sm font-medium">Base URL</label>
                  <input
                    type="text"
                    value={formProvider.baseUrl}
                    onChange={(e) =>
                      setFormProvider({ ...formProvider, baseUrl: e.target.value })
                    }
                    placeholder={selectedMetadata.defaultBaseUrl}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Model</label>
                {isLoadingModels ? (
                  <div className="mt-1 px-3 py-2 border rounded-lg flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading models...
                  </div>
                ) : availableModels.length > 0 ? (
                  <select
                    value={formProvider.model}
                    onChange={(e) =>
                      setFormProvider({ ...formProvider, model: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select a model</option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formProvider.model}
                    onChange={(e) =>
                      setFormProvider({ ...formProvider, model: e.target.value })
                    }
                    placeholder="Enter model name"
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={editingProvider ? handleUpdateProvider : handleAddProvider}
                disabled={!formProvider.name || !formProvider.model}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {editingProvider ? "Save Changes" : "Add Provider"}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
