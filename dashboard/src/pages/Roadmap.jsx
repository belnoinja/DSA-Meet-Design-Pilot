import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOPMATE_URL } from '../lib/constants.js';

const TRACKS = [
  {
    id: 'A',
    label: 'Track A',
    title: 'Interview in 6 Weeks',
    subtitle: 'You have an upcoming interview and need to be ready fast.',
    color: '#1a90ff',
    weeks: [
      {
        week: 'Week 1',
        focus: 'Learn Core Patterns',
        tasks: [
          'Read all pattern primers (Strategy, State, Observer, Singleton)',
          'Do the mini exercise at the bottom of each primer',
          'Optional: skim Refactoring Guru links for depth',
        ],
      },
      {
        week: 'Week 2',
        focus: 'Foundation Problems',
        tasks: [
          'Solve 001 — Payment Method Ranker (Strategy)',
          'Solve 004 — Vending Machine (State)',
          'Solve 003 — Notification System (Observer)',
          'Read DESIGN.md after each problem',
        ],
      },
      {
        week: 'Week 3',
        focus: 'More Foundation',
        tasks: [
          'Solve remaining Tier 1 problems',
          'Use AI Prompt tab for self-review on each',
          'Complete Extension 1 + 2 for at least 2 problems',
        ],
      },
      {
        week: 'Weeks 4–5',
        focus: 'Intermediate Problems',
        tasks: [
          'Move to Tier 2 problems (multi-pattern)',
          'Solve 010 — Ride Surge Pricing (Strategy + Observer)',
          'Practice explaining your design out loud',
        ],
      },
      {
        week: 'Week 6',
        focus: 'Mock Interview',
        tasks: [
          'Review your weakest problems again',
          'Do a timed 45-min mock session',
          'Book a mock interview for real feedback →',
        ],
        cta: { label: 'Book a mock interview →', url: TOPMATE_URL },
      },
    ],
  },
  {
    id: 'B',
    label: 'Track B',
    title: 'Deep Learning (No Rush)',
    subtitle: 'You want to truly understand LLD — not just pass an interview.',
    color: '#007a1f',
    weeks: [
      {
        week: 'Phase 1',
        focus: 'Patterns — Theory First',
        tasks: [
          'Read all primers + follow external deep-dive links',
          'Do all mini exercises',
          'Read Head First Design Patterns chapters for each pattern',
        ],
      },
      {
        week: 'Phase 2',
        focus: 'Tier 1 — Slow & Deep',
        tasks: [
          'Solve each problem, then read full DESIGN.md walkthrough',
          'Complete Extension 1 and 2 for every problem',
          'Use AI Prompt for written feedback on each',
        ],
      },
      {
        week: 'Phase 3',
        focus: 'Tier 2 — Multi-Pattern',
        tasks: [
          'Tackle problems that combine 2+ patterns',
          'Focus on explaining trade-offs, not just solutions',
          'Write your own DESIGN.md-style walkthrough for 1 problem',
        ],
      },
      {
        week: 'Phase 4',
        focus: 'Teach & Solidify',
        tasks: [
          'Explain a pattern to someone else (Feynman technique)',
          'Contribute a problem or primer to the repo',
          'Consider an async code review for deeper feedback',
        ],
        cta: { label: 'Get an async code review →', url: TOPMATE_URL },
      },
    ],
  },
  {
    id: 'C',
    label: 'Track C',
    title: 'Fresher Getting Ahead',
    subtitle: 'You\'re in college or early career — building a strong foundation now.',
    color: '#996600',
    weeks: [
      {
        week: 'Phase 1',
        focus: 'Start Simple',
        tasks: [
          'Read Strategy, Observer, and State primers',
          'Solve 001 — Payment Ranker (entry point)',
          'Solve 003 — Notification System',
          'Solve 004 — Vending Machine',
        ],
      },
      {
        week: 'Phase 2',
        focus: 'Understand Why',
        tasks: [
          'Read DESIGN.md for all 3 problems you solved',
          'Study SOLID principles (referenced in each DESIGN.md)',
          'Learn what makes a design "extensible"',
        ],
      },
      {
        week: 'Phase 3',
        focus: 'After 6 Months of Work',
        tasks: [
          'Return and attempt Tier 2 problems',
          'Your on-the-job experience will make these click differently',
          'Read Singleton + Factory primers and new problems',
        ],
      },
    ],
  },
];

export default function Roadmap() {
  const [activeTrack, setActiveTrack] = useState('A');
  const track = TRACKS.find(t => t.id === activeTrack);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/" className="text-xs text-text-tertiary hover:text-text-secondary mb-3 inline-block">
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Learning Roadmap</h1>
        <p className="text-sm text-text-secondary mt-1">
          Pick the track that matches your situation and follow the weekly plan.
        </p>
      </div>

      {/* Track selector */}
      <div className="flex gap-2 mb-6">
        {TRACKS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTrack(t.id)}
            className={`flex-1 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors text-left ${
              activeTrack === t.id
                ? 'border-transparent text-white'
                : 'border-border text-text-secondary hover:text-text-primary hover:border-border-hover bg-surface'
            }`}
            style={activeTrack === t.id ? { background: t.color, borderColor: t.color } : {}}
          >
            <div className="font-bold text-xs mb-0.5">{t.label}</div>
            <div className="text-xs opacity-90 leading-tight">{t.title}</div>
          </button>
        ))}
      </div>

      {/* Track content */}
      <div className="bg-surface border border-border rounded-xl p-5 mb-4">
        <p className="text-sm text-text-secondary mb-5">{track.subtitle}</p>

        <div className="space-y-5">
          {track.weeks.map((week, idx) => (
            <div key={idx} className="flex gap-4">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: track.color }}
                >
                  {idx + 1}
                </div>
                {idx < track.weeks.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-xs font-bold text-text-tertiary uppercase tracking-wide">{week.week}</span>
                  <span className="text-sm font-semibold text-text-primary">{week.focus}</span>
                </div>
                <ul className="space-y-1">
                  {week.tasks.map((task, ti) => (
                    <li key={ti} className="flex items-start gap-2 text-xs text-text-secondary">
                      <span className="text-text-tertiary mt-0.5">·</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
                {week.cta && (
                  <a
                    href={week.cta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-xs font-medium text-accent hover:underline"
                  >
                    {week.cta.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-center text-text-tertiary pb-4">
        All tracks assume basic OOP knowledge (classes, inheritance, polymorphism).
      </p>
    </div>
  );
}
