import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import FilterBar from '../components/FilterBar.jsx';
import ProblemTable from '../components/ProblemTable.jsx';

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

export default function ProblemList({ onProgressChange }) {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ tier: null, pattern: null, company: null, status: null, search: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getProblems()
      .then(d => { setData(d); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
          <span className="text-sm text-text-tertiary">Loading problems...</span>
        </div>
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Problems</h1>
          {summary.total > 0 && (
            <p className="text-sm text-text-secondary mt-0.5">
              {summary.solved} solved of {summary.total} total
            </p>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar problems={problems} filters={filters} onChange={setFilters} />

      {/* Problem count */}
      <div className="flex items-center justify-between py-2.5">
        <span className="text-xs text-text-tertiary">
          Showing <span className="text-text-secondary font-medium">{filtered.length}</span> of {problems.length} problems
        </span>
      </div>

      {/* Table */}
      <ProblemTable problems={filtered} />
    </div>
  );
}
