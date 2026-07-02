import { useCallback } from 'react';
import { initializeDatabase as initializeLocalDatabase } from '../db';
import { countActiveSins } from '../db/queries/sins';
import { getTodayExam } from '../db/queries/exams';
import { getLastConfession } from '../db/queries/confessions';
import { useAppStore } from '../store/appStore';

export function useDatabase() {
  const {
    setActiveSinCount,
    setTodayExamDone,
    setLastConfessionDate,
    setLoaded,
    loaded,
  } = useAppStore();

  const refreshAppState = useCallback(async (): Promise<void> => {
    try {
      const [sinCount, todayExam, lastConfession] = await Promise.all([
        countActiveSins(),
        getTodayExam(),
        getLastConfession(),
      ]);
      setActiveSinCount(sinCount);
      setTodayExamDone(todayExam?.completed ?? false);
      setLastConfessionDate(lastConfession?.date ?? null);
      setLoaded(true);
    } catch (error) {
      console.error('Error refreshing app state:', error);
      setLoaded(true);
    }
  }, [setActiveSinCount, setTodayExamDone, setLastConfessionDate, setLoaded]);

  const initializeDatabase = useCallback(async (): Promise<void> => {
    await initializeLocalDatabase();
    await refreshAppState();
  }, [refreshAppState]);

  return {
    initializeDatabase,
    refreshAppState,
    loaded,
  };
}
