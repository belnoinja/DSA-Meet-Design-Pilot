import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Code, BookOpen, BarChart3, Map, ChevronLeft, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', icon: LayoutDashboard, to: '/' },
  { label: 'Problems', icon: Code, to: '/problems' },
  { label: 'Primers', icon: BookOpen, to: '/primers' },
  { label: 'Stats', icon: BarChart3, to: '/stats' },
  { label: 'Roadmap', icon: Map, to: '/roadmap' },
];

const STORAGE_KEY = 'sidebar-collapsed';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const location = useLocation();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {}
  }, [collapsed]);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  return (
    <aside
      className="flex-shrink-0 flex flex-col border-r transition-all duration-200 ease-in-out"
      style={{
        width: collapsed ? 56 : 240,
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        minHeight: '100%',
      }}
    >
      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-3">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className="relative flex items-center gap-3 rounded-lg text-sm font-medium transition-colors duration-150"
              style={{
                padding: collapsed ? '8px 0' : '8px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                background: active ? 'var(--color-accent-light)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.background = 'var(--color-surface-tertiary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {/* Active indicator — left accent border */}
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
                  style={{
                    height: 20,
                    background: 'var(--color-accent)',
                  }}
                />
              )}
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-3 w-full rounded-lg text-sm font-medium transition-colors duration-150"
          style={{
            padding: collapsed ? '8px 0' : '8px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: 'var(--color-text-tertiary)',
            background: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-text-primary)';
            e.currentTarget.style.background = 'var(--color-surface-tertiary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-tertiary)';
            e.currentTarget.style.background = 'transparent';
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-[18px] h-[18px] flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
