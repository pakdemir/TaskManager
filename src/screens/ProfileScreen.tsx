import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, Moon } from 'lucide-react-native';
import useAuthStore from '../stores/authStore';
import useUIStore from '../stores/uiStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useUIStore();

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Profilim</Text>
        
        <View style={[styles.infoCard, isDarkMode && styles.darkCard]}>
          <Text style={[styles.infoLabel, isDarkMode && styles.darkLabel]}>E-posta Adresi</Text>
          <Text style={[styles.info, isDarkMode && styles.darkText]}>{user?.email}</Text>
        </View>
        
        <View style={[styles.switchContainer, isDarkMode && styles.darkCard]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(255,215,0,0.1)' : 'rgba(75,0,130,0.1)' }]}>
              {isDarkMode ? <Sun size={24} color="#FFD700" /> : <Moon size={24} color="#4B0082" />}
            </View>
            <Text style={[styles.switchLabel, isDarkMode && styles.darkText]}>
              {isDarkMode ? 'Aydınlık Mod' : 'Karanlık Mod'}
            </Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme} 
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#FFD700' : '#f4f3f4'}
          />
        </View>

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
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#333' },
  infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 3 },
  infoLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  info: { fontSize: 18, fontWeight: '600', color: '#333' },
  darkCard: { backgroundColor: '#1e293b' },
  darkLabel: { color: '#94a3b8' },
  darkText: { color: '#f8fafc' },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 3 },
  iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  switchLabel: { fontSize: 18, fontWeight: '600', color: '#333' },
  button: {
    backgroundColor: '#4f46e5',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButton: { backgroundColor: '#ef4444', shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, elevation: 5 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});
