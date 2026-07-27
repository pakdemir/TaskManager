import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Task } from '../types';
import useUIStore from '../stores/uiStore';
import useAuthStore from '../stores/authStore';
import { Pencil, Clock } from 'lucide-react-native';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onEdit?: () => void;
}

// TouchableOpacity'yi animasyon yeteneği olan bir bileşene dönüştürüyoruz
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const getRemainingTimeText = (dueDateStr?: string) => {
  if (!dueDateStr) return null;
  
  let dueDate: Date;
  const parsed = new Date(dueDateStr);
  if (!isNaN(parsed.getTime())) {
    dueDate = parsed;
  } else {
    const parts = dueDateStr.split(/[./-]/);
    if (parts.length === 3) {
      dueDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    } else {
      return null;
    }
  }
  
  if (isNaN(dueDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: `${Math.abs(diffDays)} gün gecikti`, color: '#FF3B30' };
  if (diffDays === 0) return { text: 'Bugün', color: '#FF9500' };
  if (diffDays === 1) return { text: 'Yarın', color: '#4CAF50' };
  return { text: `${diffDays} gün kaldı`, color: '#007BFF' };
};

export default function TaskCard({ task, onPress, onEdit }: TaskCardProps) {
  const { isDarkMode } = useUIStore(); // Temayı merkeze sor
  const { user } = useAuthStore();
  const userId = user?.uid;
  const isDone = task.status === 'completed';

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
      case 'urgent':
      case 'high': return isDarkMode ? '#4a0f0f' : '#ffebee'; 
      case 'medium': return isDarkMode ? '#4a3000' : '#fff3e0'; 
      case 'low':
      default: return isDarkMode ? '#0d3611' : '#e8f5e9'; 
    }
  };

  // Karanlık moda göre yazı renklerini ayarlıyoruz
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const descColor = isDarkMode ? '#aaa' : '#666';

  const isOwner = task.ownerId === userId;
  const isAssigned = task.assignedTo === userId;
  const isShared = task.contributorIds?.includes(userId || '');

  const getBorderColor = () => {
    if (isOwner) return '#007BFF'; // Blue
    if (isAssigned) return '#FF9800'; // Orange
    if (isShared) return '#4CAF50'; // Green
    return 'transparent';
  };

  const renderAvatar = (id: string) => {
    if (!id) return null;
    const initial = id.charAt(0).toUpperCase();
    return (
      <View key={id} style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
    );
  };

  const timeInfo = getRemainingTimeText(task.dueDate);

  return (
    <AnimatedTouchable 
      style={[
        styles.card, 
        { 
          backgroundColor: getPriorityColor(), 
          opacity: fadeAnim, // Animasyon değerini bağla
          transform: [{ translateY: translateYAnim }], // Animasyon değerini bağla
          borderColor: getBorderColor(),
          borderWidth: getBorderColor() !== 'transparent' ? 2 : 0,
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
          {timeInfo && !isDone && (
            <View style={[styles.timeBadge, { backgroundColor: `${timeInfo.color}15` }]}>
              <Clock size={12} color={timeInfo.color} style={{ marginRight: 4 }} />
              <Text style={[styles.timeText, { color: timeInfo.color }]}>{timeInfo.text}</Text>
            </View>
          )}
          <Text style={styles.priorityBadge}>
            {task.priority === 'urgent' ? 'Acil' : 
             task.priority === 'high' ? 'Yüksek' : 
             task.priority === 'medium' ? 'Orta' : 
             task.priority === 'low' ? 'Düşük' : task.priority}
          </Text>
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

      {task.subtasks && task.subtasks.length > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${Math.round((task.subtasks.filter(s => s.isCompleted).length / task.subtasks.length) * 100)}%` }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: descColor }]}>
            {task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length} Alt Görev
          </Text>
        </View>
      )}

      <View style={styles.avatarRow}>
        {task.ownerId && renderAvatar(task.ownerId)}
        {task.assignedTo && task.assignedTo !== task.ownerId && renderAvatar(task.assignedTo)}
        {task.contributorIds?.filter(id => id !== task.ownerId && id !== task.assignedTo).map(id => renderAvatar(id))}
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  rightHeader: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end', flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 8 },
  textStrike: { textDecorationLine: 'line-through' },
  timeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8, marginRight: 6 },
  timeText: { fontSize: 11, fontWeight: 'bold' },
  priorityBadge: { fontSize: 12, fontWeight: 'bold', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, color: '#555' },
  editButton: { marginLeft: 8, padding: 4, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 12, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  editButtonText: { fontSize: 16, color: '#007BFF' },
  description: { fontSize: 14, marginBottom: 12 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  progressBarBg: { flex: 1, height: 6, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 3, marginRight: 8 },
  progressBarFill: { height: 6, backgroundColor: '#007BFF', borderRadius: 3 },
  progressText: { fontSize: 12 },
  avatarRow: { flexDirection: 'row', marginTop: 12, alignItems: 'center', flexWrap: 'wrap' },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#007BFF', justifyContent: 'center', alignItems: 'center', marginRight: 4 },
  avatarText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});