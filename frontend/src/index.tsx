import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

// Components
import Welcome from './components/Welcome';
import UserDashboard from './components/UserDashboard';
import TestConfig from './components/TestConfig';
import TestProgress from './components/TestProgress';
import ResultsView from './components/ResultsView';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard/:userId" element={<UserDashboard />} />
          <Route path="/config/:userId" element={<TestConfig />} />
          <Route path="/progress/:testId" element={<TestProgress />} />
          <Route path="/results/:testId" element={<ResultsView />} />
        </Routes>
      </div>
    </Router>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}