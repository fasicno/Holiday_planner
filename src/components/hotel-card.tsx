import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

import type { Hotel } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import placeholderData from '@/lib/placeholder-images.json';


type HotelCardProps = {
  hotel: Hotel;
};

export function HotelCard({ hotel }: HotelCardProps) {
    const hotelImage = placeholderData.placeholderImages.find(p => p.id === hotel.images[0]);
  return (
    <Link href={`/hotels/${hotel.id}`}>
      <Card className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden">
            {hotelImage && (
              <Image
                src={hotelImage.imageUrl}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={hotelImage.imageHint}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-bold mb-1 leading-tight">{hotel.name}</CardTitle>
          <CardDescription>{hotel.location}</CardDescription>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="font-semibold">{hotel.rating}</span>
            <span className="text-sm text-muted-foreground">({hotel.reviews.length})</span>
          </div>
          <div>
            <span className="font-bold text-lg">${hotel.pricePerNight}</span>
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
