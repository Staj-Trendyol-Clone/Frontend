// src/app/(tabs)/index.tsx
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useQuery } from '@apollo/client/react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { getImageUrl } from '../graphql/getImageUrl';
import { GET_ALL_PRODUCTS } from '../graphql/queries';
import { AllProductsData, GraphQLProduct } from '../types/product';

// Yorumların ortalama puanını hesaplayan yardımcı fonksiyon
export const calculateAverageRating = (comments: { stars: number }[] = []) => {
  if (!comments || comments.length === 0) return 5.0;
  const total = comments.reduce((sum, c) => sum + c.stars, 0);
  return Number((total / comments.length).toFixed(1));
};

export default function HomeScreen() {
  // 1. Apollo GraphQL Query
  const { data, loading, error, refetch } = useQuery<AllProductsData>(GET_ALL_PRODUCTS);

  // 2. Yüklenme Durumu
  if (loading && !data) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="text-xs text-gray-500 mt-2 font-medium">Ürünler Yükleniyor...</Text>
      </View>
    );
  }

  // 3. Hata Durumu
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-sm font-bold text-red-500 text-center mb-2">
          Ürünler Alınamadı
        </Text>
        <Text className="text-xs text-gray-500 text-center mb-4">
          {error.message}
        </Text>
      </View>
    );
  }

  // 4. Tekil Ürün Kartı Render Fonksiyonu
  const renderProductItem = ({ item }: { item: GraphQLProduct }) => {
    // AWS S3 Kapak Görselini Tam URL'e Çevir
    const fullImageUrl = getImageUrl(item.coverImage || undefined);

    return (
      <View className="flex-1 p-1.5">
        <ProductCard
          product={{
            id: item.id,
            brand: item.categories?.[0]?.categoryName || 'Genel',
            title: item.productName,
            imageUrl: fullImageUrl,
            price: parseFloat(item.productAvrPrice) || 0,
            rating: calculateAverageRating(item.comment),
          }}
        />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header />

      {/* 2 Sütunlu Ürün Izgara Listesi */}
      <FlatList
        data={data?.allProducts || []}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={['#F97316']}
          />
        }
      />
    </View>
  );
}