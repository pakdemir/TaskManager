import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { taskAddStyles as styles } from '../screens/TaskAddScreen.styles';

interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface TaskSubtaskListProps {
  subtasks: Subtask[];
  setSubtasks: (tasks: Subtask[]) => void;
  panelBg: string;
  borderColor: string;
  textColor: string;
  labelColor: string;
}

export default function TaskSubtaskList({
  subtasks,
  setSubtasks,
  panelBg,
  borderColor,
  textColor,
  labelColor
}: TaskSubtaskListProps) {

  const addSubtask = () => {
    setSubtasks([
      ...subtasks, 
      { id: Math.random().toString(36).substr(2, 9), title: '', isCompleted: false }
    ]);
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const updateSubtask = (id: string, val: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, title: val } : s));
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: labelColor }]}>Alt Görevler</Text>
      {subtasks.map((st) => (
        <View key={st.id} style={styles.subtaskRow}>
          <TextInput
            style={[styles.subtaskInput, { borderColor, color: textColor, backgroundColor: panelBg }]}
            value={st.title}
            onChangeText={(val) => updateSubtask(st.id, val)}
            placeholder="Alt görev başlığı..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={() => removeSubtask(st.id)} style={styles.subtaskDeleteBtn}>
            <Text style={styles.subtaskDeleteText}>Sil</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addSubtask} style={styles.addSubtaskBtn}>
        <Text style={styles.addSubtaskText}>+ Alt Görev Ekle</Text>
      </TouchableOpacity>
    </View>
  );
}
