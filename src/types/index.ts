export type Priority = 'Düşük' | 'Orta' | 'Yüksek';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string; 
  isCompleted: boolean;
  createdAt: number;
}

export type RootStackParamList = {
  TaskList: undefined;
  TaskAdd: { taskToEdit?: string } | undefined;
  TaskDetail: { taskId: string };
  Statistics: undefined;
};