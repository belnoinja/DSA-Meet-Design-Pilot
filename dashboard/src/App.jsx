import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import ProblemList from './pages/ProblemList.jsx';
import ProblemView from './pages/ProblemView.jsx';
import PrimersList from './pages/PrimersList.jsx';
import PrimerView from './pages/PrimerView.jsx';
import Stats from './pages/Stats.jsx';
import Roadmap from './pages/Roadmap.jsx';
import { ToastProvider } from './components/Toast.jsx';
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
      <div className="flex flex-1 min-h-0">
        {/* Sidebar — hidden on problem view for full-width editor */}
        {!isProblemView && <Sidebar />}

        {isProblemView ? (
          <div className="flex-1 min-h-0 overflow-hidden">
            <Routes>
              <Route path="/problem/:id" element={<ProblemView onProgressChange={refreshSummary} />} />
            </Routes>
          </div>
        ) : (
          <main className="flex-1 min-w-0 overflow-y-auto px-6 py-6">
            <div className="max-w-5xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/problems" element={<ProblemList onProgressChange={refreshSummary} />} />
                <Route path="/primers" element={<PrimersList />} />
                <Route path="/primer/:name" element={<PrimerView onProgressChange={refreshSummary} />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/roadmap" element={<Roadmap />} />
              </Routes>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </ThemeProvider>
  );
}
