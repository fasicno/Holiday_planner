import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  AirVent,
  Dumbbell,
  ParkingSquare,
  Dog,
  Utensils,
  Waves,
  Wifi,
  Star,
  Sprout,
} from 'lucide-react';
import type { AmenityName } from '@/lib/types';
import { getHotelById } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookingForm } from '@/components/booking-form';
import placeholderData from '@/lib/placeholder-images.json';

const amenityIcons: Record<AmenityName, React.ReactNode> = {
  wifi: <Wifi className="h-5 w-5" />,
  pool: <Waves className="h-5 w-5" />,
  parking: <ParkingSquare className="h-5 w-5" />,
  restaurant: <Utensils className="h-5 w-5" />,
  gym: <Dumbbell className="h-5 w-5" />,
  spa: <Sprout className="h-5 w-5" />,
  'pet-friendly': <Dog className="h-5 w-5" />,
  'air-conditioning': <AirVent className="h-5 w-5" />,
};

const amenityLabels: Record<AmenityName, string> = {
  wifi: 'Wi-Fi',
  pool: 'Pool',
  parking: 'Parking',
  restaurant: 'Restaurant',
  gym: 'Gym',
  spa: 'Spa',
  'pet-friendly': 'Pet Friendly',
  'air-conditioning': 'Air Conditioning',
};


export default function HotelDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | undefined };
}) {
  const hotel = getHotelById(params.id);

  if (!hotel) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">{hotel.name}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-accent fill-accent" />
            <span className="font-medium text-foreground">{hotel.rating}</span>
            <span>({hotel.reviews.length} reviews)</span>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <span>{hotel.location}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Carousel className="w-full rounded-lg overflow-hidden shadow-lg">
            <CarouselContent>
              {hotel.images.map((imgId, index) => {
                const imgData = placeholderData.placeholderImages.find(p => p.id === imgId);
                return (
                  <CarouselItem key={index}>
                    <div className="aspect-w-16 aspect-h-9">
                      {imgData && (
                        <Image
                          src={imgData.imageUrl}
                          alt={`${hotel.name} - view ${index + 1}`}
                          fill
                          className="object-cover"
                          data-ai-hint={imgData.imageHint}
                        />
                      )}
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-headline mb-3">About this place</h2>
              <p className="text-foreground/80 leading-relaxed">{hotel.description}</p>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-2xl font-bold font-headline mb-4">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {hotel.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3">
                    {amenityIcons[amenity]}
                    <span>{amenityLabels[amenity]}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold font-headline mb-4">Reviews</h2>
              <div className="space-y-6">
                {hotel.reviews.length > 0 ? hotel.reviews.map(review => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={review.avatarUrl} alt={review.author} />
                      <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{review.author}</h4>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span>{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-muted-foreground">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
            <div className="sticky top-24">
                <BookingForm hotel={hotel} searchParams={searchParams} />
            </div>
        </div>
      </div>
    </div>
  );
}
