// src/app/(tabs)/_layout.tsx
import { useQuery } from '@apollo/client/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from 'expo-router';
import { Home, ShoppingBag, Star, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';

import '../../../global.css'; // Tailwind CSS
import { GET_MY_BASKET } from '../graphql/card';
import { UserBasketData } from '../types/card';

export default function TabsLayout() {
  const [hasToken, setHasToken] = useState(false);

  // 1. Kullanıcı oturum durumunu kontrol et
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setHasToken(!!token);
    };
    checkToken();
  }, []);

  // 2. Sepet verisini çek (Sadece oturum açıksa çalışır)
  const { data } = useQuery<UserBasketData>(GET_MY_BASKET, {
    skip: !hasToken,
  });

  const cartItemCount =
    data?.myBasket?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F97316',   // text-orange-500
        tabBarInactiveTintColor: '#6B7280', // text-gray-500
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      {/* 1. SEKMELER: Anasayfa */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Anasayfa',
          tabBarIcon: ({ color, size }) => (
            <Home size={size - 2} color={color} />
          ),
        }}
      />

      {/* 2. SEKMELER: Favoriler */}
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favoriler',
          tabBarIcon: ({ color, size }) => (
            <Star size={size - 2} color={color} />
          ),
        }}
      />

      {/* 3. SEKMELER: Sepetim */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Sepetim',
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined, // 0 ise rozet gizlenir
          tabBarBadgeStyle: {
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 'bold',
            lineHeight: 14,
          },
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag size={size - 2} color={color} />
          ),
        }}
      />

      {/* 4. SEKMELER: Profil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <User size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{href:null}}
      />
    </Tabs>
  );
}