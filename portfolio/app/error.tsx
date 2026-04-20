'use client';

import { useEffect } from 'react';
import ServerErrorComponent from '@/app/components/ServerError/ServerError';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return <ServerErrorComponent reset={reset} />;
}
