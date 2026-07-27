import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User 
} from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, 
  error: null,
  
  // Oturum dinleyicisi (Session restoration) için
  setUser: (user) => set({ user, isLoading: false }),

  // Giriş yapma fonksiyonu
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error; // UI'da yakalamak için hatayı fırlatıyoruz
    }
  },

  // Kayıt olma fonksiyonu
  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error; // UI'da göstermek için throw atıyoruz
    }
  },

  // Şifremi Unuttum fonksiyonu
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const { sendPasswordResetEmail } = require('firebase/auth');
      await sendPasswordResetEmail(auth, email);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Çıkış yapma ve store temizleme fonksiyonu
  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({ user: null, isLoading: false }); 
      
      // Diğer mağazaları sıfırla
      const useTaskStore = require('./taskStore').default;
      const useCategoryStore = require('./categoryStore').default;
      const useCollaborationStore = require('./collaborationStore').default;
      const useUIStore = require('./uiStore').default;
      
      useTaskStore.getState().reset();
      useCategoryStore.getState().reset();
      useCollaborationStore.getState().reset();
      useUIStore.getState().reset();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useAuthStore;
