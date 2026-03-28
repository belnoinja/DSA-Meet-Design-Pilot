import React from 'react';

export default function PartProgressBar({ totalParts, partsPassed, currentPart, size = 'md' }) {
  if (!totalParts || totalParts <= 1) return null;

  const dotSize  = size === 'sm' ? 6 : 8;
  const fontSize = size === 'sm' ? '10px' : '11px';

  return (
    <div
      className="flex items-center gap-1.5"
      title={`${partsPassed} of ${totalParts} parts completed`}
    >
      {Array.from({ length: totalParts }, (_, idx) => {
        const partNum = idx + 1;
        let bg;
        if (partNum <= partsPassed)     bg = '#22c55e';              // passed
        else if (partNum === currentPart) bg = 'var(--color-accent)'; // current
        else                             bg = 'var(--color-border)';  // locked
        return (
          <span
            key={partNum}
            title={
              partNum <= partsPassed ? `Part ${partNum}: passed`
              : partNum === currentPart ? `Part ${partNum}: current`
              : `Part ${partNum}: locked`
            }
            style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: bg, display: 'inline-block', flexShrink: 0 }}
          />
        );
      })}
      <span style={{ fontSize, color: 'var(--color-text-tertiary)' }}>
        {partsPassed}/{totalParts}
      </span>
    </div>
  );
}
