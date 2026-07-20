import { useEffect, useCallback } from 'react';
import { useTaskStore } from '../stores/useTaskStore';

export const useTasks = (autoFetch: boolean = true) => {
  const { tasks, isLoading, error, loadTasks } = useTaskStore();

  // Ekstra hook logic'leri eklenebilir
  const fetchTasksData = useCallback(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (autoFetch) {
      fetchTasksData();
    }
  }, [autoFetch, fetchTasksData]);

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasksData,
  };
};
