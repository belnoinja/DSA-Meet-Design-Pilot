import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ProgressRing({ solved = 0, total = 0, size = 72 }) {
  const { dark } = useTheme();
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? solved / total : 0;
  const offset = circumference - pct * circumference;

  const trackColor = dark ? '#2c2e45' : '#e0e3ef';
  const progressColor = '#22c55e';
  const textColor = dark ? '#e2e5f2' : '#0d0f1c';

  return (
    <svg width={size} height={size} className="block flex-shrink-0" style={{ transform: 'rotate(-90deg)' }}>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth="5"
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={progressColor}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      {/* Text */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          transform: `rotate(90deg) translate(0, -${size}px)`,
          transformOrigin: `${size / 2}px ${size / 2}px`,
          fontSize: size < 80 ? '11px' : '16px',
          fontWeight: 700,
          fill: textColor,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {total > 0 ? `${Math.round(pct * 100)}%` : '0%'}
      </text>
    </svg>
  );
}
