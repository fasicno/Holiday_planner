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

const SuggestActivitiesInputSchema = z.object({
  location: z.string().describe('The city or area for the holiday.'),
  activityType: z.enum(['restaurants', 'tourist attractions', 'hidden gems', 'shopping', 'movies', 'hotels', 'travel']).describe('The type of activity to suggest.'),
});
export type SuggestActivitiesInput = z.infer<typeof SuggestActivitiesInputSchema>;

const ActivitySuggestionSchema = z.object({
    name: z.string().describe('The name of the place or activity.'),
    description: z.string().describe('A short, compelling description of the activity.'),
    address: z.string().describe('The approximate address or area.'),
    website: z.string().optional().describe('The official website URL for the suggestion, if available.'),
    latitude: z.number().describe('The latitude of the location.'),
    longitude: z.number().describe('The longitude of the location.'),
    imagePrompt: z.string().describe('A few keywords to help find a relevant image for this location. For example, "eiffel tower" or "beach sunset".'),
});

const SuggestActivitiesOutputSchema = z.object({
  suggestions: z.array(ActivitySuggestionSchema).describe('A list of 10-12 activity suggestions.'),
});
export type SuggestActivitiesOutput = z.infer<typeof SuggestActivitiesOutputSchema>;

export async function suggestActivities(input: SuggestActivitiesInput): Promise<SuggestActivitiesOutput> {
  return await suggestActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActivitiesPrompt',
  input: {schema: SuggestActivitiesInputSchema},
  output: {schema: SuggestActivitiesOutputSchema},
  prompt: `You are an expert travel agent. A user is asking for suggestions for their holiday.

Based on the user's location and desired activity type, provide a list of 10-12 specific and interesting suggestions.

For the 'travel' activity type, suggest major travel hubs like airports, train stations, and bus terminals.

For each suggestion, provide a name, a short, compelling description, an address, a website URL if one is available, the precise latitude and longitude, and a few keywords to help find a relevant image for the location.

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
