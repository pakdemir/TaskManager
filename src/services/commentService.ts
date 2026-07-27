import apiClient from '../api/apiClient';

export interface Comment {
  id: string;
  taskId: string;
  message: string;
  authorId: string;
  createdAt: string;
}

export const getCommentsByTaskId = async (taskId: string): Promise<Comment[]> => {
  const response = await apiClient.get(`/comments?taskId=${taskId}`);
  return response.data;
};

export const createComment = async (comment: Omit<Comment, 'id'>): Promise<Comment> => {
  const response = await apiClient.post('/comments', comment);
  return response.data;
};

export const deleteComment = async (id: string): Promise<void> => {
  await apiClient.delete(`/comments/${id}`);
};

export const updateComment = async (id: string, updates: Partial<Comment>): Promise<Comment> => {
  const response = await apiClient.patch(`/comments/${id}`, updates);
  return response.data;
};
