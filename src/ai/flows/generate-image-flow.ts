'use server';
/**
 * @fileOverview An AI flow for generating an image based on a text prompt.
 *
 * - generateImage - A function that takes a text prompt and returns an image URL.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  imagePrompt: z.string().describe('A detailed text prompt for image generation.'),
  location: z.string().describe('The location (e.g., city, country) of the subject.'),
  name: z.string().describe('The name of the place or activity.'),
  description: z.string().describe('A short description of the place or activity.'),
});

export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().url().describe('The URL of the generated image.'),
});

export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return await generateImageFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateImagePrompt',
    input: {schema: GenerateImageInputSchema},
    output: {schema: GenerateImageOutputSchema},
    prompt: `Generate a photorealistic image that visually represents the following location.

Location: {{{location}}}
Name: {{{name}}}
Description: {{{description}}}
Image Subject: {{{imagePrompt}}}

Find a high-quality, professional photograph that best captures the essence of this place. Do not create an artistic rendering; it should look like a real photo.
`,
    model: 'googleai/imagen-4.0-fast-generate-001', 
});


const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `A photorealistic, high-quality image of ${input.name} in ${input.location}. The scene should capture: ${input.description}. Focus on: ${input.imagePrompt}`,
    });

    if (!media.url) {
        throw new Error('Image generation failed to return a URL.');
    }

    return { imageUrl: media.url };
  }
);
