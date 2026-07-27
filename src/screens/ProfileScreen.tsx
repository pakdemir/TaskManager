import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../stores/authStore';
import useUIStore from '../stores/uiStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useUIStore();

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Profil</Text>
        <Text style={[styles.info, isDarkMode && styles.darkText]}>Email: {user?.email}</Text>
        
        <TouchableOpacity style={styles.button} onPress={toggleTheme}>
          <Text style={styles.buttonText}>
            {isDarkMode ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
          <Text style={styles.buttonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24 },
  darkContainer: { backgroundColor: '#0f172a' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 40 },
  darkText: { color: '#f8fafc' },
  button: {
    backgroundColor: '#4f46e5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButton: { backgroundColor: '#ef4444' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
