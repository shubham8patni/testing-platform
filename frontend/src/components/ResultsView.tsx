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
      
      // Load AI analysis if test is completed
      if (testResult.test_metadata.status === 'completed') {
        loadAIAnalysis(testResult);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load test results');
    }
    setLoading(false);
  };

  const loadAIAnalysis = async (testResult: TestResult) => {
    try {
      setAILoading(true);
      const analysis = await apiClient.post('/ai/analyze-differences', {
        expected: testResult.plan_results || {},
        actual: testResult.plan_results || {}, // Use same data for demo
        custom_prompt: testResult.test_metadata?.ai_prompt || 'Standard analysis'
      });
      setAIAnalysis(analysis);
    } catch (error: any) {
      console.error('AI analysis failed:', error);
      setAIAnalysis({
        differences: [],
        summary: 'AI analysis unavailable',
        recommendations: [],
        model_used: 'none',
        confidence: 'low'
      });
    }
    setAILoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'failed': return '#dc3545';
      case 'running': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return '#28a745';
      case 'medium': return '#ffc107';
      case 'low': return '#6c757d';
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

      {/* AI Analysis Section */}
      {result.test_metadata.status === 'completed' && (
        <div className="ai-analysis">
          <h3>AI Analysis</h3>
          {aiLoading ? (
            <div className="ai-loading">
              <span>🤖 Analyzing differences with AI...</span>
            </div>
          ) : aiAnalysis ? (
            <div className="ai-results">
              <div className="ai-summary">
                <h4>Summary</h4>
                <p>{aiAnalysis.summary}</p>
                <div className="ai-confidence">
                  <span>Model: {aiAnalysis.model_used}</span>
                  <span 
                    className="confidence-badge"
                    style={{ backgroundColor: getConfidenceColor(aiAnalysis.confidence) }}
                  >
                    {aiAnalysis.confidence} confidence
                  </span>
                </div>
              </div>
              
              {aiAnalysis.differences.length > 0 && (
                <div className="differences-section">
                  <h4>Differences Found</h4>
                  <div className="differences-list">
                    {aiAnalysis.differences.map((diff, index) => (
                      <div key={index} className="difference-item">
                        <span className={`diff-severity ${diff.severity}`}>
                          {diff.field}
                        </span>
                        <div className="diff-details">
                          {diff.type === 'value_mismatch' && (
                            <div>
                              <p><strong>Expected:</strong> {diff.expected}</p>
                              <p><strong>Actual:</strong> {diff.actual}</p>
                            </div>
                          )}
                          {diff.type === 'missing_field' && (
                            <div>
                              <p><strong>Missing Field:</strong> {diff.field}</p>
                              <p><strong>Expected Value:</strong> {diff.expected}</p>
                            </div>
                          )}
                          {diff.type === 'extra_field' && (
                            <div>
                              <p><strong>Extra Field:</strong> {diff.field}</p>
                              <p><strong>Value:</strong> {diff.value}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                <div className="recommendations-section">
                  <h4>Recommendations</h4>
                  <ul>
                    {aiAnalysis.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="ai-error">
              <p>AI analysis unavailable. See basic comparison above.</p>
            </div>
          )}
        </div>
      )}

      <div className="actions">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          New Test
        </button>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print Results
        </button>
        {result.test_metadata.status === 'completed' && aiAnalysis && (
          <button 
            className="btn btn-secondary" 
            onClick={loadAIAnalysis}
            disabled={aiLoading}
          >
            🔄 Refresh AI Analysis
          </button>
        )}
      </div>
    </div>
  );
};