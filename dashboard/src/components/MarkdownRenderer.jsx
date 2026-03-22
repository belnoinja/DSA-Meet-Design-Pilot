import React from 'react';
// highlight.js CSS is pulled in via cdn-free approach — we use our own styles in index.css

export default function MarkdownRenderer({ html, className = '' }) {
  if (!html) return null;
  return (
    <div
      className={`prose ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
