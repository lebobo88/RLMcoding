/**
 * System prompt for Claude to generate photography shoot cards
 */
export const PHOTOGRAPHY_EXPERT_PROMPT = `You are a world-renowned fine art photography curator and creative director with decades of experience inspiring photographers.

Your role is to generate unique, actionable photography shoot concepts that spark creativity and push artistic boundaries.

Each concept you create should:
- Be specific enough to execute, not vague platitudes
- Balance creativity with achievability
- Encourage artistic growth and experimentation
- Include technical guidance appropriate to the challenge level
- Feel fresh and inspiring, not generic or clichéd

You understand the full spectrum of photographic genres: portrait, landscape, street, abstract, documentary, still life, architecture, macro, and night photography.

You are deeply familiar with photographic techniques: long exposure, shallow depth of field, high contrast, silhouettes, double exposure, panning, HDR, minimalism, and symmetry.

You think in terms of mood, emotion, and storytelling, not just technical execution.

IMPORTANT: Respond ONLY with valid JSON matching the exact schema below. Do not include markdown formatting, code blocks, or any text outside the JSON object.`;

/**
 * Build the user prompt for shoot card generation
 */
export function buildUserPrompt(filters: {
  mood?: string;
  theme?: string;
  style?: string;
  technique?: string;
  location?: string;
  challenge?: number;
  gear?: string;
}): string {
  const filterLines: string[] = [];

  if (filters.mood) {
    filterLines.push(`Mood direction: ${filters.mood}`);
  }
  if (filters.theme) {
    filterLines.push(`Theme(s): ${filters.theme}`);
  }
  if (filters.style) {
    filterLines.push(`Photography style: ${filters.style}`);
  }
  if (filters.technique) {
    filterLines.push(`Technique focus: ${filters.technique}`);
  }
  if (filters.location) {
    filterLines.push(`Location type: ${filters.location}`);
  }
  if (filters.challenge) {
    filterLines.push(`Difficulty level: ${filters.challenge}/5`);
  }
  if (filters.gear) {
    filterLines.push(`Equipment: ${filters.gear}`);
  }

  const filterSection = filterLines.length > 0
    ? `\n\nConsider these preferences:\n${filterLines.join('\n')}`
    : '';

  return `Generate a unique fine art photography shoot concept.${filterSection}

Respond with a JSON object containing exactly these fields:
{
  "title": "2-6 word evocative title",
  "description": "2-3 sentence artistic vision and story",
  "subject": "What to photograph (specific, not vague)",
  "technique": {
    "aperture": "Recommended aperture with explanation",
    "shutter": "Shutter speed guidance",
    "lighting": "Lighting approach and recommendations",
    "composition": "Compositional guidance"
  },
  "mood": "Emotional direction in 2-5 words",
  "location": "Where to shoot (generic types, not addresses)",
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "challengeLevel": 1-5,
  "proTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;
}
