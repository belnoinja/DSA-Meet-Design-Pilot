import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProblemView from './pages/ProblemView.jsx';
import PrimerView from './pages/PrimerView.jsx';
import Stats from './pages/Stats.jsx';
import Roadmap from './pages/Roadmap.jsx';
import { api } from './lib/api.js';

function AppInner() {
  const [summary, setSummary] = useState(null);
  const location = useLocation();
  const isProblemView = location.pathname.startsWith('/problem/');

  const refreshSummary = () => {
    api.getProblems()
      .then(data => setSummary(data.summary))
      .catch(() => {});
  };

  useEffect(() => { refreshSummary(); }, []);

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar summary={summary} />
      {isProblemView ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          <Routes>
            <Route path="/problem/:id" element={<ProblemView onProgressChange={refreshSummary} />} />
          </Routes>
        </div>
      ) : (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard onProgressChange={refreshSummary} />} />
            <Route path="/primer/:name" element={<PrimerView onProgressChange={refreshSummary} />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </main>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
