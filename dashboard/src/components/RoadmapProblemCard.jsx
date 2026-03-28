import React from 'react';
import { Link } from 'react-router-dom';
import PatternBadge from './PatternBadge.jsx';
import { STATUS_ICONS } from '../lib/constants.js';

/**
 * Inline mini-card for a problem reference inside the roadmap.
 * Shows: number, name, pattern badges, status indicator.
 * Clickable — navigates to /problem/:id.
 */
export default function RoadmapProblemCard({ problem, status = 'unsolved' }) {
  const statusCfg = STATUS_ICONS[status] || STATUS_ICONS.unsolved;

  return (
    <Link
      to={`/problem/${problem.id}`}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border bg-surface-secondary hover:border-border-hover hover:bg-surface-tertiary transition-all group"
    >
      {/* Status indicator */}
      <span
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          backgroundColor: status === 'solved' ? 'rgba(1,179,40,0.12)' : status === 'attempted' ? 'rgba(255,184,0,0.12)' : 'rgba(128,128,128,0.08)',
          color: statusCfg.color,
        }}
      >
        {statusCfg.icon}
      </span>

      {/* Problem number + name */}
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors truncate block">
          {problem.id.split('-')[0]} — {problem.name}
        </span>
      </div>

      {/* Pattern badges */}
      <div className="flex gap-1 flex-shrink-0">
        {(problem.patterns || []).map(p => (
          <PatternBadge key={p} pattern={p} />
        ))}
      </div>
    </Link>
  );
}
