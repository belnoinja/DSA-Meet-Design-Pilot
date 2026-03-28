import React, { useState } from 'react';

function CompilationError({ errors }) {
  return (
    <div className="mx-3 my-2.5 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.2)' }}
      >
        <span className="text-xs">❌</span>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#f87171' }}>
          Compilation Error
        </span>
      </div>
      <pre
        className="px-3 py-2.5 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto"
        style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.05)' }}
      >
        {errors}
      </pre>
    </div>
  );
}

function PartResult({ part, name, passed, total, all_passed, tests }) {
  const [expanded, setExpanded] = useState(!all_passed);

  return (
    <div style={{ borderBottom: '1px solid var(--color-border)' }} className="last:border-0">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors"
        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-tertiary)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span className="text-sm flex-shrink-0">{all_passed ? '✅' : '❌'}</span>
        <span className="text-xs font-semibold flex-1" style={{ color: 'var(--color-text-primary)' }}>
          Part {part}: {name}
        </span>
        <span
          className="text-xs font-bold flex-shrink-0 tabular-nums"
          style={{ color: all_passed ? '#22c55e' : '#f87171' }}
        >
          {passed}/{total}
        </span>
        <svg
          width="10" height="10" viewBox="0 0 10 10"
          fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round"
          className="flex-shrink-0 ml-1"
        >
          {expanded ? <path d="M2 3l3 3 3-3" /> : <path d="M2 7l3-3 3 3" />}
        </svg>
      </button>

      {expanded && tests && tests.length > 0 && (
        <div className="pb-2" style={{ paddingLeft: '2.5rem', paddingRight: '0.75rem' }}>
          {tests.map((test, i) => (
            <div key={i} className="py-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs flex-shrink-0">{test.passed ? '✓' : '✗'}</span>
                <span
                  className="text-xs font-mono"
                  style={{ color: test.passed ? 'var(--color-text-secondary)' : '#f87171' }}
                >
                  {test.name}
                </span>
              </div>
              {!test.passed && test.error && (
                <div
                  className="ml-4 mt-0.5 text-xs font-mono whitespace-pre-wrap leading-relaxed"
                  style={{ color: 'rgba(248,113,113,0.7)' }}
                >
                  {test.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TestOutput({ result, running, submitStatus }) {
  const [collapsed, setCollapsed] = useState(false);

  if (running) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
        <span
          className="w-3 h-3 border-2 rounded-full animate-spin flex-shrink-0"
          style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }}
        />
        {submitStatus || 'Compiling and running tests…'}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="px-3 py-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
        Click <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>Submit Part</span> to run tests
      </div>
    );
  }

  // ── Structured v3 result ──
  if (result.submitted_part !== undefined) {
    const { success, submitted_part, compilation, parts, timed_out, time_ms, runner_available } = result;

    if (runner_available === false) {
      return (
        <div className="px-3 py-3 text-xs">
          <p className="font-medium" style={{ color: '#f87171' }}>g++ not found on your system.</p>
          <p className="mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            Install g++ to use the test runner, or use "Skip →" below.
          </p>
        </div>
      );
    }

    return (
      <div>
        {/* Result header */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs">{success ? '✅' : '❌'}</span>
            <span
              className="text-xs font-semibold"
              style={{ color: success ? '#22c55e' : '#f87171' }}
            >
              {timed_out ? 'Timed out (10s)' : success ? 'All tests passed' : 'Tests failed'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {time_ms !== undefined && (
              <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                {time_ms}ms
              </span>
            )}
            <button
              onClick={() => setCollapsed(c => !c)}
              className="text-xs transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
            >
              {collapsed ? '▸ Show' : '▾ Hide'}
            </button>
          </div>
        </div>

        {!collapsed && (
          <>
            {compilation && !compilation.success && <CompilationError errors={compilation.errors} />}
            {parts && parts.length > 0 && (
              <div>
                {parts.map(p => <PartResult key={p.part} {...p} />)}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ── Legacy result ──
  const { success, stage, output, error, time_ms } = result;

  const noCompiler = error && (
    error.includes('not recognized') ||
    error.includes('not found') ||
    error.includes('No such file')
  );

  if (noCompiler) {
    return (
      <div className="px-3 py-3 text-xs">
        <p className="font-semibold" style={{ color: '#f87171' }}>g++ not found on your system.</p>
        <p className="mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
          Windows: Install MinGW-w64 · Mac: <code className="font-mono px-1 rounded" style={{ background: 'var(--color-surface-tertiary)' }}>xcode-select --install</code> · Linux: <code className="font-mono px-1 rounded" style={{ background: 'var(--color-surface-tertiary)' }}>sudo apt install g++</code>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div
        className="flex items-center gap-3 px-3 py-2 text-xs font-semibold"
        style={{
          borderBottom: '1px solid var(--color-border)',
          color: success ? '#22c55e' : '#f87171',
        }}
      >
        <span>{success ? '✓ Accepted' : stage === 'compile' ? '✗ Compilation Error' : '✗ Runtime Error'}</span>
        {time_ms !== undefined && (
          <span className="font-normal" style={{ color: 'var(--color-text-tertiary)' }}>{time_ms}ms</span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 font-mono text-xs leading-relaxed">
        {output && (
          <div>
            <div className="uppercase tracking-wider text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Output</div>
            <pre className="whitespace-pre-wrap" style={{ color: 'var(--color-text-primary)' }}>{output}</pre>
          </div>
        )}
        {error && (
          <div className={output ? 'mt-3' : ''}>
            <div className="uppercase tracking-wider text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
              {stage === 'compile' ? 'Compiler Output' : 'Stderr'}
            </div>
            <pre className="whitespace-pre-wrap" style={{ color: '#f87171' }}>{error}</pre>
          </div>
        )}
        {success && !output && !error && (
          <span className="italic" style={{ color: 'var(--color-text-tertiary)' }}>No output.</span>
        )}
      </div>
    </div>
  );
}
