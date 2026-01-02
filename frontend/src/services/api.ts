import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User services
export const createUser = async (name: string) => {
  const response = await api.post('/users', { name });
  return response.data;
};

export const getUser = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Test services
export const startTest = async (config: any) => {
  const response = await api.post('/tests/start', config);
  return response.data;
};

export const getTestStatus = async (testId: string) => {
  const response = await api.get(`/tests/${testId}/status`);
  return response.data;
};

// Results services
export const getTestResult = async (testId: string) => {
  const response = await api.get(`/results/${testId}`);
  return response.data;
};

export const getUserTests = async (userId: string) => {
  const response = await api.get(`/results/user/${userId}`);
  return response.data;
};

// Config services
export const getEnvironments = async () => {
  const response = await api.get('/config/environments');
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/config/products');
  return response.data;
};

export const getPlanKeys = async () => {
  const response = await api.get('/config/plan-keys');
  return response.data;
};

// AI services
export const analyzeDifferences = async (expected: any, actual: any, customPrompt: string) => {
  const response = await api.post('/ai/analyze-differences', {
    expected,
    actual,
    custom_prompt: customPrompt,
  });
  return response.data;
};

export const getAIUsageStats = async () => {
  const response = await api.get('/ai/usage-stats');
  return response.data;
};