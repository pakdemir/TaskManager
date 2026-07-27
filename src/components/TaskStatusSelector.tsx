import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TaskStatus } from '../types';
import useUIStore from '../stores/uiStore';

interface Props {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  error?: string;
}

export default function TaskStatusSelector({ value, onChange, error }: Props) {
  const { isDarkMode } = useUIStore();
  
  const statuses: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'pending', label: 'Bekliyor', color: '#ff9800' },
    { id: 'in_progress', label: 'Devam Ediyor', color: '#2196F3' },
    { id: 'completed', label: 'Tamamlandı', color: '#4CAF50' },
    { id: 'cancelled', label: 'İptal Edildi', color: '#F44336' },
  ];

  const bgColor = isDarkMode ? '#2d2d2d' : '#f0f0f0';
  const textColor = isDarkMode ? '#fff' : '#333';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: isDarkMode ? '#9CA3AF' : '#4B5563' }]}>Durum</Text>
      <View style={styles.row}>
        {statuses.map((st) => (
          <TouchableOpacity
            key={st.id}
            style={[
              styles.btn,
              { backgroundColor: bgColor },
              value === st.id && { backgroundColor: st.color, borderColor: st.color }
            ]}
            onPress={() => onChange(st.id)}
          >
            <Text style={[
              styles.btnText,
              { color: textColor },
              value === st.id && { color: '#fff', fontWeight: 'bold' }
            ]}>
              {st.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: { 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  btnText: { fontSize: 13, textAlign: 'center' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 },
});
