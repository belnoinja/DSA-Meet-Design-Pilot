import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import ProgressRing from '../components/ProgressRing.jsx';
import StatCard from '../components/StatCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ProblemTable from '../components/ProblemTable.jsx';
import PrimerList from '../components/PrimerList.jsx';
import CTABanner from '../components/CTABanner.jsx';

function applyFilters(problems, filters) {
  return problems.filter(p => {
    if (filters.tier    && p.tier !== filters.tier) return false;
    if (filters.pattern && !(p.patterns || []).includes(filters.pattern)) return false;
    if (filters.company && !(p.companies || []).includes(filters.company)) return false;
    if (filters.status  && p.status !== filters.status) return false;
    return true;
  });
}

export default function Dashboard({ onProgressChange }) {
  const [data, setData] = useState(null);
  const [primers, setPrimers] = useState([]);
  const [filters, setFilters] = useState({ tier: null, pattern: null, company: null, status: null });
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
    return <div className="text-center py-16 text-text-tertiary text-sm">Loading...</div>;
  }
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 text-sm font-medium">Error: {error}</p>
        <p className="text-text-tertiary text-xs mt-1">
          Check that <code>docs/_data/problems.yml</code> exists.
        </p>
      </div>
    );
  }

  const { problems = [], summary = {} } = data || {};
  const filtered = applyFilters(problems, filters);

  // Tier stats
  const tierStats = [1, 2, 3].map(t => {
    const tp = problems.filter(p => p.tier === t);
    return { label: `Tier ${t}`, solved: tp.filter(p => p.status === 'solved').length, total: tp.length };
  });
  const primersRead = primers.filter(p => p.read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-5 mb-5">
        <ProgressRing solved={summary.solved || 0} total={summary.total || 0} size={72} />
        <div>
          <h1 className="text-xl font-bold text-text-primary">dsa-meets-design</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Your LLD interview prep dashboard
          </p>
          {summary.total > 0 && (
            <p className="text-xs text-text-tertiary mt-1">
              {summary.solved} solved · {summary.attempted} attempted · {summary.unsolved} remaining
            </p>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="flex gap-3 mb-5">
        {tierStats.map((t, i) => (
          <StatCard key={i} label={t.label} solved={t.solved} total={t.total} />
        ))}
        <StatCard
          label="Primers"
          solved={primersRead}
          total={primers.length}
          color="#1a90ff"
        />
      </div>

      {/* New to Design Patterns on-ramp */}
      {primers.some(p => !p.read) && (
        <div className="mb-5 flex items-start gap-3 px-4 py-3.5 rounded-xl border border-accent/30 bg-accent-light">
          <span className="text-xl mt-0.5">📖</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">New to Design Patterns?</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Read the pattern primers before diving into problems — each is a 5–8 min read that builds your foundation.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Link
                to="/primer/strategy"
                className="text-xs font-medium text-accent hover:underline"
              >
                Start with Strategy →
              </Link>
              <Link
                to="/roadmap"
                className="text-xs text-text-tertiary hover:text-text-secondary"
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
          {filtered.length} of {problems.length} problems
        </span>
      </div>

      {/* Table */}
      <ProblemTable problems={filtered} />

      {/* Primers */}
      <PrimerList primers={primers} />

      {/* CTA */}
      <CTABanner />
    </div>
  );
}
