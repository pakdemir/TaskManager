import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Ekranlarımızı içeri aktarıyoruz
import TaskListScreen from '../screens/TaskListScreen';
import TaskAddScreen from '../screens/TaskAddScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import ProfileScreen from '../screens/ProfileScreen'; 
import CategoryManagementScreen from '../screens/CategoryManagementScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="TaskList"
      screenOptions={{
        headerStyle: { backgroundColor: '#007BFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="TaskList" 
        component={TaskListScreen} 
        options={{ title: 'Görevlerim' }} 
      />
      <Stack.Screen 
        name="TaskAdd" 
        component={TaskAddScreen} 
        options={{ title: 'Görev Ekle' }} 
      />
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetailScreen} 
        options={{ title: 'Görev Detayı' }} 
      />
      <Stack.Screen 
        name="Statistics" 
        component={StatisticsScreen} 
        options={{ title: 'İstatistikler' }} 
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profilim' }} 
      />
      <Stack.Screen 
        name="CategoryManagement" 
        component={CategoryManagementScreen} 
        options={{ title: 'Kategoriler', headerShown: false }} 
      />
    </Stack.Navigator>
  );
}