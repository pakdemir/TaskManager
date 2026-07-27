import apiClient from '../api/apiClient';

export interface Activity {
  id: string;
  taskId: string;
  action: string;
  userId: string;
  createdAt: string;
}

export const getActivitiesByTaskId = async (taskId: string): Promise<Activity[]> => {
  const response = await apiClient.get(`/activities?taskId=${taskId}`);
  return response.data;
};

export const createActivity = async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
  const response = await apiClient.post('/activities', activity);
  return response.data;
};
