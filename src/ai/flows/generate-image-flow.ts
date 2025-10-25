'use server';
/**
 * @fileOverview An AI flow for generating an image from a text prompt.
 *
 * - generateImage - A function that takes a text prompt and returns an image data URI.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe("The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
    return await generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a high-quality, photorealistic image for a travel website based on the following description: ${input.prompt}`,
    });

    const imageUrl = media.url;
    if (!imageUrl) {
        throw new Error('Image generation failed to return a URL.');
    }

    return { imageUrl };
  }
);
