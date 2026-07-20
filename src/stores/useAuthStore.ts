import { create } from 'zustand';
import { User } from 'firebase/auth';
import { loginUser, registerUser, logoutUser } from '../services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,          
  isLoading: true,     
  error: null,         

  // Oturum durumunu dinlemek (Session Restoration)
  setUser: (user) => set({ user, isLoading: false }),

  // Giriş Yapma Fonksiyonu (Service üzerinden)
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await loginUser(email, password);
      // Başarılı olursa setUser zaten App.tsx'teki onAuthStateChanged tarafından tetiklenecek
    } catch (error: any) {
      set({ error: error.message || 'Giriş yapılamadı', isLoading: false });
      throw error; // UI'da yakalamak için fırlatıyoruz
    }
  },

  // Kayıt Olma Fonksiyonu (Service üzerinden)
  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await registerUser(email, password);
    } catch (error: any) {
      set({ error: error.message || 'Kayıt olunamadı', isLoading: false });
      throw error;
    }
  },

  // Çıkış Yapma Fonksiyonu (Service üzerinden)
  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUser();
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Çıkış yapılamadı', isLoading: false });
    }
  },
}));
