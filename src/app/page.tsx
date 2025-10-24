import Image from 'next/image';
import Link from 'next/link';

import { HotelSearchForm } from '@/components/hotel-search-form';
import { Card, CardContent } from '@/components/ui/card';
import { getHotels } from '@/lib/data';
import placeholderData from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const heroImage = placeholderData.placeholderImages.find(p => p.id === 'hero-background');
const popularDestinations = getHotels({}).slice(0, 4);

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
            Your perfect stay, just a click away
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-shadow">
            Discover and book unique hotels and homes around the world. Unforgettable experiences start here.
          </p>
        </div>
        <div className="absolute -bottom-24 md:-bottom-16 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4">
          <HotelSearchForm />
        </div>
      </section>

      <section className="container px-4 md:px-6 pt-16 md:pt-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Popular Destinations</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Explore some of the most loved destinations and find your next adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-10">
          {popularDestinations.map((hotel) => {
             const hotelImage = placeholderData.placeholderImages.find(p => p.id === hotel.images[0]);
             return (
              <Link href={`/hotels/${hotel.id}`} key={hotel.id}>
                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="relative h-64">
                       {hotelImage && (
                        <Image
                          src={hotelImage.imageUrl}
                          alt={hotel.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={hotelImage.imageHint}
                        />
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                       <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="font-bold text-lg text-white font-headline">{hotel.name}</h3>
                        <p className="text-sm text-gray-200">{hotel.location}</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
        
        <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/hotels">
                    Explore All Hotels <ArrowRight className="ml-2" />
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
