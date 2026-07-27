import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import useTaskStore from '../stores/taskStore';
import useUIStore from '../stores/uiStore';
import useAuthStore from '../stores/authStore';
import CustomButton from '../components/CustomButton';
import { CheckCircle, Clock } from 'lucide-react-native';

import { getCommentsByTaskId, createComment, deleteComment, updateComment } from '../services/commentService';
import { getSubtasksByTaskId, createSubtask, updateSubtask, deleteSubtask } from '../services/subtaskService';
import { getActivitiesByTaskId, createActivity } from '../services/activityService';
import { getUserByEmail } from '../services/userService';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen({ route, navigation }: Props) {
  const { taskId } = route.params;
  const { tasks, updateTask, deleteTask } = useTaskStore();
  const { isDarkMode } = useUIStore();
  const { user } = useAuthStore();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  
  const [comments, setComments] = useState<any[]>([]);
  const [subtasks, setSubtasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  const [newCommentText, setNewCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editSubtaskText, setEditSubtaskText] = useState('');
  
  const [newAssigneeEmail, setNewAssigneeEmail] = useState('');
  const [newContributorEmail, setNewContributorEmail] = useState('');

  const bgColor = isDarkMode ? '#121212' : '#f9f9f9';
  const panelColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const subTextColor = isDarkMode ? '#aaa' : '#444';
  const labelColor = isDarkMode ? '#ccc' : '#555';
  const borderColor = isDarkMode ? '#333' : '#eee';

  const task = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    if (taskId) {
      loadRelatedData();
    }
  }, [taskId]);

  const loadRelatedData = async () => {
    try {
      const [c, s, a] = await Promise.all([
        getCommentsByTaskId(taskId),
        getSubtasksByTaskId(taskId),
        getActivitiesByTaskId(taskId)
      ]);
      setComments(c);
      setSubtasks(s);
      setActivities(a.sort((x,y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()));
    } catch (e) {
      console.error('Veriler yüklenemedi:', e);
    }
  };

  const addActivityRecord = async (action: string) => {
    try {
      const act = await createActivity({
        taskId,
        action,
        userId: user?.email || user?.uid || 'Bilinmeyen',
        createdAt: new Date().toISOString()
      });
      setActivities([act, ...activities]);
    } catch (e) {
      console.error('Aktivite eklenemedi:', e);
    }
  };

  if (!task) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: bgColor }]}>
        <Text style={styles.errorText}>Görev bulunamadı!</Text>
        <CustomButton title="Listeye Dön" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert("Görevi Sil", "Bu görevi tamamen silmek istediğinize emin misiniz?", [
        { text: "İptal", style: "cancel" },
        { text: "Sil", style: "destructive", onPress: () => {
            setIsDeleting(true);
            setTimeout(() => { deleteTask(taskId); navigation.goBack(); }, 400);
        }}
    ]);
  };

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const isCompleted = task.status === 'completed';
      const newStatus = isCompleted ? 'pending' : 'completed';
      const newAction = isCompleted ? 'Görev bekliyor olarak işaretlendi.' : 'Görev tamamlandı olarak işaretlendi.';
      await updateTask(taskId, { status: newStatus });
      await addActivityRecord(newAction);
    } catch (e) {
      console.error(e);
    }
    setIsToggling(false);
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;
    try {
      const newComment = await createComment({
        taskId,
        message: newCommentText.trim(),
        authorId: user?.email || user?.uid || 'Anonim',
        createdAt: new Date().toISOString()
      });
      setComments([...comments, newComment]);
      await addActivityRecord('Yorum eklendi.');
      setNewCommentText('');
    } catch (e) {
      Alert.alert('Hata', 'Yorum eklenemedi.');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert("Emin misiniz?", "Bu yorumu silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: async () => {
          await deleteComment(commentId);
          setComments(comments.filter(c => c.id !== commentId));
          await addActivityRecord('Bir yorum silindi.');
      }}
    ]);
  };

  const startEditingComment = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.message);
  };

  const handleEditComment = async () => {
    if (!editCommentText.trim() || !editingCommentId) return;
    try {
      const updated = await updateComment(editingCommentId, { message: editCommentText.trim() });
      setComments(comments.map(c => c.id === editingCommentId ? updated : c));
      await addActivityRecord('Bir yorum düzenlendi.');
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (e) {
      Alert.alert('Hata', 'Yorum düzenlenemedi.');
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskText.trim()) return;
    try {
      const st = await createSubtask({ taskId, title: newSubtaskText.trim(), isCompleted: false });
      setSubtasks([...subtasks, st]);
      await addActivityRecord('Alt görev eklendi.');
      setNewSubtaskText('');
    } catch (e) {
      Alert.alert('Hata', 'Alt görev eklenemedi.');
    }
  };

  const handleToggleSubtask = async (subtaskId: string, currentStatus: boolean) => {
    try {
      const updated = await updateSubtask(subtaskId, { isCompleted: !currentStatus });
      setSubtasks(subtasks.map(st => st.id === subtaskId ? updated : st));
      await addActivityRecord(!currentStatus ? 'Alt görev tamamlandı.' : 'Alt görev beklemeye alındı.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    Alert.alert("Emin misiniz?", "Bu alt görevi silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: async () => {
          await deleteSubtask(subtaskId);
          setSubtasks(subtasks.filter(st => st.id !== subtaskId));
          await addActivityRecord('Alt görev silindi.');
      }}
    ]);
  };

  const startEditingSubtask = (st: any) => {
    setEditingSubtaskId(st.id);
    setEditSubtaskText(st.title);
  };

  const handleEditSubtask = async () => {
    if (!editSubtaskText.trim() || !editingSubtaskId) return;
    try {
      const updated = await updateSubtask(editingSubtaskId, { title: editSubtaskText.trim() });
      setSubtasks(subtasks.map(s => s.id === editingSubtaskId ? updated : s));
      await addActivityRecord('Alt görev düzenlendi.');
      setEditingSubtaskId(null);
      setEditSubtaskText('');
    } catch (e) {
      Alert.alert('Hata', 'Alt görev düzenlenemedi.');
    }
  };

  const handleUpdateAssignee = async () => {
    if (!newAssigneeEmail.trim()) return;
    try {
      const users = await getUserByEmail(newAssigneeEmail.trim());
      if (users.length === 0) return Alert.alert('Hata', 'Bu e-posta ile kullanıcı bulunamadı.');
      await updateTask(taskId, { assignedTo: users[0].id });
      await addActivityRecord(`Görev ${users[0].email} kişisine atandı.`);
      setNewAssigneeEmail('');
    } catch (e) {
      Alert.alert('Hata', 'Atama yapılamadı.');
    }
  };

  const handleAddContributor = async () => {
    if (!newContributorEmail.trim()) return;
    try {
      const users = await getUserByEmail(newContributorEmail.trim());
      if (users.length === 0) return Alert.alert('Hata', 'Bu e-posta ile kullanıcı bulunamadı.');
      
      const current = task.contributorIds || [];
      if (!current.includes(users[0].id)) {
        await updateTask(taskId, { contributorIds: [...current, users[0].id] });
        await addActivityRecord(`${users[0].email} katılımcı olarak eklendi.`);
      }
      setNewContributorEmail('');
    } catch (e) {
      Alert.alert('Hata', 'Katılımcı eklenemedi.');
    }
  };

  const handleRemoveContributor = async (id: string) => {
    const current = task.contributorIds || [];
    await updateTask(taskId, { contributorIds: current.filter(c => c !== id) });
    await addActivityRecord('Bir katılımcı çıkarıldı.');
  };

  const renderAvatar = (id: string, label: string) => {
    if (!id) return null;
    return (
      <View style={{ alignItems: 'center', marginRight: 16 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#007BFF', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{id.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={{ color: subTextColor, fontSize: 10 }}>{label}</Text>
        <Text style={{ color: textColor, fontSize: 12, maxWidth: 60 }} numberOfLines={1}>{id}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>{task.title}</Text>
          <Text style={[styles.priorityBadge, { color: subTextColor }]}>
            Öncelik: {task.priority === 'urgent' ? 'Acil' : task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: labelColor }]}>Durum:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            {task.status === 'completed' ? (
              <CheckCircle size={18} color={isDarkMode ? '#81c784' : 'green'} />
            ) : (
              <Clock size={18} color="#ff9800" />
            )}
            <Text style={[styles.value, { marginLeft: 8, color: task.status === 'completed' ? (isDarkMode ? '#81c784' : 'green') : '#ff9800' }]}>
              {task.status === 'completed' ? 'Tamamlandı' : 
               task.status === 'in_progress' ? 'Devam Ediyor' : 
               task.status === 'cancelled' ? 'İptal Edildi' : 'Bekliyor'}
            </Text>
          </View>
        </View>

        {task.dueDate && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: labelColor }]}>Son Tarih:</Text>
            <Text style={[styles.value, { color: textColor }]}>
              {new Date(task.dueDate).toLocaleDateString('tr-TR') !== 'Invalid Date' 
                ? new Date(task.dueDate).toLocaleDateString('tr-TR') 
                : task.dueDate}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.label, { color: labelColor }]}>Açıklama:</Text>
          <Text style={[styles.description, { color: subTextColor }]}>
            {task.description || 'Bu görev için açıklama eklenmemiş.'}
          </Text>
        </View>

        {/* Alt Görevler */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: labelColor, fontSize: 18, marginBottom: 12 }]}>
            Alt Görevler {subtasks.length > 0 && `(${subtasks.filter(s => s.isCompleted).length}/${subtasks.length})`}
          </Text>
          
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <TextInput style={[styles.commentInput, { backgroundColor: isDarkMode ? '#2a2a2a' : '#eaeaea', color: textColor }]} placeholder="Alt görev yaz..." placeholderTextColor={subTextColor} value={newSubtaskText} onChangeText={setNewSubtaskText} />
            <TouchableOpacity style={styles.commentBtn} onPress={handleAddSubtask}><Text style={styles.commentBtnText}>Ekle</Text></TouchableOpacity>
          </View>

          {subtasks.map((st) => (
            <View key={st.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, padding: 8, backgroundColor: panelColor, borderRadius: 8 }}>
              {editingSubtaskId === st.id ? (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <TextInput style={[styles.commentInput, { flex: 1, backgroundColor: isDarkMode ? '#333' : '#fff', color: textColor, padding: 4 }]} value={editSubtaskText} onChangeText={setEditSubtaskText} />
                  <TouchableOpacity onPress={handleEditSubtask} style={{ padding: 8 }}><Text style={{ color: '#007BFF' }}>Kaydet</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingSubtaskId(null)} style={{ padding: 8 }}><Text style={{ color: 'red' }}>İptal</Text></TouchableOpacity>
                </View>
              ) : (
                <>
                  <TouchableOpacity onPress={() => handleToggleSubtask(st.id, st.isCompleted)}>
                    {st.isCompleted ? <CheckCircle size={20} color="#007BFF" /> : <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#007BFF' }} />}
                  </TouchableOpacity>
                  <Text style={{ flex: 1, marginLeft: 8, color: textColor, textDecorationLine: st.isCompleted ? 'line-through' : 'none' }}>{st.title}</Text>
                  <TouchableOpacity onPress={() => startEditingSubtask(st)} style={{ marginRight: 12 }}><Text style={{ color: '#007BFF', fontSize: 12 }}>Düzenle</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteSubtask(st.id)}><Text style={{ color: 'red', fontSize: 12 }}>Sil</Text></TouchableOpacity>
                </>
              )}
            </View>
          ))}
        </View>

        {/* Katılımcılar */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: labelColor, fontSize: 18, marginBottom: 12 }]}>Katılımcılar</Text>
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            {task.ownerId && renderAvatar(task.ownerId, 'Sahip')}
            {task.assignedTo && renderAvatar(task.assignedTo, 'Atanan')}
          </View>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: subTextColor, marginBottom: 4 }}>Atanan Güncelle (Email):</Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput style={[styles.commentInput, { backgroundColor: isDarkMode ? '#2a2a2a' : '#eaeaea', color: textColor }]} placeholder="ornek@mail.com" placeholderTextColor={subTextColor} value={newAssigneeEmail} onChangeText={setNewAssigneeEmail} autoCapitalize="none" />
              <TouchableOpacity style={styles.commentBtn} onPress={handleUpdateAssignee}><Text style={styles.commentBtnText}>Ata</Text></TouchableOpacity>
            </View>
          </View>

          {task.contributorIds && task.contributorIds.length > 0 && (
             <View style={{ marginBottom: 12 }}>
               <Text style={{ color: subTextColor, marginBottom: 8 }}>Katkıda Bulunanlar:</Text>
               {task.contributorIds.map(cid => (
                 <View key={cid} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                   {renderAvatar(cid, 'Katkıda Bulunan')}
                   <TouchableOpacity onPress={() => handleRemoveContributor(cid)}><Text style={{ color: 'red' }}>Çıkar</Text></TouchableOpacity>
                 </View>
               ))}
             </View>
          )}

          <View>
            <Text style={{ color: subTextColor, marginBottom: 4 }}>Katkıda Bulunan Ekle (Email):</Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput style={[styles.commentInput, { backgroundColor: isDarkMode ? '#2a2a2a' : '#eaeaea', color: textColor }]} placeholder="ornek@mail.com" placeholderTextColor={subTextColor} value={newContributorEmail} onChangeText={setNewContributorEmail} autoCapitalize="none" />
              <TouchableOpacity style={styles.commentBtn} onPress={handleAddContributor}><Text style={styles.commentBtnText}>Ekle</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Yorumlar */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: labelColor, fontSize: 18, marginBottom: 12 }]}>Yorumlar</Text>
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <TextInput style={[styles.commentInput, { backgroundColor: isDarkMode ? '#2a2a2a' : '#eaeaea', color: textColor }]} placeholder="Yorumunuzu yazın..." placeholderTextColor={subTextColor} value={newCommentText} onChangeText={setNewCommentText} />
            <TouchableOpacity style={styles.commentBtn} onPress={handleAddComment}><Text style={styles.commentBtnText}>Ekle</Text></TouchableOpacity>
          </View>
          {comments.map((comment) => (
            <View key={comment.id} style={[styles.commentItem, { backgroundColor: isDarkMode ? '#222' : '#f1f1f1' }]}>
              {editingCommentId === comment.id ? (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <TextInput style={[styles.commentInput, { flex: 1, backgroundColor: isDarkMode ? '#333' : '#fff', color: textColor, padding: 4 }]} value={editCommentText} onChangeText={setEditCommentText} />
                  <TouchableOpacity onPress={handleEditComment} style={{ padding: 8 }}><Text style={{ color: '#007BFF' }}>Kaydet</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingCommentId(null)} style={{ padding: 8 }}><Text style={{ color: 'red' }}>İptal</Text></TouchableOpacity>
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  <Text style={{ color: subTextColor, fontSize: 10, marginBottom: 4 }}>{new Date(comment.createdAt).toLocaleString()} - {comment.authorId}</Text>
                  <Text style={{ color: textColor }}>{comment.message}</Text>
                  {(comment.authorId === user?.uid || comment.authorId === user?.email) && (
                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                      <TouchableOpacity onPress={() => startEditingComment(comment)} style={{ marginRight: 12 }}><Text style={{ color: '#007BFF', fontSize: 12 }}>Düzenle</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}><Text style={{ color: 'red', fontSize: 12 }}>Sil</Text></TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
          {comments.length === 0 && <Text style={{ color: subTextColor, fontStyle: 'italic' }}>Henüz yorum yok.</Text>}
        </View>

        {/* Aktiviteler */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: labelColor, fontSize: 18, marginBottom: 12 }]}>Aktivite Geçmişi</Text>
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#007BFF', marginRight: 8, marginTop: 4 }} />
              <View>
                <Text style={{ color: textColor }}>{activity.action}</Text>
                <Text style={{ color: subTextColor, fontSize: 10 }}>{new Date(activity.createdAt).toLocaleString()} - {activity.userId}</Text>
              </View>
            </View>
          ))}
          {activities.length === 0 && <Text style={{ color: subTextColor, fontStyle: 'italic' }}>Henüz aktivite yok.</Text>}
        </View>

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: panelColor, borderTopColor: borderColor }]}>
        <CustomButton title={task.status === 'completed' ? "Tekrar Bekliyor'a Al" : "Tamamlandı İşaretle"} onPress={handleToggle} variant="outline" isLoading={isToggling} />
        <CustomButton title="Düzenle" onPress={() => navigation.navigate('TaskAdd', { taskToEdit: taskId })} disabled={isToggling || isDeleting} />
        <CustomButton title="Görevi Sil" onPress={handleDelete} variant="danger" isLoading={isDeleting} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, color: 'red', marginBottom: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  header: { marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  priorityBadge: { fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '500' },
  description: { fontSize: 16, lineHeight: 24 },
  footer: { padding: 20, borderTopWidth: 1 },
  commentInput: { flex: 1, borderRadius: 8, padding: 12, marginRight: 8 },
  commentBtn: { backgroundColor: '#007BFF', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  commentBtnText: { color: '#fff', fontWeight: 'bold' },
  commentItem: { padding: 12, borderRadius: 8, marginBottom: 8 },
  activityItem: { flexDirection: 'row', marginBottom: 12 },
});