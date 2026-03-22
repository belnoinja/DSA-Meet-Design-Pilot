import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import MarkdownRenderer from '../components/MarkdownRenderer.jsx';
import StatusToggle from '../components/StatusToggle.jsx';
import PatternBadge from '../components/PatternBadge.jsx';
import TierBadge from '../components/TierBadge.jsx';
import CopyCommand from '../components/CopyCommand.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import TestOutput from '../components/TestOutput.jsx';

const TABS_LEFT  = ['Description', 'Notes'];
const TABS_RIGHT = ['Code', 'Design', 'AI Prompt'];

export default function ProblemView({ onProgressChange }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Problem data
  const [problem,       setProblem]       = useState(null);
  const [readme,        setReadme]        = useState(null);
  const [beforeYouCode, setBeforeYouCode] = useState(null);
  const [design,        setDesign]        = useState(null);
  const [aiPrompt,      setAiPrompt]      = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  // Notes
  const [notes,   setNotes]     = useState('');
  const [saving,  setSaving]    = useState(false);
  const notesTimer = useRef(null);

  // Editor / run
  const [code,       setCode]       = useState('');
  const [runResult,  setRunResult]  = useState(null);
  const [running,    setRunning]    = useState(false);
  const [codeSaved,  setCodeSaved]  = useState(false);

  // Tabs
  const [leftTab,  setLeftTab]  = useState('Description');
  const [rightTab, setRightTab] = useState('Code');

  // Design/AI prompt load-on-demand
  const [designLoading,  setDesignLoading]  = useState(false);
  const [aiLoading,      setAiLoading]      = useState(false);

  // Drag-to-resize panel
  const containerRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(45); // percent
  const dragging = useRef(false);

  const onMouseDown = () => { dragging.current = true; };
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.max(25, Math.min(70, pct)));
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  // Load problem
  useEffect(() => {
    setLoading(true);
    setRunResult(null);
    setDesign(null);
    setAiPrompt(null);
    setLeftTab('Description');
    setRightTab('Code');

    Promise.all([api.getProblems(), api.getProblemReadme(id), api.getSolution(id)])
      .then(([problemsData, readmeData, solutionData]) => {
        const p = (problemsData.problems || []).find(x => x.id === id);
        if (!p) throw new Error(`Problem '${id}' not found`);
        setProblem(p);
        setNotes(p.notes || '');
        setReadme(readmeData.html);
        setBeforeYouCode(readmeData.before_you_code || null);
        setCode(solutionData.code);
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  // Status update
  const updateStatus = (status) => {
    api.updateStatus(id, { status })
      .then(updated => { setProblem(updated); onProgressChange?.(); })
      .catch(console.error);
  };

  // Extension toggle
  const toggleExtension = (ext) => {
    const current = ext === 1 ? problem.ext1 : problem.ext2;
    api.markExtension(id, ext, !current)
      .then(updated => { setProblem(updated); onProgressChange?.(); })
      .catch(console.error);
  };

  // Notes save (debounced on change, immediate on blur)
  const saveNotes = useCallback((value) => {
    setSaving(true);
    api.updateStatus(id, { notes: value })
      .then(() => setSaving(false))
      .catch(() => setSaving(false));
  }, [id]);

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => saveNotes(val), 1500);
  };

  // Code save
  const handleSaveCode = () => {
    api.saveSolution(id, code)
      .then(() => { setCodeSaved(true); setTimeout(() => setCodeSaved(false), 2000); })
      .catch(console.error);
  };

  // Run code
  const handleRun = () => {
    setRunning(true);
    setRunResult(null);
    api.runSolution(id, code)
      .then(result => { setRunResult(result); setRunning(false); })
      .catch(err => { setRunResult({ success: false, stage: 'run', output: '', error: err.message, time_ms: 0 }); setRunning(false); });
  };

  // Load design on tab switch
  const handleRightTab = (tab) => {
    setRightTab(tab);
    if (tab === 'Design' && !design) {
      setDesignLoading(true);
      api.getProblemDesign(id)
        .then(d => { setDesign(d.html); setDesignLoading(false); })
        .catch(() => { setDesign('<p>DESIGN.md not found.</p>'); setDesignLoading(false); });
    }
    if (tab === 'AI Prompt' && !aiPrompt) {
      setAiLoading(true);
      api.getProblemAiPrompt(id)
        .then(d => { setAiPrompt(d.markdown); setAiLoading(false); })
        .catch(() => { setAiPrompt('AI_REVIEW_PROMPT.md not found.'); setAiLoading(false); });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full text-text-tertiary text-sm">Loading...</div>;
  if (error)   return <div className="flex items-center justify-center h-full text-red-500 text-sm">{error}</div>;

  const num = id.split('-')[0];
  const canViewDesign = problem.status === 'attempted' || problem.status === 'solved';
  const command = `./run-tests.sh ${id} ${(problem.languages || ['cpp'])[0]}`;

  return (
    <div ref={containerRef} className="flex h-full" style={{ height: 'calc(100vh - 3rem)' }}>

      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col border-r border-border overflow-hidden" style={{ width: `${leftWidth}%` }}>

        {/* Problem header */}
        <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-border bg-surface">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary mb-2 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Problems
          </button>
          <h1 className="text-base font-bold text-text-primary leading-snug">
            {num}. {problem.name}
          </h1>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <TierBadge tier={problem.tier} />
            {(problem.patterns || []).map(p => <PatternBadge key={p} pattern={p} />)}
            <span className="text-xs text-text-tertiary">{problem.time_minutes} min</span>
            <span className="text-xs text-text-tertiary">· {(problem.companies || []).join(', ')}</span>
          </div>
          {problem.prerequisite_primer && (
            <div className="mt-1.5">
              {problem.primer_read === false ? (
                <Link
                  to={`/primer/${problem.prerequisite_primer}`}
                  className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border border-status-attempted/50 bg-status-attempted/10 text-status-attempted hover:opacity-80 transition-opacity"
                >
                  <span>⚠</span>
                  Read {problem.prerequisite_primer} primer first →
                </Link>
              ) : problem.primer_read === true ? (
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border border-status-solved/40 bg-status-solved/10 text-status-solved">
                  <span>✓</span>
                  {problem.prerequisite_primer} primer read
                </span>
              ) : (
                <Link to={`/primer/${problem.prerequisite_primer}`} className="text-xs text-accent hover:underline">
                  Primer: {problem.prerequisite_primer}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Left tabs */}
        <div className="flex border-b border-border bg-surface flex-shrink-0">
          {TABS_LEFT.map(tab => (
            <button
              key={tab}
              onClick={() => setLeftTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                leftTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Left tab content */}
        <div className="flex-1 overflow-y-auto bg-surface">
          {leftTab === 'Description' && (
            <div className="px-5 py-4">
              {/* Before You Code callout */}
              {beforeYouCode && (
                <div className="mb-4 rounded-lg border border-accent/30 bg-accent-light px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-sm">💡</span>
                    <span className="text-xs font-bold text-accent uppercase tracking-wide">Before You Code</span>
                  </div>
                  <div className="text-xs text-text-secondary [&_p]:mb-1 [&_ol]:pl-4 [&_ol]:space-y-0.5 [&_li]:text-text-secondary"
                    dangerouslySetInnerHTML={{ __html: beforeYouCode }}
                  />
                </div>
              )}

              <MarkdownRenderer html={readme} />

              {/* Status toggle inline */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">Your Status</p>
                <StatusToggle current={problem.status} onChange={updateStatus} />
              </div>

              {/* Extension progress */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">Extensions</p>
                <div className="space-y-2">
                  {[1, 2].map(ext => {
                    const done = ext === 1 ? problem.ext1 : problem.ext2;
                    return (
                      <button
                        key={ext}
                        onClick={() => toggleExtension(ext)}
                        className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                          done
                            ? 'border-status-solved/40 bg-status-solved/10'
                            : 'border-border hover:border-border-hover bg-surface-secondary'
                        }`}
                      >
                        <span className={`w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center ${
                          done ? 'bg-status-solved border-status-solved' : 'border-border'
                        }`}>
                          {done && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                              <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        <span className={`text-xs font-medium ${done ? 'text-status-solved' : 'text-text-secondary'}`}>
                          Extension {ext} {done ? 'complete' : '— not started'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Run command */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">Terminal</p>
                <CopyCommand command={command} />
              </div>
            </div>
          )}

          {leftTab === 'Notes' && (
            <div className="px-5 py-4">
              <textarea
                value={notes}
                onChange={handleNotesChange}
                onBlur={() => { clearTimeout(notesTimer.current); saveNotes(notes); }}
                rows={12}
                placeholder="Your notes, observations, approach..."
                className="w-full px-3 py-2 text-sm border border-border rounded-lg resize-y focus:outline-none focus:border-accent text-text-primary placeholder-text-tertiary bg-surface"
                style={{ background: 'var(--color-surface)' }}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-text-tertiary">{saving ? 'Saving...' : 'Auto-saves on blur'}</span>
                <button
                  onClick={() => saveNotes(notes)}
                  className="text-xs px-3 py-1 bg-accent text-white rounded hover:opacity-90"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── DRAG HANDLE ────────────────────────────────────────────────────── */}
      <div
        onMouseDown={onMouseDown}
        className="w-1 flex-shrink-0 cursor-col-resize hover:bg-accent transition-colors bg-border"
        style={{ userSelect: 'none' }}
      />

      {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Right toolbar */}
        <div className="flex-shrink-0 flex items-center justify-between px-3 border-b border-border bg-surface" style={{ minHeight: '42px' }}>
          {/* Tabs */}
          <div className="flex">
            {TABS_RIGHT.map(tab => {
              const locked = tab === 'Design' && !canViewDesign;
              return (
                <button
                  key={tab}
                  onClick={() => !locked && handleRightTab(tab)}
                  title={locked ? 'Attempt the problem first to unlock' : ''}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    rightTab === tab
                      ? 'border-accent text-accent'
                      : locked
                        ? 'border-transparent text-text-tertiary cursor-not-allowed'
                        : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab}{locked ? ' 🔒' : ''}
                </button>
              );
            })}
          </div>

          {/* Run / Save buttons (only on Code tab) */}
          {rightTab === 'Code' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveCode}
                className="text-xs px-3 py-1 rounded border border-border text-text-secondary hover:border-border-hover hover:text-text-primary transition-colors"
              >
                {codeSaved ? '✓ Saved' : 'Save'}
              </button>
              <button
                onClick={handleRun}
                disabled={running}
                className="text-xs px-4 py-1.5 rounded bg-status-solved text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {running ? 'Running...' : '▶ Run'}
              </button>
            </div>
          )}
        </div>

        {/* Right tab content */}
        {rightTab === 'Code' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Monaco editor */}
            <div className="flex-1 min-h-0" style={{ background: 'var(--color-surface)' }}>
              <CodeEditor value={code} onChange={setCode} language="cpp" />
            </div>

            {/* Output panel */}
            <div
              className="flex-shrink-0 border-t border-border overflow-y-auto"
              style={{ height: '180px', background: 'var(--color-surface-secondary)' }}
            >
              <TestOutput result={runResult} running={running} />
            </div>
          </div>
        )}

        {rightTab === 'Design' && (
          <div className="flex-1 overflow-y-auto px-5 py-4 bg-surface">
            {!canViewDesign ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-4xl mb-3">🔒</div>
                <p className="text-text-secondary text-sm font-medium">Mark as Attempted to unlock</p>
                <p className="text-text-tertiary text-xs mt-1">Try solving the problem first, then check the design walkthrough</p>
                <button
                  onClick={() => updateStatus('attempted')}
                  className="mt-4 px-4 py-2 text-sm bg-status-attempted text-white rounded-lg font-medium hover:opacity-90"
                >
                  Mark as Attempted
                </button>
              </div>
            ) : designLoading ? (
              <div className="text-text-tertiary text-sm">Loading...</div>
            ) : (
              <MarkdownRenderer html={design} />
            )}
          </div>
        )}

        {rightTab === 'AI Prompt' && (
          <div className="flex-1 overflow-y-auto px-5 py-4 bg-surface">
            {aiLoading ? (
              <div className="text-text-tertiary text-sm">Loading...</div>
            ) : aiPrompt ? (
              <div>
                <p className="text-xs text-text-tertiary mb-2">Click inside to select all, then copy to your AI tool.</p>
                <textarea
                  readOnly
                  value={aiPrompt}
                  className="w-full text-sm font-mono border border-border rounded-lg resize-y focus:outline-none px-3 py-2 text-text-primary"
                  style={{ background: 'var(--color-surface-tertiary)', minHeight: '400px' }}
                  onClick={e => e.target.select()}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
