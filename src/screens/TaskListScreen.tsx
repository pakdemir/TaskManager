import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { BarChart2, Sun, Moon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import CustomButton from '../components/CustomButton';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;
type FilterType = 'Tümü' | 'Bekleyenler' | 'Tamamlananlar';
type SortType = 'Yeni' | 'Eski';

export default function TaskListScreen({ navigation }: Props) {
  // Context'ten karanlık mod değerlerini çektik
  const { tasks, isDarkMode, toggleTheme } = useTasks();
  const [activeFilter, setActiveFilter] = useState<FilterType>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortType>('Yeni');
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const processedTasks = tasks
    .filter((t) => activeFilter === 'Bekleyenler' ? !t.isCompleted : activeFilter === 'Tamamlananlar' ? t.isCompleted : true)
    .filter((t) => searchQuery.trim() === '' || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortOrder === 'Yeni' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);

  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const panelColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const inputBgColor = isDarkMode ? '#2c2c2c' : '#f0f0f0';

  const handleTaskPress = (taskId: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false);
      navigation.navigate('TaskDetail', { taskId });
    }, 400);
  };

  const handleAddPress = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false);
      navigation.navigate('TaskAdd');
    }, 400);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={[styles.container, { backgroundColor: bgColor }]}>
      
      {/* Üst Bar: Arama ve Butonlar */}
      <View style={[styles.searchContainer, { backgroundColor: panelColor }]}>
        <View style={styles.headerRow}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: inputBgColor, color: textColor }]}
            placeholder="Görev başlığında ara..."
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Statistics')}>
            <BarChart2 size={24} color={textColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleTheme}>
            {isDarkMode ? <Sun size={24} color={textColor} /> : <Moon size={24} color={textColor} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.controlsContainer, { backgroundColor: panelColor }]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterScrollContent}
        >
          {(['Tümü', 'Bekleyenler', 'Tamamlananlar'] as FilterType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, activeFilter === filter && styles.activeFilterTab]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortOrder(sortOrder === 'Yeni' ? 'Eski' : 'Yeni')}>
          <Text style={styles.sortText}>Sırala: {sortOrder}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={processedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            onPress={() => handleTaskPress(item.id)} 
            onEdit={() => navigation.navigate('TaskAdd', { taskToEdit: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 16, color: '#888', fontStyle: 'italic' }}>
              {searchQuery !== '' ? 'Bulunamadı.' : 'Görev yok.'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
      
      <View style={[styles.buttonContainer, { backgroundColor: panelColor }]}>
        <CustomButton title="+ Görev Ekle" onPress={handleAddPress} />
      </View>

      {/* Navigasyon Yükleme Ekranı (Overlay) */}
      {isNavigating && (
        <View style={styles.overlay}>
          <View style={styles.overlayBox}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.overlayText}>İçerik Yükleniyor...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { paddingHorizontal: 16, paddingTop: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  searchInput: { flex: 1, padding: 12, borderRadius: 8, fontSize: 16 },
  iconBtn: { marginLeft: 12, padding: 8, backgroundColor: 'transparent', borderRadius: 20 },
  controlsContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  filterContainer: { flex: 1 },
  filterScrollContent: { alignItems: 'center', paddingRight: 8 },
  filterTab: { paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center', borderRadius: 20, marginHorizontal: 4 },
  activeFilterTab: { backgroundColor: '#007BFF' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#888' },
  activeFilterText: { color: '#fff' },
  sortButton: { marginLeft: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#007BFF', borderRadius: 8 },
  sortText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  listContainer: { padding: 16, flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  buttonContainer: { padding: 16, borderTopWidth: 1, borderTopColor: '#333' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  overlayBox: { backgroundColor: '#fff', padding: 24, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  overlayText: { marginTop: 12, fontSize: 16, fontWeight: 'bold', color: '#333' },
});