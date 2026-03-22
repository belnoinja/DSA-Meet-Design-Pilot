/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        // All semantic colors reference CSS vars — dark mode is handled in index.css
        surface:           'var(--color-surface)',
        'surface-secondary': 'var(--color-surface-secondary)',
        'surface-tertiary':  'var(--color-surface-tertiary)',
        border:            'var(--color-border)',
        'border-hover':    'var(--color-border-hover)',
        'text-primary':    'var(--color-text-primary)',
        'text-secondary':  'var(--color-text-secondary)',
        'text-tertiary':   'var(--color-text-tertiary)',
        'status-solved':   '#01b328',
        'status-attempted':'#ffb800',
        'status-unsolved': 'var(--color-status-unsolved)',
        accent:            'var(--color-accent)',
        'accent-light':    'var(--color-accent-light)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', '"Fira Code"', '"Fira Mono"', '"Roboto Mono"', 'Menlo', 'Monaco', 'Consolas', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
};
