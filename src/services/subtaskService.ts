import apiClient from '../api/apiClient';

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
}

export const getSubtasksByTaskId = async (taskId: string): Promise<Subtask[]> => {
  const response = await apiClient.get(`/subtasks?taskId=${taskId}`);
  return response.data;
};

export const createSubtask = async (subtask: Omit<Subtask, 'id'>): Promise<Subtask> => {
  const response = await apiClient.post('/subtasks', subtask);
  return response.data;
};

export const updateSubtask = async (id: string, updates: Partial<Subtask>): Promise<Subtask> => {
  const response = await apiClient.patch(`/subtasks/${id}`, updates);
  return response.data;
};

export const deleteSubtask = async (id: string): Promise<void> => {
  await apiClient.delete(`/subtasks/${id}`);
};
