// src/app/_layout.tsx
import { ApolloProvider } from '@apollo/client/react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../../global.css';
import { client } from '../app/graphql/client'; // Apollo Client bağlantısı

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        {/* Üst durum çubuğu ayarları */}
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F9FAFB' },
            animation: 'fade_from_bottom',
          }}
        >
          {/* 1. Alt Sekmeler (Anasayfa, Favoriler, Sepetim, Profil) */}
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />

          {/* 2. Kimlik Doğrulama Grubu (Login, Register) */}
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />

          {/* 3. Ürün Detay Sayfası */}
          <Stack.Screen
            name="product/[id]"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />

          {/* 4. Ödeme / Sipariş Onay Sayfası */}
          <Stack.Screen
            name="checkout"
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}