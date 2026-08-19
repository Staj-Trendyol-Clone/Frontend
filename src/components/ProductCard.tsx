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
  description?: string;
  isFavorite?: boolean; // Favori durumu için opsiyonel alan
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      className="w-36 bg-white rounded-2xl border border-gray-100 overflow-hidden mr-3 active:opacity-90 shadow-sm"
    >
{/* Görsel Katmanı */}
<View className="w-full h-36 bg-gray-50 overflow-hidden">
  <Image
    source={{ uri: product.imageUrl }}
    style={{ width: '100%', height: '100%' }} // <--- className yerine style kullandık
    contentFit="cover"
    transition={150}
    onError={(e) => console.log('Görsel Yüklenemedi:', e.error)} // Hatayı tespit etmek için
  />
</View>

      {/* İçerik Katmanı */}
      <View className="p-2.5">
        <Text numberOfLines={2} className="text-xs text-gray-700 leading-4 h-8">
          <Text className="font-bold text-gray-900">{product.brand} </Text>
          {product.title}
        </Text>

        {/* Yıldız Puanı */}
        <View className="flex-row items-center my-1.5 gap-1">
          <Star size={11} color="#EAB308" fill="#EAB308" />
          <Text className="text-[10px] font-bold text-gray-600">{product.rating}</Text>
        </View>

        {/* Fiyat */}
        <Text className="text-sm font-extrabold text-orange-600">
          {product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
        </Text>
      </View>
    </Pressable>
  );
};