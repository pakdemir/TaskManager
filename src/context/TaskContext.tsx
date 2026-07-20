import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

interface TaskContextData {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updatedData: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  // EKLENENLER: Karanlık mod state'i ve değiştirme fonksiyonu
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const TaskContext = createContext<TaskContextData | undefined>(undefined);

const TASKS_STORAGE_KEY = '@tasks_data';
const THEME_STORAGE_KEY = '@theme_data'; // Tema için yeni anahtar

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false); // Varsayılan aydınlık
  const [isLoaded, setIsLoaded] = useState(false);

  // Uygulama Açıldığında: Hem görevleri hem de tema tercihini diskten oku
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (storedTasks) setTasks(JSON.parse(storedTasks));

        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) setIsDarkMode(JSON.parse(storedTheme));
      } catch (error) {
        console.error("Veriler yüklenirken hata:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // Görevler değiştiğinde kaydet
  useEffect(() => {
    const saveTasks = async () => {
      if (isLoaded) await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    };
    saveTasks();
  }, [tasks, isLoaded]);

  // Tema değiştiğinde diske kaydet
  useEffect(() => {
    const saveTheme = async () => {
      if (isLoaded) await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
    };
    saveTheme();
  }, [isDarkMode, isLoaded]);

  // Temayı tersine çeviren fonksiyon
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // ... (addTask, toggleTaskCompletion, deleteTask, updateTask fonksiyonları öncekiyle birebir aynı)
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...taskData, id: Math.random().toString(36).substring(2, 9), createdAt: Date.now() };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => task.id === id ? { ...task, isCompleted: !task.isCompleted } : task));
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, updatedData: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prevTasks) => prevTasks.map((task) => task.id === id ? { ...task, ...updatedData } : task));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTaskCompletion, deleteTask, updateTask, isDarkMode, toggleTheme }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks hatası');
  return context;
};