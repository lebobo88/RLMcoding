'use client';

import { PhotoIdea, MAX_FAVORITES } from '@/lib/types';
import { IdeaCard } from './idea-card';

interface FavoritesPanelProps {
  favorites: PhotoIdea[];
  onRemoveFavorite: (idea: PhotoIdea) => void;
  count: number;
}

export function FavoritesPanel({ favorites, onRemoveFavorite, count }: FavoritesPanelProps) {
  return (
    <aside aria-labelledby="favorites-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="favorites-heading" className="text-xl font-bold text-neutral-900">
          Favorites
        </h2>
        <span className="text-sm text-neutral-500">
          {count} / {MAX_FAVORITES}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-neutral-200 rounded-xl">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-neutral-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p className="text-neutral-500 text-sm">
            No favorites yet. Save ideas by clicking the heart button!
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {favorites.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              isFavorite={true}
              onToggleFavorite={() => onRemoveFavorite(idea)}
              showRemove
            />
          ))}
        </div>
      )}
    </aside>
  );
}
