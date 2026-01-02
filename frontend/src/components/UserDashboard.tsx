import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

interface TestResult {
  test_id: string;
  test_metadata: {
    status: string;
    started_at: string;
    scope: any;
    environments: {
      target: string;
      baseline: string;
    };
  };
  execution_summary: {
    total_plans: number;
    completed_plans: number;
    total_api_calls: number;
  };
}

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadUserTests(parsedUser.user_id);
  }, [navigate]);

  const loadUserTests = async (userId: string) => {
    try {
      const response = await apiClient.get(`/results/user/${userId}`);
      setTests(response.tests || []);
    } catch (error: any) {
      console.error('Failed to load user tests:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'failed': return '#dc3545';
      case 'running': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const startNewTest = () => {
    navigate('/config');
  };

  if (loading) {
    return <div className="loading">Loading your test history...</div>;
  }

  if (!user) {
    return <div className="loading">Loading user information...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user.name}!</h2>
        <p>Here are your recent test runs</p>
        <button className="btn btn-primary" onClick={startNewTest}>
          Start New Test
        </button>
      </div>

      <div className="test-history">
        <h3>Test History</h3>
        {tests.length === 0 ? (
          <div className="no-tests">
            <p>No tests run yet.</p>
            <button className="btn btn-secondary" onClick={startNewTest}>
              Run Your First Test
            </button>
          </div>
        ) : (
          <div className="tests-grid">
            {tests.map((test) => (
              <div key={test.test_id} className="test-card">
                <div className="test-header">
                  <h4>{test.test_id}</h4>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(test.test_metadata.status) }}
                  >
                    {test.test_metadata.status}
                  </span>
                </div>
                
                <div className="test-details">
                  <p><strong>Started:</strong> {new Date(test.test_metadata.started_at).toLocaleString()}</p>
                  <p><strong>Target:</strong> {test.test_metadata.environments.target}</p>
                  <p><strong>Baseline:</strong> {test.test_metadata.environments.baseline}</p>
                  <p><strong>Scope:</strong> {test.test_metadata.scope.type}</p>
                </div>

                <div className="test-summary">
                  <p><strong>Plans:</strong> {test.execution_summary.total_plans}</p>
                  <p><strong>Completed:</strong> {test.execution_summary.completed_plans}</p>
                  <p><strong>API Calls:</strong> {test.execution_summary.total_api_calls}</p>
                </div>

                <div className="test-actions">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/progress/${test.test_id}`)}
                    disabled={test.test_metadata.status === 'running'}
                  >
                    View Progress
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/results/${test.test_id}`)}
                    disabled={test.test_metadata.status === 'running'}
                  >
                    View Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-actions">
        <button className="btn btn-secondary" onClick={() => {
          localStorage.removeItem('user');
          navigate('/');
        }}>
          Logout
        </button>
      </div>
    </div>
  );
};