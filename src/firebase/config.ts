import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Bu alanları kendi Firebase projenizin (986411465955) ayarları ile değiştirin.
// Firebase Console'a gidip Proje Ayarları (Project Settings) kısmından Android veya Web uygulamasının yapılandırmasını (config) kopyalayabilirsiniz.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID", // Örn: "proje-id-986411465955"
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "986411465955", // Proje numaranız (Gönderen ID)
  appId: "YOUR_APP_ID"
};

// Uygulamayı Başlat
const app = initializeApp(firebaseConfig);

// Authentication (E-posta/Şifre için)
export const auth = getAuth(app);

// Firestore (Veritabanı için)
export const db = getFirestore(app);

export default app;
