import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" strokeWidth="2"/>
      <path strokeWidth="2" strokeLinecap="round"
        d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Navbar({ summary }) {
  const location = useLocation();
  const { dark, toggle } = useTheme();

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          active
            ? 'bg-accent text-white'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-10 flex-shrink-0">
      <div className="max-w-full px-4 h-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-base font-bold text-text-primary tracking-tight">
            dsa-meets-design
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navLink('/', 'Dashboard')}
          {navLink('/stats', 'Stats')}
          {navLink('/roadmap', 'Roadmap')}
        </div>

        <div className="flex items-center gap-3">
          {summary && (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <span className="text-status-solved font-semibold">{summary.solved}</span>
              <span className="text-text-tertiary">/</span>
              <span>{summary.total}</span>
              <span className="text-text-tertiary hidden sm:inline">solved</span>
            </div>
          )}
          <button
            onClick={toggle}
            className="p-1.5 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </nav>
  );
}
