// src/app/checkout/_layout.tsx
import { Stack } from 'expo-router';

export default function CheckoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Ödeme' }} />
      <Stack.Screen name="succes" options={{ title: 'Sipariş Başarılı', gestureEnabled: false }} />
    </Stack>
  );
}