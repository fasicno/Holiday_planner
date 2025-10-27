'use server';
/**
 * @fileOverview A flow for determining the user's location based on their IP address.
 *
 * - getLocation - A function that returns the city of the user.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define a tool for fetching geolocation data from an IP address
const freegeoip = ai.defineTool(
    {
      name: 'freegeoip',
      description: 'Get location information from an IP address.',
      inputSchema: z.object({
        ip: z.string().optional().describe('The IP address to look up. If not provided, the IP of the caller is used.'),
      }),
      outputSchema: z.any(),
    },
    async (input) => {
        const url = `https://freegeoip.app/json/${input.ip || ''}`;
        const response = await fetch(url);
        return await response.json();
    }
  );
  

export async function getLocation(): Promise<{ city: string } | null> {
    return await getLocationFlow();
}

const getLocationFlow = ai.defineFlow(
  {
    name: 'getLocationFlow',
    inputSchema: z.void(),
    outputSchema: z.object({ city: z.string() }).nullable(),
  },
  async () => {
    const { output } = await ai.run('freegeoip');
    
    if (output && typeof output === 'object' && 'city' in output && typeof output.city === 'string') {
        return { city: output.city };
    }
    
    return null;
  }
);
