// src/components/profile/ProfileAuthPrompt.tsx
import { useRouter } from 'expo-router';
import { LogIn, UserCircle, UserPlus } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export const ProfileAuthPrompt: React.FC = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-5 border border-orange-100 shadow-sm">
        <UserCircle size={44} color="#F97316" />
      </View>

      <Text className="text-xl font-extrabold text-gray-900 mb-2">Giriş Yapmadınız</Text>
      <Text className="text-xs text-gray-500 text-center mb-8 px-4 leading-5">
        Profil bilgilerinizi görmek, siparişlerinizi ve favorilerinizi yönetmek için lütfen hesabınıza giriş yapın.
      </Text>

      <View className="w-full gap-3">
        <Pressable
          onPress={() => router.push('/login')}
          className="w-full bg-orange-500 py-4 rounded-xl flex-row items-center justify-center active:bg-orange-600 shadow-sm"
        >
          <LogIn size={18} color="#FFFFFF" />
          <Text className="text-white font-bold text-sm ml-2">Giriş Yap</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/register')}
          className="w-full border border-orange-500 py-3.5 rounded-xl flex-row items-center justify-center active:bg-orange-50"
        >
          <UserPlus size={18} color="#F97316" />
          <Text className="text-orange-600 font-bold text-sm"> Hesap Oluştur</Text>
        </Pressable>
      </View>
    </View>
  );
};