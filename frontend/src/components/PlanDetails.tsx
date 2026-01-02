import React, { useState } from 'react';

interface PlanDetailsProps {
  planKey: string;
  planData: any;
  onClose: () => void;
}

const PlanDetails: React.FC<PlanDetailsProps> = ({ planKey, planData, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'api-calls'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'failed': return '#dc3545';
      case 'diff': return '#ffc107';
      case 'match': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        maxWidth: '900px',
        maxHeight: '80vh',
        width: '90%',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          borderBottom: '1px solid #eee'
        }}>
          <h2 style={{ margin: 0 }}>Plan Details: {planKey}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              lineHeight: '1'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '0 20px 20px', maxHeight: 'calc(80vh - 80px)', overflowY: 'auto' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activeTab === 'overview' ? '2px solid #007bff' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'overview' ? 'bold' : 'normal'
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('api-calls')}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activeTab === 'api-calls' ? '2px solid #007bff' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'api-calls' ? 'bold' : 'normal'
              }}
            >
              API Calls
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '4px' 
              }}>
                <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Status</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>Plan Status:</strong><br/>
                    <span style={{
                      backgroundColor: getStatusColor(planData.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {planData.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <div>
                    <strong>API Calls:</strong><br/>
                    {planData.api_calls?.length || 0}
                  </div>
                </div>
              </div>

              {/* Environment Comparison */}
              {planData.environment_comparison && (
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '15px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px' 
                }}>
                  <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Environment Comparison</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h4 style={{ marginBottom: '10px', color: '#007bff' }}>Target Environment</h4>
                      <div style={{ 
                        padding: '10px', 
                        backgroundColor: 'white', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        <div style={{ marginBottom: '5px' }}>
                          <strong>API Calls:</strong> {planData.environment_comparison?.target_summary?.api_calls || 'N/A'}
                        </div>
                        <div style={{ marginBottom: '5px' }}>
                          <strong>Response Time:</strong> {planData.environment_comparison?.target_summary?.total_response_time || 'N/A'}ms
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ marginBottom: '10px', color: '#28a745' }}>Baseline Environment</h4>
                      <div style={{ 
                        padding: '10px', 
                        backgroundColor: 'white', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        <div style={{ marginBottom: '5px' }}>
                          <strong>API Calls:</strong> {planData.environment_comparison?.baseline_summary?.api_calls || 'N/A'}
                        </div>
                        <div style={{ marginBottom: '5px' }}>
                          <strong>Response Time:</strong> {planData.environment_comparison?.baseline_summary?.total_response_time || 'N/A'}ms
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '15px' }}>
                    <strong>Comparison Status:</strong><br/>
                    <span style={{
                      backgroundColor: getStatusColor(planData.environment_comparison?.status || 'unknown'),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {planData.environment_comparison?.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              )}

              {/* Differences */}
              {planData.environment_comparison?.differences && planData.environment_comparison.differences.length > 0 && (
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '15px', 
                  backgroundColor: '#fff3cd', 
                  borderRadius: '4px' 
                }}>
                  <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#856404' }}>Differences Found</h3>
                  <div>
                    {planData.environment_comparison.differences.map((diff: any, index: number) => (
                      <div key={index} style={{
                        padding: '8px',
                        backgroundColor: 'white',
                        borderRadius: '3px',
                        marginBottom: '5px',
                        fontSize: '12px'
                      }}>
                        <strong>{diff.field}:</strong> {diff.expected || 'N/A'} → {diff.actual || 'N/A'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* API Calls Tab */}
          {activeTab === 'api-calls' && (
            <div>
              <h3 style={{ marginBottom: '15px' }}>API Call Sequence</h3>
              {planData.api_calls && planData.api_calls.length > 0 ? (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {planData.api_calls.map((call: any, index: number) => (
                    <div key={index} style={{
                      padding: '15px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      marginBottom: '10px',
                      border: '1px solid #ddd'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0 }}>
                          <span style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            {call.method}
                          </span>
                          {call.endpoint}
                        </h4>
                        <span style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '3px',
                          fontSize: '11px'
                        }}>
                          {call.status_code}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                          <strong>Response Time:</strong><br/>
                          {call.response_time_ms}ms
                        </div>
                        <div>
                          <strong>Timestamp:</strong><br/>
                          {new Date(call.response?.timestamp || Date.now()).toLocaleString()}
                        </div>
                      </div>

                      {call.response && (
                        <div style={{ marginTop: '10px' }}>
                          <strong>Response:</strong>
                          <pre style={{
                            padding: '10px',
                            backgroundColor: 'white',
                            borderRadius: '3px',
                            fontSize: '11px',
                            overflowX: 'auto',
                            border: '1px solid #ddd'
                          }}>
                            {JSON.stringify(call.response, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  No API calls recorded for this plan.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;