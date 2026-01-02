import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserTests } from '../hooks/useApi';

const UserDashboard: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { tests, loading, error } = useUserTests(userId!);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'failed': return '#dc3545';
      case 'running': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const startNewTest = () => {
    navigate(`/config/${userId}`);
  };

  const viewResults = (testId: string) => {
    navigate(`/results/${testId}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading user tests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: '#dc3545', marginBottom: '20px' }}>
          Error loading tests: {error}
        </div>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px' }}>
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2>Test Dashboard</h2>
          <button
              onClick={startNewTest}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Start New Test
            </button>
        </div>

        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
          User: <strong>{userId}</strong> | 
          Total Tests: <strong>{tests.length}</strong>
        </div>

        {tests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            <div style={{ marginBottom: '20px', fontSize: '16px' }}>
              No tests found. Start your first test to see results here.
            </div>
            <button
                onClick={startNewTest}
                style={{
                  padding: '15px 30px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
              Start First Test
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Recent Tests</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Test ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Scope</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Target vs Baseline</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Started</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test: any, index: number) => (
                    <tr key={test.test_id} style={{ 
                      borderBottom: '1px solid #ddd',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'
                    }}>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                          {test.test_id}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          backgroundColor: getStatusColor(test.test_metadata?.status || 'unknown'),
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase' as any
                        }}>
                          {test.test_metadata?.status || 'Unknown'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {test.test_metadata?.scope?.type || 'N/A'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {test.test_metadata?.environments?.target || 'N/A'} vs {test.test_metadata?.environments?.baseline || 'N/A'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {new Date(test.test_metadata?.started_at || '').toLocaleString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                            onClick={() => viewResults(test.test_id)}
                            disabled={test.test_metadata?.status === 'running'}
                            style={{
                              padding: '4px 8px',
                              fontSize: '12px',
                              marginRight: '5px',
                              backgroundColor: test.test_metadata?.status === 'running' ? '#6c757d' : '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: test.test_metadata?.status === 'running' ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {test.test_metadata?.status === 'running' ? 'Running' : 'View'}
                          </button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;