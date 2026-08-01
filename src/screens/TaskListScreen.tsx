import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Modal, TouchableOpacity, Image } from 'react-native';
import { Home, Folder, User as UserIcon, BarChart2, Sun, Moon, Settings, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import useTaskStore from '../stores/taskStore';
import useUIStore from '../stores/uiStore';
import useCategoryStore from '../stores/categoryStore';
import useAuthStore from '../stores/authStore';
import TaskCard from '../components/TaskCard';
import CustomButton from '../components/CustomButton';

// Components
import HomeHeader from '../components/HomeHeader';
import HomeFilters from '../components/HomeFilters';

// Utils & Styles
import { FilterType, SortType, filterAndSortTasks } from '../utils/taskFilters';
import { taskListStyles as styles } from './TaskListScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export default function TaskListScreen({ route, navigation }: Props) {
  const { tasks, isLoading: isTasksLoading, fetchTasks, error } = useTaskStore();
  const { isDarkMode, toggleTheme, sidebarOpen, setSidebarOpen, rightSidebarOpen, setRightSidebarOpen, activeFilter, setActiveFilter } = useUIStore();
  const { user } = useAuthStore();
  const userId = user?.uid;
  
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortType>('Yeni');
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    Promise.all([fetchTasks()]).finally(() => setIsLoading(false));
  }, []);



  const processedTasks = filterAndSortTasks(tasks, {
    activeFilter: activeFilter as FilterType,
    activeCategoryId,
    searchQuery,
    sortOrder,
    userId
  });

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
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={[styles.container, { backgroundColor: bgColor }]}>
      
      <HomeHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onNavigateToStats={() => navigation.navigate('Statistics')}
        onNavigateToProfile={() => navigation.navigate('Profile')}
        panelColor={panelColor}
        inputBgColor={inputBgColor}
        textColor={textColor}
      />

      <View style={[styles.controlsContainer, { backgroundColor: panelColor, flexDirection: 'column', alignItems: 'stretch' }]}>
        <HomeFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </View>

      <FlatList
        data={processedTasks}
        keyExtractor={(item) => item.id}
        refreshing={isTasksLoading}
        onRefresh={fetchTasks}
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            onPress={() => handleTaskPress(item.id)} 
            onEdit={() => navigation.navigate('TaskAdd', { taskToEdit: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {error ? (
               <>
                 <Text style={{ fontSize: 16, color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</Text>
                 <CustomButton title="Tekrar Dene" onPress={() => fetchTasks()} />
               </>
            ) : (
               <Text style={{ fontSize: 16, color: '#888', fontStyle: 'italic' }}>
                 {searchQuery !== '' ? 'Bulunamadı.' : 'Görev yok.'}
               </Text>
            )}
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
      
      <View style={[styles.buttonContainer, { backgroundColor: panelColor }]}>
        <CustomButton title="+ Görev Ekle" onPress={handleAddPress} />
      </View>

      {isNavigating && (
        <View style={styles.overlay}>
          <View style={styles.overlayBox}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.overlayText}>İçerik Yükleniyor...</Text>
          </View>
        </View>
      )}

      {/* Sol Menü Modalı */}
      <Modal visible={sidebarOpen} transparent animationType="fade">
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ width: '75%', backgroundColor: panelColor, shadowColor: '#000', shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.1, elevation: 10 }}>
            {/* Header Alanı */}
            <View style={{ backgroundColor: '#3B82F6', padding: 24, paddingTop: 60, paddingBottom: 30, borderBottomRightRadius: 20 }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)' }}>
                <UserIcon size={32} color="#fff" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Görev Yöneticisi</Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{user?.email || 'Kullanıcı Girişi Bekleniyor'}</Text>
            </View>

            {/* Menü Öğeleri */}
            <View style={{ padding: 20, marginTop: 10 }}>
              <TouchableOpacity onPress={() => { setSidebarOpen(false); navigation.navigate('TaskList'); }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#333' : '#f0f0f0' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? '#333' : '#f0f8ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                  <Home size={20} color="#3B82F6" />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: textColor, flex: 1 }}>Ana Sayfa</Text>
                <ChevronRight size={18} color={isDarkMode ? '#666' : '#ccc'} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setSidebarOpen(false); navigation.navigate('CategoryManagement'); }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#333' : '#f0f0f0' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? '#333' : '#fff0f5', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                  <Folder size={20} color="#FF69B4" />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: textColor, flex: 1 }}>Kategoriler</Text>
                <ChevronRight size={18} color={isDarkMode ? '#666' : '#ccc'} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setSidebarOpen(false); navigation.navigate('Statistics'); }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#333' : '#f0f0f0' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? '#333' : '#e6e6fa', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                  <BarChart2 size={20} color="#8a2be2" />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: textColor, flex: 1 }}>İstatistikler</Text>
                <ChevronRight size={18} color={isDarkMode ? '#666' : '#ccc'} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setSidebarOpen(false); navigation.navigate('Profile'); }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? '#333' : '#f0fff0', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                  <UserIcon size={20} color="#32CD32" />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: textColor, flex: 1 }}>Profilim</Text>
                <ChevronRight size={18} color={isDarkMode ? '#666' : '#ccc'} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setSidebarOpen(false)} />
        </View>
      </Modal>

    </SafeAreaView>
  );
}