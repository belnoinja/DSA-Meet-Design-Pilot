/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        // ── Design system tokens (CSS var based) ─────────────
        'surface-bg':        'var(--color-surface-bg)',
        surface:             'var(--color-surface)',
        'surface-secondary': 'var(--color-surface-secondary)',
        'surface-elevated':  'var(--color-surface-elevated)',
        'surface-tertiary':  'var(--color-surface-tertiary)',
        border:              'var(--color-border)',
        'border-hover':      'var(--color-border-hover)',
        'text-primary':      'var(--color-text-primary)',
        'text-secondary':    'var(--color-text-secondary)',
        'text-tertiary':     'var(--color-text-tertiary)',
        accent:              'var(--color-accent)',
        'accent-hover':      'var(--color-accent-hover)',
        'accent-subtle':     'var(--color-accent-subtle)',
        'accent-light':      'var(--color-accent-light)',
        success:             'var(--color-success)',
        warning:             'var(--color-warning)',
        danger:              'var(--color-danger)',
        'status-solved':     'var(--color-success)',
        'status-attempted':  'var(--color-warning)',
        'status-unsolved':   'var(--color-status-unsolved)',

        // ── Shadcn/ui color tokens (HSL based) ──────────────
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', '"Fira Code"', '"Fira Mono"', '"Roboto Mono"', 'Menlo', 'Monaco', 'Consolas', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
};
