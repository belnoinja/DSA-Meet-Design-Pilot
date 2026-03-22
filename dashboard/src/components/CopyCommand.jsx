import React, { useState } from 'react';

export default function CopyCommand({ command }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2 bg-surface-tertiary border border-border rounded-lg px-4 py-2.5">
      <code className="flex-1 font-mono text-sm text-text-primary select-all">{command}</code>
      <button
        onClick={handleCopy}
        title="Copy to clipboard"
        className="flex-shrink-0 relative text-text-tertiary hover:text-text-primary transition-colors"
      >
        {copied ? (
          <span className="text-xs text-status-solved font-medium">Copied!</span>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" />
          </svg>
        )}
      </button>
    </div>
  );
}
