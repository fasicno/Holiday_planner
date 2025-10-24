import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';
import { Button } from '../ui/button';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold font-headline text-primary">
            Holiday Planner
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/holiday-planner">Planner</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
