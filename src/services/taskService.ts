import apiClient from '../api/apiClient';
import { Task } from '../types';

export const taskService = {
  // Tüm görevleri getir
  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  // Yeni görev ekle
  addTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const newTask = {
      ...task,
      createdAt: new Date().toISOString(), // Date.now() yerine ISO string kullanıldı
      id: Math.random().toString(36).substr(2, 9), // Basit ID üretimi
    };
    const response = await apiClient.post('/tasks', newTask);
    return response.data;
  },

  // Görev güncelle
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${id}`, updates);
    return response.data;
  },

  // Görev sil
  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
