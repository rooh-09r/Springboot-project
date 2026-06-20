import { useState, useCallback } from 'react';

export const useAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFn) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn();
      return result;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};
