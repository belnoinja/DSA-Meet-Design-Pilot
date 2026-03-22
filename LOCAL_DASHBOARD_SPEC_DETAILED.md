# dsa-meets-design Local Dashboard — Detailed Technical Spec
> **Author:** Jatin Kaushal | **Version:** 1.0 | **Date:** March 2026  
> **Status:** Ready for Development  
> **Build tool:** Hand this entire doc to Claude Code with: "Build this. Follow the spec exactly."  
> **Estimated build time:** 4-5 days

---

## Table of Contents

1. [Overview](#1-overview)
2. [User Experience Flow](#2-user-experience-flow)
3. [Tech Stack & Dependencies](#3-tech-stack--dependencies)
4. [Project File Structure](#4-project-file-structure)
5. [Data Model](#5-data-model)
6. [API Specification](#6-api-specification)
7. [Frontend — Pages & Components](#7-frontend--pages--components)
8. [Visual Design System](#8-visual-design-system)
9. [Page 1: Dashboard (Home)](#9-page-1-dashboard)
10. [Page 2: Problem View](#10-page-2-problem-view)
11. [Page 3: Pattern Primer View](#11-page-3-pattern-primer-view)
12. [Page 4: Stats View](#12-page-4-stats-view)
13. [Startup & Build Configuration](#13-startup--build-configuration)
14. [Error Handling & Edge Cases](#14-error-handling--edge-cases)
15. [Future P1 Extensions](#15-future-p1-extensions)

---

## 1. Overview

### What this is

A local web dashboard that runs on the user's machine. It provides a LeetCode-like browsing and progress tracking experience for the dsa-meets-design repo. Users browse problems, track their progress, read rendered READMEs and DESIGN.md files — all in a clean web UI.

### What this is NOT

- Not deployed anywhere. Runs on `localhost:3000` only.
- Not a code editor. Users write code in their own IDE (VS Code, CLion, etc.)
- Not a test runner (in MVP). Users run `./run-tests.sh` in their terminal.
- Not a database. Progress is a local JSON file.

### The single startup experience

```bash
git clone https://github.com/USERNAME/dsa-meets-design.git
cd dsa-meets-design
npm install
npm start
# → opens http://localhost:3000 in default browser
```

That's it. Three commands from clone to dashboard.

---

## 2. User Experience Flow

```
User runs `npm start`
    → Express server starts on port 3000
    → Browser opens automatically to localhost:3000
    → Dashboard loads with all problems from problems.yml

User sees:
    → Progress ring (X/Y solved)
    → Stat cards (Tier 1: X/Y, Tier 2: X/Y, Tier 3: X/Y, Primers: X/Y)
    → Problem table (filterable by tier, pattern, company, status)
    → Pattern primers section at bottom

User clicks a problem row:
    → Problem view opens
    → README.md rendered as HTML (with "Before You Code" section)
    → Status buttons: Unsolved → Attempted → Solved
    → Notes field (saves to progress.json)
    → Terminal command to copy: ./run-tests.sh 001-payment-ranker cpp
    → Links to DESIGN.md (gated: "mark as attempted first") and AI_REVIEW_PROMPT.md

User goes to their IDE:
    → Edits solution.cpp
    → Runs ./run-tests.sh in terminal
    → Comes back to dashboard
    → Marks problem as solved
    → Progress ring updates

User clicks "Stats":
    → Sees progress breakdown by tier
    → Sees patterns practiced chart
    → Sees streak and estimated time
```

---

## 3. Tech Stack & Dependencies

### Backend

| Dependency | Version | Purpose |
|-----------|---------|---------|
| `express` | ^4.18 | HTTP server |
| `marked` | ^12.0 | Markdown → HTML rendering |
| `marked-highlight` | ^2.1 | Syntax highlighting in code blocks |
| `highlight.js` | ^11.9 | Syntax highlighter (used by marked-highlight) |
| `js-yaml` | ^4.1 | Parse problems.yml |
| `open` | ^10.0 | Auto-open browser on startup |
| `chokidar` | ^3.6 | Watch progress.json for external changes (optional, nice-to-have) |

### Frontend

| Dependency | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Tailwind CSS | Utility-first styling |
| React Router | Client-side routing (dashboard, problem view, stats) |
| Vite | Build tool + dev server for frontend |

### Why React + Vite (not served from Express directly)

The Express server is the API layer (serves data, renders markdown). The React frontend is a separate Vite app that gets built to static files and served by Express in production mode. During development, Vite dev server runs on port 5173 and proxies API calls to Express on port 3000.

**In production (what the user experiences):**
```
npm run build    ← builds React app to dashboard/dist/
npm start        ← Express serves API + static files from dashboard/dist/
```

**For the user, it's still just `npm install && npm start`.** The `npm start` script handles the build step if `dashboard/dist/` doesn't exist.

---

## 4. Project File Structure

Everything dashboard-related lives inside a `dashboard/` folder in the repo root:

```
dsa-meets-design/
├── ... (existing repo files: problems/, patterns/, lib/, etc.)
│
├── dashboard/                         ← ALL dashboard code lives here
│   ├── server.js                      ← Express API server (one file)
│   ├── package.json                   ← Dashboard dependencies
│   │
│   ├── src/                           ← React frontend source
│   │   ├── main.jsx                   ← Entry point
│   │   ├── App.jsx                    ← Router + layout
│   │   ├── index.css                  ← Tailwind imports + custom styles
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          ← Home page (progress + problem table)
│   │   │   ├── ProblemView.jsx        ← Single problem view (README + status)
│   │   │   ├── PrimerView.jsx         ← Pattern primer viewer
│   │   │   └── Stats.jsx              ← Progress stats page
│   │   │
│   │   ├── components/
│   │   │   ├── ProgressRing.jsx       ← Circular progress indicator
│   │   │   ├── StatCard.jsx           ← Tier/primer stat cards
│   │   │   ├── ProblemTable.jsx       ← Filterable problem table
│   │   │   ├── FilterBar.jsx          ← Tier/pattern/company/status filters
│   │   │   ├── StatusToggle.jsx       ← Unsolved/Attempted/Solved buttons
│   │   │   ├── PatternBadge.jsx       ← Colored pattern name badge
│   │   │   ├── TierBadge.jsx          ← Tier indicator badge
│   │   │   ├── PrimerList.jsx         ← Pattern primers checklist
│   │   │   ├── MarkdownRenderer.jsx   ← Displays rendered markdown from API
│   │   │   ├── CopyCommand.jsx        ← Terminal command with copy button
│   │   │   ├── Navbar.jsx             ← Top navigation bar
│   │   │   └── CTABanner.jsx          ← Topmate CTA banner
│   │   │
│   │   └── lib/
│   │       ├── api.js                 ← API client (fetch wrapper)
│   │       └── constants.js           ← Pattern colors, tier labels, etc.
│   │
│   ├── vite.config.js                 ← Vite configuration (proxy to Express)
│   ├── tailwind.config.js             ← Tailwind configuration
│   ├── postcss.config.js              ← PostCSS for Tailwind
│   ├── index.html                     ← Vite HTML entry point
│   └── dist/                          ← Built frontend (generated, gitignored)
│
├── progress.json                      ← User's local progress (gitignored)
│
├── package.json                       ← Root package.json (startup scripts only)
└── .gitignore                         ← Includes progress.json and dashboard/dist/
```

### Why `dashboard/` is a subfolder (not root level)

The repo's primary identity is the problem content. The dashboard is a tool *for* the content. Keeping it in a subfolder means:
- The repo root stays clean (problems/, patterns/, README.md)
- Users who don't want the dashboard can ignore it entirely
- The dashboard has its own package.json and dependencies, isolated from the repo

### Root `package.json` (thin wrapper)

```json
{
  "name": "dsa-meets-design",
  "version": "1.0.0",
  "description": "The DSA + Design Pattern Integration You Were Never Taught",
  "scripts": {
    "install": "cd dashboard && npm install",
    "build": "cd dashboard && npm run build",
    "start": "cd dashboard && npm start",
    "dev": "cd dashboard && npm run dev"
  }
}
```

User runs `npm install` at root → installs dashboard dependencies.
User runs `npm start` at root → starts the dashboard.

---

## 5. Data Model

### 5.1 Source: `docs/_data/problems.yml` (read-only)

The dashboard reads this file on startup. Same file used by GitHub Pages. Adding a new problem to this file automatically makes it appear in the dashboard.

```yaml
- id: "001-payment-ranker"
  name: "Payment Method Ranker"
  tier: 1
  patterns: ["Strategy", "Comparator"]
  dsa: "Sorting"
  companies: ["Amazon", "Flipkart"]
  time_minutes: 45
  languages: ["cpp"]
  prerequisite_primer: "strategy"
  path: "problems/tier1-foundation/001-payment-ranker"

- id: "004-vending-machine"
  name: "Vending Machine"
  tier: 1
  patterns: ["State"]
  dsa: "HashMap"
  companies: ["Amazon", "Flipkart"]
  time_minutes: 45
  languages: ["cpp"]
  prerequisite_primer: "state"
  path: "problems/tier1-foundation/004-vending-machine"
```

### 5.2 Progress: `progress.json` (read-write, gitignored)

Auto-created on first status update. Lives in repo root (not inside dashboard/).

```json
{
  "version": 1,
  "created_at": "2026-04-01T10:00:00Z",
  "updated_at": "2026-04-05T14:30:00Z",
  "problems": {
    "001-payment-ranker": {
      "status": "solved",
      "started_at": "2026-04-02T09:00:00Z",
      "completed_at": "2026-04-02T10:30:00Z",
      "notes": "Used Strategy pattern. Extension 2 tricky — had to refactor."
    },
    "004-vending-machine": {
      "status": "attempted",
      "started_at": "2026-04-03T11:00:00Z",
      "completed_at": null,
      "notes": ""
    }
  },
  "primers_read": ["strategy", "state"]
}
```

**Status values:** Problems not in the file are `unsolved`. Explicit values: `"attempted"`, `"solved"`.

**Concurrency:** The file is only written by the Express server. No concurrent writers. Simple read-modify-write is sufficient.

### 5.3 Pattern Primers Metadata

Derived from the `patterns/` directory. The server scans for `*.md` files (excluding README.md) and extracts the filename as the primer name.

```json
[
  { "name": "strategy", "file": "patterns/strategy.md" },
  { "name": "state", "file": "patterns/state.md" },
  { "name": "observer", "file": "patterns/observer.md" }
]
```

---

## 6. API Specification

Base URL: `http://localhost:3000/api`

### `GET /api/problems`

Returns all problems with their progress status merged in.

**Response:**

```json
{
  "problems": [
    {
      "id": "001-payment-ranker",
      "name": "Payment Method Ranker",
      "tier": 1,
      "patterns": ["Strategy", "Comparator"],
      "dsa": "Sorting",
      "companies": ["Amazon", "Flipkart"],
      "time_minutes": 45,
      "languages": ["cpp"],
      "prerequisite_primer": "strategy",
      "path": "problems/tier1-foundation/001-payment-ranker",
      "status": "solved",
      "started_at": "2026-04-02T09:00:00Z",
      "completed_at": "2026-04-02T10:30:00Z",
      "notes": "Used Strategy pattern."
    },
    {
      "id": "003-notification-system",
      "name": "Notification System",
      "tier": 1,
      "patterns": ["Observer"],
      "dsa": "Queue",
      "companies": ["Flipkart"],
      "time_minutes": 45,
      "languages": ["cpp"],
      "prerequisite_primer": "observer",
      "path": "problems/tier1-foundation/003-notification-system",
      "status": "unsolved",
      "started_at": null,
      "completed_at": null,
      "notes": ""
    }
  ],
  "summary": {
    "total": 10,
    "solved": 7,
    "attempted": 1,
    "unsolved": 2
  }
}
```

### `POST /api/problems/:id/status`

Update a problem's status and/or notes.

**Request body:**

```json
{
  "status": "attempted",
  "notes": "Working on Extension 1"
}
```

Both fields are optional. If only `notes` is sent, status stays unchanged. When status changes to `"attempted"` and `started_at` is null, server sets `started_at` to now. When status changes to `"solved"`, server sets `completed_at` to now.

**Response:** Updated problem object (same shape as in GET /api/problems).

### `GET /api/problems/:id/readme`

Returns the problem's README.md rendered as HTML.

**Response:**

```json
{
  "html": "<h1>Problem: Payment Method Ranker</h1><table>..."
}
```

### `GET /api/problems/:id/design`

Returns the problem's DESIGN.md rendered as HTML.

**Response:**

```json
{
  "html": "<h1>Design Walkthrough: Payment Method Ranker</h1>..."
}
```

### `GET /api/problems/:id/ai-prompt`

Returns the raw markdown content of AI_REVIEW_PROMPT.md (not rendered — user copies it as-is).

**Response:**

```json
{
  "markdown": "# Review My Solution with AI\n\nAfter attempting..."
}
```

### `GET /api/primers`

Returns all pattern primers with read status.

**Response:**

```json
{
  "primers": [
    { "name": "strategy", "read": true },
    { "name": "state", "read": true },
    { "name": "observer", "read": false },
    { "name": "singleton", "read": false },
    { "name": "composite", "read": false },
    { "name": "factory", "read": false },
    { "name": "builder", "read": false }
  ],
  "summary": {
    "total": 7,
    "read": 2
  }
}
```

### `GET /api/primers/:name`

Returns a primer's markdown rendered as HTML.

**Response:**

```json
{
  "name": "strategy",
  "html": "<h1>Strategy Pattern</h1><h2>The one-line explanation</h2>...",
  "read": true
}
```

### `POST /api/primers/:name/read`

Marks a primer as read.

**Request body:** None (empty POST).

**Response:**

```json
{
  "name": "strategy",
  "read": true
}
```

### `GET /api/stats`

Returns aggregated statistics for the stats page.

**Response:**

```json
{
  "overall": {
    "total": 10,
    "solved": 7,
    "attempted": 1,
    "unsolved": 2,
    "percent_complete": 70
  },
  "by_tier": {
    "1": { "total": 10, "solved": 7, "attempted": 1, "unsolved": 2 },
    "2": { "total": 0, "solved": 0, "attempted": 0, "unsolved": 0 },
    "3": { "total": 0, "solved": 0, "attempted": 0, "unsolved": 0 }
  },
  "by_pattern": {
    "Strategy": { "solved": 4, "attempted": 0, "total": 5 },
    "Observer": { "solved": 2, "attempted": 1, "total": 3 },
    "State": { "solved": 1, "attempted": 0, "total": 2 }
  },
  "primers": {
    "total": 7,
    "read": 2
  },
  "streak": {
    "current_days": 5,
    "last_activity": "2026-04-05"
  }
}
```

---

## 7. Frontend — Pages & Components

### Route Structure

| Route | Page | Component |
|-------|------|-----------|
| `/` | Dashboard (home) | `Dashboard.jsx` |
| `/problem/:id` | Problem view | `ProblemView.jsx` |
| `/primer/:name` | Pattern primer view | `PrimerView.jsx` |
| `/stats` | Progress stats | `Stats.jsx` |

### Component Tree

```
App.jsx
├── Navbar (always visible)
│   ├── Logo + repo name
│   ├── Nav links: Dashboard | Stats
│   └── Overall progress indicator (small)
│
├── Dashboard.jsx
│   ├── ProgressRing (circular, X/Y solved)
│   ├── StatCard × 4 (Tier 1, Tier 2, Tier 3, Primers)
│   ├── FilterBar (tier, pattern, company, status dropdowns)
│   ├── ProblemTable
│   │   └── Row × N
│   │       ├── Status icon (✓ / ○ / ~)
│   │       ├── Problem number + name (clickable → /problem/:id)
│   │       ├── PatternBadge × N
│   │       ├── TierBadge
│   │       └── Company name
│   ├── PrimerList (bottom section)
│   │   └── Primer × 7 (name + read/unread, clickable → /primer/:name)
│   └── CTABanner
│
├── ProblemView.jsx
│   ├── Back button (→ /)
│   ├── Problem header (name, tier, patterns, companies, time)
│   ├── Prerequisite primer link
│   ├── MarkdownRenderer (README.md content)
│   ├── StatusToggle (Unsolved / Attempted / Solved)
│   ├── Notes textarea + save button
│   ├── CopyCommand (./run-tests.sh ... cpp)
│   ├── DESIGN.md link (gated behind "attempted" status)
│   ├── AI_REVIEW_PROMPT.md link
│   └── CTABanner
│
├── PrimerView.jsx
│   ├── Back button (→ /)
│   ├── MarkdownRenderer (primer content)
│   ├── "Mark as read" button
│   └── Link to related problems
│
└── Stats.jsx
    ├── Overall progress ring (large)
    ├── Tier breakdown bars
    ├── Pattern distribution chart (horizontal bars)
    ├── Primers progress
    └── Streak indicator
```

---

## 8. Visual Design System

### Style: LeetCode structure + Notion aesthetic

**Principles:**
- White/light background, generous whitespace
- Subtle borders (`1px solid #e5e5e5`), no shadows
- System font stack (no custom fonts to load)
- Colored badges for patterns (soft pastel background + dark text from same hue)
- Clean table layout for problems (LeetCode-inspired)
- Circular progress ring (LeetCode-inspired)
- Stat cards with tier breakdowns

### Tailwind Theme Extensions (`tailwind.config.js`)

```js
module.exports = {
  content: ['./src/**/*.{js,jsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        // Base
        surface: '#ffffff',
        'surface-secondary': '#fafafa',
        'surface-tertiary': '#f5f5f5',
        border: '#e5e5e5',
        'border-hover': '#d4d4d4',

        // Text
        'text-primary': '#171717',
        'text-secondary': '#525252',
        'text-tertiary': '#a3a3a3',

        // Status
        'status-solved': '#16a34a',
        'status-attempted': '#f59e0b',
        'status-unsolved': '#d4d4d4',

        // Accent
        accent: '#2563eb',
        'accent-light': '#eff6ff',
      }
    }
  }
}
```

### Pattern Badge Colors

Each design pattern gets a consistent color throughout the UI:

```js
// src/lib/constants.js
export const PATTERN_COLORS = {
  'Strategy':   { bg: '#eff6ff', text: '#1e40af' },  // blue
  'Observer':   { bg: '#ecfdf5', text: '#065f46' },  // green
  'State':      { bg: '#fffbeb', text: '#92400e' },  // amber
  'Singleton':  { bg: '#fef2f2', text: '#991b1b' },  // red
  'Factory':    { bg: '#f5f3ff', text: '#5b21b6' },  // purple
  'Composite':  { bg: '#ecfeff', text: '#155e75' },  // cyan
  'Builder':    { bg: '#fdf4ff', text: '#86198f' },  // pink
  'Comparator': { bg: '#f0fdf4', text: '#166534' },  // emerald
  'Decorator':  { bg: '#fff7ed', text: '#9a3412' },  // orange
  'Command':    { bg: '#faf5ff', text: '#6b21a8' },  // violet
};

export const TIER_COLORS = {
  1: { bg: '#ecfdf5', text: '#065f46', label: 'T1' },  // green — foundation
  2: { bg: '#fffbeb', text: '#92400e', label: 'T2' },  // amber — intermediate
  3: { bg: '#fef2f2', text: '#991b1b', label: 'T3' },  // red — advanced
};

export const STATUS_ICONS = {
  solved:    { icon: '✓', color: '#16a34a' },
  attempted: { icon: '~', color: '#f59e0b' },
  unsolved:  { icon: '○', color: '#d4d4d4' },
};
```

---

## 9. Page 1: Dashboard (Home)

### Layout (top to bottom)

**Section 1: Header row**
- Left: Progress ring (72px) showing X/Y solved, percentage inside
- Right: Repo name "dsa-meets-design" + subtitle "Your LLD interview prep dashboard"

**Section 2: Stat cards row** (4 cards, equal width, horizontal)
- Tier 1: `X/Y` (green number if >0, gray if 0)
- Tier 2: `X/Y`
- Tier 3: `X/Y`
- Primers: `X/Y`
- Each card: light gray background, small uppercase label, large number below

**Section 3: Filter bar**
- Row of filter controls:
  - Tier: `[All] [Tier 1] [Tier 2] [Tier 3]` — toggle buttons
  - Pattern: dropdown select → `All patterns`, `Strategy`, `Observer`, `State`, etc.
  - Company: dropdown select → `All companies`, `Amazon`, `Flipkart`, etc.
  - Status: dropdown select → `All`, `Solved`, `Attempted`, `Unsolved`
- Filters are combinable (AND logic). All default to "All".

**Section 4: Problem table**

| Column | Width | Content |
|--------|-------|---------|
| Status | 40px | Icon: ✓ (green), ~ (amber), ○ (gray) |
| # | 48px | Problem number (e.g., 001) |
| Problem | flex | Problem name (bold, clickable link to `/problem/:id`) |
| Pattern | auto | Pattern badges (colored pills) |
| Tier | 48px | Tier badge (T1/T2/T3) |
| Company | 100px | First company name (text, secondary color) |
| Time | 48px | Minutes (e.g., "45m") |

- Rows are clickable (entire row navigates to `/problem/:id`)
- Hover: light background highlight
- Sorted by: problem number (default), or clickable column headers to sort

**Section 5: Pattern primers**
- Horizontal row of primer chips: `strategy ✓ | state ✓ | observer | singleton | composite | factory | builder`
- Read primers: green check, slightly bolder
- Unread primers: gray text
- Each chip is clickable → navigates to `/primer/:name`

**Section 6: CTA banner** (bottom)
- Light gray background, subtle
- "Preparing for a product company interview? Book a mock →" with link

---

## 10. Page 2: Problem View

### Layout (top to bottom)

**Header:**
- Back arrow + "Back to dashboard" (clickable, navigates to `/`)
- Problem name: large, bold (e.g., "001 — Payment method ranker")
- Metadata row: Tier badge + Pattern badges + Company names + "45 min"
- Prerequisite primer: "Prerequisite: Strategy Primer ✓" (linked to `/primer/strategy`)

**README content:**
- Full README.md rendered as HTML via API
- Code blocks with syntax highlighting (highlight.js)
- "Before You Code" section is visually distinct (light blue/gray background box)

**Action section:**

Status toggle:
```
[○ Unsolved]  [~ Attempted]  [✓ Solved]
```
Three buttons in a row. Active state is filled with the status color. Click to change.

When status changes from `unsolved` to `attempted` → `started_at` is recorded.
When status changes to `solved` → `completed_at` is recorded.
Status can go backward (solved → attempted → unsolved) — this clears the relevant timestamps.

Notes field:
```
┌──────────────────────────────────────┐
│ Your notes...                         │
│                                       │
└──────────────────────────────────────┘
                                [Save]
```
Textarea + save button. Auto-saves on blur (debounced) AND on explicit save click.

**Terminal command:**
```
┌──────────────────────────────────────────────────┐
│ ./run-tests.sh 001-payment-ranker cpp      [📋]  │
└──────────────────────────────────────────────────┘
```
Monospace font, gray background, copy button on the right. Clicking the icon copies to clipboard and shows a brief "Copied!" tooltip.

**Solution files section:**
- "View DESIGN.md" button
  - If status is `unsolved`: button is disabled, shows tooltip "Attempt the problem first"
  - If status is `attempted` or `solved`: button is enabled, navigates to rendered DESIGN.md (inline on the same page, expanding below, or a modal — either works)
- "View AI review prompt" button → shows the raw markdown in a copyable text area

**CTA banner (bottom)**

---

## 11. Page 3: Pattern Primer View

### Layout

**Header:**
- Back arrow + "Back to dashboard"
- Primer name: "Strategy pattern"

**Content:**
- Full primer markdown rendered as HTML
- Code blocks with syntax highlighting
- External links (GFG, Refactoring Guru) open in new tab

**Actions:**
- "Mark as read" button (green, becomes "Read ✓" after clicking)
- "Practice this pattern" section: links to all Tier 1 problems that use this pattern (derived from `prerequisite_primer` field in problems.yml)

---

## 12. Page 4: Stats View

### Layout

**Section 1: Overall progress**
- Large progress ring (120px), percentage inside, X/Y below
- "You've solved X of Y problems"

**Section 2: Tier breakdown**
Three horizontal progress bars, stacked:
```
Tier 1  ████████████░░░░░░  7/10  (70%)
Tier 2  ░░░░░░░░░░░░░░░░░░  0/20  (0%)
Tier 3  ░░░░░░░░░░░░░░░░░░  0/15  (0%)
```
Green fill for solved, amber for attempted, gray for unsolved.

**Section 3: Patterns practiced**
Horizontal bar chart showing how many problems solved per pattern:
```
Strategy  ██████  4
Observer  ███     2
State     ██      1
Composite ░       0
```

**Section 4: Primers**
```
Primers read: 2/7
strategy ✓  state ✓  observer  singleton  composite  factory  builder
```

**Section 5: Activity**
```
Current streak: 5 days
Last activity: April 5, 2026
```

Streak is calculated from `completed_at` and `started_at` timestamps. A "day" counts if any problem was started or completed on that date.

---

## 13. Startup & Build Configuration

### `dashboard/package.json`

```json
{
  "name": "dsa-meets-design-dashboard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"node server.js\" \"vite\"",
    "build": "vite build",
    "start": "node server.js",
    "postinstall": "npm run build"
  },
  "dependencies": {
    "express": "^4.18.0",
    "marked": "^12.0.0",
    "marked-highlight": "^2.1.0",
    "highlight.js": "^11.9.0",
    "js-yaml": "^4.1.0",
    "open": "^10.0.0"
  },
  "devDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.1.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "concurrently": "^8.2.0"
  }
}
```

### `dashboard/vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
```

### `dashboard/server.js` — Startup Logic

```js
// Pseudocode for the server startup:

1. Load problems.yml from ../docs/_data/problems.yml
2. Load progress.json from ../progress.json (create empty if not exists)
3. Scan ../patterns/*.md for primer files
4. Set up Express routes (Section 6)
5. If dist/ folder exists → serve static files from dist/
6. If dist/ folder doesn't exist → log warning: "Run 'npm run build' first"
7. Start server on port 3000 (configurable via PORT env var)
8. Auto-open browser to http://localhost:3000
9. Log: "Dashboard running at http://localhost:3000"
```

### What `npm start` does (from repo root)

```
User runs: npm start
  → root package.json: "start": "cd dashboard && npm start"
    → dashboard package.json: "start": "node server.js"
      → Express starts, serves built React app + API
      → Browser opens automatically
```

### What `npm install` does (from repo root)

```
User runs: npm install
  → root package.json: "install": "cd dashboard && npm install"
    → dashboard dependencies installed
    → postinstall: "npm run build" → Vite builds React app to dist/
```

So `git clone → npm install → npm start` just works. The build happens during install.

---

## 14. Error Handling & Edge Cases

### problems.yml doesn't exist or is malformed
- Server logs clear error: "Could not find docs/_data/problems.yml — make sure you're running from the repo root."
- Dashboard shows: "No problems found. Check that docs/_data/problems.yml exists."

### progress.json doesn't exist
- Server creates it with empty default: `{ "version": 1, "problems": {}, "primers_read": [] }`
- Dashboard shows all problems as unsolved (correct behavior)

### progress.json is corrupted
- Server catches JSON parse error, backs up the corrupted file as `progress.json.bak`, creates fresh empty one
- Logs: "progress.json was corrupted. Backed up to progress.json.bak and created a fresh one."

### Problem README.md or DESIGN.md doesn't exist
- API returns 404 with `{ "error": "README.md not found for problem 001-payment-ranker" }`
- Frontend shows: "This problem's README hasn't been created yet."

### Port 3000 already in use
- Server catches EADDRINUSE error
- Logs: "Port 3000 is in use. Try: PORT=3001 npm start"
- Tries port 3001 automatically as fallback

### User opens dashboard before `npm install`
- The `dist/` folder won't exist. Express should log: "Frontend not built. Run 'npm install' first."

### Problems in progress.json that no longer exist in problems.yml
- Silently ignored. Progress for deleted problems stays in the file but doesn't appear in the UI.

---

## 15. Future P1 Extensions

These are NOT in the MVP. Documented here so the architecture doesn't block them.

| Feature | What Changes | Effort |
|---------|-------------|--------|
| **Test runner button** | New API endpoint `POST /api/problems/:id/run-tests` that executes `run-tests.sh`, streams output via Server-Sent Events. New `TestOutput` component in frontend. | 4-5 days |
| **In-browser code editor** | Embed Monaco editor. New API endpoints to read/write solution.cpp. | 3-4 days |
| **Timer mode** | Frontend-only. Countdown timer component on ProblemView. Configurable 45/60/90 min. | 1 day |
| **Dark mode** | Tailwind dark mode classes. Toggle button in Navbar. Preference saved in localStorage. | 1 day |
| **Export progress** | `GET /api/progress/export` returns progress as downloadable JSON or CSV. | 0.5 day |
| **Test results display** | After test runner exists: show pass/fail results inline in ProblemView with green/red test names. | 1 day |
| **Search** | Frontend-only filter. Text input in FilterBar that fuzzy-matches problem names, patterns, companies. | 0.5 day |

### Architecture decisions that enable these later:

- **API-first:** All data flows through the Express API. The frontend never reads files directly. This means adding test execution is just a new endpoint.
- **Component-based:** Each UI element is a separate React component. Adding a timer or editor is adding a component to ProblemView, not rewriting the page.
- **progress.json is versioned:** The `"version": 1` field lets us migrate the schema later without breaking existing progress files.

---

*End of spec. Hand this to Claude Code to build. Expected output: a working dashboard accessible via `npm install && npm start`.*
