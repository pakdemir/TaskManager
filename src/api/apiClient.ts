import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

let serverIP = '0.0.0.0';

// Eğer Expo Go ile çalışıyorsak (Fiziksel cihaz), bilgisayarın IP'sini Expo'dan otomatik al
const debuggerHost = Constants.expoConfig?.hostUri;
if (debuggerHost) {
  serverIP = debuggerHost.split(':')[0];
}

// Android emülatörde çalışıyorsa host'a en güvenli bağlanma yöntemi 10.0.2.2'dir (Güvenlik duvarını bypass eder)
if (Platform.OS === 'android' && !Constants.isDevice) {
  serverIP = '10.0.2.2';
} else if (Platform.OS === 'android' && (serverIP === 'localhost' || serverIP === '127.0.0.1')) {
  serverIP = '10.0.2.2';
}

// iOS Simulator için localhost kullanabiliriz
if (Platform.OS === 'ios' && !debuggerHost) {
  serverIP = 'localhost';
}

// Üniversite/Ortak ağ izolasyonunu aşmak için geçici olarak Localtunnel URL'i kullanıyoruz.
const BASE_URL = `http://${serverIP}:3000`;
console.log('📡 API BASE_URL:', BASE_URL); // Debug için eklendi

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true', // Localtunnel uyarı sayfasını atlamak için çok önemli
  },
  timeout: 30000, // Artırılmış timeout süresi (30 saniye)
});

// Response interceptor ekleyerek daha detaylı hata loglaması ve kontrol yapıyoruz
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let friendlyMessage = 'Sunucuyla iletişim kurulurken bir hata oluştu.';
    
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error(`[API Timeout]: İstek zaman aşımına uğradı. (${BASE_URL})`);
      friendlyMessage = 'İşlem zaman aşımına uğradı. Sunucu şu anda yanıt vermiyor. Lütfen uygulamanın arka plan servisinin (json-server) çalıştığından emin olun.';
    } else if (!error.response) {
      console.error(`[API Network Error]: Sunucuya bağlanılamadı. (${BASE_URL})`);
      friendlyMessage = 'Sunucuya bağlanılamadı! Lütfen "npm run dev" komutunun çalıştığından ve cihazınızın aynı ağda olduğundan emin olun.';
    } else {
      console.error(`[API Error]: ${error.response.status} - ${error.message}`);
      friendlyMessage = `Sunucu hatası: ${error.response.status}`;
    }
    
    // UI'da Alert ile gösterilebilmesi için error message'i override ediyoruz
    error.message = friendlyMessage;
    
    return Promise.reject(error);
  }
);

export default apiClient;
