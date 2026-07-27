import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
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
import HomeCategories from '../components/HomeCategories';

// Utils & Styles
import { FilterType, SortType, filterAndSortTasks } from '../utils/taskFilters';
import { taskListStyles as styles } from './TaskListScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export default function TaskListScreen({ navigation }: Props) {
  const { tasks, isLoading: isTasksLoading, fetchTasks, error, updateTask } = useTaskStore();
  const { isDarkMode, toggleTheme } = useUIStore();
  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories } = useCategoryStore();
  const { user } = useAuthStore();
  const userId = user?.uid;
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('Tümü');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortType>('Yeni');
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    Promise.all([fetchTasks(), fetchCategories()]).finally(() => setIsLoading(false));
  }, []);

  const processedTasks = filterAndSortTasks(tasks, {
    activeFilter,
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

  const handleCategoryLongPress = (id: string, name: string) => {
    Alert.alert(
      "Kategori İşlemleri",
      "Ne yapmak istersiniz?",
      [
        { text: "Düzenle", onPress: () => {
            setEditingCategory({ id, name });
            setNewCategoryName(name);
            setIsAddingCategory(true);
        }},
        { text: "Sil", onPress: () => {
            Alert.alert("Emin misiniz?", "Bu kategoriyi silmek istediğinize emin misiniz?", [
              { text: "İptal", style: "cancel" },
              { text: "Sil", style: "destructive", onPress: () => {
                  if (activeCategoryId === id) setActiveCategoryId(null);
                  deleteCategory(id);
                  // Orphan data fix: Kategorisi silinen görevlerin categoryId'sini temizle
                  tasks.filter(t => t.categoryId === id).forEach(t => updateTask(t.id, { categoryId: undefined }));
              }}
            ]);
        }},
        { text: "İptal", style: "cancel" }
      ]
    );
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      if (editingCategory) {
        updateCategory(editingCategory.id, { name: newCategoryName.trim() });
      } else {
        addCategory({ name: newCategoryName.trim(), color: '#007BFF' });
      }
      setNewCategoryName('');
      setIsAddingCategory(false);
      setEditingCategory(null);
    }
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
        <HomeCategories
          categories={categories}
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={setActiveCategoryId}
          isAddingCategory={isAddingCategory}
          setIsAddingCategory={setIsAddingCategory}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          handleAddCategory={handleAddCategory}
          handleCategoryLongPress={handleCategoryLongPress}
          setEditingCategory={setEditingCategory}
          inputBgColor={inputBgColor}
          textColor={textColor}
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
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.overlayText}>İçerik Yükleniyor...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}