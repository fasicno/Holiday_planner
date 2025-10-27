import Image from 'next/image';
import Link from 'next/link';
import placeholderData from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const heroImage = placeholderData.placeholderImages.find(p => p.id === 'hero-background');

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-24 pb-16 md:pb-24">
      <section className="relative h-[80vh] flex items-center justify-center text-center text-white">
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
    </div>
  );
}
