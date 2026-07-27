import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Category } from '../types';
import { taskAddStyles as styles } from '../screens/TaskAddScreen.styles';

interface TaskCategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (id: string) => void;
  panelBg: string;
  borderColor: string;
  textColor: string;
  labelColor: string;
}

export default function TaskCategorySelector({
  categories,
  selectedCategory,
  onSelect,
  panelBg,
  borderColor,
  textColor,
  labelColor
}: TaskCategorySelectorProps) {
  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: labelColor }]}>Kategori</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.categoryTab, 
            { backgroundColor: panelBg, borderColor: borderColor },
            !selectedCategory && styles.categoryTabActive
          ]}
          onPress={() => onSelect('')}
        >
          <Text style={[styles.priorityText, { color: textColor }, !selectedCategory && styles.priorityTextActive]}>Yok</Text>
        </TouchableOpacity>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            activeOpacity={0.7}
            style={[
              styles.categoryTab, 
              { backgroundColor: panelBg, borderColor: borderColor },
              selectedCategory === c.id && styles.categoryTabActive,
              selectedCategory === c.id && { borderColor: c.color }
            ]}
            onPress={() => onSelect(c.id)}
          >
            <View style={[styles.categoryDot, { backgroundColor: c.color }]} />
            <Text style={[styles.priorityText, { color: textColor }, selectedCategory === c.id && { color: c.color }]}>
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
