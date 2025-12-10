'use client';

import { useState, useEffect, useCallback } from 'react';
import { PhotoIdea, MAX_FAVORITES } from '@/lib/types';
import { getFavorites, saveFavorite, removeFavorite } from '@/lib/storage';

interface UseFavoritesReturn {
  favorites: PhotoIdea[];
  addFavorite: (idea: PhotoIdea) => boolean;
  removeFavoriteById: (ideaId: string) => void;
  isFavorite: (ideaId: string) => boolean;
  toggleFavorite: (idea: PhotoIdea) => void;
  isAtLimit: boolean;
  count: number;
}

/**
 * Hook for managing favorites with localStorage persistence
 */
export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<PhotoIdea[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load favorites on mount
  useEffect(() => {
    setFavorites(getFavorites());
    setIsHydrated(true);
  }, []);

  const addFavorite = useCallback((idea: PhotoIdea): boolean => {
    const success = saveFavorite(idea);
    if (success) {
      setFavorites(prev => {
        if (prev.some(f => f.id === idea.id)) return prev;
        return [...prev, idea];
      });
    }
    return success;
  }, []);

  const removeFavoriteById = useCallback((ideaId: string): void => {
    removeFavorite(ideaId);
    setFavorites(prev => prev.filter(f => f.id !== ideaId));
  }, []);

  const isFavorite = useCallback((ideaId: string): boolean => {
    return favorites.some(f => f.id === ideaId);
  }, [favorites]);

  const toggleFavorite = useCallback((idea: PhotoIdea): void => {
    if (isFavorite(idea.id)) {
      removeFavoriteById(idea.id);
    } else {
      addFavorite(idea);
    }
  }, [isFavorite, addFavorite, removeFavoriteById]);

  return {
    favorites: isHydrated ? favorites : [],
    addFavorite,
    removeFavoriteById,
    isFavorite,
    toggleFavorite,
    isAtLimit: favorites.length >= MAX_FAVORITES,
    count: favorites.length,
  };
}
