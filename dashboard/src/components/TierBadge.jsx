import React from 'react';
import { TIER_COLORS } from '../lib/constants.js';

export default function TierBadge({ tier }) {
  const colors = TIER_COLORS[tier] || { bg: '#f5f5f5', text: '#525252', label: `T${tier}` };
  return (
    <span
      className="inline-block text-xs font-semibold px-1.5 py-0.5 rounded"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {colors.label}
    </span>
  );
}
