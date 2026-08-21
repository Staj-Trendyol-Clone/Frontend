🛒 E-Ticaret Mobil Uygulaması

Expo + React Native + TypeScript kullanılarak geliştirilmiş, kullanıcı kimlik doğrulaması, ürün listeleme, favoriler, sepet, profil yönetimi ve sipariş akışı içeren modern bir e-ticaret mobil uygulaması.

---

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Proje Yapısı](#-proje-yapısı)
- [Klasörlerin Açıklaması](#-klasörlerin-açıklaması)
- [Gereksinimler](#-gereksinimler)
- [Kurulum](#-kurulum)
- [Çalıştırma](#-çalıştırma)
- [API Entegrasyonu](#-api-entegrasyonu)
- [Proje Mimarisi](#-proje-mimarisi)
- [Notlar](#-notlar)

---

## ✨ Özellikler

- ✅ **Kullanıcı Yönetimi**: Kayıt ve giriş işlemleri
- 🔐 **JWT Tabanlı Oturum Yönetimi**: Güvenli token yönetimi
- 🛍️ **Ürün Listesi & Detay**: Ürünlerin görüntülenmesi ve detaylı inceleme
- ❤️ **Favoriler**: Ürünleri favorilere ekle/çıkar
- 🛒 **Sepet Yönetimi**: Sepete ürün ekleme, çıkarma ve sepet badge göstergesi
- 📦 **Sipariş Akışı**: Ödeme ve sipariş tamamlanması
- 👤 **Profil Yönetimi**: Kişisel bilgileri görüntüleme ve güncelleme
- 🔎 **Arama Fonksiyonu**: Ürünleri aramak ve filtrelemek
- 💬 **Yorum Sistemi**: Ürünlere yorum yapabilme
- 🎨 **Modern Arayüz**: NativeWind/Tailwind CSS ile responsive tasarım
- 📱 **GraphQL API**: Verimli veri akışı

---

## 🛠️ Teknoloji Yığını

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| **React Native** | - | Mobile framework |
| **Expo** | 57 | Development platform |
| **Expo Router** | - | Navigation & routing |
| **TypeScript** | - | Type safety |
| **Apollo Client** | - | GraphQL client |
| **GraphQL** | - | API query language |
| **NativeWind** | - | Tailwind CSS for React Native |
| **AsyncStorage** | - | Local data persistence |
| **Lucide React Native** | - | Icon library |
| **ESLint** | - | Code linting |

---

## 📁 Proje Yapısı

```
To_Do_App/
├── app.json                          # Expo yapılandırması
├── babel.config.js                   # Babel ayarları
├── eslint.config.js                  # ESLint kuralları
├── metro.config.js                   # Metro bundler ayarları
├── tailwind.config.js                # Tailwind CSS yapılandırması
├── tsconfig.json                     # TypeScript ayarları
├── global.css                        # Global stil tanımları
├── package.json                      # Proje bağımlılıkları
├── README.md                         # Bu dosya
├── LICENSE                           # Lisans bilgisi
│
├── assets/                           # Statik dosyalar
│   ├── expo.icon/                    # Uygulama ikonları
│   │   ├── icon.json
│   │   └── Assets/
│   └── images/
│       └── tabIcons/                 # Tab navigasyon ikonları
│
└── src/                              # Kaynak kodu
    ├── app/                          # Uygulama ekranları ve yönlendirme
    │   ├── _layout.tsx               # Root layout
    │   │
    │   ├── (auth)/                   # Kimlik doğrulama ekranları
    │   │   ├── _layout.tsx
    │   │   ├── login.tsx             # Giriş ekranı
    │   │   └── register.tsx          # Kayıt ekranı
    │   │
    │   ├── (tabs)/                   # Sekmeli navigasyon
    │   │   ├── _layout.tsx           # Tab layout
    │   │   ├── index.tsx             # Ana sayfa (ürün listesi)
    │   │   ├── favorite.tsx          # Favoriler sekmesi
    │   │   ├── cart.tsx              # Sepet sekmesi
    │   │   ├── search.tsx            # Arama sekmesi
    │   │   └── profile/              # Profil bölümü
    │   │       ├── _layout.tsx
    │   │       ├── index.tsx         # Profil sayfası
    │   │       └── oldOrders.tsx     # Eski siparişler
    │   │
    │   ├── product/                  # Ürün detay sayfası
    │   │   └── [id].tsx              # Dinamik ürün ID rotası
    │   │
    │   ├── checkout/                 # Ödeme ve sipariş akışı
    │   │   ├── _layout.tsx
    │   │   ├── index.tsx             # Ödeme sayfası
    │   │   └── succes.tsx            # Başarı sayfası
    │   │
    │   ├── graphql/                  # GraphQL konfigürasyonu ve sorgular
    │   │   ├── client.ts             # Apollo Client kurulumu
    │   │   ├── authLogin.ts          # Giriş mutationları
    │   │   ├── authRegister.ts       # Kayıt mutationları
    │   │   ├── card.ts               # Sepet/Kart sorgular
    │   │   ├── comment.ts            # Yorum sorgular
    │   │   ├── favorite.ts           # Favoriler sorgular
    │   │   ├── order.ts              # Sipariş sorgular
    │   │   ├── profile.ts            # Profil sorgular
    │   │   ├── queries.ts            # Genel sorgular
    │   │   ├── searchQueries.ts      # Arama sorgular
    │   │   ├── comment.ts            # Yorum sorgular
    │   │   └── getImageUrl.ts        # Görsel URL fonksiyonları
    │   │
    │   ├── types/                    # TypeScript tip tanımları
    │   │   ├── authLogin.ts          # Giriş tipleri
    │   │   ├── authRegister.ts       # Kayıt tipleri
    │   │   ├── card.ts               # Sepet tipleri
    │   │   ├── comment.ts            # Yorum tipleri
    │   │   ├── favorite.ts           # Favoriler tipleri
    │   │   ├── id.ts                 # ID tipleri
    │   │   ├── order.ts              # Sipariş tipleri
    │   │   ├── product.ts            # Ürün tipleri
    │   │   ├── profile.ts            # Profil tipleri
    │   │   ├── schema.ts             # Genel şema tipleri
    │   │   └── search.ts             # Arama tipleri
    │   │
    │   └── mocks/                    # Mock veriler (test için)
    │       ├── mockProducts.tsx      # Örnek ürün verileri
    │       └── mockUser.ts           # Örnek kullanıcı verileri
    │
    └── components/                   # Tekrar kullanılabilen bileşenler
        ├── ProductCard.tsx           # Ürün kartı bileşeni
        ├── SearchBar.tsx             # Arama çubuğu bileşeni
        │
        ├── product/                  # Ürün detay bileşenleri
        │   ├── ProductBottomBar.tsx          # Alt kısım bar
        │   ├── ProductComments.tsx           # Yorum bölümü
        │   ├── ProductImageGallery.tsx       # Görsel galerisi
        │   ├── ProductVariationSelector.tsx  # Varyasyon seçici
        │   ├── AddCommentForm.tsx            # Yorum ekleme formu
        │   └── SimilarProducts.tsx           # Benzer ürünler
        │
        └── profile/                  # Profil bileşenleri
            ├── ProfileAuthPromt.tsx          # Kimlik doğrulama istemi
            ├── ProfileHeader.tsx             # Profil başlığı
            ├── ProfileInput.tsx              # Profil giriş alanları
            └── ProfileMenuItem.tsx           # Profil menü öğeleri
```

---

## 📂 Klasörlerin Açıklaması

### Root Configuration Files
- **`app.json`**: Expo yapılandırması (uygulama adı, ikon, sürüm vb.)
- **`babel.config.js`**: Babel transpiler ayarları
- **`metro.config.js`**: React Native Metro bundler yapılandırması
- **`tailwind.config.js`**: Tailwind CSS teması ve özelleştirmeleri
- **`tsconfig.json`**: TypeScript derleyici seçenekleri
- **`eslint.config.js`**: Kod kalite kontrol kuralları
- **`global.css`**: Global stil tanımları

### `src/app/` - Uygulama Ekranları
Expo Router kullanılan dosya sistemi tabanlı yönlendirme. Her `.tsx` dosyası bir rotaya karşılık gelir.

- **`(auth)/`**: Giriş öncesi ekranlar (oturum açmayan kullanıcılar için)
- **`(tabs)/`**: Oturum açan kullanıcıların ana sekmeler
- **`product/[id].tsx`**: Dinamik ürün detay sayfası
- **`checkout/`**: Ödeme ve sipariş tamamlanması akışı

### `src/app/graphql/` - API İntegrasyonu
GraphQL sorgular, mutationlar ve Apollo Client yapılandırması.

- **`client.ts`**: Apollo Client kurulumu ve konfigürasyonu
- **`auth*.ts`**: Kimlik doğrulama ile ilgili mutationlar
- **`*Queries.ts`**: GraphQL sorgu tanımları
- Diğer `.ts` dosyaları: İlgili özellikler için sorgu/mutationlar

### `src/app/types/` - TypeScript Tip Tanımları
Tüm veri modellerinin TypeScript interface ve type tanımları.

### `src/components/` - Tekrar Kullanılabilen Bileşenler
- **Üst seviye**: Global bileşenler (ProductCard, SearchBar)
- **Alt klasörler**: Özellik spesifik bileşenler (product/, profile/)

### `assets/` - Statik Dosyalar
- **`expo.icon/`**: Uygulama ikonları
- **`images/`**: Kullanılacak görseller

---

## 🔧 Gereksinimler

- **Node.js**: 18.0.0 veya üzeri
- **npm** veya **yarn**: Paket yöneticisi
- **Expo CLI**: `npm install -g expo-cli`
- **Mobil Cihaz** veya **Emülatör**:
  - Android: Android Studio emülatörü
  - iOS: Xcode simülatörü veya fiziksel cihaz
  - Web: Modern web tarayıcısı

---

## 📦 Kurulum

### 1. Depoyu klonlayın
```bash
git clone <repo-url>
cd To_Do_App
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
# veya
yarn install
```

### 3. Çevre değişkenlerini ayarlayın
Proje kökünde `.env` dosyası oluşturun:
```env
EXPO_PUBLIC_GRAPHQL_LINK=http://192.168.1.10:8000/graphql
```

> **Not**: `EXPO_PUBLIC_` ön eki gereklidir. Expo bu değişkenleri istemci tarafına açığa çıkarır.

### 4. AsyncStorage Token Yönetimi
Uygulama JWT token'ını AsyncStorage'de saklar ve her istekte Apollo istemcisine otomatik olarak ekler.

---

## 🚀 Çalıştırma

### 1. Expo Development Server başlatın
```bash
npm start
# veya
expo start
```

### 2. Platform seçin

**Android Emülatör (Windows/Mac/Linux)**
```bash
npm run android
```

**iOS Simulator (Mac)**
```bash
npm run ios
```

**Web Browser**
```bash
npm run web
```

**Fiziksel Cihaz**
- Expo uygulamasını cihaza kurun
- Terminalden gösterilen QR kodu tarayın

---

## 🌐 API Entegrasyonu

### GraphQL API Konfigürasyonu
Apollo Client yapılandırması: [src/app/graphql/client.ts](src/app/graphql/client.ts)

```typescript
// Çevre değişkeninden API URL'sini okur
const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_LINK,
  credentials: 'include',
});
```

### Kimlik Doğrulama
- JWT token'ı AsyncStorage'de saklanır (`authToken`)
- Her istek başlığında `Authorization: Bearer <token>` eklenir
- Giriş/kayıt sırasında token alınır ve saklanır

### Örnek GraphQL Sorgusu
```typescript
import { gql } from '@apollo/client';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      image
    }
  }
`;
```

### Örnek Mutation
```typescript
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;
```

---

## 🏗️ Proje Mimarisi

### Navigasyon Yapısı
```
Root (_layout.tsx)
├── (auth) - [Oturum açmamış kullanıcılar]
│   ├── login
│   └── register
└── (tabs) - [Oturum açan kullanıcılar]
    ├── index (Ana sayfa/Ürün Listesi)
    ├── favorite (Favoriler)
    ├── cart (Sepet)
    ├── search (Arama)
    └── profile
        ├── index
        └── oldOrders
        
Ayrı Rotalar:
├── product/[id] (Ürün Detayı)
└── checkout
    ├── index (Ödeme)
    └── succes (Başarı)
```

### Veri Akışı
1. **Kullanıcı Girişi**: AsyncStorage → Token saklanır
2. **API İsteği**: Apollo Client → Token eklenir → GraphQL API
3. **Veri Alma**: GraphQL API → Apollo Cache → React Components
4. **Durum Yönetimi**: Apollo Client cache ve local state

### Bileşen Hiyerarşisi
```
App (Root Layout)
├── AuthStack (auth/* screens)
│   ├── Login
│   └── Register
└── MainStack (tabs/* screens)
    ├── ProductList
    │   └── ProductCard (reusable)
    ├── ProductDetail
    │   ├── ProductImageGallery
    │   ├── ProductVariationSelector
    │   ├── ProductComments
    │   ├── ProductBottomBar
    │   ├── AddCommentForm
    │   └── SimilarProducts
    ├── Favorites
    │   └── ProductCard (reusable)
    ├── Cart
    ├── Search
    │   └── SearchBar (reusable)
    └── Profile
        ├── ProfileHeader
        ├── ProfileInput
        └── ProfileMenuItem
```

---

## 🔐 Kimlik Doğrulama Akışı

### Giriş Süreci
1. Kullanıcı email ve şifre girer
2. `authLogin` mutation çağrılır
3. API JWT token döndürür
4. Token AsyncStorage'de saklanır
5. Apollo Client başlık güncellenrir
6. (tabs) ekranlarına yönlendirilir

### Oturum Kapatma
1. Token AsyncStorage'den silinir
2. Apollo cache temizlenir
3. (auth) ekranlarına yönlendirilir

---

## 📝 Notlar

- ✅ **Yapılandırma**: ESLint ve Prettier ile kod kalitesi kontrol edilir
- ✅ **Styling**: NativeWind/Tailwind CSS mobil responsive tasarım sağlar
- ✅ **Navigation**: Expo Router dosya sistemi tabanlı yönlendirme kullanır
- ✅ **Type Safety**: TypeScript tam tip güvenliği sağlar
- ✅ **API**: GraphQL ile veri akışı optimize edilmiştir
- ✅ **Storage**: AsyncStorage ile yerel veri kalıcılığı sağlanır

---

## 🐛 Yaygın Sorunlar

### GraphQL API bağlantısı kurulamıyor
- `.env` dosyasındaki `EXPO_PUBLIC_GRAPHQL_LINK` URL'sini kontrol edin
- Backend sunucunun çalışıp çalışmadığını doğrulayın
- CORS ayarlarını backend tarafında kontrol edin

### Token problemi
- AsyncStorage'de token'ın doğru saklanıp saklanmadığını kontrol edin
- Apollo Client request headers'ını debug edin
- Token'ın geçerliğini backend tarafında doğrulayın

### Görsel yükleme başarısız
- `getImageUrl.ts` fonksiyonunda API URL'sini kontrol edin
- Görsel dosyalarının mevcut olduğunu doğrulayın

---

## 👨‍💻 Geliştirme Tipsler

1. **Hot Reload**: Dosyaları kaydettiğinizde otomatik yenileme tetiklenir
2. **Debugging**: Chrome DevTools veya Expo DevTools kullanın
3. **TypeScript**: Hataları erken yakala için strict mode'u açık tutun
4. **GraphQL**: Apollo DevTools browser extension kurarak sorguları debug edin

---

## 📄 Lisans

Bu proje [LICENSE](LICENSE) dosyasında belirtilen lisans altında dağıtılmaktadır.

---

## 📞 İletişim & Destek

Sorular veya sorunlar için lütfen GitHub Issues bölümünde konu açınız.

**Geliştirici Notları**

Bu proje, örnek bir e-ticaret iş akışını mobil uygulama olarak temsil eder. Özellikle ürün listesi, favoriler, sepet ve checkout süreçleri GraphQL veri modeline göre tasarlanmıştır.