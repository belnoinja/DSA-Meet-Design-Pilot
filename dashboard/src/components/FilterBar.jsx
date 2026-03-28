import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

function FilterChip({ active, onClick, children }) {
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className="h-7 px-3 text-xs font-medium rounded-full"
      style={active ? {
        background: 'var(--color-accent)',
        color: '#fff',
        borderColor: 'var(--color-accent)',
      } : {
        background: 'var(--color-surface)',
        color: 'var(--color-text-secondary)',
        borderColor: 'var(--color-border)',
      }}
    >
      {children}
    </Button>
  );
}

function TierChip({ tier, active, onClick }) {
  const colors = {
    1: { active: '#00b8a3', bg: 'rgba(0,184,163,0.15)', label: 'Foundation' },
    2: { active: '#ffc01e', bg: 'rgba(255,192,30,0.15)', label: 'Intermediate' },
    3: { active: '#ff375f', bg: 'rgba(255,55,95,0.15)', label: 'Advanced' },
  };
  const c = colors[tier] || {};
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-7 px-3 text-xs font-medium rounded-full"
      style={active ? {
        background: c.bg,
        color: c.active,
        borderColor: c.active,
      } : {
        background: 'var(--color-surface)',
        color: 'var(--color-text-secondary)',
        borderColor: 'var(--color-border)',
      }}
    >
      {c.label}
    </Button>
  );
}

function SelectFilter({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value || null)}
      className="h-7 px-2.5 text-xs font-medium border rounded-full focus:outline-none transition-colors cursor-pointer"
      style={{
        background: value ? 'var(--color-accent-light)' : 'var(--color-surface)',
        color: value ? 'var(--color-accent)' : 'var(--color-text-secondary)',
        borderColor: value ? 'var(--color-accent)' : 'var(--color-border)',
      }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function FilterBar({ problems, filters, onChange }) {
  const allPatterns = [...new Set(problems.flatMap(p => p.patterns || []))].sort();
  const allCompanies = [...new Set(problems.flatMap(p => p.companies || []))].sort();
  const hasFilters = filters.tier || filters.pattern || filters.company || filters.status || filters.search;

  return (
    <div className="space-y-2.5 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          type="text"
          value={filters.search || ''}
          onChange={e => onChange({ ...filters, search: e.target.value || null })}
          placeholder="Search problems..."
          className="pl-9 pr-8 h-9 text-sm bg-surface border-border text-text-primary placeholder:text-text-tertiary focus-visible:ring-1 focus-visible:ring-accent"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: null })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tier pills */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map(t => (
            <TierChip
              key={t}
              tier={t}
              active={filters.tier === t}
              onClick={() => onChange({ ...filters, tier: filters.tier === t ? null : t })}
            />
          ))}
        </div>

        <span className="w-px h-4" style={{ background: 'var(--color-border)' }} />

        {/* Status pills */}
        <div className="flex gap-1.5">
          {[
            { val: 'solved',    label: '✓ Solved' },
            { val: 'attempted', label: '~ In progress' },
            { val: 'unsolved',  label: '○ Not started' },
          ].map(s => (
            <FilterChip
              key={s.val}
              active={filters.status === s.val}
              onClick={() => onChange({ ...filters, status: filters.status === s.val ? null : s.val })}
            >
              {s.label}
            </FilterChip>
          ))}
        </div>

        <span className="w-px h-4" style={{ background: 'var(--color-border)' }} />

        <SelectFilter
          value={filters.pattern}
          onChange={v => onChange({ ...filters, pattern: v })}
          options={allPatterns}
          placeholder="Pattern"
        />
        <SelectFilter
          value={filters.company}
          onChange={v => onChange({ ...filters, company: v })}
          options={allCompanies}
          placeholder="Company"
        />

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ tier: null, pattern: null, company: null, status: null, search: null })}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear ×
          </Button>
        )}
      </div>
    </div>
  );
}
