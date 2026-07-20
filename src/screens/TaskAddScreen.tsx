import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { Calendar } from 'lucide-react-native';

import { RootStackParamList, Priority } from '../types';
import { useTasks } from '../context/TaskContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskAdd'>;

export default function TaskAddScreen({ route, navigation }: Props) {
  const { tasks, addTask, updateTask, isDarkMode } = useTasks();
  
  const taskId = route.params?.taskToEdit;
  const isEditing = !!taskId;

  // Form State'leri
  const [title, setTitle] = useState(''); 
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Orta');
  const [titleError, setTitleError] = useState('');
  
  // Tarih State'leri
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Dinamik Renkler
  const textColor = isDarkMode ? '#fff' : '#333';
  const labelColor = isDarkMode ? '#ccc' : '#333';
  const panelBg = isDarkMode ? '#1e1e1e' : '#fff';
  const borderColor = isDarkMode ? '#444' : '#ccc';

  useEffect(() => {
    if (isEditing) {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (taskToUpdate) {
        setTitle(taskToUpdate.title);
        setDescription(taskToUpdate.description || '');
        setPriority(taskToUpdate.priority);
        if (taskToUpdate.dueDate) {
          const parsed = new Date(taskToUpdate.dueDate.split('.').reverse().join('-'));
          if (!isNaN(parsed.getTime())) {
             setDueDate(parsed);
             setIsDateSelected(true);
          }
        }
      }
    }
  }, [isEditing, taskId, tasks]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
      setIsDateSelected(true);
    }
  };

  const handleSave = async () => {
    if (title.trim() === '') {
      setTitleError('Görev başlığı zorunludur.');
      return;
    }
    
    setIsSaving(true);
    
    const dateString = isDateSelected ? dueDate.toLocaleDateString('tr-TR') : '';

    if (isEditing && taskId) {
      updateTask(taskId, { title, description, priority, dueDate: dateString });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Görev Güncellendi",
          body: `"${title}" başarıyla güncellendi.`,
        },
        trigger: null,
      });
    } else {
      addTask({ title, description, priority, dueDate: dateString, isCompleted: false });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Yeni Görev Eklendi",
          body: `"${title}" listene başarıyla eklendi!`,
        },
        trigger: null,
      });
    }
    
    setTimeout(() => {
      setIsSaving(false);
      navigation.goBack();
    }, 400); // Daha kısa loading simülasyonu
  };

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <CustomInput
          label="Görev Başlığı *"
          placeholder="Örn: React Native projesini tamamla"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (text.trim() !== '') setTitleError('');
          }}
          error={titleError}
        />

        <CustomInput
          label="Açıklama"
          placeholder="Görev detaylarını buraya yazabilirsiniz..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <View style={styles.section}>
          <Text style={[styles.label, { color: labelColor }]}>Öncelik Seviyesi</Text>
          <View style={styles.priorityButtons}>
            {(['Düşük', 'Orta', 'Yüksek'] as Priority[]).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityTab, 
                  { backgroundColor: panelBg, borderColor: borderColor },
                  priority === p && styles.priorityTabActive
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[styles.priorityText, { color: textColor }, priority === p && styles.priorityTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: labelColor }]}>Son Tarih</Text>
          <TouchableOpacity 
            style={[styles.dateButton, { backgroundColor: panelBg, borderColor: borderColor, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: textColor }}>
              {isDateSelected ? dueDate.toLocaleDateString('tr-TR') : "Tarih Seçiniz"}
            </Text>
            <Calendar size={20} color={textColor} />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
            themeVariant={isDarkMode ? "dark" : "light"}
            textColor={isDarkMode ? "#ffffff" : "#000000"}
          />
        )}

        <View style={styles.footer}>
          <CustomButton 
            title={isEditing ? "Değişiklikleri Kaydet" : "Görevi Kaydet"} 
            onPress={handleSave} 
            isLoading={isSaving}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  section: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  priorityButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  priorityTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderRadius: 8, marginHorizontal: 4 },
  priorityTabActive: { backgroundColor: '#007BFF', borderColor: '#007BFF' },
  priorityText: { fontSize: 14, fontWeight: '600' },
  priorityTextActive: { color: '#fff' },
  dateButton: { 
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1, 
  },
  footer: { marginTop: 24 },
});