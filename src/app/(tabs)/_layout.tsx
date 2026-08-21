// src/app/(tabs)/_layout.tsx
import { useQuery } from '@apollo/client/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from 'expo-router';
import { Home, ShoppingBag, Star, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';

import '../../../global.css';
import { GET_MY_BASKET } from '../graphql/card';
import { UserBasketData } from '../types/card';

export default function TabsLayout() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setHasToken(!!token);
    };
    checkToken();
  }, []);

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
        tabBarActiveTintColor: '#F97316',
        tabBarInactiveTintColor: '#6B7280',
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
      {/* 1. Anasayfa */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Anasayfa',
          tabBarIcon: ({ color, size }) => (
            <Home size={size - 2} color={color} />
          ),
        }}
      />

      {/* 2. Favoriler */}
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favoriler',
          tabBarIcon: ({ color, size }) => (
            <Star size={size - 2} color={color} />
          ),
        }}
      />

      {/* 3. Sepetim */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Sepetim',
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
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

      {/* 4. Profil (DÜZELTİLDİ: listeners eklendi) */}
      <Tabs.Screen
        name="profile"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Profil sekmesine basıldığında iç yığını sıfırlayarak doğrudan index'e yönlendirir
            navigation.navigate('profile', {
              screen: 'index',
            });
          },
        })}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <User size={size - 2} color={color} />
          ),
        }}
      />

      {/* Gizli Arama Sekmesi */}
      <Tabs.Screen
        name="search"
        options={{ href: null }}
      />
    </Tabs>
  );
}