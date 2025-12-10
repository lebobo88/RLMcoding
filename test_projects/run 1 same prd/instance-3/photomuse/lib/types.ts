/**
 * Location types where photography ideas can be applied
 */
export type LocationType = 'rural' | 'suburban' | 'urban';

/**
 * A photography idea with subject, composition, lighting, and technique
 */
export interface PhotoIdea {
  id: string;
  subject: string;
  composition: string;
  lighting: string;
  technique: string;
  locations: LocationType[];
}

/**
 * Filter options for location filtering
 */
export type LocationFilter = LocationType | 'all';

/**
 * Maximum number of favorites that can be stored
 */
export const MAX_FAVORITES = 50;

/**
 * localStorage key for favorites
 */
export const STORAGE_KEY = 'photomuse-favorites';
