import React from 'react';
import { PATTERN_COLORS } from '../lib/constants.js';

export default function PatternBadge({ pattern }) {
  const colors = PATTERN_COLORS[pattern] || { bg: '#f5f5f5', text: '#525252' };
  return (
    <span
      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {pattern}
    </span>
  );
}
