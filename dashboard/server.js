const express = require('express');
const path = require('path');
const fs = require('fs');
const { execFile, exec } = require('child_process');
const os = require('os');
const yaml = require('js-yaml');
const { marked } = require('marked');
const { markedHighlight } = require('marked-highlight');
const hljs = require('highlight.js');

// ─── Markdown setup ─────────────────────────────────────────────────────────

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

// ─── Paths ──────────────────────────────────────────────────────────────────

const REPO_ROOT      = path.join(__dirname, '..');
const PROBLEMS_YML   = path.join(REPO_ROOT, 'docs', '_data', 'problems.yml');
const PROGRESS_JSON  = path.join(REPO_ROOT, 'progress.json');
const PATTERNS_DIR   = path.join(REPO_ROOT, 'patterns');
const DIST_DIR       = path.join(__dirname, 'dist');

// ─── Data helpers ───────────────────────────────────────────────────────────

function loadProblems() {
  if (!fs.existsSync(PROBLEMS_YML)) {
    console.error('ERROR: Could not find docs/_data/problems.yml — make sure you\'re running from the repo root.');
    return [];
  }
  try {
    const raw = fs.readFileSync(PROBLEMS_YML, 'utf8');
    return yaml.load(raw) || [];
  } catch (e) {
    console.error('ERROR: Failed to parse problems.yml:', e.message);
    return [];
  }
}

function loadProgress() {
  if (!fs.existsSync(PROGRESS_JSON)) {
    return createEmptyProgress();
  }
  try {
    const raw = fs.readFileSync(PROGRESS_JSON, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    const backupPath = PROGRESS_JSON + '.bak';
    console.error(`progress.json was corrupted. Backed up to progress.json.bak and created a fresh one.`);
    try { fs.copyFileSync(PROGRESS_JSON, backupPath); } catch (_) {}
    const fresh = createEmptyProgress();
    saveProgress(fresh);
    return fresh;
  }
}

function createEmptyProgress() {
  return {
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problems: {},
    primers_read: [],
  };
}

function saveProgress(data) {
  data.updated_at = new Date().toISOString();
  fs.writeFileSync(PROGRESS_JSON, JSON.stringify(data, null, 2), 'utf8');
}

function loadPrimers() {
  if (!fs.existsSync(PATTERNS_DIR)) return [];
  return fs.readdirSync(PATTERNS_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .map(f => ({
      name: path.basename(f, '.md'),
      file: path.join(PATTERNS_DIR, f),
    }));
}

function renderMarkdown(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  return marked(raw);
}

function extractBeforeYouCode(rawMarkdown) {
  const lines = rawMarkdown.split('\n');
  let start = -1, end = -1;
  for (let i = 0; i < lines.length; i++) {
    if (start === -1 && /^#+\s*Before You Code/i.test(lines[i])) {
      start = i;
    } else if (start !== -1 && i > start && /^#+\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (start === -1) return null;
  return marked(lines.slice(start, end === -1 ? undefined : end).join('\n'));
}

function stripBeforeYouCode(rawMarkdown) {
  const lines = rawMarkdown.split('\n');
  let start = -1, end = -1;
  for (let i = 0; i < lines.length; i++) {
    if (start === -1 && /^#+\s*Before You Code/i.test(lines[i])) {
      start = i;
    } else if (start !== -1 && i > start && /^#+\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (start === -1) return rawMarkdown;
  const kept = [...lines.slice(0, start), ...(end === -1 ? [] : lines.slice(end))];
  return kept.join('\n');
}

function mergeProblemWithProgress(problem, progress, primersRead) {
  const p = progress.problems[problem.id] || {};
  const primerName = problem.prerequisite_primer;
  return {
    ...problem,
    status:       p.status       || 'unsolved',
    started_at:   p.started_at   || null,
    completed_at: p.completed_at || null,
    notes:        p.notes        || '',
    ext1:         p.ext1         || false,
    ext2:         p.ext2         || false,
    primer_read:  primerName ? (primersRead || []).includes(primerName) : null,
  };
}

function buildSummary(mergedProblems) {
  const total     = mergedProblems.length;
  const solved    = mergedProblems.filter(p => p.status === 'solved').length;
  const attempted = mergedProblems.filter(p => p.status === 'attempted').length;
  const unsolved  = total - solved - attempted;
  const ext1_count = mergedProblems.filter(p => p.ext1).length;
  const ext2_count = mergedProblems.filter(p => p.ext2).length;
  return { total, solved, attempted, unsolved, ext1_count, ext2_count };
}

function calculateStreak(progress) {
  const dates = new Set();
  for (const p of Object.values(progress.problems)) {
    if (p.started_at)   dates.add(p.started_at.slice(0, 10));
    if (p.completed_at) dates.add(p.completed_at.slice(0, 10));
  }
  if (dates.size === 0) return { current_days: 0, last_activity: null };

  const sorted = [...dates].sort().reverse();
  const lastActivity = sorted[0];

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (lastActivity !== today && lastActivity !== yesterday) {
    return { current_days: 0, last_activity: lastActivity };
  }

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev - curr) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return { current_days: streak, last_activity: lastActivity };
}

// ─── Express app ────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());

// ── GET /api/problems ────────────────────────────────────────────────────────

app.get('/api/problems', (req, res) => {
  const problems    = loadProblems();
  const progress    = loadProgress();
  const primersRead = progress.primers_read || [];
  const merged      = problems.map(p => mergeProblemWithProgress(p, progress, primersRead));
  const summary     = buildSummary(merged);
  res.json({ problems: merged, summary });
});

// ── POST /api/problems/:id/status ────────────────────────────────────────────

app.post('/api/problems/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const problems = loadProblems();
  const problem  = problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: `Problem ${id} not found` });

  const progress = loadProgress();
  const entry    = progress.problems[id] || {};

  if (status !== undefined) {
    const prev = entry.status || 'unsolved';
    entry.status = status;

    if (status === 'attempted' && prev === 'unsolved' && !entry.started_at) {
      entry.started_at = new Date().toISOString();
    }
    if (status === 'solved') {
      if (!entry.started_at) entry.started_at = new Date().toISOString();
      entry.completed_at = new Date().toISOString();
    }
    if (status === 'unsolved') {
      entry.started_at   = null;
      entry.completed_at = null;
    }
    if (status === 'attempted' && prev === 'solved') {
      entry.completed_at = null;
    }
  }

  if (notes !== undefined) {
    entry.notes = notes;
  }

  progress.problems[id] = entry;
  saveProgress(progress);

  const primersRead = progress.primers_read || [];
  res.json(mergeProblemWithProgress(problem, progress, primersRead));
});

// ── POST /api/problems/:id/extension ─────────────────────────────────────────

app.post('/api/problems/:id/extension', (req, res) => {
  const { id } = req.params;
  const { ext, completed } = req.body; // ext: 1 or 2, completed: boolean

  if (ext !== 1 && ext !== 2) return res.status(400).json({ error: 'ext must be 1 or 2' });

  const problems = loadProblems();
  const problem  = problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: `Problem ${id} not found` });

  const progress = loadProgress();
  const entry    = progress.problems[id] || {};
  entry[`ext${ext}`] = !!completed;
  progress.problems[id] = entry;
  saveProgress(progress);

  const primersRead = progress.primers_read || [];
  res.json(mergeProblemWithProgress(problem, progress, primersRead));
});

// ── GET /api/problems/:id/readme ─────────────────────────────────────────────

app.get('/api/problems/:id/readme', (req, res) => {
  const { id } = req.params;
  const problems = loadProblems();
  const problem  = problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: `Problem ${id} not found` });

  const filePath = path.join(REPO_ROOT, problem.path, 'README.md');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: `README.md not found for problem ${id}` });

  const raw = fs.readFileSync(filePath, 'utf8');
  const before_you_code = extractBeforeYouCode(raw);
  const html = marked(stripBeforeYouCode(raw));

  res.json({ html, before_you_code });
});

// ── GET /api/problems/:id/design ─────────────────────────────────────────────

app.get('/api/problems/:id/design', (req, res) => {
  const { id } = req.params;
  const problems = loadProblems();
  const problem  = problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: `Problem ${id} not found` });

  const filePath = path.join(REPO_ROOT, problem.path, 'DESIGN.md');
  const html = renderMarkdown(filePath);
  if (!html) return res.status(404).json({ error: `DESIGN.md not found for problem ${id}` });

  res.json({ html });
});

// ── GET /api/problems/:id/ai-prompt ──────────────────────────────────────────

app.get('/api/problems/:id/ai-prompt', (req, res) => {
  const { id } = req.params;
  const problems = loadProblems();
  const problem  = problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: `Problem ${id} not found` });

  const filePath = path.join(REPO_ROOT, problem.path, 'AI_REVIEW_PROMPT.md');
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `AI_REVIEW_PROMPT.md not found for problem ${id}` });
  }
  const markdown = fs.readFileSync(filePath, 'utf8');
  res.json({ markdown });
});

// ── GET /api/primers ──────────────────────────────────────────────────────────

app.get('/api/primers', (req, res) => {
  const primers  = loadPrimers();
  const progress = loadProgress();
  const read     = new Set(progress.primers_read || []);

  const result = primers.map(p => ({ name: p.name, read: read.has(p.name) }));
  const summary = { total: result.length, read: result.filter(p => p.read).length };
  res.json({ primers: result, summary });
});

// ── GET /api/primers/:name ────────────────────────────────────────────────────

app.get('/api/primers/:name', (req, res) => {
  const { name } = req.params;
  const primers  = loadPrimers();
  const primer   = primers.find(p => p.name === name);
  if (!primer) return res.status(404).json({ error: `Primer '${name}' not found` });

  const html     = renderMarkdown(primer.file);
  const progress = loadProgress();
  const read     = (progress.primers_read || []).includes(name);

  res.json({ name, html, read });
});

// ── POST /api/primers/:name/read ─────────────────────────────────────────────

app.post('/api/primers/:name/read', (req, res) => {
  const { name } = req.params;
  const primers  = loadPrimers();
  if (!primers.find(p => p.name === name)) {
    return res.status(404).json({ error: `Primer '${name}' not found` });
  }

  const progress = loadProgress();
  if (!progress.primers_read) progress.primers_read = [];
  if (!progress.primers_read.includes(name)) {
    progress.primers_read.push(name);
  }
  saveProgress(progress);
  res.json({ name, read: true });
});

// ── GET /api/stats ────────────────────────────────────────────────────────────

app.get('/api/stats', (req, res) => {
  const problems    = loadProblems();
  const progress    = loadProgress();
  const primersRead = progress.primers_read || [];
  const merged      = problems.map(p => mergeProblemWithProgress(p, progress, primersRead));

  const overall = buildSummary(merged);
  overall.percent_complete = overall.total > 0
    ? Math.round((overall.solved / overall.total) * 100)
    : 0;

  // by_tier
  const by_tier = { 1: null, 2: null, 3: null };
  for (const tier of [1, 2, 3]) {
    const tier_problems = merged.filter(p => p.tier === tier);
    by_tier[tier] = buildSummary(tier_problems);
  }

  // by_pattern
  const by_pattern = {};
  for (const p of merged) {
    for (const pattern of (p.patterns || [])) {
      if (!by_pattern[pattern]) by_pattern[pattern] = { solved: 0, attempted: 0, total: 0 };
      by_pattern[pattern].total++;
      if (p.status === 'solved')   by_pattern[pattern].solved++;
      if (p.status === 'attempted') by_pattern[pattern].attempted++;
    }
  }

  // primers
  const primers = loadPrimers();
  const readSet  = new Set(progress.primers_read || []);
  const primersStats = { total: primers.length, read: [...readSet].length };

  // streak
  const streak = calculateStreak(progress);

  res.json({ overall, by_tier, by_pattern, primers: primersStats, streak });
});

// ── GET /api/problems/:id/solution ───────────────────────────────────────────

const DEFAULT_SOLUTION = `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
using namespace std;

// TODO: Implement your solution here

int main() {
    // Test your implementation
    cout << "Hello, DSA + Design!" << endl;
    return 0;
}
`;

app.get('/api/problems/:id/solution', (req, res) => {
  const { id } = req.params;
  const problems = loadProblems();
  const problem  = problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: `Problem ${id} not found` });

  const filePath = path.join(REPO_ROOT, problem.path, 'solution.cpp');
  const code = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, 'utf8')
    : DEFAULT_SOLUTION;

  res.json({ code, language: 'cpp', exists: fs.existsSync(filePath) });
});

// ── POST /api/problems/:id/solution ──────────────────────────────────────────

app.post('/api/problems/:id/solution', (req, res) => {
  const { id } = req.params;
  const { code } = req.body;
  if (typeof code !== 'string') return res.status(400).json({ error: 'code must be a string' });

  const problems = loadProblems();
  const problem  = problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: `Problem ${id} not found` });

  const filePath = path.join(REPO_ROOT, problem.path, 'solution.cpp');
  fs.writeFileSync(filePath, code, 'utf8');
  res.json({ saved: true });
});

// ── POST /api/problems/:id/run ────────────────────────────────────────────────

app.post('/api/problems/:id/run', (req, res) => {
  const { id } = req.params;
  const { code } = req.body;
  if (typeof code !== 'string') return res.status(400).json({ error: 'code must be a string' });

  // Write code to a temp file
  const tmpDir    = os.tmpdir();
  const srcFile   = path.join(tmpDir, `dsa_solution_${id}.cpp`);
  const binFile   = path.join(tmpDir, `dsa_solution_${id}${os.platform() === 'win32' ? '.exe' : ''}`);
  const startTime = Date.now();

  fs.writeFileSync(srcFile, code, 'utf8');

  // Step 1: Compile
  const compileCmd = `g++ -std=c++17 -Wall -o "${binFile}" "${srcFile}" 2>&1`;
  exec(compileCmd, { timeout: 15000 }, (compileErr, compileOut) => {
    if (compileErr) {
      return res.json({
        success: false,
        stage: 'compile',
        output: '',
        error: compileOut || compileErr.message,
        time_ms: Date.now() - startTime,
      });
    }

    // Step 2: Run
    exec(`"${binFile}"`, { timeout: 10000 }, (runErr, stdout, stderr) => {
      // Clean up
      try { fs.unlinkSync(srcFile); } catch (_) {}
      try { fs.unlinkSync(binFile); } catch (_) {}

      if (runErr && runErr.killed) {
        return res.json({
          success: false,
          stage: 'run',
          output: stdout || '',
          error: 'Execution timed out (10s limit)',
          time_ms: Date.now() - startTime,
        });
      }

      res.json({
        success: !runErr,
        stage: 'run',
        output: stdout || '',
        error: stderr || (runErr ? runErr.message : ''),
        time_ms: Date.now() - startTime,
      });
    });
  });
});

// ── Static frontend ───────────────────────────────────────────────────────────

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('<h2>Frontend not built. Run <code>npm install</code> first.</h2>');
  });
}

// ── Start server ──────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT || '3000', 10);

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Dashboard running at http://localhost:${port}`);
    // Auto-open browser (open is ESM-only, use dynamic import)
    import('open').then(({ default: open }) => {
      open(`http://localhost:${port}`);
    }).catch(() => {
      // open is optional — don't fail if it can't load
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (port === PORT) {
        console.log(`Port ${port} is in use. Trying port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error(`Port ${port} is also in use. Try: PORT=3002 npm start`);
        process.exit(1);
      }
    } else {
      throw err;
    }
  });
}

startServer(PORT);
