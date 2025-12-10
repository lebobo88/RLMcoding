'use client';

import { useFavorites } from '@/hooks/use-favorites';
import { IdeaGenerator } from '@/components/features/idea-generator';
import { FavoritesPanel } from '@/components/features/favorites-panel';

export default function Home() {
  const { favorites, toggleFavorite, isFavorite, count } = useFavorites();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-600">
              PhotoMuse
            </h1>
            <p className="mt-2 text-lg text-neutral-600">
              Fine Art Photography Ideas Generator
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generator Section - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <IdeaGenerator
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
          </div>

          {/* Favorites Section - 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <FavoritesPanel
              favorites={favorites}
              onRemoveFavorite={toggleFavorite}
              count={count}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-neutral-500 text-sm">
            PhotoMuse - Discover your next masterpiece
          </p>
        </div>
      </footer>
    </main>
  );
}
