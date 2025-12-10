'use client';

import { LocationFilter as LocationFilterType } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface LocationFilterProps {
  currentFilter: LocationFilterType;
  onFilterChange: (filter: LocationFilterType) => void;
}

const filters: { value: LocationFilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'rural', label: 'Rural' },
  { value: 'suburban', label: 'Suburban' },
  { value: 'urban', label: 'Urban' },
];

export function LocationFilter({ currentFilter, onFilterChange }: LocationFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Location filter">
      {filters.map(({ value, label }) => (
        <Button
          key={value}
          variant={currentFilter === value ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(value)}
          aria-pressed={currentFilter === value}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
