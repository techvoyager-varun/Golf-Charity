import { useState, useEffect, useCallback } from 'react';
import { drawAPI } from '../services/api';

export const useDraw = () => {
  const [currentDraw, setCurrentDraw] = useState(null);
  const [drawHistory, setDrawHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrent = useCallback(async () => {
    try {
      const { data } = await drawAPI.getCurrent();
      setCurrentDraw(data.data);
    } catch (error) { console.error('Failed to fetch draw:', error); }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await drawAPI.getHistory();
      setDrawHistory(data.data);
    } catch (error) { console.error('Failed to fetch draw history:', error); }
  }, []);

  useEffect(() => {
    Promise.all([fetchCurrent(), fetchHistory()]).finally(() => setLoading(false));
  }, [fetchCurrent, fetchHistory]);

  return { currentDraw, drawHistory, loading, refetch: () => { fetchCurrent(); fetchHistory(); } };
};
