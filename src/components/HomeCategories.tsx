import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { taskListStyles as styles } from '../screens/TaskListScreen.styles';
import { Category } from '../types';

interface HomeCategoriesProps {
  categories: Category[];
  activeCategoryId: string | null;
  setActiveCategoryId: (id: string | null) => void;
  isAddingCategory: boolean;
  setIsAddingCategory: (val: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  handleAddCategory: () => void;
  handleCategoryLongPress: (id: string, name: string) => void;
  setEditingCategory: (cat: { id: string, name: string } | null) => void;
  inputBgColor: string;
  textColor: string;
}

export default function HomeCategories({
  categories,
  activeCategoryId,
  setActiveCategoryId,
  isAddingCategory,
  setIsAddingCategory,
  newCategoryName,
  setNewCategoryName,
  handleAddCategory,
  handleCategoryLongPress,
  setEditingCategory,
  inputBgColor,
  textColor
}: HomeCategoriesProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterScrollContent}
      >
        <TouchableOpacity
          style={[styles.filterTab, activeCategoryId === null && styles.activeFilterTab]}
          onPress={() => setActiveCategoryId(null)}
        >
          <Text style={[styles.filterText, activeCategoryId === null && styles.activeFilterText]}>Tüm Kategoriler</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.filterTab, activeCategoryId === cat.id && styles.activeFilterTab, { borderColor: cat.color, borderWidth: 1 }]}
            onPress={() => setActiveCategoryId(cat.id)}
            onLongPress={() => handleCategoryLongPress(cat.id, cat.name)}
          >
            <Text style={[styles.filterText, activeCategoryId === cat.id && styles.activeFilterText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {isAddingCategory ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
          <TextInput
            style={{ backgroundColor: inputBgColor, color: textColor, padding: 4, borderRadius: 4, width: 80, fontSize: 12 }}
            placeholder="Ad..."
            placeholderTextColor="#888"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            onSubmitEditing={handleAddCategory}
          />
          <TouchableOpacity onPress={() => { setIsAddingCategory(false); setEditingCategory(null); setNewCategoryName(''); }} style={{ marginLeft: 4 }}>
            <Text style={{ color: 'red', fontSize: 12 }}>İptal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.sortButton} onPress={() => setIsAddingCategory(true)}>
          <Text style={styles.sortText}>+ Kategori</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
