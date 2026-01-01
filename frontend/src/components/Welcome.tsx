import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { User } from '../types';

export const Welcome: React.FC = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const user = await apiClient.post('/users', { name });
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/config');
    } catch (error: any) {
      setError(error.message || 'Failed to create user');
    }
    
    setLoading(false);
  };

  return (
    <div className="welcome-screen">
      <h2>Welcome to Insurance Testing Platform</h2>
      <p>Enter your name to begin testing insurance policies across environments</p>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Your Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          disabled={loading}
        />
      </div>
      
      <button 
        className="btn btn-primary" 
        onClick={handleStart} 
        disabled={loading || !name.trim()}
      >
        {loading ? 'Creating...' : 'Start Testing'}
      </button>
    </div>
  );
};