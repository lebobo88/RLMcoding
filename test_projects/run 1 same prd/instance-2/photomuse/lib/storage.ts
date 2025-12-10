import { PhotoIdea, STORAGE_KEY, MAX_FAVORITES } from './types';

/**
 * Get all favorites from localStorage
 */
export function getFavorites(): PhotoIdea[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (e) {
    console.error('[PhotoMuse] Failed to read favorites:', e);
    return [];
  }
}

/**
 * Save a favorite idea to localStorage
 * @returns true if saved, false if at limit or error
 */
export function saveFavorite(idea: PhotoIdea): boolean {
  try {
    const favorites = getFavorites();

    // Check if already favorited
    if (favorites.some(f => f.id === idea.id)) {
      return true;
    }

    // Check limit
    if (favorites.length >= MAX_FAVORITES) {
      return false;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites, idea]));
    return true;
  } catch (e) {
    console.error('[PhotoMuse] Failed to save favorite:', e);
    return false;
  }
}

/**
 * Remove a favorite idea from localStorage
 */
export function removeFavorite(ideaId: string): boolean {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(f => f.id !== ideaId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('[PhotoMuse] Failed to remove favorite:', e);
    return false;
  }
}

/**
 * Check if an idea is favorited
 */
export function isFavorited(ideaId: string): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.id === ideaId);
}

/**
 * Clear all favorites
 */
export function clearFavorites(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('[PhotoMuse] Failed to clear favorites:', e);
    return false;
  }
}
