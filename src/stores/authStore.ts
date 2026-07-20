import { create } from 'zustand';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
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
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Kayıt olma fonksiyonu
  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error; // UI'da göstermek için throw atıyoruz
    }
  },

  // Çıkış yapma ve store temizleme fonksiyonu
  logout: async () => {
    set({ isLoading: true });
    try {
      await auth().signOut();
      set({ user: null, isLoading: false }); 
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useAuthStore;
