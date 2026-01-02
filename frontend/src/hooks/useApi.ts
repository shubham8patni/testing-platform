import { useState, useEffect } from 'react';
import * as api from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeApiCall = async (apiCall: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
      throw err;
    }
  };

  return { loading, error, executeApiCall };
};

export const useUserTests = (userId: string) => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getUserTests(userId);
        setTests(data.tests || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTests();
    }
  }, [userId]);

  return { tests, loading, error };
};

export const useTestProgress = (testId: string) => {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!testId) return;

    const intervalId = setInterval(async () => {
      try {
        const data = await api.getTestStatus(testId);
        setProgress(data);
        
        // Stop polling if test is completed or failed
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(intervalId);
        }
      } catch (err: any) {
        console.error('Error polling test status:', err);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId);
  }, [testId]);

  const pollOnce = async () => {
    try {
      const data = await api.getTestStatus(testId);
      setProgress(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { progress, loading, error, pollOnce };
};