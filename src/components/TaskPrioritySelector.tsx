import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Priority } from '../types';
import { taskAddStyles as styles } from '../screens/TaskAddScreen.styles';

interface TaskPrioritySelectorProps {
  selectedPriority: Priority;
  onSelect: (p: Priority) => void;
  panelBg: string;
  borderColor: string;
  textColor: string;
  labelColor: string;
}

export default function TaskPrioritySelector({
  selectedPriority,
  onSelect,
  panelBg,
  borderColor,
  textColor,
  labelColor
}: TaskPrioritySelectorProps) {
  const priorityMap: Record<Priority, string> = {
    'low': 'Düşük',
    'medium': 'Orta',
    'high': 'Yüksek',
    'urgent': 'Acil'
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: labelColor }]}>Öncelik Seviyesi</Text>
      <View style={styles.priorityButtons}>
        {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
          <TouchableOpacity
            key={p}
            activeOpacity={0.7}
            style={[
              styles.priorityTab, 
              { backgroundColor: panelBg, borderColor: borderColor },
              selectedPriority === p && styles.priorityTabActive
            ]}
            onPress={() => onSelect(p)}
          >
            <Text style={[styles.priorityText, { color: textColor }, selectedPriority === p && styles.priorityTextActive]}>
              {priorityMap[p]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
