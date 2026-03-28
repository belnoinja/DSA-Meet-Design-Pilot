import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { api } from '../lib/api.js';

export default function StreakBadge() {
  const [streak, setStreak] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    api.getActivity()
      .then(data => setStreak(data.streak ?? 0))
      .catch(() => setStreak(0));
  }, []);

  if (streak === null) return null;

  const isActive = streak > 0;

  return (
    <div
      className="relative flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold cursor-default select-none"
      style={{
        background: isActive
          ? 'rgba(245, 158, 11, 0.12)'
          : 'var(--color-surface-tertiary)',
        color: isActive
          ? '#f59e0b'
          : 'var(--color-text-tertiary)',
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Flame
        className="flex-shrink-0"
        size={14}
        style={{
          color: isActive ? '#f59e0b' : 'var(--color-text-tertiary)',
        }}
      />
      <span className="tabular-nums">{streak}</span>

      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 6,
            background: 'var(--color-surface-elevated, var(--color-surface-tertiary))',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 11,
            lineHeight: '16px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 50,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {isActive
            ? `You've been active for ${streak} consecutive day${streak !== 1 ? 's' : ''}`
            : 'No active streak — solve a problem today!'
          }
        </div>
      )}
    </div>
  );
}
