import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import auth from '@react-native-firebase/auth';

import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { TaskProvider } from './src/context/TaskContext';
import useAuthStore from './src/stores/authStore';

export default function App() {
  const { user, isLoading, setUser } = useAuthStore();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return subscriber; // unsubscribe on unmount
  }, [setUser]);

  if (isLoading) return null; // Veya SplashScreen

  return (
    <SafeAreaProvider>
      <TaskProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </TaskProvider>
    </SafeAreaProvider>
  );
}