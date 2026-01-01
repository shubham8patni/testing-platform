import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

interface TestResult {
  test_id: string;
  test_metadata: {
    status: string;
    started_at: string;
    completed_at?: string;
    scope: any;
    environments: {
      target: string;
      baseline: string;
    };
  };
  execution_summary: {
    total_plans: number;
    completed_plans: number;
    failed_plans: number;
    total_api_calls: number;
    execution_time_minutes: number;
  };
  plan_results: {
    [plan_key: string]: {
      status: string;
      api_calls: any[];
      environment_comparison?: {
        status: string;
        differences: any[];
        target_summary: any;
        baseline_summary: any;
      };
    };
  };
}

export const ResultsView: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (testId) {
      loadResults();
    }
  }, [testId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const testResult = await apiClient.get(`/results/${testId}`);
      setResult(testResult);
    } catch (error: any) {
      setError(error.message || 'Failed to load test results');
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

  if (loading) {
    return <div className="loading">Loading results...</div>;
  }

  if (error) {
    return (
      <div className="results-view">
        <div className="error">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  if (!result) {
    return <div className="loading">No results available</div>;
  }

  return (
    <div className="results-view">
      <h2>Test Results</h2>
      
      {/* Test Summary */}
      <div className="test-summary">
        <h3>Test Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <label>Test ID:</label>
            <span>{result.test_id}</span>
          </div>
          <div className="summary-item">
            <label>Status:</label>
            <span style={{ color: getStatusColor(result.test_metadata.status) }}>
              {result.test_metadata.status}
            </span>
          </div>
          <div className="summary-item">
            <label>Started:</label>
            <span>{new Date(result.test_metadata.started_at).toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <label>Completed:</label>
            <span>
              {result.test_metadata.completed_at 
                ? new Date(result.test_metadata.completed_at).toLocaleString()
                : 'Not completed'
              }
            </span>
          </div>
          <div className="summary-item">
            <label>Target Environment:</label>
            <span>{result.test_metadata.environments.target}</span>
          </div>
          <div className="summary-item">
            <label>Baseline Environment:</label>
            <span>{result.test_metadata.environments.baseline}</span>
          </div>
        </div>
      </div>

      {/* Execution Summary */}
      <div className="execution-summary">
        <h3>Execution Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <label>Total Plans:</label>
            <span>{result.execution_summary.total_plans}</span>
          </div>
          <div className="summary-item">
            <label>Completed:</label>
            <span style={{ color: '#28a745' }}>{result.execution_summary.completed_plans}</span>
          </div>
          <div className="summary-item">
            <label>Failed:</label>
            <span style={{ color: '#dc3545' }}>{result.execution_summary.failed_plans}</span>
          </div>
          <div className="summary-item">
            <label>Total API Calls:</label>
            <span>{result.execution_summary.total_api_calls}</span>
          </div>
          <div className="summary-item">
            <label>Execution Time:</label>
            <span>{result.execution_summary.execution_time_minutes} minutes</span>
          </div>
        </div>
      </div>

      {/* Plan Results */}
      <div className="plan-results">
        <h3>Plan Results</h3>
        {Object.entries(result.plan_results).map(([planKey, planData]) => (
          <div key={planKey} className="plan-result-item">
            <div className="plan-header">
              <h4>{planKey}</h4>
              <span className={`status ${planData.status}`}>{planData.status}</span>
            </div>
            
            {planData.environment_comparison && (
              <div className="environment-comparison">
                <h5>Environment Comparison</h5>
                <div className="comparison-grid">
                  <div className="env-target">
                    <h6>Target Environment</h6>
                    <p>API Calls: {planData.environment_comparison.target_summary?.api_calls}</p>
                    <p>Response Time: {planData.environment_comparison.target_summary?.total_response_time}ms</p>
                  </div>
                  <div className="env-baseline">
                    <h6>Baseline Environment</h6>
                    <p>API Calls: {planData.environment_comparison.baseline_summary?.api_calls}</p>
                    <p>Response Time: {planData.environment_comparison.baseline_summary?.total_response_time}ms</p>
                  </div>
                </div>
                <div className="comparison-status">
                  <strong>Comparison Status:</strong>
                  <span className={`status ${planData.environment_comparison.status}`}>
                    {planData.environment_comparison.status}
                  </span>
                </div>
              </div>
            )}
            
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(`/progress/${result.testId}/plan/${planKey}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="actions">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          New Test
        </button>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print Results
        </button>
      </div>
    </div>
  );
};