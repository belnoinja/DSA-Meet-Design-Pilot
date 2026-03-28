import React from 'react';

// Spec §9: Two card options side by side.
// "Continue" card: subtle green left border (recommended).
// "Start fresh" card: neutral gray left border.
export default function CarryForwardDialog({ partNum, partName, mode, onContinue, onStartFresh }) {
  const modeLabel = { interview: 'Interview', guided: 'Guided', learning: 'Learning' }[mode] || mode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }} />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl p-6"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div className="text-2xl mb-2">🎉</div>
        <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Part {partNum - 1} complete!
        </h2>
        <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>
          Part {partNum} — <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{partName}</span> is now unlocked.
          How would you like to proceed?
        </p>

        {/* Two card options — spec §9 */}
        <div className="grid grid-cols-2 gap-3 mb-4">

          {/* "Continue" card — green left border (recommended) */}
          <button
            onClick={onContinue}
            className="flex flex-col text-left p-4 rounded-xl transition-all"
            style={{
              borderLeft: '3px solid #22c55e',
              border: '1px solid var(--color-border)',
              borderLeftWidth: '3px',
              borderLeftColor: '#22c55e',
              background: 'rgba(34,197,94,0.05)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.05)'}
          >
            <div className="text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
              Continue with my code
            </div>
            <div className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Extend your Part {partNum - 1} solution — this is how real interviews work.
            </div>
          </button>

          {/* "Start fresh" card — neutral gray left border */}
          <button
            onClick={onStartFresh}
            className="flex flex-col text-left p-4 rounded-xl transition-all"
            style={{
              border: '1px solid var(--color-border)',
              borderLeftWidth: '3px',
              borderLeftColor: 'var(--color-border)',
              background: 'var(--color-surface-secondary)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-surface-secondary)'}
          >
            <div className="text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
              Start fresh
            </div>
            <div className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Load Part {partNum} {modeLabel} starter. Use if your Part {partNum - 1} design needs a rewrite.
            </div>
          </button>
        </div>

        {/* Recommended note — spec §9 */}
        <p className="text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
          ✧ Recommended: Continue with your code
        </p>
      </div>
    </div>
  );
}
