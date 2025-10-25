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
    country: z.string().describe('The country where the suggestion is located.'),
    website: z.string().optional().describe('The official website URL for the suggestion, if available.'),
    latitude: z.number().describe('The latitude of the location.'),
    longitude: z.number().describe('The longitude of the location.'),
    placeId: z.string().optional().describe('The Google Places place_id for this location, if available.'),
    photoReference: z.string().optional().describe('A valid Google Places photo_reference for this location, if one exists.'),
});

const SuggestActivitiesOutputSchema = z.object({
  suggestions: z.array(ActivitySuggestionSchema).describe('A list of 10-12 activity suggestions.'),
  searchCountry: z.string().describe("The country of the user's search location. For example, if the user enters 'Paris', this should be 'France'.")
});
export type SuggestActivitiesOutput = z.infer<typeof SuggestActivitiesOutputSchema>;

export async function suggestActivities(input: SuggestActivitiesInput): Promise<SuggestActivitiesOutput> {
  return await suggestActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActivitiesPrompt',
  input: {schema: SuggestActivitiesInputSchema},
  output: {schema: SuggestActivitiesOutputSchema},
  prompt: `You are an expert travel agent with access to Google Places data. A user is asking for suggestions for their holiday.

Based on the user's location and desired activity type, provide a list of 10-12 specific and interesting suggestions.

Also, identify the country of the user's search location.

For the 'travel' activity type, suggest major travel hubs like airports, train stations, and bus terminals.

For each suggestion, you MUST provide the following details by looking up the location in Google Places:
- name: The official name of the place.
- description: A short, compelling description.
- address: The full, formatted address.
- country: The country it is in.
- website: The official website URL, if available.
- latitude and longitude: The precise geographic coordinates.
- placeId: The Google Places 'place_id'.
- photoReference: A valid 'photo_reference' from the Google Places photos data. If a place has multiple photos, pick the best one.

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
