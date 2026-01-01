import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

interface PlanDetails {
  plan_key: string;
  status: string;
  progress: number;
  api_calls: Array<{
    endpoint: string;
    method: string;
    status_code: number;
    response_time_ms: number;
    response: any;
  }>;
}

export const PlanDetails: React.FC = () => {
  const { testId, planKey } = useParams<{ testId: string; planKey: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<PlanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (testId && planKey) {
      loadPlanDetails();
    }
  }, [testId, planKey]);

  const loadPlanDetails = async () => {
    try {
      setLoading(true);
      const testResult = await apiClient.get(`/results/${testId}`);
      const planData = testResult.plan_results[planKey || ''];
      
      if (planData) {
        setDetails({
          plan_key: planKey || '',
          status: planData.status,
          progress: planData.progress || 0,
          api_calls: planData.api_calls || []
        });
      } else {
        setError('Plan not found in test results');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load plan details');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading plan details...</div>;
  }

  if (error) {
    return (
      <div className="plan-details">
        <div className="error">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate(`/progress/${testId}`)}>
          Back to Progress
        </button>
      </div>
    );
  }

  if (!details) {
    return <div className="loading">No details available</div>;
  }

  return (
    <div className="plan-details">
      <h2>Plan Details: {details.plan_key}</h2>
      
      <div className="plan-summary">
        <p><strong>Status:</strong> <span className={`status ${details.status}`}>{details.status}</span></p>
        <p><strong>Progress:</strong> {details.progress}%</p>
      </div>

      <div className="api-calls">
        <h3>API Calls</h3>
        {details.api_calls.length === 0 ? (
          <p>No API calls recorded</p>
        ) : (
          details.api_calls.map((call, index) => (
            <div key={index} className="api-call">
              <div className="call-header">
                <span className="method">{call.method}</span>
                <span className="endpoint">{call.endpoint}</span>
                <span className={`status-code ${call.status_code === 200 ? 'success' : 'error'}`}>
                  {call.status_code}
                </span>
                <span className="response-time">{call.response_time_ms}ms</span>
              </div>
              
              <div className="call-details">
                <h4>Response:</h4>
                <pre className="response-data">
                  {JSON.stringify(call.response, null, 2)}
                </pre>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="actions">
        <button className="btn btn-secondary" onClick={() => navigate(`/progress/${testId}`)}>
          Back to Progress
        </button>
        <button className="btn btn-primary" onClick={() => navigate(`/results/${testId}`)}>
          View Full Results
        </button>
      </div>
    </div>
  );
};