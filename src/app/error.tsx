'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold">Oops! Something went wrong</h1>
        <p className="text-foreground-secondary">
          We're experiencing some turbulent weather in our systems.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-secondary"
        >
          Try again
        </button>
      </motion.div>
    </div>
  );
} 