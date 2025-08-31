import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (url === null) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      const response = await fetch(`http://localhost:5000${url}`, { headers });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An error occurred while fetching data');
      }
      
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;