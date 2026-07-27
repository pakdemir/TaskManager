import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { taskService } from '../services/taskService';
import { Task } from '../types';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reset: () => void;
}

const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      error: null,
      
      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await taskService.getTasks();
          set({ tasks: data, isLoading: false });
        } catch (error: any) {
          let errorMessage = error.message;
          if (errorMessage.includes('timeout') || errorMessage.includes('Network Error')) {
            errorMessage = 'Sunucuya bağlanılamadı. Çevrimdışı modda eski görevler gösteriliyor.';
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      addTask: async (taskData) => {
        set({ isLoading: true, error: null });
        try {
          const newTask = await taskService.addTask(taskData);
          set({ tasks: [...get().tasks, newTask], isLoading: false });
          return newTask;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateTask: async (id, updates) => {
        const useCollaborationStore = require('./collaborationStore').default;
        const taskToUpdate = get().tasks.find(t => t.id === id);
        
        if (taskToUpdate && !useCollaborationStore.getState().canEditTask(taskToUpdate)) {
          set({ error: 'Bu görevi düzenleme yetkiniz yok.', isLoading: false });
          throw new Error('Bu görevi düzenleme yetkiniz yok.');
        }

        const previousTasks = get().tasks;
        set({
          tasks: previousTasks.map(t => t.id === id ? { ...t, ...updates } as Task : t),
          error: null
        });

        try {
          const updatedTask = await taskService.updateTask(id, updates);
          set({
            tasks: get().tasks.map(t => t.id === id ? updatedTask : t)
          });
        } catch (error: any) {
          set({ tasks: previousTasks, error: error.message });
          throw error;
        }
      },

      deleteTask: async (id) => {
        const useCollaborationStore = require('./collaborationStore').default;
        const taskToDelete = get().tasks.find(t => t.id === id);
        
        if (taskToDelete && !useCollaborationStore.getState().canDeleteTask(taskToDelete)) {
          set({ error: 'Bu görevi silme yetkiniz yok.', isLoading: false });
          throw new Error('Bu görevi silme yetkiniz yok.');
        }

        const previousTasks = get().tasks;
        set({
          tasks: previousTasks.filter(t => t.id !== id),
          error: null
        });

        try {
          await taskService.deleteTask(id);
        } catch (error: any) {
          set({ tasks: previousTasks, error: error.message });
          throw error;
        }
      },

      reset: () => set({ tasks: [], isLoading: false, error: null }),
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ tasks: state.tasks }), // Sadece tasks dizisini kaydet
    }
  )
);

export default useTaskStore;

