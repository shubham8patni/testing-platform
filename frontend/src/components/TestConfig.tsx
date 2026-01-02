import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

interface TestConfigProps {
  userId: string;
}

const TestConfig: React.FC<TestConfigProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [environments, setEnvironments] = useState<any>({});
  const [products, setProducts] = useState<any>({});
  const [planKeys, setPlanKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState({
    user_id: userId,
    target_env: 'dev',
    baseline_env: 'stage',
    scope: { type: 'all' as const },
    admin_token: '',
    customer_token: '',
    ai_prompt: 'Focus on pricing differences and business logic changes'
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [envData, productData, planData] = await Promise.all([
          api.getEnvironments(),
          api.getProducts(),
          api.getPlanKeys()
        ]);
        setEnvironments(envData.environments || {});
        setProducts(productData.categories || {});
        setPlanKeys(planData.all_plans || []);
      } catch (err: any) {
        console.error('Failed to load configuration:', err);
      }
    };

    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config.admin_token || !config.customer_token) {
      setError('Both admin and customer tokens are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.startTest(config);
      console.log('Test started:', result);
      navigate(`/progress/${result.test_id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to start test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ marginBottom: '20px' }}>Configure Test</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Target Environment:
              </label>
              <select
                value={config.target_env}
                onChange={(e) => setConfig({...config, target_env: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                {Object.entries(environments).map(([key, env]: any) => (
                  <option key={key} value={key}>
                    {env.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Baseline Environment:
              </label>
              <select
                value={config.baseline_env}
                onChange={(e) => setConfig({...config, baseline_env: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                {Object.entries(environments).map(([key, env]: any) => (
                  <option key={key} value={key}>
                    {env.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Test Scope:
            </label>
            <select
              value={config.scope.type}
              onChange={(e) => setConfig({
                ...config, 
                scope: { ...config.scope, type: e.target.value as any }
              })}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="all">All Categories</option>
              <option value="category">Specific Category</option>
              <option value="product">Specific Product</option>
              <option value="plan">Specific Plan</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Admin Token:
              </label>
              <input
                type="password"
                value={config.admin_token}
                onChange={(e) => setConfig({...config, admin_token: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="Enter admin portal token"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Customer Token:
              </label>
              <input
                type="password"
                value={config.customer_token}
                onChange={(e) => setConfig({...config, customer_token: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="Enter customer portal token"
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              AI Analysis Focus (Optional):
            </label>
            <textarea
              value={config.ai_prompt}
              onChange={(e) => setConfig({...config, ai_prompt: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                minHeight: '60px'
              }}
              placeholder="Describe what AI should focus on during analysis"
            />
          </div>

          {error && (
            <div style={{
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Starting Test...' : 'Start Test'}
            </button>
          </div>
        </form>

        <div style={{ 
          marginTop: '20px', 
          fontSize: '12px', 
          color: '#666' 
        }}>
          <strong>Available Plans:</strong> {planKeys.length} plans found
        </div>
      </div>
    </div>
  );
};

export default TestConfig;