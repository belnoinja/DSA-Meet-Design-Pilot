import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PATTERN_COLORS } from '../lib/constants.js';

export default function PatternBadge({ pattern }) {
  const colors = PATTERN_COLORS[pattern] || { bg: 'var(--color-surface-tertiary)', text: 'var(--color-text-secondary)' };
  return (
    <Badge
      variant="secondary"
      className="text-xs font-medium whitespace-nowrap rounded-full"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {pattern}
    </Badge>
  );
}
