import { useState, useEffect, useCallback } from 'react';
import { scoreAPI } from '../services/api';

export const useScores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await scoreAPI.getScores();
      setScores(data.data);
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    } finally { setLoading(false); }
  }, []);

  const addScore = async (value, date) => {
    const { data } = await scoreAPI.addScore({ value, date });
    setScores(data.data);
    return data.data;
  };

  const updateScore = async (id, value, date) => {
    const { data } = await scoreAPI.updateScore(id, { value, date });
    setScores(data.data);
    return data.data;
  };

  const deleteScore = async (id) => {
    const { data } = await scoreAPI.deleteScore(id);
    setScores(data.data);
    return data.data;
  };

  useEffect(() => { fetchScores(); }, [fetchScores]);

  return { scores, loading, addScore, updateScore, deleteScore, refetch: fetchScores };
};
