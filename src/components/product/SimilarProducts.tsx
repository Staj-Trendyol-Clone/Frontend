// src/components/product/SimilarProducts.tsx
import { useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Layers, Star } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { getImageUrl } from '../../app/graphql/getImageUrl';
import { GET_ALL_PRODUCTS } from '../../app/graphql/queries';
import { AllProductsData, GraphQLProduct } from '../../app/types/product';

interface SimilarProductsProps {
  currentProductId: string;
  categoryName?: string;
}

export const SimilarProducts: React.FC<SimilarProductsProps> = ({
  currentProductId,
  categoryName,
}) => {
  const router = useRouter();
  const { data } = useQuery<AllProductsData>(GET_ALL_PRODUCTS, {
    fetchPolicy: 'cache-first',
  });

  // Aynı kategorideki ürünleri filtrele (mevcut ürünü hariç tutarak ilk 5 ürünü al)
  const similarProducts = useMemo(() => {
    if (!data?.allProducts || !categoryName) return [];

    return data.allProducts
      .filter(
        (p: GraphQLProduct) =>
          p.id !== currentProductId &&
          p.categories?.some((c) => c.categoryName.toLowerCase() === categoryName.toLowerCase())
      )
      .slice(0, 5);
  }, [data, currentProductId, categoryName]);

  if (similarProducts.length === 0) return null;

  return (
    <View className="mt-8 pt-4 border-t border-gray-100">
      {/* Başlık */}
      <View className="flex-row items-center justify-between mb-3 px-0.5">
        <View className="flex-row items-center gap-1.5">
          <Layers size={16} color="#F97316" />
          <Text className="text-sm font-bold text-gray-900">
            Benzer Ürünler ({categoryName})
          </Text>
        </View>
        <Text className="text-[11px] font-semibold text-gray-400">Kaydırın ›</Text>
      </View>

      {/* Yatay Kaydırılabilir Liste */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 8 }}
        className="-mx-4 px-4"
      >
        {similarProducts.map((item: GraphQLProduct) => {
          const imageUrl = getImageUrl(item.coverImage || undefined);
          const price = parseFloat(item.productAvrPrice) || 0;
          const rating =
            item.comment && item.comment.length > 0
              ? (
                  item.comment.reduce((sum, c) => sum + (c.stars || 5), 0) /
                  item.comment.length
                ).toFixed(1)
              : '5.0';

          return (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/product/${item.id}`)}
              className="w-36 bg-white rounded-2xl p-2.5 mr-3 border border-gray-100 shadow-sm active:opacity-90"
            >
              {/* Görsel */}
              <View className="w-full h-28 bg-gray-50 rounded-xl overflow-hidden mb-2 border border-gray-50">
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                  transition={150}
                />
              </View>

              {/* Başlık */}
              <Text numberOfLines={1} className="text-xs font-semibold text-gray-800 mb-1">
                {item.productName}
              </Text>

              {/* Puan ve Fiyat */}
              <View className="flex-row items-center gap-1 mb-1">
                <Star size={10} color="#EAB308" fill="#EAB308" />
                <Text className="text-[10px] font-bold text-gray-600">{rating}</Text>
              </View>

              <Text className="text-xs font-extrabold text-orange-600">
                {price > 0 ? `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL` : 'Fiyat Yok'}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};