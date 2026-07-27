import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { taskListStyles as styles } from '../screens/TaskListScreen.styles';
import { FilterType, SortType } from '../utils/taskFilters';

interface HomeFiltersProps {
  activeFilter: FilterType;
  setActiveFilter: (f: FilterType) => void;
  sortOrder: SortType;
  setSortOrder: (s: SortType) => void;
}

export default function HomeFilters({
  activeFilter,
  setActiveFilter,
  sortOrder,
  setSortOrder,
}: HomeFiltersProps) {
  const filters: FilterType[] = ['Tümü', 'Bekleyenler', 'Tamamlananlar', 'Görevlerim', 'Bana Atananlar', 'Katkıda Bulunduklarım', 'Benimle Paylaşılanlar'];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterScrollContent}
      >
        {filters.map((filter) => (
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
  );
}
