'use client';

import { create } from 'zustand';
import type { ShootCard } from '@/types/shoot-card';
import type { GeneratorFilters } from '@/types/filters';
import { filtersToRequest } from '@/types/api';

/**
 * Initial empty filters state
 */
const initialFilters: GeneratorFilters = {
  mood: null,
  theme: null,
  style: null,
  technique: null,
  location: null,
  challenge: null,
  gear: null,
};

/**
 * Generator store state and actions
 */
interface GeneratorStore {
  // State
  filters: GeneratorFilters;
  currentCard: ShootCard | null;
  isGenerating: boolean;
  error: string | null;
  history: ShootCard[];

  // Actions
  setFilter: <K extends keyof GeneratorFilters>(
    key: K,
    value: GeneratorFilters[K]
  ) => void;
  clearFilters: () => void;
  generate: () => Promise<void>;
  clearError: () => void;
  clearCard: () => void;

  // Computed
  activeFilterCount: () => number;
}

/**
 * Main generator store using Zustand
 */
export const useGeneratorStore = create<GeneratorStore>((set, get) => ({
  // Initial state
  filters: initialFilters,
  currentCard: null,
  isGenerating: false,
  error: null,
  history: [],

  // Set a single filter value
  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },

  // Clear all filters to initial state
  clearFilters: () => {
    set({ filters: initialFilters });
  },

  // Generate a new shoot card
  generate: async () => {
    const { filters, currentCard, history } = get();

    // Set loading state
    set({ isGenerating: true, error: null });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtersToRequest(filters)),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to generate shoot card');
      }

      // Add current card to history if it exists
      const newHistory = currentCard
        ? [currentCard, ...history].slice(0, 10) // Keep last 10
        : history;

      set({
        currentCard: data.data,
        isGenerating: false,
        history: newHistory,
      });
    } catch (err) {
      set({
        isGenerating: false,
        error: err instanceof Error ? err.message : 'An error occurred',
      });
    }
  },

  // Clear error message
  clearError: () => {
    set({ error: null });
  },

  // Clear current card
  clearCard: () => {
    set({ currentCard: null });
  },

  // Count active filters
  activeFilterCount: () => {
    const { filters } = get();
    let count = 0;

    if (filters.mood) count++;
    if (filters.theme && filters.theme.length > 0) count++;
    if (filters.style) count++;
    if (filters.technique) count++;
    if (filters.location) count++;
    if (filters.challenge) count++;
    if (filters.gear && filters.gear.length > 0) count++;

    return count;
  },
}));
