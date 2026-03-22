import React from 'react';

export default function ProgressRing({ solved = 0, total = 0, size = 72 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? solved / total : 0;
  const offset = circumference - pct * circumference;

  return (
    <svg width={size} height={size} className="block flex-shrink-0" style={{ transform: 'rotate(-90deg)' }}>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e5e5"
        strokeWidth="5"
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#16a34a"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      {/* Text — counter-rotate */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ transform: `rotate(90deg) translate(0, -${size}px)`, transformOrigin: `${size / 2}px ${size / 2}px`, fontSize: size < 80 ? '11px' : '18px', fontWeight: 700, fill: '#171717' }}
      >
        {total > 0 ? `${Math.round(pct * 100)}%` : '0%'}
      </text>
    </svg>
  );
}
