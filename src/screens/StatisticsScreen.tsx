import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTaskStore from '../stores/taskStore';
import useUIStore from '../stores/uiStore';
import useAuthStore from '../stores/authStore';
import CustomButton from '../components/CustomButton';

export default function StatisticsScreen({ navigation }: any) {
  const { tasks } = useTaskStore();
  const { isDarkMode } = useUIStore();
  const { user } = useAuthStore();
  const userId = user?.uid;

  const todayStr = new Date().toISOString().split('T')[0];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter((t) => t.status !== 'completed' && t.dueDate && t.dueDate < todayStr).length;
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr).length;
  
  const assignedToMe = tasks.filter((t) => t.assignedTo === userId).length;
  const sharedWithMe = tasks.filter((t) => t.contributorIds?.includes(userId || '')).length;

  const highPriority = tasks.filter((t) => t.priority === 'high' || t.priority === 'urgent').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'medium').length;
  const lowPriority = tasks.filter((t) => t.priority === 'low').length;

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const cardColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const labelColor = isDarkMode ? '#aaa' : '#666';

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>Genel Durum</Text>
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#007BFF' }]}>{totalTasks}</Text>
              <Text style={[styles.statLabel, { color: labelColor }]}>Toplam</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: 'green' }]}>{completedTasks}</Text>
              <Text style={[styles.statLabel, { color: labelColor }]}>Tamamlanan</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#2196F3' }]}>{tasks.filter(t => t.status === 'in_progress').length}</Text>
              <Text style={[styles.statLabel, { color: labelColor }]}>Devam Eden</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#ff9800' }]}>{tasks.filter(t => t.status === 'pending').length}</Text>
              <Text style={[styles.statLabel, { color: labelColor }]}>Bekleyen</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <Text style={[styles.progressLabel, { color: textColor }]}>Tamamlanma Oranı: %{completionRate}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${completionRate}%`, backgroundColor: completionRate === 100 ? 'green' : '#007BFF' }]} />
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>Öncelik Dağılımı</Text>
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#e53935' }]}>{highPriority}</Text>
              <Text style={[styles.statLabel, { color: labelColor }]}>Yüksek</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#fb8c00' }]}>{mediumPriority}</Text>
              <Text style={[styles.statLabel, { color: labelColor }]}>Orta</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#43a047' }]}>{lowPriority}</Text>
              <Text style={[styles.statLabel, { color: labelColor }]}>Düşük</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>İşbirliği ve Tarih</Text>
          <View style={[styles.statRow, { flexWrap: 'wrap' }]}>
            <View style={[styles.statBox, { width: '50%', marginBottom: 16 }]}>
              <Text style={[styles.statValue, { color: '#8e24aa' }]}>{assignedToMe}</Text>
              <Text style={[styles.statLabel, { color: labelColor }]}>Bana Atananlar</Text>
            </View>
            <View style={[styles.statBox, { width: '50%', marginBottom: 16 }]}>
              <Text style={[styles.statValue, { color: '#3949ab' }]}>{sharedWithMe}</Text>
              <Text style={[styles.statLabel, { color: labelColor }]}>Katkıda Bulunduklarım</Text>
            </View>
            <View style={[styles.statBox, { width: '50%' }]}>
              <Text style={[styles.statValue, { color: '#00acc1' }]}>{todayTasks}</Text>
              <Text style={[styles.statLabel, { color: labelColor }]}>Bugünün Görevleri</Text>
            </View>
            <View style={[styles.statBox, { width: '50%' }]}>
              <Text style={[styles.statValue, { color: '#d32f2f' }]}>{overdueTasks}</Text>
              <Text style={[styles.statLabel, { color: labelColor }]}>Gecikenler</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 24, marginHorizontal: 20 }}>
          <CustomButton 
            title="Kategori Yönetimi" 
            onPress={() => navigation.navigate('CategoryManagement')} 
            variant="outline"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { borderRadius: 12, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600' },
  progressContainer: { marginTop: 8 },
  progressLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  progressBarBg: { height: 12, backgroundColor: '#e0e0e0', borderRadius: 6, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 6 },
});
