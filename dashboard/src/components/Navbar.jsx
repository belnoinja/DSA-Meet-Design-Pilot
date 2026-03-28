import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Search } from 'lucide-react';
import StreakBadge from './StreakBadge.jsx';

export default function Navbar({ summary }) {
  const { dark, toggle } = useTheme();

  const solved = summary?.solved || 0;
  const total = summary?.total || 0;

  return (
    <nav
      className="flex-shrink-0 sticky top-0 z-10 border-b"
      style={{
        height: 48,
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left: Logo / brand */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)' }}
          >
            D
          </div>
          <span
            className="text-sm font-bold tracking-tight hidden sm:block"
            style={dark
              ? { background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
              : { background: 'linear-gradient(135deg, #6366f1, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
            }
          >
            dsa-meets-design
          </span>
        </Link>

        {/* Center: Search (placeholder) */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div
            className="flex items-center gap-2 px-3 h-8 rounded-lg border text-sm"
            style={{
              background: 'var(--color-surface-secondary)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs">Search problems, primers...</span>
          </div>
        </div>

        {/* Right: Streak + theme toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Streak badge */}
          <StreakBadge />

          {/* Progress indicator */}
          {total > 0 && (
            <div
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg border"
              style={{
                background: 'var(--color-surface-tertiary)',
                borderColor: 'var(--color-border)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} />
              <span style={{ color: '#22c55e', fontWeight: 700 }}>{solved}</span>
              <span className="text-text-tertiary">/</span>
              <span className="text-text-secondary">{total}</span>
            </div>
          )}

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
