'use client';

import { PhotoIdea } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IdeaCardProps {
  idea: PhotoIdea;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  showRemove?: boolean;
}

export function IdeaCard({ idea, isFavorite, onToggleFavorite, showRemove = false }: IdeaCardProps) {
  return (
    <Card variant="elevated" className="animate-fade-in">
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            {idea.subject}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.locations.map(loc => (
              <span
                key={loc}
                className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 capitalize"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">
              Composition
            </h4>
            <p className="text-neutral-800">{idea.composition}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">
              Lighting
            </h4>
            <p className="text-neutral-800">{idea.lighting}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">
              Technique
            </h4>
            <p className="text-neutral-800">{idea.technique}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          variant={isFavorite ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="group"
        >
          <svg
            className={`w-5 h-5 mr-1 transition-transform group-hover:scale-110 ${
              isFavorite ? 'text-white fill-current' : 'text-secondary-500'
            }`}
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {showRemove && isFavorite ? 'Remove' : isFavorite ? 'Saved' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
}
