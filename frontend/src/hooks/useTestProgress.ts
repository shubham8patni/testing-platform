import { useState, useEffect, useCallback } from 'react';
import { TestProgress } from '../types';
import { apiClient } from '../services/api';

export const useTestProgress = (testId: string) => {
  const [progress, setProgress] = useState<TestProgress | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollProgress = useCallback(async () => {
    try {
      const data = await apiClient.get(`/tests/${testId}/status`);
      setProgress(data);
      
      // Stop polling if test is completed or failed
      if (data.status === 'completed' || data.status === 'failed') {
        setIsPolling(false);
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setIsPolling(false);
    }
  }, [testId]);

  const startPolling = useCallback(() => {
    setIsPolling(true);
    setError(null);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  useEffect(() => {
    if (!isPolling || !testId) return;

    // Initial poll immediately
    pollProgress();

    // Then poll every 2 seconds
    const interval = setInterval(pollProgress, 2000);

    return () => clearInterval(interval);
  }, [isPolling, testId, pollProgress]);

  return {
    progress,
    isPolling,
    error,
    startPolling,
    stopPolling
  };
};