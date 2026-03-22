import React from 'react';

export default function FilterBar({ problems, filters, onChange }) {
  // Derive unique values from problems
  const allPatterns = [...new Set(problems.flatMap(p => p.patterns || []))].sort();
  const allCompanies = [...new Set(problems.flatMap(p => p.companies || []))].sort();

  const tierBtn = (tier, label) => {
    const active = filters.tier === tier;
    return (
      <button
        key={tier}
        onClick={() => onChange({ ...filters, tier: active ? null : tier })}
        className={`px-3 py-1.5 text-sm rounded border transition-colors ${
          active
            ? 'bg-accent text-white border-accent'
            : 'bg-surface text-text-secondary border-border hover:border-border-hover hover:text-text-primary'
        }`}
      >
        {label}
      </button>
    );
  };

  const select = (key, options, allLabel) => (
    <select
      value={filters[key] || ''}
      onChange={e => onChange({ ...filters, [key]: e.target.value || null })}
      className="px-2 py-1.5 text-sm border border-border rounded text-text-secondary hover:border-border-hover focus:outline-none focus:border-accent cursor-pointer"
      style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}
    >
      <option value="">{allLabel}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 border-b border-border">
      <span className="text-xs text-text-tertiary uppercase tracking-wide font-medium mr-1">Filter:</span>

      {/* Tier toggle buttons */}
      <div className="flex gap-1">
        {tierBtn(1, 'Tier 1')}
        {tierBtn(2, 'Tier 2')}
        {tierBtn(3, 'Tier 3')}
      </div>

      {/* Dropdowns */}
      {select('pattern', allPatterns, 'All patterns')}
      {select('company', allCompanies, 'All companies')}
      {select('status', ['solved', 'attempted', 'unsolved'], 'All statuses')}

      {/* Clear */}
      {(filters.tier || filters.pattern || filters.company || filters.status) && (
        <button
          onClick={() => onChange({ tier: null, pattern: null, company: null, status: null })}
          className="text-xs text-accent hover:underline ml-1"
        >
          Clear
        </button>
      )}
    </div>
  );
}
