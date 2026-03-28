import React, { useState, useRef, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import { PART_STATUS } from '../lib/constants.js';

/* ── Icons ──────────────────────────────────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1.5" />
      <path d="M6.5 10l2.5 2.5 4.5-4.5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" fill="var(--color-surface-tertiary)" stroke="var(--color-border)" strokeWidth="1.2" />
      <rect x="7" y="10" width="6" height="4.5" rx="1" stroke="var(--color-text-tertiary)" strokeWidth="1" />
      <path d="M8.5 10V8.5a1.5 1.5 0 013 0V10" stroke="var(--color-text-tertiary)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function ActiveDot() {
  return (
    <span
      className="stepper-active-dot"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'var(--color-accent-light)',
        border: '2px solid var(--color-accent)',
      }}
    >
      <span
        className="stepper-pulse"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--color-accent)',
        }}
      />
    </span>
  );
}

function ChevronIcon({ down }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {down ? <path d="M3 5l4 4 4-4" /> : <path d="M3 9l4-4 4 4" />}
    </svg>
  );
}

/* ── Collapsible wrapper with smooth height transition ──────────────────────── */

function Collapsible({ open, children }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(open ? 'auto' : 0);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setHeight(open ? 'auto' : 0);
      return;
    }
    if (open) {
      const h = ref.current?.scrollHeight || 0;
      setHeight(h);
      const timer = setTimeout(() => setHeight('auto'), 250);
      return () => clearTimeout(timer);
    } else {
      // Set explicit height before collapsing so transition works
      const h = ref.current?.scrollHeight || 0;
      setHeight(h);
      // Force reflow then set to 0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(0));
      });
    }
  }, [open]);

  return (
    <div
      ref={ref}
      style={{
        height: height === 'auto' ? 'auto' : height,
        overflow: 'hidden',
        transition: height === 'auto' ? 'none' : 'height 0.25s ease',
      }}
    >
      {children}
    </div>
  );
}

/* ── Single step ────────────────────────────────────────────────────────────── */

function StepItem({ part, name, description_html, status, isLast, expanded, onToggle }) {
  const isLocked = status === 'locked';
  const isPassed = status === 'passed';
  const isCurrent = status === 'active' || status === 'attempted';
  const cfg = PART_STATUS[status] || PART_STATUS.locked;

  // Line segment color
  const lineColor = isPassed
    ? '#22c55e'
    : isCurrent
      ? 'var(--color-accent)'
      : 'var(--color-border)';

  return (
    <div className="flex" style={{ opacity: isLocked ? 0.55 : 1 }}>
      {/* Left column: icon + connecting line */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
        {/* Status icon */}
        <div className="flex-shrink-0" style={{ zIndex: 1 }}>
          {isPassed ? <CheckIcon /> : isCurrent ? <ActiveDot /> : <LockIcon />}
        </div>
        {/* Connecting line */}
        {!isLast && (
          <div
            className="flex-1"
            style={{
              width: 2,
              minHeight: 16,
              background: lineColor,
              borderRadius: 1,
            }}
          />
        )}
      </div>

      {/* Right column: content */}
      <div className="flex-1 min-w-0 ml-3 pb-5">
        {/* Clickable header */}
        <button
          onClick={!isLocked ? onToggle : undefined}
          disabled={isLocked}
          className="w-full text-left flex items-start justify-between gap-2 group"
          style={{
            cursor: isLocked ? 'not-allowed' : 'pointer',
            borderLeft: isCurrent ? '2px solid var(--color-accent)' : '2px solid transparent',
            paddingLeft: 10,
            borderRadius: 2,
            animation: isCurrent ? 'stepper-border-pulse 2s ease-in-out infinite' : 'none',
          }}
        >
          <div className="flex-1 min-w-0">
            {/* Part label + status badge */}
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: cfg.color }}
              >
                Part {part}
              </span>
              {isPassed && (
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}
                </span>
              )}
              {status === 'attempted' && (
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}
                </span>
              )}
              {status === 'active' && (
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  Current
                </span>
              )}
            </div>

            {/* Title */}
            <div
              className="text-sm font-medium"
              style={{ color: isLocked ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}
            >
              {name}
            </div>

            {/* Locked hint */}
            {isLocked && (
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                Complete Part {part - 1} to unlock
              </div>
            )}
          </div>

          {/* Chevron */}
          {!isLocked && (
            <span
              className="flex-shrink-0 mt-1 transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              <ChevronIcon down={!expanded} />
            </span>
          )}
        </button>

        {/* Expandable content */}
        <Collapsible open={expanded && !isLocked}>
          <div
            className="mt-2 ml-3 px-4 py-3 rounded-lg"
            style={{
              background: 'var(--color-surface-secondary)',
              borderLeft: '2px solid var(--color-border)',
            }}
          >
            {description_html ? (
              <MarkdownRenderer html={description_html} />
            ) : (
              <p className="text-sm italic" style={{ color: 'var(--color-text-tertiary)' }}>
                No description available for this part.
              </p>
            )}
          </div>
        </Collapsible>
      </div>
    </div>
  );
}

/* ── CSS keyframes (injected once) ──────────────────────────────────────────── */

const styleId = 'stepper-timeline-styles';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes stepper-border-pulse {
      0%, 100% { border-left-color: var(--color-accent); }
      50%      { border-left-color: transparent; }
    }
    @keyframes stepper-dot-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(1.3); opacity: 0.7; }
    }
    .stepper-pulse {
      animation: stepper-dot-pulse 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

/* ── Main component (drop-in replacement for PartAccordion) ─────────────────── */

export default function StepperTimeline({ parts }) {
  if (!parts || parts.length === 0) return null;

  // Determine current part (same logic as PartAccordion)
  const currentPart = parts.find(p => p.status === 'attempted' || p.status === 'active')
    || [...parts].reverse().find(p => p.status === 'passed')
    || parts[0];

  const [expandedCurrent, setExpandedCurrent] = useState(currentPart?.part ?? null);
  const [expandedPassed, setExpandedPassed] = useState(null);

  const handleToggle = (p) => {
    const isPassed = p.status === 'passed';
    if (isPassed) {
      setExpandedPassed(prev => prev === p.part ? null : p.part);
    } else {
      setExpandedCurrent(prev => prev === p.part ? null : p.part);
    }
  };

  const isExpanded = (p) => {
    if (p.status === 'passed') return expandedPassed === p.part;
    return expandedCurrent === p.part;
  };

  return (
    <div className="py-2">
      {parts.map((p, i) => (
        <StepItem
          key={p.part}
          part={p.part}
          name={p.name}
          description_html={p.description_html}
          status={p.status}
          isLast={i === parts.length - 1}
          expanded={isExpanded(p)}
          onToggle={() => handleToggle(p)}
        />
      ))}
    </div>
  );
}
