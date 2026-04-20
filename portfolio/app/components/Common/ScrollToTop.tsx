'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset scroll to top on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
