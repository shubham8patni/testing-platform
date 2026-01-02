import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const ResultsView: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!testId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await api.getTestResult(testId);
        setResult(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [testId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'failed': return '#dc3545';
      case 'diff': return '#ffc107';
      case 'match': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const backToDashboard = () => {
    if (result?.test_metadata?.user_id) {
      navigate(`/dashboard/${result.test_metadata.user_id}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading test results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: '#dc3545', marginBottom: '20px' }}>
          {error}
        </div>
        <button onClick={backToDashboard}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const { test_metadata, execution_summary, plan_results } = result;

  return (
    <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px' }}>
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ marginBottom: '30px' }}>
          <button
              onClick={backToDashboard}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              ← Back to Dashboard
            </button>
        </div>

        <h2 style={{ marginBottom: '20px' }}>Test Results</h2>

        {/* Test Metadata */}
        <div style={{ 
          marginBottom: '30px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px' 
        }}>
          <h3 style={{ marginBottom: '15px' }}>Test Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <strong>Test ID:</strong><br/>
              <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{test_metadata.test_id}</span>
            </div>
            <div>
              <strong>Status:</strong><br/>
              <span style={{
                backgroundColor: getStatusColor(test_metadata.status),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                {test_metadata.status.toUpperCase()}
              </span>
            </div>
            <div>
              <strong>Scope:</strong><br/>
              {test_metadata.scope?.type || 'N/A'}: {test_metadata.scope?.value || 'All'}
            </div>
            <div>
              <strong>Environments:</strong><br/>
              {test_metadata.environments?.target || 'N/A'} vs {test_metadata.environments?.baseline || 'N/A'}
            </div>
            <div>
              <strong>Started:</strong><br/>
              {new Date(test_metadata.started_at).toLocaleString()}
            </div>
            {test_metadata.completed_at && (
              <div>
                <strong>Completed:</strong><br/>
                {new Date(test_metadata.completed_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Execution Summary */}
        <div style={{ 
          marginBottom: '30px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px' 
        }}>
          <h3 style={{ marginBottom: '15px' }}>Execution Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <strong>Total Plans:</strong><br/>
              <span style={{ fontSize: '24px', color: '#007bff' }}>{execution_summary.total_plans}</span>
            </div>
            <div>
              <strong>Completed:</strong><br/>
              <span style={{ fontSize: '24px', color: '#28a745' }}>{execution_summary.completed_plans}</span>
            </div>
            <div>
              <strong>Failed:</strong><br/>
              <span style={{ fontSize: '24px', color: '#dc3545' }}>{execution_summary.failed_plans}</span>
            </div>
            <div>
              <strong>API Calls:</strong><br/>
              <span style={{ fontSize: '18px', color: '#6c757d' }}>{execution_summary.total_api_calls}</span>
            </div>
            <div>
              <strong>Duration:</strong><br/>
              <span style={{ fontSize: '18px', color: '#6c757d' }}>{execution_summary.execution_time_minutes} min</span>
            </div>
          </div>
        </div>

        {/* Plan Results */}
        <div>
          <h3 style={{ marginBottom: '15px' }}>Plan Results</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
            {Object.entries(plan_results).map(([planKey, planData]: [string, any], index: number) => (
              <div key={planKey} style={{
                borderBottom: '1px solid #eee',
                padding: '15px',
                backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>{planKey}</h4>
                  <span style={{
                    backgroundColor: getStatusColor(planData.status),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {planData.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  {/* Environment Comparison */}
                  <div>
                    <h5 style={{ marginBottom: '10px' }}>Environment Comparison</h5>
                    <div style={{ 
                      padding: '10px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      <div style={{ marginBottom: '5px' }}>
                        <strong>Status:</strong> {planData.environment_comparison?.status || 'N/A'}
                      </div>
                      <div style={{ marginBottom: '5px' }}>
                        <strong>Target Calls:</strong> {planData.environment_comparison?.target_summary?.api_calls || 'N/A'}
                      </div>
                      <div style={{ marginBottom: '5px' }}>
                        <strong>Baseline Calls:</strong> {planData.environment_comparison?.baseline_summary?.api_calls || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Error Details */}
                  {planData.error && (
                    <div>
                      <h5 style={{ marginBottom: '10px', color: '#dc3545' }}>Error Details</h5>
                      <div style={{
                        padding: '10px',
                        backgroundColor: '#f8d7da',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#721c24'
                      }}>
                        {planData.error}
                      </div>
                    </div>
                  )}
                </div>

                {/* API Calls */}
                <div>
                  <h5 style={{ marginBottom: '10px' }}>API Calls ({planData.api_calls?.length || 0})</h5>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '11px' }}>
                    {planData.api_calls?.map((call: any, callIndex: number) => (
                      <div key={callIndex} style={{
                        padding: '8px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '3px',
                        marginBottom: '5px',
                        fontFamily: 'monospace'
                      }}>
                        <div style={{ marginBottom: '3px' }}>
                          <strong>{call.method} {call.endpoint}</strong> - {call.status_code}
                        </div>
                        <div style={{ color: '#666' }}>
                          {call.response_time_ms}ms | {call.response?.data || 'No data'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;