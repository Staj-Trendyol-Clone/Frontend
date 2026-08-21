// src/components/product/ProductImageGallery.tsx
import React from 'react';
import { View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { getImageUrl } from '../../app/graphql/getImageUrl';

interface ProductImageGalleryProps {
  mainImageUrl: string;
  images: Array<{ id?: string; image?: string | null }>;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  isFavorited: boolean;
  toggling: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  mainImageUrl,
  images,
  selectedIndex,
  onSelectIndex,
  isFavorited,
  toggling,
  onToggleFavorite,
  onBack,
}) => {
  return (
    <View>
      <View className="relative w-full h-96 bg-gray-50 overflow-hidden items-center justify-center">
        {/* Üst Navigasyon Butonları */}
        <View className="absolute top-4 left-0 right-0 px-4 flex-row items-center justify-between z-10">
          <Pressable
            onPress={onBack}
            className="w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-md active:bg-gray-100"
          >
            <ArrowLeft size={20} color="#1F2937" />
          </Pressable>

          <Pressable
            onPress={onToggleFavorite}
            disabled={toggling}
            className="w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-md border border-gray-100 active:scale-95"
          >
            <Heart
              size={20}
              color={isFavorited ? '#EF4444' : '#6B7280'}
              fill={isFavorited ? '#EF4444' : 'none'}
            />
          </Pressable>
        </View>

        {/* Ana Görsel */}
        <Image
          source={{ uri: mainImageUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="contain"
          transition={150}
        />
      </View>

      {/* Çoklu Görsel Önizlemeleri */}
      {images.length > 1 && (
        <View className="flex-row p-3 gap-2 bg-gray-50 border-b border-gray-100">
          {images.map((img, idx) => (
            <Pressable
              key={img.id || idx}
              onPress={() => onSelectIndex(idx)}
              className={`w-14 h-14 rounded-lg overflow-hidden bg-white border-2 ${
                selectedIndex === idx ? 'border-orange-500' : 'border-gray-200'
              }`}
            >
              <Image
                source={{ uri: getImageUrl(img.image ?? undefined) }}
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
              />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};