import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Search } from 'lucide-react-native';
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
      </View>
    </View>
  );
}
