import { create } from 'zustand';
import { FilterType } from '../utils/taskFilters';

interface UIState {
  isDarkMode: boolean;
  sidebarOpen: boolean;
  rightSidebarOpen: boolean;
  activeFilter: FilterType;
  toggleTheme: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setRightSidebarOpen: (isOpen: boolean) => void;
  setActiveFilter: (filter: FilterType) => void;
  reset: () => void;
}

const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  sidebarOpen: false,
  rightSidebarOpen: false,
  activeFilter: 'Tümü' as any,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  setRightSidebarOpen: (isOpen) => set({ rightSidebarOpen: isOpen }),
  setActiveFilter: (filter: any) => set({ activeFilter: filter }),
  reset: () => set({ isDarkMode: false, sidebarOpen: false, rightSidebarOpen: false, activeFilter: 'Tümü' }),
}));

export default useUIStore;
