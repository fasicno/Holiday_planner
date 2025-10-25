'use server';
/**
 * @fileOverview An AI flow for suggesting holiday activities.
 *
 * - suggestActivities - A function that suggests activities based on location and type.
 * - SuggestActivitiesInput - The input type for the suggestActivities function.
 * - SuggestActivitiesOutput - The return type for the suggestActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import placeholderData from '@/lib/placeholder-images.json';

const SuggestActivitiesInputSchema = z.object({
  location: z.string().describe('The city or area for the holiday.'),
  activityType: z.enum(['restaurants', 'tourist attractions', 'hidden gems', 'shopping', 'movies', 'hotels']).describe('The type of activity to suggest.'),
});
export type SuggestActivitiesInput = z.infer<typeof SuggestActivitiesInputSchema>;

const ActivitySuggestionSchema = z.object({
    name: z.string().describe('The name of the place or activity.'),
    description: z.string().describe('A short, compelling description of the activity.'),
    address: z.string().describe('The approximate address or area.'),
    website: z.string().optional().describe('The official website URL for the suggestion, if available.'),
    imageUrl: z.string().url().describe('A URL for a relevant, high-quality image for the suggestion.'),
    imageHint: z.string().describe('One or two keywords for a relevant image. For tourist attractions that are temples, use the hint "temple".'),
});

const SuggestActivitiesOutputSchema = z.object({
  suggestions: z.array(ActivitySuggestionSchema).describe('A list of 3-5 activity suggestions.'),
});
export type SuggestActivitiesOutput = z.infer<typeof SuggestActivitiesOutputSchema>;

export async function suggestActivities(input: SuggestActivitiesInput): Promise<SuggestActivitiesOutput> {
  const result = await suggestActivitiesFlow(input);
  
  // Replace AI-generated image URLs with reliable placeholders
  const activityPlaceholders = placeholderData.placeholderImages.filter(p => p.id.startsWith('activity-'));
  
  result.suggestions.forEach((suggestion, index) => {
    // Try to find a relevant placeholder based on the hint
    const hintWords = (suggestion.imageHint?.toLowerCase() || '').split(' ');
    let placeholder = activityPlaceholders.find(p => {
      const placeholderHintWords = p.imageHint.toLowerCase().split(' ');
      return hintWords.some(hw => placeholderHintWords.includes(hw));
    });
    
    // Fallback to cycling through placeholders if no specific match is found
    if (!placeholder) {
      placeholder = activityPlaceholders[index % activityPlaceholders.length];
    }

    suggestion.imageUrl = placeholder.imageUrl;
    suggestion.imageHint = placeholder.imageHint;
  });

  return result;
}

const prompt = ai.definePrompt({
  name: 'suggestActivitiesPrompt',
  input: {schema: SuggestActivitiesInputSchema},
  output: {schema: SuggestActivitiesOutputSchema},
  prompt: `You are an expert travel agent. A user is asking for suggestions for their holiday.

Based on the user's location and desired activity type, provide a list of 3-5 specific and interesting suggestions.

For each suggestion, provide a name, a short description, an address, and a website URL if one is available.
Crucially, DO NOT provide an imageUrl. Provide an imageHint of one or two keywords that would be good for a photo of the location.
For any suggestions that are temples, you MUST use the imageHint "temple".

Location: {{{location}}}
Activity Type: {{{activityType}}}`,
});

const suggestActivitiesFlow = ai.defineFlow(
  {
    name: 'suggestActivitiesFlow',
    inputSchema: SuggestActivitiesInputSchema,
    outputSchema: SuggestActivitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
