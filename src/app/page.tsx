import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import placeholderData from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Clapperboard, Map, Utensils } from 'lucide-react';

const heroImage = placeholderData.placeholderImages.find(p => p.id === 'hero-background');

const planningActivities = [
  {
    title: "Vehicle Booking",
    description: "Find the perfect ride for your adventure.",
    icon: <Car className="w-8 h-8 text-primary" />,
    href: "/holiday-planner",
  },
  {
    title: "Sightseeing",
    description: "Discover breathtaking places and create lasting memories.",
    icon: <Map className="w-8 h-8 text-primary" />,
    href: "/holiday-planner",
  },
  {
    title: "Dining",
    description: "Explore the best local cuisine and book tables.",
    icon: <Utensils className="w-8 h-8 text-primary" />,
    href: "/holiday-planner",
  },
  {
    title: "Entertainment",
    description: "Book tickets for movies, concerts, and more.",
    icon: <Clapperboard className="w-8 h-8 text-primary" />,
    href: "/holiday-planner",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-24 pb-16 md:pb-24">
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-primary/40" />
        <div className="relative z-10 container px-4 md:px-6 space-y-6">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-shadow-lg">
            Your Perfect Holiday, Planned
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-shadow">
            Craft your dream vacation with our all-in-one planning tool. Unforgettable experiences start here.
          </p>
           <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground mt-4">
                <Link href="/holiday-planner">
                    Start Planning <ArrowRight className="ml-2" />
                </Link>
            </Button>
        </div>
      </section>

      <section className="container px-4 md:px-6">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Plan Your Adventure</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            From car rentals to restaurant reservations, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-10">
          {planningActivities.map((activity) => (
            <Link href={activity.href} key={activity.title}>
              <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 h-full flex flex-col text-center items-center p-6">
                 <CardHeader className="p-0 mb-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        {activity.icon}
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                  <CardTitle className="text-xl mb-2">{activity.title}</CardTitle>
                  <p className="text-muted-foreground">{activity.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/holiday-planner">
                    Go to Planner <ArrowRight className="ml-2" />
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
