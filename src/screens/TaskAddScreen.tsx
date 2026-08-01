import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';

import { RootStackParamList, Priority } from '../types';
import useTaskStore from '../stores/taskStore';
import useCategoryStore from '../stores/categoryStore';
import useUIStore from '../stores/uiStore';
import useAuthStore from '../stores/authStore';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import TaskPrioritySelector from '../components/TaskPrioritySelector';
import TaskCategorySelector from '../components/TaskCategorySelector';
import TaskDatePicker from '../components/TaskDatePicker';
import TaskStatusSelector from '../components/TaskStatusSelector';
import { createActivity } from '../services/activityService';

import { taskAddStyles as styles } from './TaskAddScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskAdd'>;

export default function TaskAddScreen({ route, navigation }: Props) {
  const { tasks, addTask, updateTask } = useTaskStore();
  const { isDarkMode } = useUIStore();
  const { categories, fetchCategories } = useCategoryStore();
  
  const taskId = route.params?.taskToEdit;
  const isEditing = !!taskId;

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { title: '', description: '', priority: 'medium' as Priority, categoryId: '', status: 'pending' as any }
  });
  const selectedPriority = watch('priority');
  const selectedCategory = watch('categoryId');
  const selectedStatus = watch('status');

  // State
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const panelBg = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const labelColor = isDarkMode ? '#aaa' : '#666';
  const borderColor = isDarkMode ? '#333' : '#e0e0e0';

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (isEditing) {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (taskToUpdate) {
        setValue('title', taskToUpdate.title);
        setValue('description', taskToUpdate.description || '');
        // @ts-ignore
        setValue('priority', taskToUpdate.priority || 'medium');
        setValue('categoryId', taskToUpdate.categoryId || '');
        setValue('status', taskToUpdate.status || 'pending');
        
        if (taskToUpdate.dueDate) {
          const parsed = new Date(taskToUpdate.dueDate);
          if (!isNaN(parsed.getTime())) {
             setDueDate(parsed);
             setIsDateSelected(true);
          } else {
             const parts = taskToUpdate.dueDate.split(/[./-]/);
             if (parts.length === 3) {
               const oldParsed = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
               if (!isNaN(oldParsed.getTime())) {
                 setDueDate(oldParsed);
                 setIsDateSelected(true);
               }
             }
          }
        }
      }
    }
  }, [isEditing, taskId, tasks, setValue]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    const dateString = isDateSelected ? dueDate.toISOString() : '';

    try {
      if (isEditing && taskId) {
        await updateTask(taskId, { ...data, dueDate: dateString });
        await createActivity({ taskId, action: 'Görev düzenlendi.', userId: useAuthStore.getState().user?.email || 'Bilinmeyen Kullanıcı', createdAt: new Date().toISOString() });
      } else {
        const { user } = useAuthStore.getState();
        const newTaskData = { 
          ...data, 
          dueDate: dateString,
          ownerId: user?.uid || 'unknown-user',
          contributorIds: []
        };
        const addedTask = await addTask(newTaskData);
        await createActivity({ taskId: addedTask.id, action: 'Görev oluşturuldu.', userId: user?.email || 'Bilinmeyen Kullanıcı', createdAt: new Date().toISOString() });
      }
      setIsSaving(false);
      useUIStore.getState().setActiveFilter('Tümü');
      navigation.goBack();
    } catch (error: any) {
      setIsSaving(false);
      Alert.alert('Hata', error.message || 'Görev kaydedilemedi.');
    }
  };

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={[styles.container, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Controller
            control={control}
            rules={{ required: 'Görev başlığı zorunludur.' }}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Görev Başlığı *"
                placeholder="Örn: React Native projesini tamamla"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message?.toString()}
              />
            )}
            name="title"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Açıklama"
                placeholder="Görev detaylarını buraya yazabilirsiniz..."
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
              />
            )}
            name="description"
          />

          <TaskStatusSelector
            value={selectedStatus}
            onChange={(s) => setValue('status', s)}
          />

          <TaskPrioritySelector
            selectedPriority={selectedPriority}
            onSelect={(p) => setValue('priority', p)}
            panelBg={panelBg}
            borderColor={borderColor}
            textColor={textColor}
            labelColor={labelColor}
          />

          <TaskCategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={(id) => setValue('categoryId', id)}
            panelBg={panelBg}
            borderColor={borderColor}
            textColor={textColor}
            labelColor={labelColor}
          />

          <TaskDatePicker
            dueDate={dueDate}
            setDueDate={setDueDate}
            isDateSelected={isDateSelected}
            setIsDateSelected={setIsDateSelected}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            panelBg={panelBg}
            borderColor={borderColor}
            textColor={textColor}
            labelColor={labelColor}
            isDarkMode={isDarkMode}
          />

          <View style={styles.footer}>
            <CustomButton 
              title={isEditing ? "Değişiklikleri Kaydet" : "Görevi Kaydet"} 
              onPress={handleSubmit(onSubmit)} 
              isLoading={isSaving}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}