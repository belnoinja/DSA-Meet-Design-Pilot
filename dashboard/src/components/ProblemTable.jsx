import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatternBadge from './PatternBadge.jsx';
import TierBadge from './TierBadge.jsx';
import { STATUS_ICONS } from '../lib/constants.js';

const COLUMNS = [
  { key: 'status',       label: '',            width: 'w-10',  sortable: false },
  { key: 'id',           label: '#',           width: 'w-14',  sortable: true },
  { key: 'name',         label: 'Title',       width: '',      sortable: true },
  { key: 'progress',     label: 'Parts',       width: 'w-20',  sortable: false },
  { key: 'patterns',     label: 'Pattern',     width: 'w-52',  sortable: false },
  { key: 'tier',         label: 'Difficulty',  width: 'w-32',  sortable: true },
  { key: 'difficulty_mode', label: 'Mode',     width: 'w-12',  sortable: false },
  { key: 'companies',    label: 'Company',     width: 'w-28',  sortable: false },
  { key: 'time_minutes', label: 'Time',        width: 'w-16',  sortable: true },
];

const MODE_STYLE = {
  interview: { dot: '#ef4444', title: 'Interview mode' },
  guided:    { dot: '#f59e0b', title: 'Guided mode' },
  learning:  { dot: '#22c55e', title: 'Learning mode' },
};

function SortIcon({ dir }) {
  return (
    <svg className="inline w-3 h-3 ml-1 opacity-60" viewBox="0 0 12 12" fill="currentColor">
      {dir === 'asc'
        ? <path d="M6 2l4 5H2l4-5z" />
        : <path d="M6 10L2 5h8l-4 5z" />
      }
    </svg>
  );
}

function PartDots({ totalParts, partsPassed, currentPart }) {
  if (!totalParts || totalParts <= 1) return null;

  const dots = [];
  for (let i = 1; i <= totalParts; i++) {
    let bg;
    if (i <= partsPassed)    bg = '#22c55e';
    else if (i === currentPart) bg = 'var(--color-accent)';
    else                     bg = 'var(--color-border)';
    dots.push(
      <span
        key={i}
        style={{ width: 7, height: 7, borderRadius: '50%', background: bg, display: 'inline-block', margin: '0 1.5px' }}
      />
    );
  }

  return (
    <span title={`${partsPassed} of ${totalParts} parts completed`} className="flex items-center">
      {dots}
    </span>
  );
}

function StatusDot({ status }) {
  if (status === 'solved') {
    return (
      <span title="Solved" className="flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" fill="#22c55e" />
          <path d="M6 10l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    );
  }

  if (status === 'attempted') {
    return (
      <span title="In progress" className="flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
          <path d="M10 10 L10 1 A9 9 0 0 1 19 10 Z" fill="#f59e0b"/>
        </svg>
      </span>
    );
  }

  return (
    <span title="Not started" className="flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8.5" stroke="var(--color-border)" strokeWidth="1.5"/>
      </svg>
    </span>
  );
}

function sortProblems(problems, { col, dir }) {
  if (!col) return problems;
  return [...problems].sort((a, b) => {
    let av = a[col], bv = b[col];
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

export default function ProblemTable({ problems, onFilterChange }) {
  const navigate = useNavigate();
  const [sort, setSort] = useState({ col: 'id', dir: 'asc' });

  const toggleSort = (col) => {
    setSort(s => s.col === col
      ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' }
      : { col, dir: 'asc' }
    );
  };

  const handlePatternClick = (e, pattern) => {
    e.stopPropagation();
    if (onFilterChange) {
      onFilterChange({ pattern });
    } else {
      navigate(`/?pattern=${encodeURIComponent(pattern)}`);
    }
  };

  const handleCompanyClick = (e, company) => {
    e.stopPropagation();
    if (onFilterChange) {
      onFilterChange({ company });
    } else {
      navigate(`/?company=${encodeURIComponent(company)}`);
    }
  };

  const sorted = sortProblems(problems, sort);

  if (problems.length === 0) {
    return (
      <div
        className="text-center py-16 text-text-tertiary text-sm rounded-xl border border-border"
        style={{ background: 'var(--color-surface)' }}
      >
        <div className="text-3xl mb-3">🔍</div>
        <p className="font-medium text-text-secondary">No problems match the filters</p>
        <p className="text-xs mt-1">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden border border-border"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr style={{ background: 'var(--color-surface-tertiary)', borderBottom: '1px solid var(--color-border)' }}>
            {COLUMNS.map(col => (
              <th
                key={col.key}
                className={`${col.width} px-3 py-2.5 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider ${
                  col.sortable ? 'cursor-pointer hover:text-text-secondary select-none' : ''
                }`}
                onClick={() => col.sortable && toggleSort(col.key)}
              >
                {col.label}
                {col.sortable && sort.col === col.key && <SortIcon dir={sort.dir} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ background: 'var(--color-surface)' }}>
          {sorted.map((problem, idx) => {
            const num = problem.id.split('-')[0];
            const totalParts  = problem.total_parts  || 1;
            const partsPassed = problem.parts_passed || 0;
            const currentPart = problem.current_part || 1;
            const isSolved = problem.status === 'solved';
            const modeStyle = MODE_STYLE[problem.difficulty_mode] || MODE_STYLE.interview;

            return (
              <tr
                key={problem.id}
                onClick={() => navigate(`/problem/${problem.id}`)}
                className="cursor-pointer group"
                style={{
                  borderTop: idx > 0 ? '1px solid var(--color-border)' : 'none',
                  transition: 'background 150ms ease, border-color 150ms ease',
                  borderLeft: '3px solid transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--color-surface-secondary)';
                  e.currentTarget.style.borderLeftColor = 'var(--color-accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '';
                  e.currentTarget.style.borderLeftColor = 'transparent';
                }}
              >
                {/* Status */}
                <td className="w-10 px-3 py-3">
                  <StatusDot status={problem.status} />
                </td>
                {/* # */}
                <td className="w-14 px-3 py-3 text-text-tertiary font-mono text-xs tabular-nums">
                  {num}
                </td>
                {/* Title */}
                <td className="px-3 py-3">
                  <span
                    className="font-medium truncate block transition-colors"
                    style={{
                      color: isSolved ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                      transitionDuration: '150ms',
                    }}
                  >
                    {problem.name}
                  </span>
                </td>
                {/* Parts progress */}
                <td className="w-20 px-3 py-3">
                  {totalParts > 1 ? (
                    <PartDots
                      totalParts={totalParts}
                      partsPassed={partsPassed}
                      currentPart={currentPart}
                    />
                  ) : (
                    <span className="text-xs text-text-tertiary">&mdash;</span>
                  )}
                </td>
                {/* Patterns — clickable */}
                <td className="w-52 px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(problem.patterns || []).map(p => (
                      <span
                        key={p}
                        onClick={(e) => handlePatternClick(e, p)}
                        className="cursor-pointer transition-opacity hover:opacity-75"
                        style={{ transitionDuration: '150ms' }}
                        title={`Filter by ${p}`}
                      >
                        <PatternBadge pattern={p} />
                      </span>
                    ))}
                  </div>
                </td>
                {/* Difficulty (Tier) */}
                <td className="w-32 px-3 py-3">
                  <TierBadge tier={problem.tier} />
                </td>
                {/* Mode */}
                <td className="w-12 px-3 py-3 text-center" title={modeStyle.title}>
                  {problem.status === 'unsolved' ? (
                    <span className="w-2 h-2 inline-block rounded-full" style={{ background: 'var(--color-border)' }} />
                  ) : (
                    <span className="w-2 h-2 inline-block rounded-full" style={{ background: modeStyle.dot }} />
                  )}
                </td>
                {/* Company — clickable */}
                <td className="w-28 px-3 py-3">
                  {(problem.companies || []).length > 0 ? (
                    <span
                      onClick={(e) => handleCompanyClick(e, problem.companies[0])}
                      className="text-xs cursor-pointer transition-colors hover:text-accent"
                      style={{
                        color: 'var(--color-text-secondary)',
                        transitionDuration: '150ms',
                        textDecoration: 'none',
                      }}
                      title={`Filter by ${problem.companies[0]}`}
                    >
                      {problem.companies[0]}
                    </span>
                  ) : (
                    <span className="text-xs text-text-tertiary">&mdash;</span>
                  )}
                </td>
                {/* Time */}
                <td className="w-16 px-3 py-3 text-text-tertiary text-xs tabular-nums">
                  {problem.time_minutes}m
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
