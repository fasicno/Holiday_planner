import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Clapperboard, Map, Utensils } from "lucide-react";

export default function HolidayPlannerPage() {
  const activities = [
    {
      title: "Vehicle Booking",
      description: "Rent a car to explore the area at your own pace.",
      icon: <Car className="w-8 h-8 text-primary" />,
    },
    {
      title: "Sightseeing Tours",
      description: "Discover the best local attractions and landmarks.",
      icon: <Map className="w-8 h-8 text-primary" />,
    },
    {
      title: "Restaurant Reservations",
      description: "Book a table at the finest local restaurants.",
      icon: <Utensils className="w-8 h-8 text-primary" />,
    },
    {
      title: "Movie Tickets",
      description: "Catch the latest blockbusters during your trip.",
      icon: <Clapperboard className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Plan Your Perfect Holiday
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Build your dream itinerary with our planner. Book activities, find attractions, and make reservations all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {activities.map((activity) => (
          <Card key={activity.title} className="flex flex-col text-center items-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader className="p-0 mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                {activity.icon}
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
              <CardTitle className="text-xl mb-2">{activity.title}</CardTitle>
              <p className="text-muted-foreground">{activity.description}</p>
            </CardContent>
            <Button className="mt-6 w-full bg-accent hover:bg-accent/90">Add to Plan</Button>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
         <h2 className="text-3xl font-headline font-bold mb-4">Your Itinerary</h2>
         <Card className="max-w-3xl mx-auto p-8 text-center">
            <p className="text-muted-foreground">Your planned activities will appear here.</p>
         </Card>
      </div>
    </div>
  );
}
