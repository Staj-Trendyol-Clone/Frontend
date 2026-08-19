/*import { Header } from '@/components/Header';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { HeartOff, ShoppingBag, Star, Trash2 } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import mockProducts from '../mocks/mockProducts';
import { Product } from '../types/schema';
import { calculateAverageRating } from './index';

export default function FavoriteScreen() {
  const router = useRouter();

  // Favori ürünleri filtreleme ve state yönetimi
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  // Sekmeye her geçildiğinde favori ürünleri yeniden senkronize et
  useFocusEffect(
    useCallback(() => {
      const filtered = mockProducts.filter((product) => product.isFavorite);
      setFavoriteProducts(filtered);
    }, [])
  );

  // Favorilerden çıkarma fonksiyonu
  const handleRemoveFavorite = (id: string) => {
    // 1. Ekrandaki listeyi güncelle
    setFavoriteProducts((prev) => prev.filter((item) => item.id !== id));

    // 2. Bellekteki nesne değerini güncelle
    const product = mockProducts.find((p) => p.id === id);
    if (product) {
      product.isFavorite = false;
    }
  };

  // Boş Durum (Favori Ürün Yoksa)
  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20 px-6">
      <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4 border border-orange-100">
        <HeartOff size={36} color="#F97316" />
      </View>
      <Text className="text-lg font-bold text-gray-900 mb-1">
        Favori Ürününüz Bulunmuyor
      </Text>
      <Text className="text-xs text-gray-500 text-center mb-6 leading-5">
        Beğendiğiniz ürünlerin üzerindeki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
      </Text>
      <Pressable
        onPress={() => router.push('/')}
        className="bg-orange-500 px-6 py-3 rounded-xl active:bg-orange-600 shadow-sm"
      >
        <Text className="text-white font-bold text-xs">Alışverişe Başla</Text>
      </Pressable>
    </View>
  );

  const renderFavoriteItem = ({ item }: { item: Product }) => (
  <Pressable
    onPress={() => router.push(`/product/${item.id}`)}
    className="bg-white p-3 rounded-2xl mb-3 border border-gray-100 flex-row items-center active:opacity-95 shadow-sm"
  >
    {/* Sol: Ürün Görseli (Images Tablosundan ilk resim) *//*}
    <View className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden mr-3">
      <Image
        source={{ uri: item.images[0]?.images }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={150}
      />
    </View>

    {/* Orta: Ürün Bilgileri *//*}
    <View className="flex-1 h-24 justify-between py-0.5">
      <View>
        <Text className="text-xs font-bold text-orange-600">
          {item.categories[0]?.category_name || 'Kategori'}
        </Text>
        <Text numberOfLines={2} className="text-xs text-gray-800 leading-4 font-medium mt-0.5">
          {item.product_name}
        </Text>
      </View>

      {/* Puan (Comments Tablosundan Ortalama) *//*}
      <View className="flex-row items-center gap-1">
        <Star size={11} color="#EAB308" fill="#EAB308" />
        <Text className="text-[10px] font-bold text-gray-600">
          {calculateAverageRating(item.comments)}
        </Text>
      </View>

      {/* Fiyat *//*}
      <Text className="text-sm font-extrabold text-gray-900">
        {item.product_avr_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
      </Text>
    </View>

    {/* Sağ: Aksiyon Butonları *//*}
    <View className="h-24 justify-between items-end pl-2">
      <Pressable
        onPress={() => handleRemoveFavorite(item.id)}
        className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center active:bg-red-50"
      >
        <Trash2 size={16} color="#EF4444" />
      </Pressable>

      <Pressable className="bg-orange-500 p-2 rounded-lg flex-row items-center active:bg-orange-600">
        <ShoppingBag size={14} color="#FFFFFF" />
      </Pressable>
    </View>
  </Pressable>
);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Üst Header Barı *//*}
      <Header />

      {/* Sayfa Başlığı ve Sayıcı *//*}
      <View className="px-4 py-3 flex-row items-center justify-between bg-white border-b border-gray-100">
        <Text className="text-base font-bold text-gray-900">Favorilerim</Text>
        <Text className="text-xs font-medium text-gray-500">
          {favoriteProducts.length} Ürün
        </Text>
      </View>

      {/* Dikey Kaydırılabilir Favori Listesi *//*}
      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderFavoriteItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}*/

import { Text, View } from 'react-native'

const favorite = () => {
  return (
    <View>
      <Text>favorite</Text>
    </View>
  )
}

export default favorite