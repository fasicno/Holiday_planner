import Link from 'next/link';
import { Hotel } from 'lucide-react';
import { Button } from '../ui/button';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Hotel className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold font-headline text-primary">
            BookEase
          </span>
        </Link>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/hotels">All Stays</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
