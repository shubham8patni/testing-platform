import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Welcome } from './components/Welcome';
import { TestConfig } from './components/TestConfig';
import { TestProgress } from './components/TestProgress';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="container">
          <header className="header">
            <h1>Insurance Testing Platform</h1>
          </header>
          
          <main className="main">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/config" element={<TestConfig />} />
              <Route path="/progress/:testId" element={<TestProgress />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;