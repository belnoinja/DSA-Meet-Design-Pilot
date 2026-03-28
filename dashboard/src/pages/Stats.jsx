import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { SkeletonCard } from '../components/SkeletonLoader.jsx';
import ActivityHeatmap from '../components/ActivityHeatmap.jsx';

const COLOR_SOLVED   = '#22c55e';
const COLOR_ATTEMPTED = '#f59e0b';
const COLOR_UNSOLVED  = 'var(--color-border)';

function StatRow({ label, value, note }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {value}
        {note && <span className="text-xs font-normal ml-1" style={{ color: 'var(--color-text-tertiary)' }}>{note}</span>}
      </span>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      {label}
    </span>
  );
}

function TierRow({ tier, stats }) {
  const { solved = 0, attempted = 0, total = 0 } = stats || {};
  const unsolved = total - solved - attempted;
  const pSolved   = total > 0 ? (solved   / total) * 100 : 0;
  const pAttempted = total > 0 ? (attempted / total) * 100 : 0;
  const pUnsolved  = total > 0 ? (unsolved  / total) * 100 : 0;

  return (
    <div className="py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Tier {tier}</span>
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {solved}/{total}
          {total > 0 && <span className="ml-1" style={{ color: 'var(--color-text-tertiary)' }}>({Math.round(pSolved)}%)</span>}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'var(--color-surface-tertiary)' }}>
        <div style={{ width: `${pSolved}%`,   background: COLOR_SOLVED,    transition: 'width 0.5s ease' }} />
        <div style={{ width: `${pAttempted}%`, background: COLOR_ATTEMPTED, transition: 'width 0.5s ease' }} />
        <div style={{ width: `${pUnsolved}%`,  background: COLOR_UNSOLVED,  transition: 'width 0.5s ease' }} />
      </div>
      <div className="flex gap-4 mt-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
        <span>{solved} solved</span>
        <span>{attempted} attempted</span>
        <span>{unsolved} unsolved</span>
      </div>
    </div>
  );
}

function PatternRow({ rank, pattern, data }) {
  return (
    <div className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <span className="text-xs w-4 text-right flex-shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>{rank}.</span>
      <span className="text-sm flex-1" style={{ color: 'var(--color-text-primary)' }}>{pattern}</span>
      <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{data.solved}</span>
      <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>solved</span>
    </div>
  );
}

export default function Stats() {
  const navigate = useNavigate();
  const [stats,   setStats]   = useState(null);
  const [primers, setPrimers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    Promise.all([api.getStats(), api.getPrimers()])
      .then(([s, p]) => { setStats(s); setPrimers(p.primers || []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="max-w-xl mx-auto py-6 space-y-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
  if (error) return <div className="text-center py-16 text-sm" style={{ color: '#f87171' }}>{error}</div>;

  const { overall, by_tier, by_pattern, by_difficulty_mode, parts_stats, streak } = stats;

  const patternEntries = Object.entries(by_pattern || {})
    .sort((a, b) => b[1].solved - a[1].solved);

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'No activity yet';

  const primersRead = primers.filter(p => p.read).length;

  return (
    <div className="max-w-xl mx-auto">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Stats</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
          Progress breakdown across tiers, patterns, primers and parts
        </p>
      </div>

      {/* ── Overall progress ─────────────────────────────────────────────── */}
      <div className="rounded-xl p-5 mb-4 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="mb-4">
          <div className="text-4xl font-bold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
            {overall.percent_complete}%
          </div>
          <div className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {overall.solved}/{overall.total} problems solved
          </div>
        </div>

        <div className="h-2.5 rounded-full overflow-hidden mb-4" style={{ background: 'var(--color-surface-tertiary)' }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${overall.percent_complete}%`, background: COLOR_SOLVED, transition: 'width 0.5s ease' }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLOR_SOLVED }} />
            <span className="text-sm flex-1" style={{ color: 'var(--color-text-secondary)' }}>Solved</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{overall.solved}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLOR_ATTEMPTED }} />
            <span className="text-sm flex-1" style={{ color: 'var(--color-text-secondary)' }}>Attempted</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{overall.attempted}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-border)' }} />
            <span className="text-sm flex-1" style={{ color: 'var(--color-text-secondary)' }}>Unsolved</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{overall.unsolved}</span>
          </div>
        </div>
      </div>

      {/* ── Parts completion (spec §11) ───────────────────────────────────── */}
      {parts_stats && parts_stats.total_parts_across_all_problems > 0 && (
        <div className="rounded-xl p-5 mb-4 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>Parts completion</h2>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
            How far you've progressed through each problem's sequential parts
          </p>

          {/* Progress bar */}
          <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: 'var(--color-surface-tertiary)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.round((parts_stats.parts_passed / parts_stats.total_parts_across_all_problems) * 100)}%`,
                background: 'var(--color-accent)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>

          {/* 2×2 stat grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
                {parts_stats.parts_passed}
                <span className="text-sm font-normal ml-1" style={{ color: 'var(--color-text-tertiary)' }}>
                  / {parts_stats.total_parts_across_all_problems}
                </span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>parts passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
                {parts_stats.problems_fully_completed}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>fully completed</div>
            </div>
            <div>
              <div className="text-xl font-semibold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
                {parts_stats.problems_partially_completed}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>partially started</div>
            </div>
            <div>
              <div className="text-xl font-semibold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
                {parts_stats.avg_parts_per_solve > 0 ? parts_stats.avg_parts_per_solve : '—'}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>avg parts / solve</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tier breakdown ────────────────────────────────────────────────── */}
      <div className="rounded-xl p-5 mb-4 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Tier breakdown</h2>
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Stacked by status</span>
        </div>
        <div className="flex gap-4 mb-3">
          <LegendDot color={COLOR_SOLVED}   label="Solved" />
          <LegendDot color={COLOR_ATTEMPTED} label="Attempted" />
          <LegendDot color="var(--color-border)" label="Unsolved" />
        </div>
        <TierRow tier={1} stats={by_tier[1]} />
        <TierRow tier={2} stats={by_tier[2]} />
        <TierRow tier={3} stats={by_tier[3]} />
      </div>

      {/* ── Patterns practiced ───────────────────────────────────────────── */}
      {patternEntries.length > 0 && (
        <div className="rounded-xl p-5 mb-4 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>Patterns practiced</h2>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
            Ranked by number of problems solved
          </p>
          {patternEntries.map(([pattern, data], i) => (
            <PatternRow key={pattern} rank={i + 1} pattern={pattern} data={data} />
          ))}
        </div>
      )}

      {/* ── Difficulty mode distribution ─────────────────────────────────── */}
      {by_difficulty_mode && (
        <div className="rounded-xl p-5 mb-4 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>Difficulty mode</h2>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Problems solved or attempted per mode</p>
          <div className="space-y-3">
            {[
              { id: 'interview', label: '🔴 Interview', color: '#dc2626' },
              { id: 'guided',    label: '🟡 Guided',    color: '#f59e0b' },
              { id: 'learning',  label: '🟢 Learning',  color: '#22c55e' },
            ].map(({ id, label, color }) => {
              const d = (by_difficulty_mode || {})[id] || { solved: 0, attempted: 0 };
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="text-xs w-28 flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-tertiary)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: d.solved > 0 ? `${(d.solved / Math.max(overall.total, 1)) * 100}%` : '0%', background: color, transition: 'width 0.5s ease' }}
                      />
                    </div>
                    <span className="text-xs w-16 flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
                      {d.solved} solved{d.attempted > 0 ? `, ${d.attempted} att.` : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Primers ──────────────────────────────────────────────────────── */}
      <div className="rounded-xl p-5 mb-4 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Primers</h2>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>
            {primersRead}/{primers.length} read
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'var(--color-surface-tertiary)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: primers.length > 0 ? `${(primersRead / primers.length) * 100}%` : '0%',
              background: 'var(--color-accent)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {primers.map(p => (
            <Link
              key={p.name}
              to={`/primer/${p.name}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors"
              style={p.read ? {
                background: COLOR_SOLVED,
                color: '#fff',
                borderColor: COLOR_SOLVED,
              } : {
                background: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
                borderColor: 'var(--color-border)',
              }}
            >
              {p.read && <span>✓</span>}
              {p.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Activity Heatmap ────────────────────────────────────────────── */}
      <div className="mb-4">
        <ActivityHeatmap />
      </div>

      {/* ── Streak / Last Activity ────────────────────────────────────────── */}
      <div className="rounded-xl p-5 mb-4 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Streak</h2>
        <div className="flex items-start gap-8">
          <div>
            <div className="text-3xl font-bold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>{streak.current_days}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>day streak</div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{formatDate(streak.last_activity)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>last activity</div>
            {streak.current_days === 0 ? (
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Solve a problem today to start your streak.
              </p>
            ) : (
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                A streak counts if you solved or attempted any problem that day.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-4 w-full py-2 text-sm font-medium rounded-lg border transition-colors"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-secondary)',
            background: 'transparent',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-border-hover)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
        >
          Open a problem →
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-xs pb-6" style={{ color: 'var(--color-text-tertiary)' }}>
        Local dashboard · Runs on localhost · Progress saved to progress.json
      </p>
    </div>
  );
}
