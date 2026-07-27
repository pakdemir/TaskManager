import { Task } from '../types';

export type FilterType = 'Tümü' | 'Bekleyenler' | 'Tamamlananlar' | 'Görevlerim' | 'Bana Atananlar' | 'Katkıda Bulunduklarım' | 'Benimle Paylaşılanlar';
export type SortType = 'Yeni' | 'Eski';

interface FilterOptions {
  activeFilter: FilterType;
  activeCategoryId: string | null;
  searchQuery: string;
  sortOrder: SortType;
  userId?: string;
}

export const filterAndSortTasks = (tasks: Task[], options: FilterOptions): Task[] => {
  const { activeFilter, activeCategoryId, searchQuery, sortOrder, userId } = options;

  return tasks
    .filter((t) => {
      if (activeFilter === 'Bekleyenler') return t.status !== 'completed';
      if (activeFilter === 'Tamamlananlar') return t.status === 'completed';
      if (activeFilter === 'Görevlerim') return t.ownerId === userId;
      if (activeFilter === 'Bana Atananlar') return t.assignedTo === userId;
      if (activeFilter === 'Katkıda Bulunduklarım') return t.contributorIds?.includes(userId || '');
      if (activeFilter === 'Benimle Paylaşılanlar') return t.assignedTo === userId || t.contributorIds?.includes(userId || '');
      return true;
    })
    .filter((t) => (activeCategoryId ? t.categoryId === activeCategoryId : true))
    .filter((t) => searchQuery.trim() === '' || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'Yeni' ? timeB - timeA : timeA - timeB;
    });
};
