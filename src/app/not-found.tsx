'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-foreground-secondary">
          Looks like you've wandered into uncharted weather territory.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-secondary"
        >
          Return to Weather Dashboard
        </Link>
      </motion.div>
    </div>
  );
} 