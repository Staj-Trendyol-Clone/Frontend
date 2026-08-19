// src/app/checkout/succes.tsx
import { useMutation, useQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { GET_MY_BASKET, REMOVE_FROM_BASKET } from '../graphql/card';
import {
  RemoveFromBasketData,
  RemoveFromBasketVariables,
  UserBasketData,
} from '../types/card';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const hasClearedRef = useRef(false);

  // 1. Mevcut sepet verilerini çek
  const { data } = useQuery<UserBasketData>(GET_MY_BASKET, {
    fetchPolicy: 'network-only',
  });

  // 2. Sepetten silme mutasyonu
  const [removeFromBasket] = useMutation<
    RemoveFromBasketData,
    RemoveFromBasketVariables
  >(REMOVE_FROM_BASKET, {
    refetchQueries: [{ query: GET_MY_BASKET }],
  });

  // 3. Başarılı sipariş ekranı açıldığında sepetteki tüm ürünleri temizle
  useEffect(() => {
    const clearBasketItems = async () => {
      const items = data?.myBasket?.items;

      // Sepette ürün varsa ve daha önce temizlenmediyse çalıştır
      if (items && items.length > 0 && !hasClearedRef.current) {
        hasClearedRef.current = true; // Tekrar tekrar çalışmasını engeller

        try {
          // Tüm sepet ürünlerini paralel olarak tek seferde sil
          await Promise.all(
            items.map((item) =>
              removeFromBasket({
                variables: {
                  basketItemId: String(item.id),
                },
              })
            )
          );
        } catch (error) {
          console.error('Sipariş sonrası sepet temizlenirken hata oluştu:', error);
        }
      }
    };

    clearBasketItems();
  }, [data, removeFromBasket]);

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <View className="w-20 h-20 bg-green-50 rounded-full items-center justify-center mb-4 border border-green-100 shadow-sm">
        <CheckCircle2 size={46} color="#16A34A" />
      </View>

      <Text className="text-xl font-extrabold text-gray-900 mb-1">Siparişiniz Alındı!</Text>
      <Text className="text-xs text-gray-500 text-center mb-8 px-4 leading-5">
        Ödemeniz başarıyla tamamlandı. Siparişinizin hazırlık sürecini profilinizdeki geçmiş siparişler alanından takip edebilirsiniz.
      </Text>

      <View className="w-full gap-3">
        <Pressable
          onPress={() => router.replace('/(tabs)/profile/oldOrders')}
          className="w-full bg-orange-500 py-3.5 rounded-xl flex-row items-center justify-center active:bg-orange-600 shadow-sm"
        >
          <ShoppingBag size={18} color="#FFFFFF" />
          <Text className="text-white font-bold text-sm ml-2">Sipariş Detayına Git</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace('/(tabs)')}
          className="w-full border border-gray-200 py-3.5 rounded-xl flex-row items-center justify-center active:bg-gray-50"
        >
          <Text className="text-gray-700 font-semibold text-sm mr-1">Alışverişe Devam Et</Text>
          <ArrowRight size={16} color="#374151" />
        </Pressable>
      </View>
    </View>
  );
}