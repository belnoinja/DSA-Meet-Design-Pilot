import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TIER_COLORS } from '../lib/constants.js';

export default function TierBadge({ tier }) {
  const colors = TIER_COLORS[tier] || { bg: 'var(--color-surface-tertiary)', text: 'var(--color-text-tertiary)', label: `T${tier}` };
  return (
    <Badge
      variant="outline"
      className="text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.text + '40' }}
    >
      {colors.label}
    </Badge>
  );
}
