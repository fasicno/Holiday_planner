'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, X, Plus, Car, Clapperboard, UtensilsCrossed, MapPin, ImageIcon } from 'lucide-react';
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
import { ClientOnly } from '@/components/client-only';

type ActivityType = SuggestActivitiesInput['activityType'];
type ActivitySuggestion = SuggestActivitiesOutput['suggestions'][0];
type ItineraryItem = ActivitySuggestion & { activityType: ActivityType };


type Coordinates = {
  latitude: number;
  longitude: number;
};

const SuggestionCardImage = ({ suggestion, location }: { suggestion: ActivitySuggestion, location: string }) => {
    const { imagePrompt, name, description } = suggestion;
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(true);
  
    useEffect(() => {
        setIsImageLoading(true);
        // Using a consistent seed for picsum.photos based on the suggestion name
        // This ensures the same image is shown for the same suggestion, but is unique otherwise.
        const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        setImageUrl(`https://picsum.photos/seed/${seed}/600/400`);
        setIsImageLoading(false);
    }, [name]);
  
    return (
      <div className="relative h-48 w-full overflow-hidden bg-muted flex items-center justify-center">
        {isImageLoading && (
          <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
            <ImageIcon className="w-8 h-8" />
            <span className="text-xs">Loading image...</span>
          </div>
        )}
        {imageUrl && !isImageLoading && (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={imagePrompt}
          />
        )}
      </div>
    );
  };


const SuggestionCard = ({
  item,
  onAddToItinerary,
  isAdded,
  distance,
  location,
}: {
  item: ActivitySuggestion,
  onAddToItinerary: (suggestion: ActivitySuggestion) => void,
  isAdded: boolean,
  distance: number | null,
  location: string,
}) => (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group">
      <SuggestionCardImage suggestion={item} location={location} />
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.address}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-muted-foreground">{item.description}</p>
        {distance !== null && (
          <div className="flex items-center text-sm text-primary pt-2 font-medium">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{distance.toFixed(2)} km away</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onAddToItinerary(item)}
          disabled={isAdded}
        >
          <Plus className="mr-2" />
          {isAdded ? 'Added to Itinerary' : 'Add to Itinerary'}
        </Button>
      </CardFooter>
    </Card>
);

// Haversine formula to calculate distance between two lat/lng points
const getDistance = (coord1: Coordinates, coord2: Coordinates) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}


export default function HolidayPlannerPage() {
  const [location, setLocation] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('tourist attractions');
  const [suggestions, setSuggestions] = useState<ActivitySuggestion[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation permission denied. Distance calculations will be unavailable.", error);
          toast({
            variant: "destructive",
            title: "Location Access Denied",
            description: "Could not get your location. Distances to suggestions will not be shown.",
          });
        }
      );
    }
  }, [toast]);

  const handleAddToItinerary = (suggestion: ActivitySuggestion) => {
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

  return (
    <ClientOnly>
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
                {isLoading && !suggestions.length ? (
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

        {isLoading && !suggestions.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
               <Card key={i}>
                  <div className="h-48 w-full bg-muted animate-pulse rounded-t-lg"></div>
                  <CardHeader>
                      <div className="h-6 bg-muted rounded w-2/3 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-1/2 animate-pulse mt-2"></div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                  </CardContent>
                  <CardFooter>
                      <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
                  </CardFooter>
               </Card>
            ))}
          </div>
        )}

        {suggestions.length > 0 && (
          <div>
            <h2 className="text-3xl font-headline font-bold text-center mb-8">Your AI-Powered Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((item, index) => (
                <SuggestionCard 
                  key={`${item.name}-${index}`}
                  item={item} 
                  onAddToItinerary={handleAddToItinerary}
                  isAdded={isSuggestionInItinerary(item)}
                  distance={userCoords ? getDistance(userCoords, item) : null}
                  location={location}
                />
              ))}
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
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0">
                         <ImageIcon className="w-full h-full object-cover text-muted-foreground p-4"/>
                       </div>
                      <div className="flex-grow">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.address}</p>
                      </div>
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
    </ClientOnly>
  );
}
