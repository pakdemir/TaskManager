import { create } from 'zustand';

interface UIState {
  isDarkMode: boolean;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  reset: () => void;
}

const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  sidebarOpen: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  reset: () => set({ isDarkMode: false, sidebarOpen: false }),
}));

export default useUIStore;
