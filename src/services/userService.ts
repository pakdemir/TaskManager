import apiClient from '../api/apiClient';

export interface User { id: string; email: string; displayName?: string; avatar?: string; }

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const getUserByEmail = async (email: string): Promise<User[]> => {
  const response = await apiClient.get(`/users?email=${encodeURIComponent(email)}`);
  return response.data;
};
