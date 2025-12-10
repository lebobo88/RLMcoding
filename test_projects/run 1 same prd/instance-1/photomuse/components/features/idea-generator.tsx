'use client';

import { useState, useCallback } from 'react';
import { PhotoIdea, LocationFilter as LocationFilterType } from '@/lib/types';
import { generateIdea } from '@/lib/ideas';
import { Button } from '@/components/ui/button';
import { LocationFilter } from './location-filter';
import { IdeaCard } from './idea-card';

interface IdeaGeneratorProps {
  onToggleFavorite: (idea: PhotoIdea) => void;
  isFavorite: (ideaId: string) => boolean;
}

export function IdeaGenerator({ onToggleFavorite, isFavorite }: IdeaGeneratorProps) {
  const [currentIdea, setCurrentIdea] = useState<PhotoIdea | null>(null);
  const [filter, setFilter] = useState<LocationFilterType>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);

    // Small delay for animation effect
    setTimeout(() => {
      const idea = generateIdea(filter);
      setCurrentIdea(idea);
      setIsGenerating(false);
    }, 150);
  }, [filter]);

  const handleFilterChange = useCallback((newFilter: LocationFilterType) => {
    setFilter(newFilter);
  }, []);

  return (
    <section aria-labelledby="generator-heading" className="space-y-6">
      <div className="text-center">
        <h2 id="generator-heading" className="text-2xl font-bold text-neutral-900 mb-2">
          Generate Ideas
        </h2>
        <p className="text-neutral-600 mb-6">
          Click to discover your next photography masterpiece
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <LocationFilter currentFilter={filter} onFilterChange={handleFilterChange} />

        <Button
          size="lg"
          onClick={handleGenerate}
          isLoading={isGenerating}
          className="min-w-[200px]"
        >
          {currentIdea ? 'Generate New Idea' : 'Generate Idea'}
        </Button>
      </div>

      {currentIdea && (
        <div className="mt-8">
          <IdeaCard
            idea={currentIdea}
            isFavorite={isFavorite(currentIdea.id)}
            onToggleFavorite={() => onToggleFavorite(currentIdea)}
          />
        </div>
      )}

      {!currentIdea && (
        <div className="mt-8 text-center p-12 border-2 border-dashed border-neutral-200 rounded-xl">
          <p className="text-neutral-500">
            Click the button above to generate your first photography idea!
          </p>
        </div>
      )}
    </section>
  );
}
