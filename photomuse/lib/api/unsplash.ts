import type { ReferenceImage } from '@/types/shoot-card';

const UNSPLASH_API_URL = 'https://api.unsplash.com';

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
}

/**
 * Build a search query from shoot card concept
 */
export function buildSearchQuery(concept: {
  subject: string;
  mood: string;
  location?: string;
}): string {
  const elements = [concept.subject, concept.mood];

  if (concept.location) {
    elements.push(concept.location);
  }

  // Clean and combine
  const query = elements
    .filter(Boolean)
    .join(' ')
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim()
    .slice(0, 100);          // Limit length

  return query || 'fine art photography';
}

/**
 * Fetch reference images from Unsplash API
 */
export async function fetchReferenceImages(
  query: string,
  count: number = 6
): Promise<ReferenceImage[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    console.warn('UNSPLASH_ACCESS_KEY not set, returning empty images');
    return [];
  }

  try {
    const params = new URLSearchParams({
      query,
      per_page: String(count),
      orientation: 'landscape',
      content_filter: 'high',
      order_by: 'relevant',
    });

    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?${params}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
      }
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status);
      return [];
    }

    const data: UnsplashSearchResponse = await response.json();

    return data.results.map((photo) => ({
      id: photo.id,
      url: `${photo.urls.regular}&w=800`,
      thumbnailUrl: `${photo.urls.small}&w=400`,
      fullUrl: photo.urls.full,
      alt: photo.alt_description || 'Reference photography',
      photographer: photo.user.name,
      photographerUrl: `${photo.user.links.html}?utm_source=photomuse&utm_medium=referral`,
    }));
  } catch (error) {
    console.error('Failed to fetch Unsplash images:', error);
    return [];
  }
}
