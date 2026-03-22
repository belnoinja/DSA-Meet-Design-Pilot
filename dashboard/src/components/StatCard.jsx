import React from 'react';

export default function StatCard({ label, solved, total, color = '#01b328' }) {
  return (
    <div className="bg-surface border border-border rounded-lg px-4 py-3 flex-1 min-w-0">
      <div className="text-xs uppercase tracking-wide text-text-tertiary font-medium mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold" style={{ color: solved > 0 ? color : '#a3a3a3' }}>
          {solved}
        </span>
        <span className="text-sm text-text-tertiary">/ {total}</span>
      </div>
    </div>
  );
}
