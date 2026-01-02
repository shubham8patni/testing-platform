import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Welcome } from './components/Welcome';
import { TestConfig } from './components/TestConfig';
import { TestProgress } from './components/TestProgress';
import { PlanDetails } from './components/PlanDetails';
import { ResultsView } from './components/ResultsView';
import { UserDashboard } from './components/UserDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <div className="container">
          <header className="header">
            <h1>Insurance Testing Platform</h1>
            {user && (
              <div className="user-info">
                <span>Logged in as: {user.name}</span>
              </div>
            )}
          </header>
          
          <main className="main">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/config" element={<TestConfig />} />
              <Route path="/progress/:testId" element={<TestProgress />} />
              <Route path="/progress/:testId/plan/:planKey" element={<PlanDetails />} />
              <Route path="/results/:testId" element={<ResultsView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;