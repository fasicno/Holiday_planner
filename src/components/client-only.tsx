'use client';

import { Loader2 } from 'lucide-react';
import { useState, useEffect, type ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
}

export function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
        <div className="flex justify-center items-center h-[80vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return <>{children}</>;
}
