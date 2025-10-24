import { HotelCard } from "@/components/hotel-card";
import { HotelSearchForm } from "@/components/hotel-search-form";
import { getHotels } from "@/lib/data";
import { Frown } from "lucide-react";

export default function HotelsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const location = searchParams?.location;
  const hotels = getHotels({ location });

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8">
        <div className="max-w-4xl mx-auto">
          <HotelSearchForm />
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-headline font-bold mb-2">
        {location ? `Stays in ${location}` : "Available Stays"}
      </h1>
      <p className="text-muted-foreground mb-8">
        {hotels.length} {hotels.length === 1 ? 'stay' : 'stays'} found.
      </p>

      {hotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg bg-card border">
          <Frown className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Hotels Found</h2>
          <p className="text-muted-foreground">
            We couldn't find any hotels matching your search. Try a different location.
          </p>
        </div>
      )}
    </div>
  );
}
