import React from 'react';

const MODES = [
  { id: 'interview', label: 'Interview', short: 'Int', color: '#dc2626', bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.3)' },
  { id: 'guided',    label: 'Guided',    short: 'Gui', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  { id: 'learning',  label: 'Learning',  short: 'Lrn', color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)'  },
];

const DESCRIPTIONS = {
  interview: 'Blank slate — design everything from scratch',
  guided:    'Structural hints — you name and connect the pieces',
  learning:  'Full scaffolding — implement the method bodies',
};

// Compact variant for the top toolbar
function CompactSelector({ mode, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {MODES.map(m => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => !active && onChange(m.id)}
            title={DESCRIPTIONS[m.id]}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-150"
            style={active ? {
              background: m.bg,
              color: m.color,
              border: `1px solid ${m.border}`,
            } : {
              background: 'transparent',
              color: 'var(--color-text-tertiary)',
              border: '1px solid transparent',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: active ? m.color : 'var(--color-border)' }}
            />
            <span className="hidden sm:inline">{m.label}</span>
            <span className="sm:hidden">{m.short}</span>
          </button>
        );
      })}
    </div>
  );
}

// Full-width variant (used standalone)
function FullSelector({ mode, onChange }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border flex-shrink-0" style={{ background: 'var(--color-surface)' }}>
      <span className="text-xs text-text-tertiary font-medium mr-1">Mode:</span>
      {MODES.map(m => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => !active && onChange(m.id)}
            title={DESCRIPTIONS[m.id]}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all border"
            style={active ? {
              background: m.bg,
              color: m.color,
              border: `1px solid ${m.border}`,
            } : {
              background: 'transparent',
              color: 'var(--color-text-tertiary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? m.color : 'var(--color-border)' }} />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

export default function DifficultyModeSelector({ mode, onChange, compact = false }) {
  if (compact) return <CompactSelector mode={mode} onChange={onChange} />;
  return <FullSelector mode={mode} onChange={onChange} />;
}
