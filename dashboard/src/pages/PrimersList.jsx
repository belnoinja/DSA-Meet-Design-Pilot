import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

const LEARNING_ORDER = ['strategy', 'state', 'observer', 'singleton', 'composite', 'factory', 'builder'];

export default function PrimersList() {
  const [primers, setPrimers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getPrimers(), api.getProblems()])
      .then(([primersData, problemsData]) => {
        setPrimers(primersData.primers || []);
        setProblems(problemsData.problems || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
          <span className="text-sm text-text-tertiary">Loading primers...</span>
        </div>
      </div>
    );
  }

  const readCount = primers.filter(p => p.read).length;

  // Sort by learning order
  const sorted = [...primers].sort((a, b) => {
    const ai = LEARNING_ORDER.indexOf(a.name.toLowerCase());
    const bi = LEARNING_ORDER.indexOf(b.name.toLowerCase());
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  // Count related problems per pattern
  const getRelatedCount = (primerName) => {
    const name = primerName.toLowerCase();
    return problems.filter(p => (p.patterns || []).some(pat => pat.toLowerCase() === name)).length;
  };

  // Estimate read time (5-8 min per primer)
  const getReadTime = (idx) => {
    return 5 + (idx % 4); // Vary between 5-8 min
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Pattern Primers</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {readCount} of {primers.length} primers read
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((primer, idx) => {
          const relatedCount = getRelatedCount(primer.name);
          const readTime = getReadTime(idx);
          const orderIdx = LEARNING_ORDER.indexOf(primer.name.toLowerCase());
          const num = orderIdx !== -1 ? orderIdx + 1 : null;

          return (
            <Card
              key={primer.name}
              className="border-border bg-surface hover:border-border-hover transition-all duration-200 hover:shadow-sm cursor-pointer group"
              onClick={() => navigate(`/primer/${primer.name}`)}
            >
              <CardContent className="px-5 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {num && (
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background: primer.read ? 'rgba(34,197,94,0.12)' : 'var(--color-surface-tertiary)',
                          color: primer.read ? '#22c55e' : 'var(--color-text-tertiary)',
                        }}
                      >
                        {num}
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-text-primary capitalize group-hover:text-accent transition-colors">
                      {primer.name}
                    </h3>
                  </div>
                  {primer.read ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#22c55e' }} />
                  ) : (
                    <BookOpen className="w-4 h-4 flex-shrink-0 text-text-tertiary" />
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readTime} min read
                  </span>
                  {relatedCount > 0 && (
                    <span>{relatedCount} problem{relatedCount !== 1 ? 's' : ''}</span>
                  )}
                </div>

                <div className="mt-3">
                  <span
                    className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: primer.read ? 'rgba(34,197,94,0.1)' : 'var(--color-surface-tertiary)',
                      color: primer.read ? '#22c55e' : 'var(--color-text-tertiary)',
                    }}
                  >
                    {primer.read ? 'Read' : 'Unread'}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
