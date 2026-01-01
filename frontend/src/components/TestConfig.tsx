import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { TestConfig, Environment } from '../types';

export const TestConfig: React.FC = () => {
  const navigate = useNavigate();
  const [environments, setEnvironments] = useState<any>(null);
  const [products, setProducts] = useState<any>(null);
  const [planKeys, setPlanKeys] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [config, setConfig] = useState<TestConfig>({
    user_id: '',
    target_env: '',
    baseline_env: '',
    scope: { type: 'all' },
    admin_token: '',
    customer_token: '',
    ai_prompt: 'Focus on pricing differences and business logic variations'
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }
    
    const userData = JSON.parse(user);
    setConfig(prev => ({ ...prev, user_id: userData.user_id }));
    
    // Load configurations
    loadConfigurations();
  }, [navigate]);

  const loadConfigurations = async () => {
    try {
      const [envData, productsData, planKeysData] = await Promise.all([
        apiClient.get('/config/environments'),
        apiClient.get('/config/products'),
        apiClient.get('/config/plan-keys')
      ]);
      
      setEnvironments(envData);
      setProducts(productsData);
      setPlanKeys(planKeysData);
    } catch (error: any) {
      setError(error.message || 'Failed to load configurations');
    }
  };

  const handleStartTest = async () => {
    if (!config.target_env || !config.baseline_env) {
      setError('Please select both target and baseline environments');
      return;
    }
    
    if (config.target_env === config.baseline_env) {
      setError('Target and baseline environments must be different');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.post('/tests/start', config);
      navigate(`/progress/${response.test_id}`);
    } catch (error: any) {
      setError(error.message || 'Failed to start test');
    }
    
    setLoading(false);
  };

  if (!environments || !products) {
    return <div className="loading">Loading configurations...</div>;
  }

  return (
    <div className="test-config">
      <h2>Configure Test Run</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label>Target Environment:</label>
        <select
          value={config.target_env}
          onChange={(e) => setConfig(prev => ({ ...prev, target_env: e.target.value }))}
        >
          <option value="">Select Target Environment</option>
          {Object.keys(environments.environments || {}).map(env => (
            <option key={env} value={env}>
              {environments.environments[env].name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Baseline Environment:</label>
        <select
          value={config.baseline_env}
          onChange={(e) => setConfig(prev => ({ ...prev, baseline_env: e.target.value }))}
        >
          <option value="">Select Baseline Environment</option>
          {Object.keys(environments.environments || {}).map(env => (
            <option key={env} value={env}>
              {environments.environments[env].name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Admin Portal Token:</label>
        <input
          type="password"
          value={config.admin_token}
          onChange={(e) => setConfig(prev => ({ ...prev, admin_token: e.target.value }))}
          placeholder="Enter admin portal access token"
        />
      </div>

      <div className="form-group">
        <label>Customer Portal Token:</label>
        <input
          type="password"
          value={config.customer_token}
          onChange={(e) => setConfig(prev => ({ ...prev, customer_token: e.target.value }))}
          placeholder="Enter customer portal access token"
        />
      </div>

      <div className="form-group">
        <label>Test Scope:</label>
        <select
          value={config.scope.type}
          onChange={(e) => setConfig(prev => ({ 
            ...prev, 
            scope: { ...prev.scope, type: e.target.value as any }
          }))}
        >
          <option value="all">All Categories & Plans</option>
          <option value="category">Specific Category</option>
          <option value="product">Specific Product</option>
          <option value="plan">Specific Plan</option>
        </select>
      </div>

      {config.scope.type === 'category' && (
        <div className="form-group">
          <label>Category:</label>
          <select
            value={config.scope.value || ''}
            onChange={(e) => setConfig(prev => ({ 
              ...prev, 
              scope: { ...prev.scope, value: e.target.value }
            }))}
          >
            <option value="">Select Category</option>
            {Object.keys(products.categories || {}).map(cat => (
              <option key={cat} value={cat}>
                {products.categories[cat].name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Custom AI Prompt:</label>
        <textarea
          value={config.ai_prompt}
          onChange={(e) => setConfig(prev => ({ ...prev, ai_prompt: e.target.value }))}
          placeholder="Describe what to focus on during analysis..."
        />
      </div>

      <button 
        className="btn btn-primary" 
        onClick={handleStartTest}
        disabled={loading || !config.target_env || !config.baseline_env}
      >
        {loading ? 'Starting Test...' : 'Start Test Run'}
      </button>
    </div>
  );
};