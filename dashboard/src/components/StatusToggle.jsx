import React from 'react';
import { STATUS_ICONS, STATUS_LABELS } from '../lib/constants.js';

const STATUSES = ['unsolved', 'attempted', 'solved'];

const ACTIVE_STYLES = {
  solved:    'bg-status-solved text-white border-status-solved',
  attempted: 'bg-status-attempted text-white border-status-attempted',
  unsolved:  'bg-surface-tertiary text-text-secondary border-border',
};

const INACTIVE_STYLES = 'bg-surface text-text-secondary border-border hover:bg-surface-tertiary';

export default function StatusToggle({ current, onChange, disabled = false }) {
  return (
    <div className="flex gap-2">
      {STATUSES.map(status => {
        const isActive = current === status;
        const { icon } = STATUS_ICONS[status];
        return (
          <button
            key={status}
            onClick={() => !disabled && onChange(status)}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm font-medium transition-colors ${
              isActive ? ACTIVE_STYLES[status] : INACTIVE_STYLES
            } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            <span>{icon}</span>
            <span>{STATUS_LABELS[status]}</span>
          </button>
        );
      })}
    </div>
  );
}
