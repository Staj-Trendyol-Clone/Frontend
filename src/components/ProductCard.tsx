// src/components/ProductCard.tsx
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface Product {
  id: string;
  brand: string;
  title: string;
  imageUrl: string;
  price: number;
  rating: number;
  reviewCount?: number;
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm active:opacity-90"
    >
      {/* Ürün Görseli */}
      <View className="w-full h-36 bg-gray-50 items-center justify-center p-2 border-b border-gray-50">
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="contain"
          transition={150}
        />
      </View>

      {/* Ürün Bilgileri */}
      <View className="p-3">
        {/* Kategori / Marka Rozeti */}
        <Text
          numberOfLines={1}
          className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1"
        >
          {product.brand}
        </Text>

        {/* Ürün Başlığı */}
        <Text numberOfLines={2} className="text-xs font-semibold text-gray-800 leading-4 h-8 mb-2">
          {product.title}
        </Text>

        {/* Alt Satır: Yıldız Puanı ve Fiyat */}
        <View className="flex-row items-center justify-between pt-2 border-t border-gray-50">
          <View className="flex-row items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
            <Star size={10} color="#EAB308" fill="#EAB308" />
            <Text className="text-[10px] font-bold text-amber-700">
              {product.rating.toFixed(1)}
            </Text>
          </View>

          <Text className="text-xs font-extrabold text-gray-900">
            {product.price > 0
              ? `${product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`
              : 'Fiyat Yok'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};