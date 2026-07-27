export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatar?: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  message: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  taskId: string;
  action: string;
  userId: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string; 
  createdAt: string;
  ownerId: string;
  assignedTo?: string;
  contributorIds: string[];
  categoryId?: string;
  subtasks?: any[];
}

export type RootStackParamList = {
  TaskList: undefined;
  TaskAdd: { taskToEdit?: string } | undefined;
  TaskDetail: { taskId: string };
  Statistics: undefined;
  Profile: undefined;
  CategoryManagement: undefined;
};