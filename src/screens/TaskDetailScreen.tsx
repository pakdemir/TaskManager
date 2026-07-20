import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useTasks } from '../context/TaskContext';
import CustomButton from '../components/CustomButton';
import { CheckCircle, Clock } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen({ route, navigation }: Props) {
  // Liste sayfasından buraya gönderilen ID'yi yakalıyoruz
  const { taskId } = route.params;
  const { tasks, toggleTaskCompletion, deleteTask, isDarkMode } = useTasks();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const bgColor = isDarkMode ? '#121212' : '#f9f9f9';
  const panelColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const subTextColor = isDarkMode ? '#aaa' : '#444';
  const labelColor = isDarkMode ? '#ccc' : '#555';
  const borderColor = isDarkMode ? '#333' : '#eee';

  // Hafızadaki görevler arasından bu ID'ye sahip olanı buluyoruz
  const task = tasks.find((t) => t.id === taskId);

  // Eğer görev bulunamazsa (yanlış ID veya silinmişse) çökmemesi için güvenlik kalkanı
  if (!task) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: bgColor }]}>
        <Text style={styles.errorText}>Görev bulunamadı!</Text>
        <CustomButton title="Listeye Dön" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  // Bonus Özellik: Silmeden önce kullanıcıdan onay alma mekanizması
  const handleDelete = () => {
    Alert.alert(
      "Görevi Sil",
      "Bu görevi tamamen silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive",
          onPress: () => {
            setIsDeleting(true);
            setTimeout(() => {
              deleteTask(taskId);
              navigation.goBack();
            }, 400);
          }
        }
      ]
    );
  };

  const handleToggle = () => {
    setIsToggling(true);
    setTimeout(() => {
      toggleTaskCompletion(taskId);
      setIsToggling(false);
    }, 400);
  };

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Başlık ve Öncelik Alanı */}
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>{task.title}</Text>
          <Text style={[styles.priorityBadge, { color: subTextColor }]}>Öncelik: {task.priority}</Text>
        </View>

        {/* Durum Alanı */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: labelColor }]}>Durum:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            {task.isCompleted ? (
              <CheckCircle size={18} color={isDarkMode ? '#81c784' : 'green'} />
            ) : (
              <Clock size={18} color="#ff9800" />
            )}
            <Text style={[styles.value, { marginLeft: 8, color: task.isCompleted ? (isDarkMode ? '#81c784' : 'green') : '#ff9800' }]}>
              {task.isCompleted ? 'Tamamlandı' : 'Bekliyor'}
            </Text>
          </View>
        </View>

        {/* Son Tarih Alanı (Eğer varsa göster) */}
        {task.dueDate ? (
          <View style={styles.section}>
            <Text style={[styles.label, { color: labelColor }]}>Son Tarih:</Text>
            <Text style={[styles.value, { color: textColor }]}>{task.dueDate}</Text>
          </View>
        ) : null}

        {/* Açıklama Alanı */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: labelColor }]}>Açıklama:</Text>
          <Text style={[styles.description, { color: subTextColor }]}>
            {task.description ? task.description : 'Bu görev için açıklama eklenmemiş.'}
          </Text>
        </View>

      </ScrollView>

      {/* Aksiyon Butonları */}
      <View style={[styles.footer, { backgroundColor: panelColor, borderTopColor: borderColor }]}>
        <CustomButton
          title={task.isCompleted ? "Tekrar Bekliyor'a Al" : "Tamamlandı İşaretle"}
          onPress={handleToggle}
          variant="outline"
          isLoading={isToggling}
        />
        <CustomButton
          title="Düzenle"
          onPress={() => navigation.navigate('TaskAdd', { taskToEdit: taskId })}
          disabled={isToggling || isDeleting}
        />
        <CustomButton
          title="Görevi Sil"
          onPress={handleDelete}
          variant="danger"
          isLoading={isDeleting}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, color: 'red', marginBottom: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  header: { marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  priorityBadge: { fontSize: 14, color: '#666', fontWeight: '600' },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 4 },
  value: { fontSize: 16, color: '#333', fontWeight: '500' },
  description: { fontSize: 16, color: '#444', lineHeight: 24 },
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
});