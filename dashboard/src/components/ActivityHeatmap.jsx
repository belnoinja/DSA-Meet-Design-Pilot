import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/api.js';

const WEEKS = 12;
const DAYS_PER_WEEK = 7;
const CELL_SIZE = 13;
const CELL_GAP = 3;
const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getCellColor(count) {
  if (count === 0) return 'var(--color-surface-tertiary)';
  if (count === 1) return 'var(--color-accent-subtle, rgba(99, 102, 241, 0.35))';
  if (count <= 3)  return 'var(--color-accent-hover, rgba(99, 102, 241, 0.65))';
  return 'var(--color-accent)';
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatActions(actions) {
  if (!actions || actions.length === 0) return 'No activity';
  const unique = [...new Set(actions)];
  return unique.map(a => a.replace(/_/g, ' ')).join(', ');
}

export default function ActivityHeatmap() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    api.getActivity()
      .then(data => { setActivity(data.activity || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const grid = useMemo(() => {
    const activityMap = {};
    for (const entry of activity) {
      activityMap[entry.date] = entry;
    }

    const today = new Date();
    const totalDays = WEEKS * DAYS_PER_WEEK;

    // Calculate the start date: go back enough days to fill the grid
    // The grid ends on today's column (week), starting from Monday of that week
    const dayOfWeek = (today.getDay() + 6) % 7; // 0=Mon, 6=Sun
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (totalDays - 1) - (6 - dayOfWeek));

    // Build cells: columns are weeks, rows are days (Mon=0..Sun=6)
    const cells = [];
    const monthLabels = [];
    let lastMonth = -1;

    for (let week = 0; week < WEEKS; week++) {
      for (let day = 0; day < DAYS_PER_WEEK; day++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + week * 7 + day);

        const dateStr = cellDate.toISOString().slice(0, 10);
        const isFuture = cellDate > today;
        const entry = activityMap[dateStr];

        cells.push({
          week,
          day,
          date: dateStr,
          count: isFuture ? -1 : (entry ? entry.count : 0),
          actions: entry ? entry.actions : [],
          isFuture,
        });

        // Track month labels
        if (day === 0) {
          const month = cellDate.getMonth();
          if (month !== lastMonth) {
            monthLabels.push({ week, label: MONTH_NAMES[month] });
            lastMonth = month;
          }
        }
      }
    }

    return { cells, monthLabels };
  }, [activity]);

  if (loading) {
    return (
      <div className="rounded-xl p-5 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-border)', borderTopColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  const labelWidth = 32;
  const gridWidth = WEEKS * (CELL_SIZE + CELL_GAP);
  const gridHeight = DAYS_PER_WEEK * (CELL_SIZE + CELL_GAP);
  const svgWidth = labelWidth + gridWidth;
  const svgHeight = 20 + gridHeight; // 20px for month labels

  return (
    <div className="rounded-xl p-5 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Activity</h2>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          <span>Less</span>
          {[0, 1, 2, 4].map(count => (
            <span
              key={count}
              className="inline-block rounded-sm"
              style={{
                width: 10,
                height: 10,
                background: getCellColor(count),
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto" style={{ position: 'relative' }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', maxWidth: '100%' }}
        >
          {/* Month labels */}
          {grid.monthLabels.map(({ week, label }, i) => (
            <text
              key={`month-${i}`}
              x={labelWidth + week * (CELL_SIZE + CELL_GAP)}
              y={12}
              fontSize="10"
              fill="var(--color-text-tertiary)"
              fontFamily="Inter, sans-serif"
            >
              {label}
            </text>
          ))}

          {/* Day labels */}
          {DAY_LABELS.map((label, i) => (
            label ? (
              <text
                key={`day-${i}`}
                x={0}
                y={20 + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE - 2}
                fontSize="10"
                fill="var(--color-text-tertiary)"
                fontFamily="Inter, sans-serif"
              >
                {label}
              </text>
            ) : null
          ))}

          {/* Grid cells */}
          {grid.cells.map((cell, i) => {
            if (cell.isFuture) return null;
            return (
              <rect
                key={i}
                x={labelWidth + cell.week * (CELL_SIZE + CELL_GAP)}
                y={20 + cell.day * (CELL_SIZE + CELL_GAP)}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={2}
                ry={2}
                fill={getCellColor(cell.count)}
                style={{ cursor: 'pointer', transition: 'fill 0.15s ease' }}
                onMouseEnter={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  setTooltip({
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                    date: cell.date,
                    count: cell.count,
                    actions: cell.actions,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            style={{
              position: 'fixed',
              left: tooltip.x,
              top: tooltip.y - 8,
              transform: 'translate(-50%, -100%)',
              background: 'var(--color-surface-elevated, var(--color-surface-tertiary))',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 11,
              lineHeight: '16px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 50,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ fontWeight: 600 }}>{formatDateLabel(tooltip.date)}</div>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              {tooltip.count === 0
                ? 'No activity'
                : `${tooltip.count} action${tooltip.count !== 1 ? 's' : ''}: ${formatActions(tooltip.actions)}`
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
