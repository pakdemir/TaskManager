import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { BarChart2, Sun, Moon } from 'lucide-react-native';
import { taskListStyles as styles } from '../screens/TaskListScreen.styles';

interface HomeHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigateToStats: () => void;
  onNavigateToProfile: () => void;
  panelColor: string;
  inputBgColor: string;
  textColor: string;
}

export default function HomeHeader({
  searchQuery,
  setSearchQuery,
  isDarkMode,
  toggleTheme,
  onNavigateToStats,
  onNavigateToProfile,
  panelColor,
  inputBgColor,
  textColor,
}: HomeHeaderProps) {
  return (
    <View style={[styles.searchContainer, { backgroundColor: panelColor }]}>
      <View style={styles.headerRow}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: inputBgColor, color: textColor }]}
          placeholder="Görev başlığında ara..."
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.iconBtn} onPress={onNavigateToStats}>
          <BarChart2 size={24} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onNavigateToProfile}>
          <Text style={{ color: textColor, fontWeight: 'bold' }}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleTheme}>
          {isDarkMode ? <Sun size={24} color={textColor} /> : <Moon size={24} color={textColor} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
