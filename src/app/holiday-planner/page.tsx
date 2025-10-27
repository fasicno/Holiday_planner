'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, X, Plus, Car, Clapperboard, UtensilsCrossed, MapPin, Plane, Train, Bus, Building } from 'lucide-react';
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
type ItineraryItem = ActivitySuggestion & { activityType: ActivityType; distance: number | null };


type Coordinates = {
  latitude: number;
  longitude: number;
};

const SuggestionCardImage = ({imageQuery, name}: {imageQuery?: string, name: string}) => {
  if (!imageQuery) {
    return (
      <div className="relative h-52 w-full bg-muted flex items-center justify-center">
        <MapPin className="w-12 h-12 text-muted-foreground/50" />
      </div>
    );
  }

  const imageUrl = `/api/photo?image_query=${encodeURIComponent(imageQuery)}`;

  return (
    <div className="relative h-52 w-full overflow-hidden">
      <Image 
        src={imageUrl}
        alt={`Photo of ${name}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
  );
};

const SuggestionCard = ({
  item,
  onAddToItinerary,
  isAdded,
  distance,
}: {
  item: ActivitySuggestion,
  onAddToItinerary: (suggestion: ActivitySuggestion, distance: number | null) => void,
  isAdded: boolean,
  distance: number | null,
}) => (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group">
      <SuggestionCardImage imageQuery={item.imageQuery} name={item.name} />
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
          onClick={() => onAddToItinerary(item, distance)}
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
  const [searchCountry, setSearchCountry] = useState<string | null>(null);
  const { toast } = useToast();

  const getSuggestions = useCallback(async (loc: string, type: ActivityType) => {
    if (!loc) {
      toast({
        variant: "destructive",
        title: "Location required",
        description: "Please enter a location to get suggestions.",
      });
      return;
    }

    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestActivities({ location: loc, activityType: type });
      setSuggestions(result.suggestions);
      setSearchCountry(result.searchCountry);
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
  }, [toast]);
  
  const handleAddToItinerary = (suggestion: ActivitySuggestion, distance: number | null) => {
    setItinerary((prev) => [...prev, { ...suggestion, activityType, distance }]);
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

  const handleBookTravel = (medium: 'flight' | 'train' | 'bus', destination: ActivitySuggestion) => {
    window.open(`https://www.makemytrip.com/`, '_blank');
    toast({
        title: `Redirecting to MakeMyTrip...`,
        description: `Continue booking your ${medium} to ${destination.name}.`
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getSuggestions(location, activityType);
  };
  
  const handleActivityTypeChange = (type: ActivityType) => {
    setActivityType(type);
    if(location) {
        getSuggestions(location, type);
    }
  }

  const getActivityIcon = (activityType: ActivityType) => {
    switch (activityType) {
        case 'restaurants':
            return <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />;
        case 'hotels':
            return <Building className="w-5 h-5 text-muted-foreground" />;
        case 'movies':
            return <Clapperboard className="w-5 h-5 text-muted-foreground" />;
        case 'travel':
            return <Plane className="w-5 h-5 text-muted-foreground" />;
        default:
            return <MapPin className="w-5 h-5 text-muted-foreground" />;
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

        <Card className="max-w-3xl mx-auto mb-12">
          <CardHeader>
            <CardTitle>Find Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <div className="relative">
                  <Input
                    id="location"
                    placeholder="e.g., Udupi, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-1 space-y-2">
                <label htmlFor="activity-type" className="text-sm font-medium">Activity Type</label>
                <Select value={activityType} onValueChange={handleActivityTypeChange}>
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
                    <SelectItem value="travel">Travel</SelectItem>
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
                    <div className="h-52 w-full bg-muted animate-pulse"></div>
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
              {suggestions.map((item, index) => {
                const distance = userCoords ? getDistance(userCoords, item) : null;
                return (
                  <SuggestionCard 
                    key={`${item.name}-${index}`}
                    item={item} 
                    onAddToItinerary={handleAddToItinerary}
                    isAdded={isSuggestionInItinerary(item)}
                    distance={distance}
                  />
                )
              })}
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
                       <div className="w-12 h-12 rounded-md bg-muted flex-shrink-0 flex items-center justify-center">
                          {item.imageQuery ? (
                            <Image
                              src={`/api/photo?image_query=${encodeURIComponent(item.imageQuery)}`}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="object-cover rounded-md"
                            />
                          ) : (
                            getActivityIcon(item.activityType)
                          )}
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
                      {item.activityType === 'travel' && (item.country !== searchCountry || (item.distance && item.distance > 100)) && (
                          <Button variant="outline" size="sm" onClick={() => handleBookTravel('flight', item)}>
                              <Plane className="mr-2" /> Book Flight
                          </Button>
                      )}
                      {item.activityType === 'travel' && item.country === searchCountry && item.distance && item.distance <= 100 && item.distance > 0 && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleBookTravel('train', item)}>
                                <Train className="mr-2" /> Book Train
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleBookTravel('bus', item)}>
                                <Bus className="mr-2" /> Book Bus
                            </Button>
                          </>
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
                    <p className="text-muted-foreground">Enter a location to get started. Your planned activities will appear here.</p>
                 </Card>
             </div>
           )
        )}
      </div>
    </ClientOnly>
  );
}
    