'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2 } from 'lucide-react';
import { suggestActivities, SuggestActivitiesInput, SuggestActivitiesOutput } from '@/ai/flows/suggest-activities-flow';

type ActivityType = SuggestActivitiesInput['activityType'];

export default function HolidayPlannerPage() {
  const [location, setLocation] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('tourist attractions');
  const [suggestions, setSuggestions] = useState<SuggestActivitiesOutput['suggestions']>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestActivities({ location, activityType });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      // Here you could show an error toast to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Plan Your Perfect Holiday
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Let our AI assistant help you discover the best activities for your trip.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto mb-12">
        <CardHeader>
          <CardTitle>Find Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1 space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <Input
                id="location"
                placeholder="e.g., Paris, France"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-1 space-y-2">
              <label htmlFor="activity-type" className="text-sm font-medium">Activity Type</label>
              <Select value={activityType} onValueChange={(value: ActivityType) => setActivityType(value)}>
                <SelectTrigger id="activity-type">
                  <SelectValue placeholder="Select an activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurants">Restaurants</SelectItem>
                  <SelectItem value="tourist attractions">Tourist Attractions</SelectItem>
                  <SelectItem value="hidden gems">Hidden Gems</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isLoading} className="md:col-span-1 w-full bg-accent hover:bg-accent/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2" />
                  Get Suggestions
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
             <Card key={i}>
                <CardHeader>
                    <div className="h-6 bg-muted rounded w-2/3 animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-1/2 animate-pulse mt-2"></div>
                </CardContent>
             </Card>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h2 className="text-3xl font-headline font-bold text-center mb-8">Your AI-Powered Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((item, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <p className="text-muted-foreground">{item.description}</p>
                  <p className="text-sm font-medium text-primary pt-2">{item.address}</p>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button className="w-full">Add to Itinerary</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

       {!isLoading && suggestions.length === 0 && (
         <div className="mt-16 text-center">
             <h2 className="text-3xl font-headline font-bold mb-4">Your Itinerary</h2>
             <Card className="max-w-3xl mx-auto p-8 text-center">
                <p className="text-muted-foreground">Enter a location above to get started. Your planned activities will appear here.</p>
             </Card>
         </div>
       )}
    </div>
  );
}
