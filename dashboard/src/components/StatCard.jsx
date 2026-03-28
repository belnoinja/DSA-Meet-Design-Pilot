import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function StatCard({ label, solved, total, color = '#22c55e', tier }) {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  const isEmpty = solved === 0;

  // Tier-specific colors from CSS vars
  const tierColor = tier === 1 ? 'var(--color-tier-1)' : tier === 2 ? 'var(--color-tier-2)' : tier === 3 ? 'var(--color-tier-3)' : color;
  const activeColor = tier ? tierColor : color;

  return (
    <Card className="flex-1 min-w-0 relative overflow-hidden border-border bg-surface hover:border-border-hover transition-all duration-200">
      {!isEmpty && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: activeColor }}
        />
      )}
      <CardContent className="px-4 py-4">
        <div className="text-xs uppercase tracking-wider text-text-tertiary font-semibold mb-2.5">
          {label}
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span
            className="text-2xl font-bold tabular-nums"
            style={{ color: isEmpty ? 'var(--color-text-tertiary)' : activeColor }}
          >
            {solved}
          </span>
          <span className="text-sm text-muted-foreground font-medium">/ {total}</span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--color-surface-tertiary)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%`, background: isEmpty ? 'transparent' : activeColor }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
