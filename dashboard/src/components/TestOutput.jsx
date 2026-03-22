import React from 'react';

export default function TestOutput({ result, running }) {
  if (running) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 text-sm text-text-secondary">
        <span className="inline-block w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        Compiling and running...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="px-4 py-3 text-sm text-text-tertiary">
        Click <span className="font-semibold text-accent">Run</span> to compile and execute your code.
      </div>
    );
  }

  const { success, stage, output, error, time_ms } = result;

  // g++ not installed
  const noCompiler = error && (error.includes('not recognized') || error.includes('not found') || error.includes('No such file'));

  if (noCompiler) {
    return (
      <div className="px-4 py-3 text-sm">
        <p className="text-red-400 font-medium mb-1">g++ not found on your system.</p>
        <p className="text-text-tertiary text-xs">
          Install g++ to use the Run button:<br/>
          • <strong>Windows:</strong> Install <a className="text-accent underline" href="https://www.mingw-w64.org/" target="_blank" rel="noreferrer">MinGW-w64</a> and add to PATH<br/>
          • <strong>Mac:</strong> <code className="bg-surface-tertiary px-1 rounded">xcode-select --install</code><br/>
          • <strong>Linux:</strong> <code className="bg-surface-tertiary px-1 rounded">sudo apt install g++</code>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className={`flex items-center gap-3 px-4 py-2 border-b border-border text-xs font-medium ${
        success ? 'text-status-solved' : 'text-red-500'
      }`}>
        <span>{success ? '✓ Accepted' : stage === 'compile' ? '✗ Compilation Error' : '✗ Runtime Error'}</span>
        {time_ms !== undefined && (
          <span className="text-text-tertiary font-normal">{time_ms}ms</span>
        )}
      </div>

      {/* Output */}
      <div className="flex-1 overflow-y-auto px-4 py-2 font-mono text-xs leading-relaxed">
        {output && (
          <div>
            <div className="text-text-tertiary mb-1 uppercase tracking-wide text-xs">Output</div>
            <pre className="text-text-primary whitespace-pre-wrap">{output}</pre>
          </div>
        )}
        {error && (
          <div className={output ? 'mt-3' : ''}>
            <div className="text-text-tertiary mb-1 uppercase tracking-wide text-xs">
              {stage === 'compile' ? 'Compiler Error' : 'Stderr'}
            </div>
            <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
          </div>
        )}
        {success && !output && !error && (
          <div className="text-text-tertiary italic">No output produced.</div>
        )}
      </div>
    </div>
  );
}
