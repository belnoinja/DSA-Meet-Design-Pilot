import React from 'react';

/* ── Inject shimmer keyframes once ──────────────────────────────────────────── */

const styleId = 'skeleton-loader-styles';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes skeleton-shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .skeleton-shimmer {
      background: linear-gradient(
        90deg,
        var(--color-surface-secondary) 0%,
        var(--color-surface-elevated, var(--color-surface-tertiary)) 40%,
        var(--color-surface-secondary) 80%
      );
      background-size: 800px 100%;
      animation: skeleton-shimmer 1.6s ease-in-out infinite;
      border-radius: 6px;
    }
  `;
  document.head.appendChild(style);
}

/* ── Base shimmer block ─────────────────────────────────────────────────────── */

function ShimmerBlock({ className = '', style = {} }) {
  return <div className={`skeleton-shimmer ${className}`} style={style} />;
}

/* ── SkeletonText ───────────────────────────────────────────────────────────── */

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerBlock
          key={i}
          style={{
            height: 14,
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

/* ── SkeletonCard ───────────────────────────────────────────────────────────── */

export function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Title line */}
      <ShimmerBlock style={{ height: 16, width: '45%', marginBottom: 12 }} />
      {/* Subtitle */}
      <ShimmerBlock style={{ height: 12, width: '70%', marginBottom: 16 }} />
      {/* Progress bar */}
      <ShimmerBlock style={{ height: 8, width: '100%', marginBottom: 16, borderRadius: 9999 }} />
      {/* Stat rows */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <ShimmerBlock style={{ height: 12, width: '30%' }} />
          <ShimmerBlock style={{ height: 12, width: '15%' }} />
        </div>
        <div className="flex items-center justify-between">
          <ShimmerBlock style={{ height: 12, width: '40%' }} />
          <ShimmerBlock style={{ height: 12, width: '10%' }} />
        </div>
      </div>
    </div>
  );
}

/* ── SkeletonTable ──────────────────────────────────────────────────────────── */

export function SkeletonTable({ rows = 5 }) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-4 px-4 py-3"
        style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-secondary)' }}
      >
        <ShimmerBlock style={{ height: 12, width: 40 }} />
        <ShimmerBlock style={{ height: 12, width: '30%', flex: 1 }} />
        <ShimmerBlock style={{ height: 12, width: 60 }} />
        <ShimmerBlock style={{ height: 12, width: 60 }} />
        <ShimmerBlock style={{ height: 12, width: 80 }} />
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3.5"
          style={{
            borderBottom: i < rows - 1 ? '1px solid var(--color-border)' : 'none',
          }}
        >
          <ShimmerBlock style={{ height: 12, width: 32 }} />
          <ShimmerBlock style={{ height: 14, flex: 1, maxWidth: '40%' }} />
          <ShimmerBlock style={{ height: 20, width: 64, borderRadius: 9999 }} />
          <ShimmerBlock style={{ height: 20, width: 56, borderRadius: 9999 }} />
          <ShimmerBlock style={{ height: 12, width: 72 }} />
        </div>
      ))}
    </div>
  );
}

/* ── SkeletonProblemView ────────────────────────────────────────────────────── */

export function SkeletonProblemView() {
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px)' }}>
      {/* Top toolbar skeleton */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-4 border-b"
        style={{
          height: 48,
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <ShimmerBlock style={{ height: 14, width: 70 }} />
        <div style={{ width: 1, height: 16, background: 'var(--color-border)' }} />
        <ShimmerBlock style={{ height: 14, width: 28 }} />
        <ShimmerBlock style={{ height: 16, width: '25%' }} />
        <ShimmerBlock style={{ height: 20, width: 72, borderRadius: 9999 }} />
        <ShimmerBlock style={{ height: 20, width: 56, borderRadius: 9999 }} />
        <div className="flex-1" />
        <ShimmerBlock style={{ height: 24, width: 100, borderRadius: 6 }} />
      </div>

      {/* Split panels */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel */}
        <div className="flex flex-col" style={{ width: '42%', borderRight: '1px solid var(--color-border)' }}>
          {/* Tab bar */}
          <div
            className="flex items-center gap-1 px-3 border-b"
            style={{
              height: 40,
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <ShimmerBlock style={{ height: 12, width: 80 }} />
            <ShimmerBlock style={{ height: 12, width: 50, marginLeft: 8 }} />
          </div>
          {/* Content area */}
          <div className="flex-1 px-4 py-4 space-y-5" style={{ background: 'var(--color-surface)' }}>
            {/* Scenario placeholder */}
            <SkeletonText lines={4} />
            {/* Parts stepper placeholder */}
            <div className="space-y-4 mt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3">
                  <ShimmerBlock style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0 }} />
                  <div className="flex-1 space-y-2">
                    <ShimmerBlock style={{ height: 12, width: '30%' }} />
                    <ShimmerBlock style={{ height: 14, width: '70%' }} />
                    <ShimmerBlock style={{ height: 10, width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 4, background: 'var(--color-border)', flexShrink: 0 }} />

        {/* Right panel */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Tab bar */}
          <div
            className="flex items-center gap-1 px-3 border-b"
            style={{
              height: 40,
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <ShimmerBlock style={{ height: 12, width: 50 }} />
            <ShimmerBlock style={{ height: 12, width: 60, marginLeft: 8 }} />
            <ShimmerBlock style={{ height: 12, width: 70, marginLeft: 8 }} />
          </div>
          {/* Code editor placeholder */}
          <div className="flex-1 px-4 py-4 space-y-2" style={{ background: 'var(--color-surface)' }}>
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <ShimmerBlock style={{ height: 12, width: 24, flexShrink: 0 }} />
                <ShimmerBlock
                  style={{
                    height: 12,
                    width: `${30 + Math.sin(i * 1.7) * 25 + 25}%`,
                  }}
                />
              </div>
            ))}
          </div>
          {/* Submit bar placeholder */}
          <div
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5"
            style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
          >
            <ShimmerBlock style={{ height: 40, flex: 1, borderRadius: 12 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Default export (all variants) ──────────────────────────────────────────── */

export default { SkeletonCard, SkeletonTable, SkeletonText, SkeletonProblemView };
