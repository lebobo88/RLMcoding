import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { PHOTOGRAPHY_EXPERT_PROMPT, buildUserPrompt } from '@/lib/api/prompts';
import { fetchReferenceImages, buildSearchQuery } from '@/lib/api/unsplash';
import { generateConceptImage } from '@/lib/api/gemini';
import type { ShootCard } from '@/types/shoot-card';
import type { GenerateResponse } from '@/types/api';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Default model if not specified in environment
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const getModelId = () => process.env.ANTHROPIC_MODEL_ID || DEFAULT_MODEL;

/**
 * Generate unique ID for shoot card
 */
function generateId(): string {
  return `sc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Parse Claude's response into a ShootCard
 */
function parseClaudeResponse(content: string): Omit<ShootCard, 'id' | 'referenceImages'> {
  // Try to extract JSON from the response
  let jsonStr = content.trim();

  // Remove markdown code blocks if present
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(jsonStr);

  // Validate required fields
  if (!parsed.title || !parsed.description || !parsed.subject) {
    throw new Error('Missing required fields in response');
  }

  return {
    title: parsed.title,
    description: parsed.description,
    subject: parsed.subject,
    technique: {
      aperture: parsed.technique?.aperture || 'Varies based on subject',
      shutter: parsed.technique?.shutter || 'Adjust for lighting conditions',
      lighting: parsed.technique?.lighting || 'Natural light recommended',
      composition: parsed.technique?.composition || 'Follow the rule of thirds',
    },
    mood: parsed.mood || 'Evocative',
    location: parsed.location || 'Flexible',
    colorPalette: Array.isArray(parsed.colorPalette) ? parsed.colorPalette : ['#8B4513', '#2F4F4F', '#CD853F', '#696969'],
    challengeLevel: Math.min(5, Math.max(1, Number(parsed.challengeLevel) || 3)) as 1 | 2 | 3 | 4 | 5,
    proTips: Array.isArray(parsed.proTips) ? parsed.proTips.slice(0, 3) : ['Take your time', 'Experiment with angles'],
  };
}

export async function POST(request: Request): Promise<NextResponse<GenerateResponse>> {
  const startTime = Date.now();

  try {
    // Parse request body
    const body = await request.json().catch(() => ({}));

    // Build prompt with filters
    const userPrompt = buildUserPrompt({
      mood: body.mood,
      theme: body.theme,
      style: body.style,
      technique: body.technique,
      location: body.location,
      challenge: body.challenge,
      gear: body.gear,
    });

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SERVICE_UNAVAILABLE' as const,
            message: 'API configuration error. Please check server settings.',
          },
        },
        { status: 503 }
      );
    }

    // Call Claude API
    const message = await anthropic.messages.create({
      model: getModelId(),
      max_tokens: 1024,
      temperature: 0.9,
      system: PHOTOGRAPHY_EXPERT_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract text content
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    // Parse the response
    const concept = parseClaudeResponse(textContent.text);

    // Fetch reference images and generate AI concept image in parallel
    const searchQuery = buildSearchQuery({
      subject: concept.subject,
      mood: concept.mood,
      location: concept.location,
    });

    const [referenceImages, generatedImageResult] = await Promise.all([
      fetchReferenceImages(searchQuery, 4),
      generateConceptImage({
        title: concept.title,
        description: concept.description,
        mood: concept.mood,
        location: concept.location,
        colorPalette: concept.colorPalette,
        technique: {
          lighting: concept.technique.lighting,
          composition: concept.technique.composition,
        },
      }),
    ]);

    // Build final shoot card
    const shootCard: ShootCard = {
      id: generateId(),
      ...concept,
      referenceImages,
      generatedImage: generatedImageResult
        ? {
            dataUrl: `data:${generatedImageResult.mimeType};base64,${generatedImageResult.imageData}`,
            generated: true,
          }
        : undefined,
    };

    const processingMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: shootCard,
      meta: {
        generatedAt: new Date().toISOString(),
        processingMs,
      },
    });
  } catch (error) {
    console.error('Generation error:', error);

    const processingMs = Date.now() - startTime;

    // Determine error type
    let errorCode: 'GENERATION_FAILED' | 'RATE_LIMITED' | 'INVALID_INPUT' = 'GENERATION_FAILED';
    let statusCode = 500;
    let message = 'Failed to generate shoot card. Please try again.';

    if (error instanceof Error) {
      if (error.message.includes('rate')) {
        errorCode = 'RATE_LIMITED';
        statusCode = 429;
        message = 'Too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('JSON')) {
        message = 'Failed to parse creative response. Please try again.';
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: errorCode,
          message,
        },
        meta: {
          generatedAt: new Date().toISOString(),
          processingMs,
        },
      },
      { status: statusCode }
    );
  }
}
