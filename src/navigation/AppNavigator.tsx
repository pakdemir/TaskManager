import React from 'react';
import { View, TouchableOpacity, Switch } from 'react-native';
import { Menu, MoreVertical, User } from 'lucide-react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import useUIStore from '../stores/uiStore';

// Ekranlarımızı içeri aktarıyoruz
import TaskListScreen from '../screens/TaskListScreen';
import TaskAddScreen from '../screens/TaskAddScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import ProfileScreen from '../screens/ProfileScreen'; 
import CategoryManagementScreen from '../screens/CategoryManagementScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { setSidebarOpen, isDarkMode, toggleTheme } = useUIStore();

  return (
    <Stack.Navigator 
      initialRouteName="TaskList"
      screenOptions={{
        headerStyle: { backgroundColor: '#3B82F6' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="TaskList" 
        component={TaskListScreen} 
        options={({ navigation }: any) => ({ 
          title: 'Görevlerim',
          headerLeft: () => (
            <TouchableOpacity onPress={() => setSidebarOpen(true)} style={{ marginLeft: 10 }}>
              <Menu size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ marginRight: 15 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }}>
                  <User size={18} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
          )
        })} 
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
        options={{ title: 'Kategoriler' }} 
      />
    </Stack.Navigator>
  );
}