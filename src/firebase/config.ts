import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Bu alanları kendi Firebase projenizin (986411465955) ayarları ile değiştirin.
// Firebase Console'a gidip Proje Ayarları (Project Settings) kısmından Android veya Web uygulamasının yapılandırmasını (config) kopyalayabilirsiniz.
const firebaseConfig = {
  apiKey: "AIzaSyC91D9gVZi6wSmfRHEErRy9okdO8e4ZE10",
  authDomain: "taskmaneger-91a16.firebaseapp.com",
  projectId: "taskmaneger-91a16",
  storageBucket: "taskmaneger-91a16.firebasestorage.app",
  messagingSenderId: "986411465955",
  appId: "1:986411465955:web:f8218b1fdf18dc0a3899d6",
  measurementId: "G-B9YZ9F1ZKR"
};

// Uygulamayı Başlat
const app = initializeApp(firebaseConfig);

import { initializeAuth } from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Authentication
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Firestore (Veritabanı için)
export const db = getFirestore(app);

export default app;
