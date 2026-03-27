import { useState, useEffect, useCallback } from 'react';
import type { HistoryEntry } from '../types';
import { getAllHistory, saveHistory, deleteHistory, clearHistory } from '../lib/db';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const entries = await getAllHistory();
      setHistory(entries);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(
    async (entry: HistoryEntry) => {
      await saveHistory(entry);
      await reload();
    },
    [reload]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteHistory(id);
      await reload();
    },
    [reload]
  );

  const clear = useCallback(async () => {
    await clearHistory();
    await reload();
  }, [reload]);

  return { history, loading, save, remove, clear, reload };
}
