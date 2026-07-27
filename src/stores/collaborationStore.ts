import { create } from 'zustand';
import useAuthStore from './authStore';
import { Task } from '../types';

interface CollaborationState {
  collaborators: any[];
  getRoleForTask: (task: Task) => 'owner' | 'contributor' | 'none';
  canDeleteTask: (task: Task) => boolean;
  canEditTask: (task: Task) => boolean;
  setCollaborators: (collaborators: any[]) => void;
  reset: () => void;
}

const useCollaborationStore = create<CollaborationState>((set, get) => ({
  collaborators: [],
  
  getRoleForTask: (task: Task) => {
    const user = useAuthStore.getState().user;
    if (!user) return 'none';
    
    if (task.ownerId === user.uid) return 'owner';
    if (task.contributorIds?.includes(user.uid)) return 'contributor';
    
    // Fallback: If ownerId is missing, assume they can do whatever (for older tasks)
    if (!task.ownerId) return 'owner';
    
    return 'none';
  },
  
  canDeleteTask: (task: Task) => {
    return get().getRoleForTask(task) === 'owner';
  },
  
  canEditTask: (task: Task) => {
    const role = get().getRoleForTask(task);
    return role === 'owner' || role === 'contributor';
  },
  
  setCollaborators: (collaborators) => set({ collaborators }),
  reset: () => set({ collaborators: [] }),
}));

export default useCollaborationStore;
