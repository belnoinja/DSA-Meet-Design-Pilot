import React from 'react';
import { Building2 } from 'lucide-react';

const COMPANIES = [
  { name: 'Amazon',    short: 'AMZ' },
  { name: 'Flipkart',  short: 'FK'  },
  { name: 'Razorpay',  short: 'RP'  },
  { name: 'Meesho',    short: 'ME'  },
  { name: 'PhonePe',   short: 'PP'  },
  { name: 'Microsoft', short: 'MS'  },
  { name: 'Uber',      short: 'UB'  },
];

/**
 * Row of company buttons for Track D.
 * Shows problem count per company and highlights the selected one.
 */
export default function CompanySelector({ selected, onSelect, problemsByCompany }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COMPANIES.map(c => {
        const count = (problemsByCompany[c.name] || []).length;
        const isActive = selected === c.name;

        return (
          <button
            key={c.name}
            onClick={() => onSelect(isActive ? null : c.name)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
              isActive
                ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                : 'border-border bg-surface text-text-secondary hover:border-border-hover hover:text-text-primary'
            }`}
          >
            <Building2 size={13} className="flex-shrink-0" />
            <span>{c.name}</span>
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              isActive ? 'bg-purple-500/20 text-purple-300' : 'bg-surface-tertiary text-text-tertiary'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { COMPANIES };
