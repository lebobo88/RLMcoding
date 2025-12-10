import { GoogleGenerativeAI } from '@google/generative-ai';

// Default model for image generation
const DEFAULT_IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';
const getImageModelId = () => process.env.GEMINI_IMAGE_MODEL_ID || DEFAULT_IMAGE_MODEL;

/**
 * Generate an AI image based on the photography concept
 */
export async function generateConceptImage(params: {
  title: string;
  description: string;
  mood: string;
  location: string;
  colorPalette: string[];
  technique: {
    lighting: string;
    composition: string;
  };
}): Promise<{ imageData: string; mimeType: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('Gemini API key not configured, skipping image generation');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: getImageModelId(),
      generationConfig: {
        responseModalities: ['Text', 'Image'],
      } as never,
    });

    // Build a detailed prompt for the image
    const colorDescription = params.colorPalette.slice(0, 3).join(', ');
    const prompt = `Create a fine art photography concept visualization:

Title: "${params.title}"
Description: ${params.description}
Mood: ${params.mood}
Location: ${params.location}
Lighting: ${params.technique.lighting}
Composition: ${params.technique.composition}
Color palette: ${colorDescription}

Generate a beautiful, artistic photograph that captures this concept. The image should look like a professional fine art photograph with dramatic lighting and composition. Make it inspirational for photographers.`;

    const response = await model.generateContent(prompt);
    const result = response.response;

    // Extract image from response
    if (result.candidates && result.candidates[0]?.content?.parts) {
      for (const part of result.candidates[0].content.parts) {
        // Check if this part has inline data (image)
        if ('inlineData' in part && part.inlineData) {
          return {
            imageData: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          };
        }
      }
    }

    console.log('No image generated in Gemini response');
    return null;
  } catch (error) {
    console.error('Gemini image generation error:', error);
    return null;
  }
}
