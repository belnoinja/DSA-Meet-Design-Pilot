import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import ProgressRing from '../components/ProgressRing.jsx';
import StatCard from '../components/StatCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ProblemTable from '../components/ProblemTable.jsx';
import PrimerList from '../components/PrimerList.jsx';
import CTABanner from '../components/CTABanner.jsx';
import { SkeletonTable } from '../components/SkeletonLoader.jsx';

function applyFilters(problems, filters) {
  return problems.filter(p => {
    if (filters.tier    && p.tier !== filters.tier) return false;
    if (filters.pattern && !(p.patterns || []).includes(filters.pattern)) return false;
    if (filters.company && !(p.companies || []).includes(filters.company)) return false;
    if (filters.status  && p.status !== filters.status) return false;
    if (filters.search  && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export default function Dashboard({ onProgressChange }) {
  const [data, setData] = useState(null);
  const [primers, setPrimers] = useState([]);
  const [filters, setFilters] = useState({ tier: null, pattern: null, company: null, status: null, search: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    Promise.all([api.getProblems(), api.getPrimers()])
      .then(([problemsData, primersData]) => {
        setData(problemsData);
        setPrimers(primersData.primers || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="py-6 space-y-6">
        {/* Skeleton stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="rounded-xl p-4 border skeleton-shimmer"
              style={{ height: 80, borderColor: 'var(--color-border)' }}
            />
          ))}
        </div>
        {/* Skeleton table */}
        <SkeletonTable rows={6} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 text-sm font-medium">Error: {error}</p>
        <p className="text-text-tertiary text-xs mt-1">
          Check that <code>docs/_data/problems.yml</code> exists.
        </p>
      </div>
    );
  }

  const { problems = [], summary = {} } = data || {};
  const filtered = applyFilters(problems, filters);

  const tierStats = [1, 2, 3].map(t => {
    const tp = problems.filter(p => p.tier === t);
    return { tier: t, label: t === 1 ? 'Foundation' : t === 2 ? 'Intermediate' : 'Advanced', solved: tp.filter(p => p.status === 'solved').length, total: tp.length };
  });
  const primersRead = primers.filter(p => p.read).length;
  const pct = summary.total > 0 ? Math.round((summary.solved / summary.total) * 100) : 0;

  return (
    <div>
      {/* Hero header */}
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-border gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-border text-text-tertiary"
              style={{ background: 'var(--color-surface-tertiary)' }}
            >
              LLD Interview Prep
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mt-1">
            dsa-meets-design
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-md">
            Design patterns + DSA problems to ace your LLD rounds.
          </p>

          {summary.total > 0 && (
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} />
                <span className="text-xs font-semibold text-text-primary">{summary.solved}</span>
                <span className="text-xs text-text-tertiary">solved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                <span className="text-xs font-semibold text-text-primary">{summary.attempted}</span>
                <span className="text-xs text-text-tertiary">in progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--color-border)' }} />
                <span className="text-xs font-semibold text-text-primary">{summary.unsolved}</span>
                <span className="text-xs text-text-tertiary">remaining</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Progress ring with text */}
        {summary.total > 0 && (
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <ProgressRing solved={summary.solved || 0} total={summary.total || 0} size={88} />
            <span className="text-xs text-text-tertiary">{summary.solved}/{summary.total}</span>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {tierStats.map((t) => (
          <StatCard key={t.tier} tier={t.tier} label={t.label} solved={t.solved} total={t.total} />
        ))}
        <StatCard
          label="Primers"
          solved={primersRead}
          total={primers.length}
          color="#818cf8"
        />
      </div>

      {/* New to Design Patterns on-ramp */}
      {primers.some(p => !p.read) && (
        <div
          className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl border border-accent/20"
          style={{ background: 'var(--color-accent-light)' }}
        >
          <span className="text-lg mt-0.5">📖</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">New to Design Patterns?</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Read the pattern primers before diving into problems — each is a 5–8 min read that builds your foundation.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Link
                to="/primer/strategy"
                className="text-xs font-semibold text-accent hover:underline"
              >
                Start with Strategy →
              </Link>
              <Link
                to="/roadmap"
                className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
              >
                View learning tracks
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <FilterBar problems={problems} filters={filters} onChange={setFilters} />

      {/* Problem count */}
      <div className="flex items-center justify-between py-2.5">
        <span className="text-xs text-text-tertiary">
          Showing <span className="text-text-secondary font-medium">{filtered.length}</span> of {problems.length} problems
        </span>
      </div>

      {/* Table */}
      <ProblemTable problems={filtered} onFilterChange={(f) => setFilters(prev => ({ ...prev, ...f }))} />

      {/* Primers */}
      <PrimerList primers={primers} />

      {/* CTA */}
      <CTABanner />
    </div>
  );
}
