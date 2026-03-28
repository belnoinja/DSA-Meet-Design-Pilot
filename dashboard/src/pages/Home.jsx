import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, CheckCircle, Zap, BookOpen, ArrowRight } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState(null);
  const [primers, setPrimers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProblems(), api.getPrimers()])
      .then(([problemsData, primersData]) => {
        setData(problemsData);
        setPrimers(primersData.primers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
          <span className="text-sm text-text-tertiary">Loading...</span>
        </div>
      </div>
    );
  }

  const { problems = [], summary = {} } = data || {};
  const solved = summary.solved || 0;
  const attempted = summary.attempted || 0;
  const total = summary.total || 0;
  const primersRead = primers.filter(p => p.read).length;

  // Streak: count consecutive recent days (simplified — just show attempted as proxy)
  const streak = summary.streak || attempted;

  // Parts completed: count solved problems' parts
  const partsCompleted = problems.filter(p => p.status === 'solved').reduce((sum, p) => sum + (p.parts_total || 1), 0);

  // Last attempted problems
  const attemptedProblems = problems
    .filter(p => p.status === 'attempted')
    .slice(0, 2);

  // First unsolved problem
  const firstUnsolved = problems.find(p => p.status === 'unsolved');

  const statCards = [
    { label: 'Problems Solved', value: solved, total, icon: CheckCircle, color: '#22c55e' },
    { label: 'Current Streak', value: streak, total: null, icon: Flame, color: '#f59e0b' },
    { label: 'Parts Completed', value: partsCompleted, total: null, icon: Zap, color: 'var(--color-accent)' },
    { label: 'Primers Read', value: primersRead, total: primers.length, icon: BookOpen, color: '#818cf8' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          Welcome back
          {streak > 0 && (
            <span className="inline-flex items-center gap-1 text-base font-semibold px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
              <Flame className="w-4 h-4" />
              {streak}
            </span>
          )}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Pick up where you left off or start something new.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {statCards.map(({ label, value, total: t, icon: Icon, color }) => (
          <Card key={label} className="border-border bg-surface hover:border-border-hover transition-all duration-200">
            <CardContent className="px-4 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-text-tertiary font-semibold">{label}</span>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tabular-nums" style={{ color }}>{value}</span>
                {t != null && <span className="text-sm text-text-tertiary font-medium">/ {t}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue where you left off */}
      {attemptedProblems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3">
            Continue where you left off
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {attemptedProblems.map(p => {
              const partsDone = p.parts_done || 0;
              const partsTotal = p.parts_total || 1;
              const pct = partsTotal > 0 ? Math.round((partsDone / partsTotal) * 100) : 0;
              const tierColor = p.tier === 1 ? 'var(--color-tier-1)' : p.tier === 2 ? 'var(--color-tier-2)' : 'var(--color-tier-3)';
              return (
                <Link key={p.id} to={`/problem/${p.id}`} className="block group">
                  <Card className="border-border bg-surface hover:border-border-hover transition-all duration-200 group-hover:shadow-sm">
                    <CardContent className="px-4 py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tierColor }} />
                        <span className="text-sm font-semibold text-text-primary truncate">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-tertiary)' }}>
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: tierColor }} />
                        </div>
                        <span className="text-xs text-text-tertiary font-medium">{partsDone}/{partsTotal}</span>
                      </div>
                      <span className="text-xs text-text-tertiary">
                        {(p.patterns || []).join(', ')}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended next problem */}
      {firstUnsolved && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3">
            Recommended next
          </h2>
          <Link to={`/problem/${firstUnsolved.id}`} className="block group">
            <Card className="border-border bg-surface hover:border-border-hover transition-all duration-200 group-hover:shadow-sm">
              <CardContent className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      background: firstUnsolved.tier === 1 ? 'var(--color-tier-1)' : firstUnsolved.tier === 2 ? 'var(--color-tier-2)' : 'var(--color-tier-3)',
                    }}
                  />
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-text-primary block truncate">{firstUnsolved.name}</span>
                    <span className="text-xs text-text-tertiary">{(firstUnsolved.patterns || []).join(', ')}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3">
          Quick links
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { to: '/problems', label: 'Browse Problems', icon: '📋' },
            { to: '/primers', label: 'Read a Primer', icon: '📖' },
            { to: '/roadmap', label: 'View Roadmap', icon: '🗺️' },
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to}>
              <Card className="border-border bg-surface hover:border-border-hover transition-all duration-200 hover:shadow-sm cursor-pointer">
                <CardContent className="px-5 py-3 flex items-center gap-2">
                  <span>{icon}</span>
                  <span className="text-sm font-medium text-text-primary">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-tertiary ml-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
