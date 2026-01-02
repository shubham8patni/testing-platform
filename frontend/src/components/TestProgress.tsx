import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTestProgress } from '../hooks/useApi';

const TestProgress: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { progress } = useTestProgress(testId!);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusBadge = (status: string) => (
    <span style={{
      backgroundColor: getStatusColor(status),
      color: 'white',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase' as any
    }}>
      {status}
    </span>
  );

  if (!progress) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading test progress...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '20px' }}>
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Test Progress</h2>
          <div>
            {getStatusBadge(progress.status)}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <strong>Test ID:</strong>
            <span>{progress.test_id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <strong>Status:</strong>
            <span>{progress.status}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <strong>Progress:</strong>
            <span>{progress.progress}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <strong>Current Step:</strong>
            <span>{progress.current_step || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Started:</strong>
            <span>{new Date(progress.started_at).toLocaleString()}</span>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>Overall Progress:</strong>
          </div>
          <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#e9ecef',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress.progress}%`,
              height: '100%',
              backgroundColor: '#28a745',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '14px', color: '#666' }}>
            {progress.progress}% Complete
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Plan Progress</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {Object.entries(progress.plans).map(([planKey, planData]: [string, any]) => (
              <div key={planKey} style={{
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '14px' }}>{planKey}</strong>
                  {getStatusBadge(planData.status)}
                </div>
                
                <div style={{ marginTop: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                    <span>Progress: {planData.progress}%</span>
                    <span>Step: {planData.current_step || 'N/A'}</span>
                  </div>
                  
                  {planData.error && (
                    <div style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '5px'
                    }}>
                      Error: {planData.error}
                    </div>
                  )}
                </div>

                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '5px'
                }}>
                  <div style={{
                    width: `${planData.progress}%`,
                    height: '100%',
                    backgroundColor: getStatusColor(planData.status),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {progress.status === 'completed' && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => navigate(`/results/${progress.test_id}`)}
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
              View Results
            </button>
          </div>
        )}

        {progress.status === 'failed' && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestProgress;