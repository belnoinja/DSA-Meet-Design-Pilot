import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import MarkdownRenderer from '../components/MarkdownRenderer.jsx';
import TierBadge from '../components/TierBadge.jsx';
import PatternBadge from '../components/PatternBadge.jsx';
import { PRIMER_READ_TIME } from '../lib/constants.js';

const MASTERY_CHECKLIST = [
  'Can you explain the pattern without looking at notes?',
  'Have you solved at least one problem using this pattern?',
  'Can you identify when to apply this pattern in a new problem?',
];

function ProblemCard({ problem }) {
  const num = problem.id.split('-')[0];
  return (
    <Link
      to={`/problem/${problem.id}`}
      className="block p-4 bg-surface border border-border rounded-xl hover:border-accent hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-2 mb-2">
        <TierBadge tier={problem.tier} />
        {(problem.patterns || []).slice(0, 1).map(p => (
          <PatternBadge key={p} pattern={p} />
        ))}
      </div>
      <div className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors leading-snug">
        {num}. {problem.name}
      </div>
      <div className="text-xs text-text-tertiary mt-1">{problem.time_minutes} min</div>
    </Link>
  );
}

export default function PrimerView({ onProgressChange }) {
  const { name } = useParams();
  const navigate = useNavigate();

  const [primer, setPrimer] = useState(null);
  const [relatedProblems, setRelatedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState([false, false, false]);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getPrimer(name), api.getProblems()])
      .then(([primerData, problemsData]) => {
        setPrimer(primerData);
        const related = (problemsData.problems || []).filter(
          p => p.prerequisite_primer === name || (p.patterns || []).map(s => s.toLowerCase()).includes(name.toLowerCase())
        );
        setRelatedProblems(related);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [name]);

  const markRead = () => {
    api.markPrimerRead(name)
      .then(() => {
        setPrimer(prev => ({ ...prev, read: true }));
        onProgressChange?.();
      })
      .catch(console.error);
  };

  const toggleCheck = (i) => {
    setCheckedItems(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  if (loading) return <div className="text-center py-16 text-text-tertiary text-sm">Loading...</div>;
  if (error)   return <div className="text-center py-16 text-red-600 text-sm">{error}</div>;

  const readTime = PRIMER_READ_TIME[name.toLowerCase()] || 7;
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="max-w-2xl mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-5 group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        Back to dashboard
      </button>

      {/* Header card */}
      <div className="bg-surface border border-border rounded-xl p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-light text-accent border border-border">
                {displayName} / primer
              </span>
            </div>

            {/* Title + read time */}
            <h1 className="text-xl font-bold text-text-primary">
              {displayName} Pattern
              <span className="ml-2 text-sm font-normal text-text-tertiary">· ~{readTime} min read</span>
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Design pattern primer — theory and structure
            </p>
          </div>

          {/* Read button */}
          <div className="flex-shrink-0">
            {primer.read ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-status-solved font-medium px-3 py-1.5 border border-status-solved/40 rounded-lg bg-surface">
                <span>✓</span> Read
              </span>
            ) : (
              <button
                onClick={markRead}
                className="text-sm px-3 py-1.5 bg-status-solved text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface border border-border rounded-xl p-5 mb-4">
        <MarkdownRenderer html={primer.html} />
      </div>

      {/* Mastery checklist */}
      <div className="bg-surface border border-border rounded-xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Mastery check</h2>
        <div className="space-y-2.5">
          {MASTERY_CHECKLIST.map((item, i) => (
            <label
              key={i}
              className="flex items-start gap-3 cursor-pointer group"
              onClick={() => toggleCheck(i)}
            >
              <span className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center transition-colors ${
                checkedItems[i]
                  ? 'bg-status-solved border-status-solved'
                  : 'border-border group-hover:border-text-secondary'
              }`}>
                {checkedItems[i] && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={`text-sm transition-colors ${
                checkedItems[i] ? 'text-text-tertiary line-through' : 'text-text-secondary'
              }`}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Related problems */}
      {relatedProblems.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-primary">Practice this pattern</h2>
            <Link
              to="/"
              className="text-xs text-accent hover:underline"
            >
              Browse all problems →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {relatedProblems.slice(0, 4).map(p => (
              <ProblemCard key={p.id} problem={p} />
            ))}
          </div>
        </div>
      )}

      {/* Footer browse link (if no related problems) */}
      {relatedProblems.length === 0 && (
        <div className="text-center py-2 mb-4">
          <Link to="/" className="text-sm text-accent hover:underline">
            Browse all problems →
          </Link>
        </div>
      )}

    </div>
  );
}
