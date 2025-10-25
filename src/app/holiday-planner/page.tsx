'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, X, Plus, Car, Clapperboard, UtensilsCrossed } from 'lucide-react';
import { suggestActivities, SuggestActivitiesInput, SuggestActivitiesOutput } from '@/ai/flows/suggest-activities-flow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';


type ActivityType = SuggestActivitiesInput['activityType'];
type ActivitySuggestion = SuggestActivitiesOutput['suggestions'][0];
type ItineraryItem = ActivitySuggestion & { activityType: ActivityType };

export default function HolidayPlannerPage() {
  const [location, setLocation] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('tourist attractions');
  const [suggestions, setSuggestions] = useState<ActivitySuggestion[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddToItinerary = (e: React.MouseEvent, suggestion: ActivitySuggestion) => {
    e.preventDefault();
    e.stopPropagation();
    setItinerary((prev) => [...prev, { ...suggestion, activityType }]);
  };

  const handleRemoveFromItinerary = (suggestionToRemove: ActivitySuggestion) => {
    setItinerary((prev) => prev.filter((item) => item.name !== suggestionToRemove.name));
  };

  const isSuggestionInItinerary = (suggestion: ActivitySuggestion) => {
    return itinerary.some((item) => item.name === suggestion.name);
  };
  
  const handleBookTaxi = (destination: ActivitySuggestion) => {
    window.open(`https://www.olacabs.com/`, '_blank');
    toast({
      title: "Redirecting to Ola Cabs...",
      description: `Continue your booking for ${destination.name} on the Ola website.`,
    })
  }

  const handleBookMovie = (destination: ActivitySuggestion) => {
    window.open(`https://in.bookmyshow.com/`, '_blank');
    toast({
      title: "Redirecting to BookMyShow...",
      description: `Continue your booking for ${destination.name} on the BookMyShow website.`,
    })
  }
  
  const handleOrderFood = (destination: ActivitySuggestion) => {
    window.open(`https://www.zomato.com/`, '_blank');
    toast({
      title: "Redirecting to Zomato...",
      description: `Search for ${destination.name} on Zomato to order food.`,
    })
  }

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
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem getting suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const SuggestionCard = ({ item }: { item: ActivitySuggestion }) => (
    <Card className="flex flex-col h-full transition-shadow duration-300 hover:shadow-lg overflow-hidden">
        {item.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={item.imageUrl}
            alt={`Image of ${item.name}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-muted-foreground">{item.description}</p>
        <p className="text-sm font-medium text-primary pt-2">{item.address}</p>
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
          <Button 
            className="w-full"
            onClick={(e) => handleAddToItinerary(e, item)}
            disabled={isSuggestionInItinerary(item)}
          >
            <Plus className="mr-2"/>
            Add to Itinerary
          </Button>
      </div>
    </Card>
  );

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
                  <SelectItem value="movies">Movies</SelectItem>
                  <SelectItem value="hotels">Hotels</SelectItem>
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
                <div className="h-48 bg-muted w-full animate-pulse"></div>
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
            {suggestions.map((item, index) =>
              item.website ? (
                <Link
                  key={index}
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  aria-label={`Visit website for ${item.name}`}
                >
                  <SuggestionCard item={item} />
                </Link>
              ) : (
                <SuggestionCard key={index} item={item} />
              )
            )}
          </div>
        </div>
      )}

      {itinerary.length > 0 ? (
        <div className="mt-16">
          <h2 className="text-3xl font-headline font-bold text-center mb-8">Your Itinerary</h2>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-6 space-y-4">
              {itinerary.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div className="flex-grow">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.address}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {item.activityType === 'movies' && (
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Clapperboard className="mr-2" />
                              Book Ticket
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Book a movie ticket?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will open the BookMyShow website in a new tab to book a ticket for {item.name}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleBookMovie(item)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    )}
                     {(item.activityType === 'restaurants' || item.activityType === 'hotels') && (
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <UtensilsCrossed className="mr-2" />
                              Order Food
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Order Food?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will open the Zomato website in a new tab to order food from {item.name}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleOrderFood(item)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Car className="mr-2" />
                          Book Taxi
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Book a taxi?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will open the Ola Cabs website in a new tab to book a ride to {item.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleBookTaxi(item)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button variant="ghost" size="icon" onClick={() => handleRemoveFromItinerary(item)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove from itinerary</span>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
         !isLoading && suggestions.length === 0 && (
           <div className="mt-16 text-center">
               <h2 className="text-3xl font-headline font-bold mb-4">Your Itinerary</h2>
               <Card className="max-w-3xl mx-auto p-8 text-center">
                  <p className="text-muted-foreground">Enter a location above to get started. Your planned activities will appear here.</p>
               </Card>
           </div>
         )
      )}
    </div>
  );
}
