/**
 * Core data model for a photography shoot card concept
 */
export interface ShootCard {
  id: string;
  title: string;
  description: string;
  subject: string;
  technique: TechniqueGuide;
  mood: string;
  location: string;
  colorPalette: string[];
  challengeLevel: ChallengeLevel;
  proTips: string[];
  referenceImages: ReferenceImage[];
  /** AI-generated concept image (base64 data URL) */
  generatedImage?: GeneratedImage;
}

/**
 * AI-generated concept visualization
 */
export interface GeneratedImage {
  /** Base64 data URL for the image */
  dataUrl: string;
  /** Whether generation was successful */
  generated: true;
}

/**
 * Technical guidance for executing the shoot
 */
export interface TechniqueGuide {
  aperture: string;
  shutter: string;
  lighting: string;
  composition: string;
}

/**
 * Difficulty rating from 1 (beginner) to 5 (expert)
 */
export type ChallengeLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Challenge level descriptions for tooltips
 */
export const CHALLENGE_DESCRIPTIONS: Record<ChallengeLevel, string> = {
  1: 'Beginner: Simple concept, no special equipment needed',
  2: 'Easy: Basic technique required',
  3: 'Intermediate: Requires planning and skill',
  4: 'Advanced: Complex setup or rare conditions',
  5: 'Expert: Significant challenge, unique vision required',
};

/**
 * Reference image from Unsplash
 */
export interface ReferenceImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  fullUrl: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}
