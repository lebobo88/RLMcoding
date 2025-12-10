import type { ShootCard } from './shoot-card';
import type { GeneratorFilters } from './filters';

/**
 * API request for generating a shoot card
 */
export interface GenerateRequest {
  mood?: string;
  theme?: string;
  style?: string;
  technique?: string;
  location?: string;
  challenge?: number;
  gear?: string;
}

/**
 * Converts store filters to API request format
 */
export function filtersToRequest(filters: GeneratorFilters): GenerateRequest {
  return {
    mood: filters.mood ?? undefined,
    theme: filters.theme?.join(', ') ?? undefined,
    style: filters.style ?? undefined,
    technique: filters.technique ?? undefined,
    location: filters.location ?? undefined,
    challenge: filters.challenge ?? undefined,
    gear: filters.gear?.join(', ') ?? undefined,
  };
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

/**
 * API error structure
 */
export interface ApiError {
  code: 'GENERATION_FAILED' | 'RATE_LIMITED' | 'INVALID_INPUT' | 'SERVICE_UNAVAILABLE';
  message: string;
}

/**
 * API response metadata
 */
export interface ApiMeta {
  generatedAt: string;
  processingMs: number;
}

/**
 * Full generation response
 */
export type GenerateResponse = ApiResponse<ShootCard>;
