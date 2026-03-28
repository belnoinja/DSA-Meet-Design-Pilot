import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  MessageSquare,
  Code2,
  Shield,
  Puzzle,
  GraduationCap,
} from 'lucide-react';

const REVIEW_CHECKLIST = [
  { key: 'pattern',   icon: Puzzle,         label: 'Pattern Correctness',      desc: 'Strategy/Observer/State implementation' },
  { key: 'ocp',       icon: Shield,         label: 'OCP Compliance',           desc: 'Open for extension, closed for modification' },
  { key: 'cpp',       icon: Code2,          label: 'C++ Quality',              desc: 'Memory, const correctness, STL usage' },
  { key: 'extension', icon: ChevronUp,      label: 'Extension Handling',       desc: 'How well the design absorbs new parts' },
  { key: 'interview', icon: GraduationCap,  label: 'Interview Readiness Score', desc: 'Hire / Lean Hire / Lean No Hire / No Hire' },
];

const AI_TOOLS = [
  {
    name: 'Claude',
    url: 'https://claude.ai',
    preferred: true,
    color: '#d97706',
    bg: 'rgba(217,119,6,0.1)',
  },
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    preferred: false,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
  },
];

export default function AiReviewPanel({ promptMarkdown, code, problemName, loading }) {
  const [approach, setApproach] = useState('');
  const [questions, setQuestions] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  // Build the full prompt with user's code, approach, and questions injected
  const fullPrompt = useMemo(() => {
    if (!promptMarkdown) return '';

    let result = promptMarkdown;

    // Replace the placeholder with the user's actual code
    if (code && code.trim() && !code.trim().startsWith('// Write your solution here')) {
      result = result.replace('// PASTE YOUR SOLUTION HERE', code.trim());
    }

    // Replace approach placeholder
    if (approach.trim()) {
      result = result.replace(
        '<!-- Describe your thought process in 2-3 sentences -->',
        approach.trim()
      );
    }

    // Replace questions placeholder
    if (questions.trim()) {
      result = result.replace(
        '<!-- Ask the AI anything specific about your solution -->',
        questions.trim()
      );
    }

    return result;
  }, [promptMarkdown, code, approach, questions]);

  const hasCode = useMemo(() => {
    return code && code.trim() && !code.trim().startsWith('// Write your solution here');
  }, [code]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [fullPrompt]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Loading...</div>
      </div>
    );
  }

  if (!promptMarkdown) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          AI_REVIEW_PROMPT.md not found for this problem.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--color-surface)' }}>
      <div className="max-w-2xl mx-auto px-5 py-5 space-y-5">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div
          className="rounded-xl px-5 py-4"
          style={{ background: 'var(--color-surface-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <Sparkles size={18} style={{ color: 'var(--color-accent)' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
              AI Code Review
            </h2>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            Get expert feedback on your {problemName || 'solution'} from AI. Your code is auto-inserted into the prompt — just add your notes, copy, and paste into your preferred AI tool.
          </p>
        </div>

        {/* ── Code Status ─────────────────────────────────────────── */}
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{
            background: hasCode ? 'rgba(34,197,94,0.06)' : 'rgba(245,158,11,0.06)',
            border: `1px solid ${hasCode ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
          }}
        >
          {hasCode ? (
            <CheckCircle2 size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
          ) : (
            <Code2 size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
          )}
          <span className="text-xs font-medium" style={{ color: hasCode ? '#22c55e' : '#f59e0b' }}>
            {hasCode
              ? 'Your code from the editor is auto-inserted into the prompt'
              : 'No code detected — write your solution in the Code tab first, then come back here'}
          </span>
        </div>

        {/* ── Approach Notes ──────────────────────────────────────── */}
        <div
          className="rounded-xl px-4 py-4"
          style={{ background: 'var(--color-surface-secondary)', border: '1px solid var(--color-border)' }}
        >
          <label className="flex items-center gap-2 mb-2">
            <MessageSquare size={14} style={{ color: 'var(--color-text-tertiary)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              My Approach
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>(optional)</span>
          </label>
          <textarea
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            placeholder="Describe your thought process in 2-3 sentences..."
            rows={3}
            className="w-full px-3 py-2 text-xs border rounded-lg resize-y focus:outline-none transition-colors"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              borderColor: 'var(--color-border)',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-accent)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; }}
          />
        </div>

        {/* ── Specific Questions ──────────────────────────────────── */}
        <div
          className="rounded-xl px-4 py-4"
          style={{ background: 'var(--color-surface-secondary)', border: '1px solid var(--color-border)' }}
        >
          <label className="flex items-center gap-2 mb-2">
            <Sparkles size={14} style={{ color: 'var(--color-text-tertiary)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              Specific Questions
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>(optional)</span>
          </label>
          <textarea
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Ask the AI anything specific about your solution..."
            rows={2}
            className="w-full px-3 py-2 text-xs border rounded-lg resize-y focus:outline-none transition-colors"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              borderColor: 'var(--color-border)',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-accent)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; }}
          />
        </div>

        {/* ── Review Checklist ────────────────────────────────────── */}
        <div
          className="rounded-xl px-4 py-4"
          style={{ background: 'var(--color-surface-secondary)', border: '1px solid var(--color-border)' }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--color-text-secondary)' }}>
            The AI will review:
          </p>
          <div className="space-y-2">
            {REVIEW_CHECKLIST.map(({ key, icon: Icon, label, desc }) => (
              <div key={key} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-surface-tertiary)' }}
                >
                  <Icon size={13} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {label}
                  </span>
                  <span className="text-xs ml-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                    — {desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Copy Button (prominent) ─────────────────────────────── */}
        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
          style={{
            background: copied
              ? '#22c55e'
              : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            boxShadow: copied
              ? '0 2px 8px rgba(34,197,94,0.35)'
              : '0 2px 8px rgba(99,102,241,0.35)',
          }}
        >
          {copied ? (
            <>
              <ClipboardCheck size={16} />
              Copied to Clipboard!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy Full Prompt to Clipboard
            </>
          )}
        </button>

        {/* ── AI Tool Links ───────────────────────────────────────── */}
        <div className="flex gap-3">
          {AI_TOOLS.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: tool.bg,
                color: tool.color,
                border: `1px solid ${tool.color}22`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <ExternalLink size={13} />
              {tool.preferred ? `Open ${tool.name} (Recommended)` : `Open ${tool.name}`}
            </a>
          ))}
        </div>

        {/* ── Prompt Preview (collapsible) ────────────────────────── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <button
            onClick={() => setShowPromptPreview(!showPromptPreview)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold transition-colors"
            style={{
              background: 'var(--color-surface-secondary)',
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-tertiary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-surface-secondary)'; }}
          >
            <span>Preview Full Prompt</span>
            {showPromptPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showPromptPreview && (
            <div
              className="px-4 py-3 overflow-x-auto"
              style={{
                background: 'var(--color-surface-tertiary)',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <pre
                className="text-xs whitespace-pre-wrap break-words"
                style={{
                  color: 'var(--color-text-primary)',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {fullPrompt}
              </pre>
            </div>
          )}
        </div>

        {/* Bottom spacer */}
        <div style={{ height: '8px' }} />
      </div>
    </div>
  );
}
