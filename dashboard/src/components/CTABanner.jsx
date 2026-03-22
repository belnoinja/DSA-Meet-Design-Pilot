import React from 'react';
import { TOPMATE_URL } from '../lib/constants.js';

export default function CTABanner() {
  return (
    <div className="mt-8 bg-surface border border-border rounded-lg px-5 py-4 text-center">
      <p className="text-sm text-text-secondary">
        Preparing for a product company interview?{' '}
        <a
          href={TOPMATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent font-medium hover:underline"
        >
          Book a mock interview →
        </a>
      </p>
    </div>
  );
}
