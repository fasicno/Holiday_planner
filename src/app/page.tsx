import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import placeholderData from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Clapperboard, Map, Utensils, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { ClientOnly } from '@/components/client-only';
import { Suspense } from 'react';

const heroImage = placeholderData.placeholderImages.find(p => p.id === 'hero-background');
const vidhanaSoudhaImage = placeholderData.placeholderImages.find(p => p.id === 'vidhana-soudha');


const planningActivities = [
  {
    title: "Vehicle Booking",
    description: "Find the perfect ride for your adventure.",
    icon: <Car className="w-10 h-10" />,
    href: "/holiday-planner",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
  },
  {
    title: "Sightseeing",
    description: "Discover breathtaking places and create lasting memories.",
    icon: <Map className="w-10 h-10" />,
    href: "/holiday-planner",
    bgColor: "bg-green-500/10",
    textColor: "text-green-500",
  },
  {
    title: "Dining",
    description: "Explore the best local cuisine and book tables.",
    icon: <Utensils className="w-10 h-10" />,
    href: "/holiday-planner",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500",
  },
  {
    title: "Entertainment",
    description: "Book tickets for movies, concerts, and more.",
    icon: <Clapperboard className="w-10 h-10" />,
    href: "/holiday-planner",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-500",
  },
];

const featuredDestinations = [
    {
        name: "Vidhana Soudha",
        location: "Bangalore, India",
        description: "The seat of the state legislature of Karnataka, a magnificent example of Neo-Dravidian architecture.",
        imagePrompt: "A grand, imposing government building, Vidhana Soudha, in Bangalore, India, under a clear blue sky. Show the intricate details of its Dravidian architectural style."
    },
    {
        name: "Eiffel Tower",
        location: "Paris, France",
        description: "An iconic wrought-iron lattice tower on the Champ de Mars.",
        imagePrompt: "The Eiffel Tower in Paris at sunset, with golden light reflecting off the structure and the city skyline in the background."
    },
    {
        name: "Colosseum",
        location: "Rome, Italy",
        description: "An ancient oval amphitheatre in the centre of the city of Rome.",
        imagePrompt: "The ancient Colosseum in Rome, Italy, with dramatic lighting showcasing its historical architecture and arches."
    }
]

async function GeneratedImageCard({ destination }: { destination: typeof featuredDestinations[0] }) {
  const { imageUrl } = await generateImage({
    prompt: destination.imagePrompt,
    name: destination.name,
    location: destination.location,
    description: destination.description,
  });

  return (
    <Card className="overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
      <div className="relative h-64 w-full">
        <Image
          src={imageUrl}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="text-2xl font-bold text-white text-shadow-lg">{destination.name}</h3>
          <p className="text-sm text-white/90 text-shadow">{destination.location}</p>
        </div>
      </div>
      <CardContent className="p-6 bg-card">
        <p className="text-muted-foreground">{destination.description}</p>
        <Button variant="link" className="p-0 mt-4" asChild>
          <Link href="/holiday-planner">
            Plan a trip <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ImageCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="relative h-64 w-full bg-muted animate-pulse flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Generating image...</p>
            </div>
            <CardContent className="p-6">
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-full bg-muted rounded animate-pulse mt-4"></div>
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse mt-2"></div>
                <div className="h-6 w-24 bg-muted rounded animate-pulse mt-4"></div>
            </CardContent>
        </Card>
    )
}


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
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            From car rentals to restaurant reservations, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12">
          {planningActivities.map((activity) => (
            <Link href={activity.href} key={activity.title} className="group block">
              <Card className={cn(
                "overflow-hidden h-full transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-2 relative",
                activity.bgColor
              )}>
                <CardContent className="p-8 text-center flex flex-col items-center gap-4">
                    <div className={cn("p-4 rounded-full bg-white shadow-md", activity.textColor)}>
                        {activity.icon}
                    </div>
                    <div className="mt-2">
                        <h3 className="text-xl font-bold text-foreground">{activity.title}</h3>
                        <p className="text-muted-foreground mt-1 text-sm">{activity.description}</p>
                    </div>
                    <div className="absolute bottom-4 right-4 text-white bg-accent rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-16">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/holiday-planner">
                    Go to Planner <ArrowRight className="ml-2" />
                </Link>
            </Button>
        </div>
      </section>

      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container px-4 md:px-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Featured Destinations</h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Get inspired by these AI-generated images of iconic landmarks.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {featuredDestinations.map(dest => (
                    <ClientOnly key={dest.name}>
                        <Suspense fallback={<ImageCardSkeleton />}>
                            {/* @ts-ignore */}
                            <GeneratedImageCard destination={dest} />
                        </Suspense>
                    </ClientOnly>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
}
