import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, GraduationCap, Building2, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { api } from '../lib/api.js';
import { TOPMATE_URL } from '../lib/constants.js';
import RoadmapProblemCard from '../components/RoadmapProblemCard.jsx';
import CompanySelector from '../components/CompanySelector.jsx';

// ─── Problem registry (from problems.yml) ──────────────────────────────────

const PROBLEMS = [
  { id: '001-payment-ranker',   name: 'Payment Method Ranker',           tier: 1, patterns: ['Strategy', 'Comparator'],  companies: ['Amazon', 'Flipkart'] },
  { id: '003-notification-system', name: 'Notification System',          tier: 1, patterns: ['Observer'],                companies: ['Flipkart', 'Swiggy'] },
  { id: '004-vending-machine',  name: 'Vending Machine',                 tier: 1, patterns: ['State'],                   companies: ['Amazon', 'Flipkart'] },
  { id: '005-issue-resolver',   name: 'Customer Issue Resolution System',tier: 1, patterns: ['Strategy', 'Observer'],    companies: ['PhonePe', 'Flipkart'] },
  { id: '006-discount-engine',  name: 'Billing & Discount Engine',       tier: 1, patterns: ['Strategy', 'Decorator'],   companies: ['Flipkart', 'Amazon', 'Meesho'] },
  { id: '007-order-management', name: 'Order Management System',         tier: 1, patterns: ['State'],                   companies: ['Meesho', 'PhonePe', 'Amazon'] },
  { id: '008-file-search',      name: 'File Search System',              tier: 1, patterns: ['Strategy', 'Composite'],   companies: ['Amazon', 'Microsoft'] },
  { id: '009-meeting-scheduler',name: 'Meeting Room Scheduler',          tier: 2, patterns: ['Strategy', 'Observer'],    companies: ['Flipkart', 'Razorpay', 'Groww', 'Microsoft'] },
  { id: '010-ride-surge-pricing',name: 'Ride Surge Pricing Engine',      tier: 2, patterns: ['Strategy', 'Observer'],    companies: ['Uber', 'Ola'] },
  { id: '011-rate-limiter',     name: 'API Rate Limiter',                tier: 1, patterns: ['Strategy', 'Factory'],     companies: ['Amazon', 'Razorpay', 'Uber'] },
];

const PRIMERS = ['Strategy', 'Observer', 'State', 'Singleton'];

function getProblem(id) {
  return PROBLEMS.find(p => p.id === id);
}

// ─── Track definitions ─────────────────────────────────────────────────────

const TRACKS = [
  {
    id: 'A',
    title: 'Interview in 6 Weeks',
    subtitle: 'You have an upcoming interview and need to be ready fast.',
    color: '#1a90ff',
    icon: Clock,
    estimatedHours: 40,
    phases: [
      {
        name: 'Week 1',
        focus: 'Learn Core Patterns',
        prerequisite: null,
        tasks: [
          { type: 'manual', key: 'A-1-primers', label: 'Read all 4 primers: Strategy, Observer, State, Singleton (~4 hours)' },
          { type: 'manual', key: 'A-1-exercises', label: 'Do the mini exercise at the bottom of each primer' },
          { type: 'manual', key: 'A-1-optional', label: 'Optional: skim Refactoring Guru links for depth' },
        ],
      },
      {
        name: 'Week 2',
        focus: 'Foundation Basics',
        prerequisite: 'Read Strategy, Observer, State primers first',
        tasks: [
          { type: 'problem', problemId: '001-payment-ranker' },
          { type: 'problem', problemId: '003-notification-system' },
          { type: 'problem', problemId: '004-vending-machine' },
          { type: 'manual', key: 'A-2-design', label: 'Read DESIGN.md after each problem' },
        ],
      },
      {
        name: 'Week 3',
        focus: 'Foundation Continued',
        prerequisite: 'Complete Week 2 problems',
        tasks: [
          { type: 'problem', problemId: '005-issue-resolver' },
          { type: 'problem', problemId: '006-discount-engine' },
          { type: 'problem', problemId: '007-order-management' },
          { type: 'manual', key: 'A-3-review', label: 'Use AI Prompt tab for self-review on each' },
        ],
      },
      {
        name: 'Week 4',
        focus: 'Foundation Advanced',
        prerequisite: 'Complete all Week 3 problems',
        tasks: [
          { type: 'problem', problemId: '008-file-search' },
          { type: 'problem', problemId: '011-rate-limiter' },
          { type: 'manual', key: 'A-4-extensions', label: 'Complete ALL extensions for Week 2-3 problems' },
        ],
      },
      {
        name: 'Week 5',
        focus: 'Intermediate',
        prerequisite: 'All Tier 1 problems solved',
        tasks: [
          { type: 'problem', problemId: '009-meeting-scheduler' },
          { type: 'problem', problemId: '010-ride-surge-pricing' },
          { type: 'manual', key: 'A-5-explain', label: 'Practice explaining your design out loud' },
        ],
      },
      {
        name: 'Week 6',
        focus: 'Review + Mock Interview',
        prerequisite: 'All problems attempted',
        tasks: [
          { type: 'manual', key: 'A-6-review', label: 'Re-attempt your weakest 2-3 problems' },
          { type: 'manual', key: 'A-6-mock', label: 'Do a timed 45-min mock session' },
        ],
        cta: { label: 'Book a mock interview', url: TOPMATE_URL },
      },
    ],
  },
  {
    id: 'B',
    title: 'Deep Learning (No Rush)',
    subtitle: 'You want to truly understand LLD — not just pass an interview.',
    color: '#007a1f',
    icon: BookOpen,
    estimatedHours: 80,
    phases: [
      {
        name: 'Phase 1',
        focus: 'Patterns Deep Dive',
        prerequisite: null,
        tasks: [
          { type: 'manual', key: 'B-1-primers', label: 'Read all 4 primers + follow external deep-dive links' },
          { type: 'manual', key: 'B-1-exercises', label: 'Do all primer exercises thoroughly' },
          { type: 'manual', key: 'B-1-book', label: 'Read Head First Design Patterns chapters for each pattern' },
          { type: 'manual', key: 'B-1-refactoring', label: 'Study Refactoring Guru for Strategy, Observer, State, Singleton' },
        ],
      },
      {
        name: 'Phase 2',
        focus: 'Tier 1 — Slow & Deep',
        prerequisite: 'Complete Phase 1 deep dive',
        tasks: [
          { type: 'problem', problemId: '001-payment-ranker' },
          { type: 'problem', problemId: '003-notification-system' },
          { type: 'problem', problemId: '004-vending-machine' },
          { type: 'problem', problemId: '005-issue-resolver' },
          { type: 'problem', problemId: '006-discount-engine' },
          { type: 'problem', problemId: '007-order-management' },
          { type: 'problem', problemId: '008-file-search' },
          { type: 'problem', problemId: '011-rate-limiter' },
          { type: 'manual', key: 'B-2-design', label: 'Read full DESIGN.md walkthrough after every problem' },
          { type: 'manual', key: 'B-2-extensions', label: 'Complete ALL extensions for every problem' },
          { type: 'manual', key: 'B-2-ai', label: 'Use AI Prompt for written feedback on each' },
        ],
      },
      {
        name: 'Phase 3',
        focus: 'Tier 2 — Multi-Pattern',
        prerequisite: 'All Tier 1 solved with all extensions',
        tasks: [
          { type: 'problem', problemId: '009-meeting-scheduler' },
          { type: 'problem', problemId: '010-ride-surge-pricing' },
          { type: 'manual', key: 'B-3-tradeoffs', label: 'Focus on explaining trade-offs, not just solutions' },
          { type: 'manual', key: 'B-3-writeup', label: 'Write your own DESIGN.md-style walkthrough for 1 problem' },
        ],
      },
      {
        name: 'Phase 4',
        focus: 'Teach & Solidify',
        prerequisite: 'All problems completed',
        tasks: [
          { type: 'manual', key: 'B-4-feynman', label: 'Explain a pattern to someone else (Feynman technique)' },
          { type: 'manual', key: 'B-4-contribute', label: 'Contribute a problem or primer to the repo' },
        ],
        cta: { label: 'Get an async code review', url: TOPMATE_URL },
      },
    ],
  },
  {
    id: 'C',
    title: 'Fresher Getting Ahead',
    subtitle: "You're in college or early career — building a strong foundation now.",
    color: '#996600',
    icon: GraduationCap,
    estimatedHours: 50,
    phases: [
      {
        name: 'Phase 1',
        focus: 'Learn OOP & SOLID',
        prerequisite: null,
        tasks: [
          { type: 'manual', key: 'C-1-oop', label: 'Learn OOP fundamentals (classes, inheritance, polymorphism) from external resources' },
          { type: 'manual', key: 'C-1-solid', label: 'Study SOLID principles — understand why they matter' },
          { type: 'manual', key: 'C-1-primers', label: 'Read Strategy + Observer primers' },
        ],
      },
      {
        name: 'Phase 2',
        focus: 'First 3 Problems',
        prerequisite: 'Read Strategy, Observer, State primers',
        tasks: [
          { type: 'problem', problemId: '001-payment-ranker' },
          { type: 'problem', problemId: '003-notification-system' },
          { type: 'problem', problemId: '004-vending-machine' },
          { type: 'manual', key: 'C-2-design', label: 'Read DESIGN.md after solving each problem' },
          { type: 'manual', key: 'C-2-extensible', label: 'Study what makes a design "extensible"' },
        ],
      },
      {
        name: 'Phase 3',
        focus: 'After Some Work Experience',
        prerequisite: '3-6 months of work experience',
        tasks: [
          { type: 'problem', problemId: '005-issue-resolver' },
          { type: 'problem', problemId: '006-discount-engine' },
          { type: 'problem', problemId: '007-order-management' },
          { type: 'problem', problemId: '008-file-search' },
          { type: 'problem', problemId: '011-rate-limiter' },
          { type: 'manual', key: 'C-3-primers', label: 'Read State + Singleton primers' },
          { type: 'manual', key: 'C-3-extensions', label: 'Complete extensions for all problems' },
        ],
      },
      {
        name: 'Phase 4',
        focus: 'Tier 2 When Ready',
        prerequisite: 'Comfortable with Tier 1 patterns',
        tasks: [
          { type: 'problem', problemId: '009-meeting-scheduler' },
          { type: 'problem', problemId: '010-ride-surge-pricing' },
          { type: 'manual', key: 'C-4-mock', label: 'Do timed mocks to simulate interview pressure' },
        ],
      },
    ],
  },
  {
    id: 'D',
    title: 'Company-Specific Prep',
    subtitle: 'Targeting a specific company? Focus on the problems they actually ask.',
    color: '#9333ea',
    icon: Building2,
    estimatedHours: null, // varies
    phases: [], // dynamically generated based on company selection
  },
];

// ─── Build company-specific phases ──────────────────────────────────────────

function buildCompanyPhases(companyName) {
  const companyProblems = PROBLEMS.filter(p => p.companies.includes(companyName));
  const tier1 = companyProblems.filter(p => p.tier === 1);
  const tier2 = companyProblems.filter(p => p.tier === 2);

  // Collect required primers
  const neededPatterns = new Set();
  companyProblems.forEach(p => p.patterns.forEach(pat => neededPatterns.add(pat)));
  const primerList = PRIMERS.filter(p => neededPatterns.has(p));

  const phases = [];

  // Phase 1: Primers
  phases.push({
    name: 'Step 1',
    focus: 'Read Relevant Primers',
    prerequisite: null,
    tasks: primerList.map(p => ({
      type: 'manual',
      key: `D-${companyName}-primer-${p}`,
      label: `Read ${p} primer`,
    })),
  });

  // Phase 2: Foundation problems
  if (tier1.length > 0) {
    phases.push({
      name: 'Step 2',
      focus: 'Foundation Problems',
      prerequisite: 'Complete primers above',
      tasks: [
        ...tier1.map(p => ({ type: 'problem', problemId: p.id })),
        { type: 'manual', key: `D-${companyName}-design`, label: 'Read DESIGN.md after each problem' },
        { type: 'manual', key: `D-${companyName}-ext`, label: 'Complete all extensions' },
      ],
    });
  }

  // Phase 3: Intermediate problems
  if (tier2.length > 0) {
    phases.push({
      name: 'Step 3',
      focus: 'Intermediate Problems',
      prerequisite: 'All foundation problems solved',
      tasks: [
        ...tier2.map(p => ({ type: 'problem', problemId: p.id })),
        { type: 'manual', key: `D-${companyName}-tradeoffs`, label: 'Focus on trade-off discussions' },
      ],
    });
  }

  // Phase 4: Mock
  phases.push({
    name: tier2.length > 0 ? 'Step 4' : 'Step 3',
    focus: 'Mock Interview',
    prerequisite: 'All company problems solved',
    tasks: [
      { type: 'manual', key: `D-${companyName}-timed`, label: 'Do a timed 45-min mock with one of these problems' },
      { type: 'manual', key: `D-${companyName}-explain`, label: 'Practice explaining trade-offs aloud' },
    ],
    cta: { label: 'Book a mock interview', url: TOPMATE_URL },
  });

  return phases;
}

// ─── Utility: count completed tasks in a phase ──────────────────────────────

function countPhaseCompletion(phase, progressData, manualChecks) {
  let total = 0;
  let done = 0;

  for (const task of phase.tasks) {
    total++;
    if (task.type === 'problem') {
      const ps = progressData[task.problemId];
      if (ps && ps.status === 'solved') done++;
    } else {
      if (manualChecks[task.key]) done++;
    }
  }

  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function countTrackCompletion(phases, progressData, manualChecks) {
  let total = 0;
  let done = 0;
  for (const phase of phases) {
    const c = countPhaseCompletion(phase, progressData, manualChecks);
    total += c.total;
    done += c.done;
  }
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

// ─── Build company -> problems index ────────────────────────────────────────

function buildProblemsByCompany() {
  const map = {};
  for (const p of PROBLEMS) {
    for (const c of p.companies) {
      if (!map[c]) map[c] = [];
      map[c].push(p);
    }
  }
  return map;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Roadmap() {
  const [activeTrack, setActiveTrack] = useState('A');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState({});
  const [progressData, setProgressData] = useState({});
  const [primersRead, setPrimersRead] = useState([]);
  const [manualChecks, setManualChecks] = useState({});
  const [loading, setLoading] = useState(true);

  const problemsByCompany = useMemo(() => buildProblemsByCompany(), []);

  // Fetch progress data
  useEffect(() => {
    setLoading(true);
    api.getRoadmapProgress()
      .then(data => {
        setProgressData(data.problems || {});
        setPrimersRead(data.primers_read || []);
        setManualChecks(data.manual_checks || {});
      })
      .catch(() => {
        // Fallback: try localStorage
        try {
          const saved = JSON.parse(localStorage.getItem('roadmap_checks') || '{}');
          setManualChecks(saved);
        } catch (_) {}
      })
      .finally(() => setLoading(false));
  }, []);

  // Get current track + phases
  const track = TRACKS.find(t => t.id === activeTrack);
  const phases = activeTrack === 'D'
    ? (selectedCompany ? buildCompanyPhases(selectedCompany) : [])
    : track.phases;

  // Determine first incomplete phase for auto-expand
  useEffect(() => {
    if (phases.length === 0) return;
    const newExpanded = {};
    let foundIncomplete = false;
    for (let i = 0; i < phases.length; i++) {
      const { percent } = countPhaseCompletion(phases[i], progressData, manualChecks);
      if (!foundIncomplete && percent < 100) {
        newExpanded[i] = true;
        foundIncomplete = true;
      }
    }
    // If all complete, expand last
    if (!foundIncomplete && phases.length > 0) {
      newExpanded[phases.length - 1] = true;
    }
    setExpandedPhases(newExpanded);
  }, [activeTrack, selectedCompany, phases.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePhase = useCallback((idx) => {
    setExpandedPhases(prev => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  // Handle manual checkbox toggle
  const handleManualCheck = useCallback((key, checked) => {
    setManualChecks(prev => ({ ...prev, [key]: checked }));
    // Persist to server
    api.setRoadmapCheck(key, checked).catch(() => {
      // Fallback to localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('roadmap_checks') || '{}');
        saved[key] = checked;
        localStorage.setItem('roadmap_checks', JSON.stringify(saved));
      } catch (_) {}
    });
  }, []);

  // Track-level completion
  const trackCompletion = phases.length > 0
    ? countTrackCompletion(phases, progressData, manualChecks)
    : { total: 0, done: 0, percent: 0 };

  return (
    <div className="max-w-3xl mx-auto pb-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/" className="text-xs text-text-tertiary hover:text-text-secondary mb-3 inline-block">
          &larr; Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Learning Roadmap</h1>
        <p className="text-sm text-text-secondary mt-1">
          Pick the track that matches your situation. Progress syncs with your problem submissions.
        </p>
      </div>

      {/* Track selector — responsive grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {TRACKS.map(t => {
          const Icon = t.icon;
          const isActive = activeTrack === t.id;

          return (
            <button
              key={t.id}
              onClick={() => { setActiveTrack(t.id); setSelectedCompany(null); }}
              className={`relative px-3 py-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-transparent text-white shadow-lg'
                  : 'border-border text-text-secondary hover:text-text-primary hover:border-border-hover bg-surface'
              }`}
              style={isActive ? {
                background: `linear-gradient(135deg, ${t.color}, ${t.color}dd)`,
                borderColor: t.color,
              } : {}}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={14} className={isActive ? 'text-white/80' : 'text-text-tertiary'} />
                <span className="font-bold text-xs uppercase tracking-wide opacity-80">Track {t.id}</span>
              </div>
              <div className="text-xs font-semibold leading-tight">{t.title}</div>
            </button>
          );
        })}
      </div>

      {/* Track content card */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {/* Track header */}
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                {React.createElement(track.icon, { size: 18, style: { color: track.color } })}
                {track.title}
              </h2>
              <p className="text-xs text-text-secondary mt-1">{track.subtitle}</p>
            </div>
            {track.estimatedHours && (
              <div className="flex-shrink-0 text-right">
                <div className="text-xs text-text-tertiary">Est. time</div>
                <div className="text-sm font-bold text-text-primary">{track.estimatedHours}h</div>
              </div>
            )}
            {activeTrack === 'D' && selectedCompany && (
              <div className="flex-shrink-0 text-right">
                <div className="text-xs text-text-tertiary">Problems</div>
                <div className="text-sm font-bold text-text-primary">{(problemsByCompany[selectedCompany] || []).length}</div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {phases.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-text-secondary">
                  {trackCompletion.done}/{trackCompletion.total} tasks completed
                </span>
                <span className="text-xs font-bold" style={{ color: track.color }}>
                  {trackCompletion.percent}%
                </span>
              </div>
              <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${trackCompletion.percent}%`,
                    background: `linear-gradient(90deg, ${track.color}, ${track.color}bb)`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Company selector for Track D */}
        {activeTrack === 'D' && (
          <div className="px-5 py-4 border-b border-border bg-surface-secondary">
            <div className="text-xs font-semibold text-text-secondary mb-2.5 uppercase tracking-wide">
              Select your target company
            </div>
            <CompanySelector
              selected={selectedCompany}
              onSelect={setSelectedCompany}
              problemsByCompany={problemsByCompany}
            />
          </div>
        )}

        {/* Phases / Timeline */}
        <div className="px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-border border-t-accent rounded-full" />
            </div>
          ) : phases.length === 0 && activeTrack === 'D' ? (
            <div className="text-center py-12">
              <Building2 size={32} className="mx-auto text-text-tertiary mb-3" />
              <p className="text-sm text-text-secondary">Select a company above to see your personalized roadmap.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Animated vertical line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-0.5" style={{ background: 'var(--color-border)' }}>
                {/* Colored portion for completed phases */}
                {(() => {
                  let completedCount = 0;
                  for (const phase of phases) {
                    const { percent } = countPhaseCompletion(phase, progressData, manualChecks);
                    if (percent === 100) completedCount++;
                    else break;
                  }
                  const pct = phases.length > 1 ? (completedCount / (phases.length - 1)) * 100 : (completedCount > 0 ? 100 : 0);
                  return (
                    <div
                      className="w-full rounded-full transition-all duration-700"
                      style={{
                        height: `${Math.min(pct, 100)}%`,
                        background: track.color,
                      }}
                    />
                  );
                })()}
              </div>

              {/* Phase list */}
              <div className="space-y-1">
                {phases.map((phase, idx) => {
                  const completion = countPhaseCompletion(phase, progressData, manualChecks);
                  const isExpanded = expandedPhases[idx];
                  const isComplete = completion.percent === 100;
                  const isCurrentPhase = !isComplete && (idx === 0 || countPhaseCompletion(phases[idx - 1], progressData, manualChecks).percent === 100);

                  return (
                    <div key={idx} className="relative">
                      {/* Phase header — clickable to expand/collapse */}
                      <button
                        onClick={() => togglePhase(idx)}
                        className="w-full flex items-start gap-3 py-3 text-left group"
                      >
                        {/* Milestone circle */}
                        <div className="relative z-10 flex-shrink-0">
                          <div
                            className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                              isComplete
                                ? 'text-white border-transparent'
                                : isCurrentPhase
                                  ? 'border-transparent text-white'
                                  : 'border-border bg-surface text-text-tertiary'
                            }`}
                            style={
                              isComplete
                                ? { background: track.color, borderColor: track.color }
                                : isCurrentPhase
                                  ? {
                                      background: track.color,
                                      borderColor: track.color,
                                      boxShadow: `0 0 0 3px ${track.color}33`,
                                      animation: 'pulse 2s infinite',
                                    }
                                  : {}
                            }
                          >
                            {isComplete ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              idx + 1
                            )}
                          </div>
                        </div>

                        {/* Phase title + summary */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-text-tertiary uppercase tracking-wide">{phase.name}</span>
                            <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{phase.focus}</span>
                            <span className="ml-auto flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                isComplete ? 'bg-green-500/10 text-green-500' : 'bg-surface-tertiary text-text-tertiary'
                              }`}>
                                {completion.done}/{completion.total}
                              </span>
                              {isExpanded ? (
                                <ChevronDown size={14} className="text-text-tertiary" />
                              ) : (
                                <ChevronRight size={14} className="text-text-tertiary" />
                              )}
                            </span>
                          </div>
                          {/* Collapsed mini progress bar */}
                          {!isExpanded && (
                            <div className="h-1 mt-1.5 bg-surface-tertiary rounded-full overflow-hidden max-w-[200px]">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${completion.percent}%`, background: track.color }}
                              />
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Expanded phase content */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="ml-[42px] pb-4">
                          {/* Prerequisite note */}
                          {phase.prerequisite && (
                            <div className="text-[10px] text-text-tertiary mb-2.5 px-2 py-1 bg-surface-secondary rounded border border-border inline-block">
                              Prerequisite: {phase.prerequisite}
                            </div>
                          )}

                          {/* Tasks */}
                          <div className="space-y-2">
                            {phase.tasks.map((task, ti) => (
                              <TaskItem
                                key={ti}
                                task={task}
                                progressData={progressData}
                                manualChecks={manualChecks}
                                onManualCheck={handleManualCheck}
                                trackColor={track.color}
                              />
                            ))}
                          </div>

                          {/* CTA */}
                          {phase.cta && (
                            <a
                              href={phase.cta.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                              style={{ background: track.color }}
                            >
                              {phase.cta.label}
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-center text-text-tertiary mt-4 pb-4">
        All tracks assume basic OOP knowledge (classes, inheritance, polymorphism).
        Progress auto-syncs from your problem submissions.
      </p>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px ${track.color}33; }
          50% { box-shadow: 0 0 0 6px ${track.color}22; }
        }
      `}</style>
    </div>
  );
}

// ─── TaskItem sub-component ─────────────────────────────────────────────────

function TaskItem({ task, progressData, manualChecks, onManualCheck, trackColor }) {
  if (task.type === 'problem') {
    const problem = getProblem(task.problemId);
    if (!problem) return null;

    const ps = progressData[task.problemId];
    const status = ps ? ps.status : 'unsolved';

    return (
      <RoadmapProblemCard problem={problem} status={status} />
    );
  }

  // Manual task with checkbox
  const isChecked = !!manualChecks[task.key];

  return (
    <label className="flex items-start gap-2.5 cursor-pointer group py-1">
      <span className="flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={e => onManualCheck(task.key, e.target.checked)}
          className="sr-only peer"
        />
        <span
          className={`block w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${
            isChecked
              ? 'border-transparent'
              : 'border-border group-hover:border-text-tertiary'
          }`}
          style={isChecked ? { background: trackColor, borderColor: trackColor } : {}}
        >
          {isChecked && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
      </span>
      <span className={`text-xs leading-relaxed transition-colors ${
        isChecked ? 'text-text-tertiary line-through' : 'text-text-secondary group-hover:text-text-primary'
      }`}>
        {task.label}
      </span>
    </label>
  );
}
