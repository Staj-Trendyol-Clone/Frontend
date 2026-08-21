// src/components/product/ProductBottomBar.tsx
import { ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface ProductBottomBarProps {
  price: number;
  stock: number;
  addingToCart: boolean;
  onAddToCart: () => void;
}

export const ProductBottomBar: React.FC<ProductBottomBarProps> = ({
  price,
  stock,
  addingToCart,
  onAddToCart,
}) => {
  const isOutOfStock = stock <= 0;

  return (
    <View className="p-4 pb-8 bg-white border-t border-gray-100 flex-row items-center justify-between shadow-lg">
      <View>
        <Text className="text-xs text-gray-400 font-medium">Toplam Tutar</Text>
        <Text className="text-xl font-extrabold text-gray-900">
          {price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
        </Text>
      </View>

      <Pressable
        onPress={onAddToCart}
        disabled={isOutOfStock || addingToCart}
        className={`flex-row items-center px-6 py-3.5 rounded-xl shadow-sm ${
          isOutOfStock ? 'bg-gray-300' : 'bg-orange-500 active:bg-orange-600'
        }`}
      >
        {addingToCart ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <ShoppingBag size={18} color="#FFFFFF" />
            <Text className="text-white font-bold text-sm ml-2">
              {isOutOfStock ? 'Tükendi' : 'Sepete Ekle'}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
};