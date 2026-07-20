import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { Pencil } from 'lucide-react-native';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onEdit?: () => void;
}

// TouchableOpacity'yi animasyon yeteneği olan bir bileşene dönüştürüyoruz
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function TaskCard({ task, onPress, onEdit }: TaskCardProps) {
  const { isDarkMode } = useTasks(); // Temayı merkeze sor
  const isDone = task.isCompleted;

  // Animasyon başlangıç değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current; // Başlangıçta görünmez (0)
  const translateYAnim = useRef(new Animated.Value(20)).current; // Başlangıçta 20 piksel aşağıda

  // Bileşen ekrana ilk çizildiğinde animasyonu başlat
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // Görünür hale getir
        duration: 400, // 400 milisaniye sürsün
        useNativeDriver: true, // Performans için Native işletim sistemini kullan
      }),
      Animated.timing(translateYAnim, {
        toValue: 0, // Kendi orijinal pozisyonuna getir
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, translateYAnim]);

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'Yüksek': return isDarkMode ? '#4a0f0f' : '#ffebee'; 
      case 'Orta': return isDarkMode ? '#4a3000' : '#fff3e0'; 
      default: return isDarkMode ? '#0d3611' : '#e8f5e9'; 
    }
  };

  // Karanlık moda göre yazı renklerini ayarlıyoruz
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const descColor = isDarkMode ? '#aaa' : '#666';

  return (
    <AnimatedTouchable 
      style={[
        styles.card, 
        { 
          backgroundColor: getPriorityColor(), 
          opacity: fadeAnim, // Animasyon değerini bağla
          transform: [{ translateY: translateYAnim }], // Animasyon değerini bağla
        },
        isDone && { opacity: 0.4 } // Eğer görev tamamlandıysa daha soluk yap
      ]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }, isDone && styles.textStrike]}>
          {task.title}
        </Text>
        <View style={styles.rightHeader}>
          <Text style={styles.priorityBadge}>{task.priority}</Text>
          {onEdit && (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Pencil size={16} color="#007BFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {task.description ? (
        <Text style={[styles.description, { color: descColor }, isDone && styles.textStrike]} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  rightHeader: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 8 },
  textStrike: { textDecorationLine: 'line-through' },
  priorityBadge: { fontSize: 12, fontWeight: 'bold', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, color: '#555' },
  editButton: { marginLeft: 8, padding: 4, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 12, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  editButtonText: { fontSize: 16, color: '#007BFF' },
  description: { fontSize: 14, marginBottom: 12 },
});