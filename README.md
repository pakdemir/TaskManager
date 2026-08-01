# TaskManager

TaskManager, kullanıcıların günlük görevlerini oluşturmasını, düzenlemesini, silmesini ve takip etmesini sağlayan React Native tabanlı bir mobil görev yönetimi uygulamasıdır.

Bu proje, Codlean Teknoloji A.Ş. bünyesinde gerçekleştirdiğim zorunlu yaz stajı kapsamında geliştirilmiştir.

## Özellikler

- Kullanıcı kayıt ve giriş işlemleri
- Firebase Authentication entegrasyonu
- Görev oluşturma, listeleme, güncelleme ve silme
- Görev durumu ve öncelik yönetimi
- Görevleri kategorilere ayırma
- Görev arama ve filtreleme
- Alt görev oluşturma
- Görevlere yorum ekleme
- Aktivite geçmişini görüntüleme
- Açık ve koyu tema desteği
- AsyncStorage ile yerel veri saklama
- Zustand ile merkezi durum yönetimi
- JSON Server tabanlı REST API entegrasyonu

## Kullanılan Teknolojiler

- React Native
- Expo
- TypeScript
- Zustand
- Firebase Authentication
- React Hook Form
- React Navigation
- Axios
- AsyncStorage
- JSON Server
- Lucide React Native

## Proje Yapısı

```text
TaskManager
├── src
│   ├── api
│   ├── components
│   ├── firebase
│   ├── navigation
│   ├── screens
│   ├── services
│   ├── stores
│   └── types
├── App.tsx
├── db.json
├── package.json
└── README.md
```

## Kurulum

Projeyi bilgisayarınıza klonlayın:

```bash
git clone https://github.com/pakdemir/TaskManager.git
```

Proje klasörüne girin:

```bash
cd TaskManager
```

Gerekli paketleri yükleyin:

```bash
npm install
```

JSON Server'ı çalıştırın:

```bash
npx json-server --watch db.json --port 3000
```

Uygulamayı başlatın:

```bash
npx expo start
```

## Kullanım

1. Uygulamayı başlatın.
2. Yeni bir kullanıcı hesabı oluşturun veya mevcut hesabınızla giriş yapın.
3. Ana ekran üzerinden yeni görev oluşturun.
4. Görevin durumunu, önceliğini, kategorisini ve teslim tarihini belirleyin.
5. Oluşturulan görevleri düzenleyin, tamamlayın veya silin.

## Geliştirici

**Halime Sude Pakdemir**

Düzce Üniversitesi  
Bilgisayar Mühendisliği

## Proje Bağlantısı

[TaskManager GitHub Deposu](https://github.com/pakdemir/TaskManager)