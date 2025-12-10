import type { ChallengeLevel } from './shoot-card';

/**
 * All filter options for the generator
 */
export interface GeneratorFilters {
  mood: MoodOption | null;
  theme: ThemeOption[] | null;
  style: StyleOption | null;
  technique: TechniqueOption | null;
  location: LocationOption | null;
  challenge: ChallengeLevel | null;
  gear: GearOption[] | null;
}

export type MoodOption =
  | 'mysterious'
  | 'joyful'
  | 'melancholic'
  | 'serene'
  | 'dramatic'
  | 'playful'
  | 'nostalgic'
  | 'ethereal';

export type ThemeOption =
  | 'identity'
  | 'nature'
  | 'urban'
  | 'time'
  | 'connection'
  | 'solitude'
  | 'movement'
  | 'light'
  | 'texture'
  | 'decay';

export type StyleOption =
  | 'portrait'
  | 'landscape'
  | 'street'
  | 'abstract'
  | 'documentary'
  | 'still-life'
  | 'architecture'
  | 'macro'
  | 'night';

export type TechniqueOption =
  | 'long-exposure'
  | 'shallow-dof'
  | 'high-contrast'
  | 'silhouette'
  | 'double-exposure'
  | 'panning'
  | 'hdr'
  | 'minimalist'
  | 'symmetry';

export type LocationOption =
  | 'indoor'
  | 'outdoor'
  | 'urban'
  | 'nature'
  | 'studio'
  | 'home'
  | 'water'
  | 'mountains'
  | 'desert';

export type GearOption =
  | 'phone-only'
  | '50mm-prime'
  | 'wide-angle'
  | 'telephoto'
  | 'macro-lens'
  | 'flash'
  | 'natural-light'
  | 'tripod';

/**
 * Filter display configuration
 */
export const FILTER_OPTIONS = {
  mood: [
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'joyful', label: 'Joyful' },
    { value: 'melancholic', label: 'Melancholic' },
    { value: 'serene', label: 'Serene' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'playful', label: 'Playful' },
    { value: 'nostalgic', label: 'Nostalgic' },
    { value: 'ethereal', label: 'Ethereal' },
  ],
  theme: [
    { value: 'identity', label: 'Identity' },
    { value: 'nature', label: 'Nature' },
    { value: 'urban', label: 'Urban' },
    { value: 'time', label: 'Time' },
    { value: 'connection', label: 'Connection' },
    { value: 'solitude', label: 'Solitude' },
    { value: 'movement', label: 'Movement' },
    { value: 'light', label: 'Light' },
    { value: 'texture', label: 'Texture' },
    { value: 'decay', label: 'Decay' },
  ],
  style: [
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'street', label: 'Street' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'documentary', label: 'Documentary' },
    { value: 'still-life', label: 'Still Life' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'macro', label: 'Macro' },
    { value: 'night', label: 'Night' },
  ],
  technique: [
    { value: 'long-exposure', label: 'Long Exposure' },
    { value: 'shallow-dof', label: 'Shallow DOF' },
    { value: 'high-contrast', label: 'High Contrast' },
    { value: 'silhouette', label: 'Silhouette' },
    { value: 'double-exposure', label: 'Double Exposure' },
    { value: 'panning', label: 'Panning' },
    { value: 'hdr', label: 'HDR' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'symmetry', label: 'Symmetry' },
  ],
  location: [
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'urban', label: 'Urban' },
    { value: 'nature', label: 'Nature' },
    { value: 'studio', label: 'Studio' },
    { value: 'home', label: 'Home' },
    { value: 'water', label: 'Water' },
    { value: 'mountains', label: 'Mountains' },
    { value: 'desert', label: 'Desert' },
  ],
  gear: [
    { value: 'phone-only', label: 'Phone Only' },
    { value: '50mm-prime', label: '50mm Prime' },
    { value: 'wide-angle', label: 'Wide Angle' },
    { value: 'telephoto', label: 'Telephoto' },
    { value: 'macro-lens', label: 'Macro Lens' },
    { value: 'flash', label: 'Flash' },
    { value: 'natural-light', label: 'Natural Light' },
    { value: 'tripod', label: 'Tripod' },
  ],
} as const;
