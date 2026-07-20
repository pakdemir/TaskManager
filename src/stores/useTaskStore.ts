import { create } from 'zustand';
import { fetchTasks } from '../services/api';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  
  loadTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Screen ➔ Zustand Action (burası) ➔ Service
      const data = await fetchTasks();
      set({ tasks: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Görevler yüklenirken bir hata oluştu', 
        isLoading: false 
      });
    }
  },
}));
