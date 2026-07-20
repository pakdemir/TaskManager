// src/services/api.ts

// NOT: Android emülatör kullanıyorsan localhost yerine 10.0.2.2 kullanmalısın.
// iOS simülatör kullanıyorsan 'http://localhost:3000' yazabilirsin.
const BASE_URL = 'http://10.0.2.2:3000';

export const fetchTasks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tasks`);
    
    if (!response.ok) {
      throw new Error('Ağ yanıtı başarısız oldu');
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Görevler çekilirken bir hata oluştu:", error);
    throw error;
  }
};
