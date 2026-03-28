import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import { PART_STATUS } from '../lib/constants.js';

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1"/>
      <path d="M4.5 7l2 2 3-3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="3" y="6.5" width="8" height="6" rx="1.5" stroke="var(--color-text-tertiary)" strokeWidth="1.2"/>
      <path d="M4.5 6.5V4.5a2.5 2.5 0 015 0v2" stroke="var(--color-text-tertiary)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function ChevronIcon({ down }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {down ? <path d="M2 4l4 4 4-4" /> : <path d="M2 8l4-4 4 4" />}
    </svg>
  );
}

function PartHeader({ part, name, status, expanded, onToggle }) {
  const isLocked  = status === 'locked';
  const isPassed  = status === 'passed';
  const isCurrent = status === 'active' || status === 'attempted';
  const cfg = PART_STATUS[status] || PART_STATUS.locked;

  return (
    <button
      onClick={!isLocked ? onToggle : undefined}
      disabled={isLocked}
      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
      style={{
        cursor: isLocked ? 'not-allowed' : 'pointer',
        background: expanded ? 'var(--color-surface-secondary)' : 'transparent',
      }}
      onMouseEnter={e => { if (!isLocked && !expanded) e.currentTarget.style.background = 'var(--color-surface-tertiary)'; }}
      onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Status icon */}
      <span className="flex-shrink-0 flex items-center justify-center w-5">
        {isPassed  ? <CheckIcon /> : isLocked ? <LockIcon /> : (
          <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
        )}
      </span>

      {/* Labels */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
            Part {part}
          </span>
          {isPassed && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: cfg.bg, color: cfg.color }}>
              {cfg.label}
            </span>
          )}
          {status === 'attempted' && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: cfg.bg, color: cfg.color }}>
              {cfg.label}
            </span>
          )}
          {status === 'active' && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: cfg.bg, color: cfg.color }}>
              Current
            </span>
          )}
        </div>
        <div
          className="text-sm font-medium mt-0.5 truncate"
          style={{ color: isLocked ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}
        >
          {name}
        </div>
        {isLocked && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
            Complete Part {part - 1} to unlock
          </div>
        )}
      </div>

      {/* Expand chevron */}
      {!isLocked && (
        <span style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
          <ChevronIcon down={!expanded} />
        </span>
      )}
    </button>
  );
}

// Spec §9: "at most one unlocked+passed part can be open alongside the current part"
// — the current (active/attempted) part is always shown expanded by default,
//   and one passed part may additionally be open at the same time.
export default function PartAccordion({ parts }) {
  if (!parts || parts.length === 0) return null;

  // Determine current part (active or attempted)
  const currentPart = parts.find(p => p.status === 'attempted' || p.status === 'active')
    || [...parts].reverse().find(p => p.status === 'passed')
    || parts[0];

  // expandedCurrent: which current/locked part is "open" (default = currentPart)
  // expandedPassed:  which passed part is additionally open (default = none)
  const [expandedCurrent, setExpandedCurrent] = useState(currentPart?.part ?? null);
  const [expandedPassed,  setExpandedPassed]  = useState(null);

  const handleToggle = (p) => {
    const isPassed = p.status === 'passed';

    if (isPassed) {
      // Toggle the passed panel; only one passed panel open at a time
      setExpandedPassed(prev => prev === p.part ? null : p.part);
    } else {
      // Toggle the current/active panel
      setExpandedCurrent(prev => prev === p.part ? null : p.part);
    }
  };

  const isExpanded = (p) => {
    if (p.status === 'passed') return expandedPassed === p.part;
    return expandedCurrent === p.part;
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
      {parts.map((p, i) => (
        <div key={p.part} style={{ borderTop: i > 0 ? '1px solid var(--color-border)' : 'none' }}>
          <PartHeader
            part={p.part}
            name={p.name}
            status={p.status}
            expanded={isExpanded(p)}
            onToggle={() => handleToggle(p)}
          />
          {isExpanded(p) && p.status !== 'locked' && (
            <div
              className="px-5 pb-5 pt-1"
              style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface-secondary)' }}
            >
              {p.description_html ? (
                <MarkdownRenderer html={p.description_html} />
              ) : (
                <p className="text-sm italic" style={{ color: 'var(--color-text-tertiary)' }}>
                  No description available for this part.
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
