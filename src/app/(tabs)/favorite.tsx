  // src/app/(tabs)/favorite.tsx
import { useMutation, useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowRight, Heart, Star } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { GET_MY_FAVORITES, TOGGLE_FAVORITE } from '../graphql/favorite';
import { getImageUrl } from '../graphql/getImageUrl';
import {
  FavoriteItem,
  MyFavoritesData,
  ToggleFavoriteData,
  ToggleFavoriteVariables,
} from '../types/favorite';

  const { width } = Dimensions.get('window');
  const CARD_WIDTH = (width - 44) / 2; // 2 sütunlu grid genişliği

  export default function FavoriteScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    // 1. Favori Ürünleri Çek
    const { data, loading, refetch } = useQuery<MyFavoritesData>(GET_MY_FAVORITES, {
      fetchPolicy: 'network-only',
    });

    // 2. Favoriden Çıkarma Mutasyonu
    const [toggleFavorite] = useMutation<ToggleFavoriteData, ToggleFavoriteVariables>(
      TOGGLE_FAVORITE,
      {
        refetchQueries: [{ query: GET_MY_FAVORITES }],
      }
    );

    const favorites = data?.myFavorites || [];

    const onRefresh = async () => {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    };

    const handleRemoveFavorite = async (productId: string) => {
      try {
        await toggleFavorite({
          variables: {
            data: { productId },
          },
        });
      } catch (error) {
        console.error('Favoriden çıkarılırken hata oluştu:', error);
      }
    };

    // Boş Favori Ekranı
    const renderEmptyState = () => (
      <View className="flex-1 justify-center items-center py-28 px-6">
        <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4 border border-orange-100 shadow-sm">
          <Heart size={36} color="#F97316" />
        </View>
        <Text className="text-lg font-bold text-gray-900 mb-1">Favori Listeniz Boş</Text>
        <Text className="text-xs text-gray-500 text-center mb-6 leading-5">
          Beğendiğiniz ürünlerin kalp simgesine dokunarak favorilerinize ekleyebilir ve buradan kolayca takip edebilirsiniz.
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)')}
          className="bg-orange-500 px-6 py-3 rounded-xl flex-row items-center active:bg-orange-600 shadow-sm"
        >
          <Text className="text-white font-bold text-xs mr-2">Ürünleri Keşfet</Text>
          <ArrowRight size={14} color="#FFFFFF" />
        </Pressable>
      </View>
    );

    // Tekil Ürün Kartı (2'li Grid)
    const renderFavoriteItem = ({ item }: { item: FavoriteItem }) => {
      const product = item.product;
      const price = Number(product.productAvrPrice) || 0;
      const imageUrl = getImageUrl(product.coverImage || undefined);

      return (
        <Pressable
          onPress={() => router.push(`/product/${product.id}`)}
          style={{ width: CARD_WIDTH }}
          className="bg-white rounded-2xl p-3 mb-3 border border-gray-100 shadow-sm relative active:opacity-95"
        >
          {/* Favoriden Çıkar (Kalp) Butonu */}
          <Pressable
            onPress={() => handleRemoveFavorite(product.id)}
            hitSlop={8}
            className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 rounded-full items-center justify-center shadow-sm border border-gray-100"
          >
            <Heart size={16} color="#EF4444" fill="#EF4444" />
          </Pressable>

          {/* Ürün Görseli */}
          <View className="w-full h-32 bg-gray-50 rounded-xl overflow-hidden mb-2.5 border border-gray-50">
            <Image
              source={{ uri: imageUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
            />
          </View>

          {/* Ürün Bilgileri */}
          <Text numberOfLines={2} className="text-xs font-semibold text-gray-800 mb-1 h-8">
            {product.productName}
          </Text>

          <Text className="text-xs font-extrabold text-orange-600 mt-1">
            {price > 0 ? `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL` : 'Fiyat Belirtilmedi'}
          </Text>
        </Pressable>
      );
    };

    if (loading && !refreshing) {
      return (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#F97316" />
          <Text className="text-xs text-gray-500 mt-2">Favorileriniz yükleniyor...</Text>
        </View>
      );
    }

    return (
      <View className="flex-1 bg-gray-50 py-5">
        <View className="pt-4 pb-3.5 px-4 bg-white border-b border-gray-100 flex-row items-center justify-between shadow-sm">
          <View className="flex-row items-center gap-2">
            <Star size={20} color="#F97316" fill="#F97316" />
            <Text className="text-base font-extrabold text-gray-900">Favorilerim</Text>
          </View>
          <Text className="text-xs font-semibold text-gray-400">{favorites.length} Ürün</Text>
        </View>

        {/* Grid Liste */}
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />
          }
        />
      </View>
    );
  }