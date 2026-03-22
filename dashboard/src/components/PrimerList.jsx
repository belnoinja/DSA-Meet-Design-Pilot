import React from 'react';
import { useNavigate } from 'react-router-dom';

const LEARNING_ORDER = ['strategy', 'state', 'observer', 'singleton', 'composite', 'factory', 'builder'];

export default function PrimerList({ primers }) {
  const navigate = useNavigate();

  if (!primers || primers.length === 0) return null;

  // Sort by learning order; any unknown primers go at the end
  const sorted = [...primers].sort((a, b) => {
    const ai = LEARNING_ORDER.indexOf(a.name.toLowerCase());
    const bi = LEARNING_ORDER.indexOf(b.name.toLowerCase());
    const aIdx = ai === -1 ? 999 : ai;
    const bIdx = bi === -1 ? 999 : bi;
    return aIdx - bIdx;
  });

  const readCount = sorted.filter(p => p.read).length;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
          Pattern Primers
        </h3>
        <span className="text-xs text-text-tertiary">
          {readCount}/{sorted.length} read
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sorted.map((p, idx) => {
          const orderIdx = LEARNING_ORDER.indexOf(p.name.toLowerCase());
          const num = orderIdx !== -1 ? orderIdx + 1 : null;
          return (
            <button
              key={p.name}
              onClick={() => navigate(`/primer/${p.name}`)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                p.read
                  ? 'bg-surface text-status-solved border-status-solved hover:bg-surface-secondary'
                  : 'bg-surface text-text-secondary border-border hover:border-border-hover hover:text-text-primary'
              }`}
            >
              {num && (
                <span className={`text-xs font-bold ${p.read ? 'text-status-solved' : 'text-text-tertiary'}`}>
                  {num}.
                </span>
              )}
              {p.read && <span className="text-status-solved">✓</span>}
              {p.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
