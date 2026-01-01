import React from 'react';
import { useParams } from 'react-router-dom';
import { useTestProgress } from '../hooks/useTestProgress';

export const TestProgress: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { progress, isPolling, error, startPolling } = useTestProgress(testId || '');

  React.useEffect(() => {
    if (testId) {
      startPolling();
    }
  }, [testId, startPolling]);

  if (error) {
    return (
      <div className="progress-screen">
        <h2>Test Progress</h2>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="progress-screen">
        <h2>Test Progress</h2>
        <div className="loading">Loading test progress...</div>
      </div>
    );
  }

  return (
    <div className="progress-screen">
      <h2>Test Progress - {progress.status}</h2>
      
      <div className="overall-progress">
        <h3>Overall Progress: {progress.progress}%</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      </div>

      <div className="environments">
        <p>Target Environment: <strong>{progress.target_env}</strong></p>
        <p>Baseline Environment: <strong>{progress.baseline_env}</strong></p>
      </div>
      
      <div className="plans-section">
        <h3>Plans Being Tested</h3>
        <div className="plans-list">
          {Object.entries(progress.plans).map(([planKey, planData]) => (
            <div key={planKey} className="plan-item">
              <span className="plan-name">{planKey}</span>
              <span className={`status ${planData.status}`}>
                {planData.status}
              </span>
              <span className="progress">{planData.progress}%</span>
              <button className="btn btn-secondary btn-sm">
                Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {progress.current_step && (
        <div className="current-step">
          <h4>Current Step:</h4>
          <p>{progress.current_step}</p>
        </div>
      )}
    </div>
  );
};