import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../types';
import apiClient from '../api/apiClient';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reset: () => void;
}

const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      isLoading: false,
      error: null,
      fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get('/categories');
          set({ categories: response.data, isLoading: false });
        } catch (e: any) {
          set({ error: e.message, isLoading: false });
        }
      },
      addCategory: async (categoryData) => {
        try {
          const response = await apiClient.post('/categories', { ...categoryData, id: Math.random().toString(36).substr(2, 9) });
          set({ categories: [...get().categories, response.data] });
        } catch (e: any) {
          set({ error: e.message });
        }
      },
      updateCategory: async (id, data) => {
        try {
          const response = await apiClient.patch(`/categories/${id}`, data);
          set({ categories: get().categories.map(c => c.id === id ? response.data : c) });
        } catch (e: any) {
          set({ error: e.message });
        }
      },
      deleteCategory: async (id) => {
        try {
          await apiClient.delete(`/categories/${id}`);
          set({ categories: get().categories.filter(c => c.id !== id) });
        } catch (e: any) {
          set({ error: e.message });
        }
      },
      reset: () => set({ categories: [], isLoading: false, error: null }),
    }),
    {
      name: 'category-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ categories: state.categories }),
    }
  )
);

export default useCategoryStore;
