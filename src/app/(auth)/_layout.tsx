import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Üstteki varsayılan başlık çubuğunu gizler
        contentStyle: { backgroundColor: '#FFFFFF' }, // Ekran arka planı
        animation: 'slide_from_right', // Sayfa geçiş animasyonu
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{
          title: 'Giriş Yap',
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{
          title: 'Kayıt Ol',
        }} 
      />
    </Stack>
  );
}