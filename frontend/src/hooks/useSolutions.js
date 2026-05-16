import { useState, useEffect } from 'react';
import { solutionsHeaderData, solutionsData } from './solutionsData';

export function useSolutions() {
  const [header, setHeader] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (!active) return;

        setHeader(solutionsHeaderData);
        setSolutions(solutionsData);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load solutions');
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  return { header, solutions, loading, error };
}
