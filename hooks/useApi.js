import { useState } from 'react';

export const useApi = (apiFunc) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (...args) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiFunc(...args);
      setIsLoading(false);
      return res;
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Error');
      throw err;
    }
  };

  return { callApi, isLoading, error };
};
