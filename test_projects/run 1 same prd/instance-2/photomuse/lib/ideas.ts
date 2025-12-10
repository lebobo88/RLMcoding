import { PhotoIdea, LocationFilter } from './types';
import ideasData from '../data/photography-ideas.json';

const ideas: PhotoIdea[] = ideasData as PhotoIdea[];

/**
 * Get all photography ideas
 */
export function getAllIdeas(): PhotoIdea[] {
  return ideas;
}

/**
 * Get ideas filtered by location type
 */
export function getIdeasByLocation(filter: LocationFilter): PhotoIdea[] {
  if (filter === 'all') {
    return ideas;
  }
  return ideas.filter(idea => idea.locations.includes(filter));
}

/**
 * Generate a random idea based on location filter
 * @param filter - Location type or 'all' for no filter
 * @returns A random PhotoIdea matching the filter criteria
 */
export function generateIdea(filter: LocationFilter): PhotoIdea | null {
  const filteredIdeas = getIdeasByLocation(filter);

  if (filteredIdeas.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * filteredIdeas.length);
  return filteredIdeas[randomIndex];
}

/**
 * Get an idea by its ID
 */
export function getIdeaById(id: string): PhotoIdea | undefined {
  return ideas.find(idea => idea.id === id);
}

/**
 * Get count of ideas by location
 */
export function getIdeaCountByLocation(filter: LocationFilter): number {
  return getIdeasByLocation(filter).length;
}
