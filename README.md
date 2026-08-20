# 🛒 E-Ticaret Mobil Uygulaması

Bu proje, Expo + React Native + TypeScript kullanılarak geliştirilmiş, kullanıcı girişi, ürün listesi, favoriler, sepet, profil ve sipariş akışı içeren mobil bir e-ticaret uygulamasıdır.

## Özellikler

- Kullanıcı kaydı ve girişi
- JWT tabanlı oturum yönetimi
- Ürün listesi ve ürün detay ekranı
- Favori ürün ekleme/çıkarma
- Sepet yönetimi ve sepet badge göstergesi
- Sipariş oluşturma ve ödeme akışı
- Profil görüntüleme ve kişisel bilgileri güncelleme
- GraphQL API ile veri akışı
- NativeWind ile modern mobil arayüz

## Teknoloji Yığını

- React Native
- Expo SDK 57
- Expo Router
- TypeScript
- Apollo Client + GraphQL
- NativeWind / Tailwind CSS
- AsyncStorage
- Lucide React Native

## Proje Yapısı

```text
.
├── app.json
├── babel.config.js
├── eslint.config.js
├── global.css
├── metro.config.js
├── package.json
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── assets/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── (auth)/
│   │   ├── (tabs)/
│   │   ├── checkout/
│   │   ├── graphql/
│   │   ├── product/
│   │   └── types/
│   └── components/
│       ├── ProductCard.tsx
│       └── SearchBar.tsx
└── assets/
```

## Gereksinimler

- Node.js 18+
- npm veya yarn
- Expo CLI
- Mobil cihaz veya emülatör

## Kurulum

1. Projeyi klonlayın:

```bash
git clone <repo-url>
cd <proje-klasoru>
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Çevre değişkenlerini ayarlayın.

Projenin GraphQL istemcisi `src/app/graphql/client.ts` içinde aşağıdaki değişkeni kullanmaktadır:

```env
EXPO_PUBLIC_GRAPHQL_LINK=https://your-graphql-api-url/graphql
```

Örnek:

```env
EXPO_PUBLIC_GRAPHQL_LINK=http://192.168.1.10:8000/graphql
```

> Not: Uygulama, kullanıcı token'ını `AsyncStorage` üzerinde saklar ve Apollo istemcisine `Authorization: JWT <token>` şeklinde ekler.

## Çalıştırma

```bash
npm start
```

veya doğrudan platform için:

```bash
npx expo start
npm run android
npm run ios
npm run web
```

## Notlar

- Uygulamanın ana navigasyonu `expo-router` ile yönetilmektedir.
- Tab navigasyonu `src/app/(tabs)/_layout.tsx` içinde tanımlanmıştır.
- GraphQL API şeması, backend tarafında tanımlanan alanlara göre çalışır.

## Geliştirici Notları

Bu proje, örnek bir e-ticaret iş akışını mobil uygulama olarak temsil eder. Özellikle ürün listesi, favoriler, sepet ve checkout süreçleri GraphQL veri modeline göre tasarlanmıştır.
