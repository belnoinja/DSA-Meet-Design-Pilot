const BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getProblems() {
    return request(`${BASE}/problems`);
  },

  updateStatus(id, { status, notes }) {
    return request(`${BASE}/problems/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    });
  },

  getProblemReadme(id) {
    return request(`${BASE}/problems/${id}/readme`);
  },

  getProblemDesign(id) {
    return request(`${BASE}/problems/${id}/design`);
  },

  getProblemAiPrompt(id) {
    return request(`${BASE}/problems/${id}/ai-prompt`);
  },

  getPrimers() {
    return request(`${BASE}/primers`);
  },

  getPrimer(name) {
    return request(`${BASE}/primers/${name}`);
  },

  markPrimerRead(name) {
    return request(`${BASE}/primers/${name}/read`, { method: 'POST' });
  },

  getStats() {
    return request(`${BASE}/stats`);
  },

  getSolution(id) {
    return request(`${BASE}/problems/${id}/solution`);
  },

  saveSolution(id, code) {
    return request(`${BASE}/problems/${id}/solution`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  runSolution(id, code) {
    return request(`${BASE}/problems/${id}/run`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  markExtension(id, ext, completed) {
    return request(`${BASE}/problems/${id}/extension`, {
      method: 'POST',
      body: JSON.stringify({ ext, completed }),
    });
  },
};
