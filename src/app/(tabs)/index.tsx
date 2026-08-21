// src/app/(tabs)/index.tsx
import { useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Flame, Sparkles, Star, Tag, Zap } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { getImageUrl } from '../graphql/getImageUrl';
import { GET_ALL_PRODUCTS } from '../graphql/queries';
import { AllProductsData, GraphQLProduct } from '../types/product';

export const calculateAverageRating = (comments: { stars: number }[] = []) => {
  if (!comments || comments.length === 0) return 5.0;
  const total = comments.reduce((sum, c) => sum + (c.stars || 5), 0);
  return Number((total / comments.length).toFixed(1));
};

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');

  const { data, loading, error, refetch } = useQuery<AllProductsData>(GET_ALL_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
  });

  const allProducts = data?.allProducts || [];

  // 1. Yeni Eklenen Ürünler (Son eklenen ilk 6 ürün)
  const newArrivals = useMemo(() => {
    return [...allProducts].reverse().slice(0, 6);
  }, [allProducts]);

  // 2. Dinamik Kategori Listesi
  const categories = useMemo(() => {
    const unique = new Set<string>();
    allProducts.forEach((p) => {
      p.categories?.forEach((c) => {
        if (c.categoryName) unique.add(c.categoryName);
      });
    });
    return ['Tümü', ...Array.from(unique)];
  }, [allProducts]);

  // 3. Kategoriye Göre Filtrelenmiş Ana Liste
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Tümü') return allProducts;
    return allProducts.filter((p) =>
      p.categories?.some((c) => c.categoryName === selectedCategory)
    );
  }, [allProducts, selectedCategory]);

  if (loading && !data) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="text-xs text-gray-500 mt-2 font-medium">Vitrin hazırlanıyor...</Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-sm font-bold text-red-500 text-center mb-1">
          Ürünler Yüklenemedi
        </Text>
        <Text className="text-xs text-gray-500 text-center mb-4">{error.message}</Text>
        <Pressable
          onPress={() => refetch()}
          className="bg-orange-500 px-5 py-2.5 rounded-xl active:bg-orange-600 shadow-sm"
        >
          <Text className="text-white font-bold text-xs">Yeniden Dene</Text>
        </Pressable>
      </View>
    );
  }

  // Liste Üst Bölümü
  const renderHeader = () => (
    <View className="pt-2 pb-1">
      {/* Kampanya / Fırsat Banner'ı */}
      <View className="bg-orange-500 rounded-2xl p-4 mb-5 shadow-sm flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Sparkles size={16} color="#FEF08A" />
            <Text className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">
              Özel Fırsatlar
            </Text>
          </View>
          <Text className="text-base font-extrabold text-white leading-5">
            Tüm Siparişlerde Hızlı & Güvenli Teslimat
          </Text>
        </View>
        <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center border border-white/30">
          <Tag size={22} color="#FFFFFF" />
        </View>
      </View>

      {/* YENİ EKLENEN ÜRÜNLER (Yatay Kaydırmalı Slider) */}
      {newArrivals.length > 0 && selectedCategory === 'Tümü' && (
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3 px-0.5">
            <View className="flex-row items-center gap-1.5">
              <Zap size={16} color="#F97316" fill="#F97316" />
              <Text className="text-sm font-extrabold text-gray-900">
                Yeni Eklenen Ürünler
              </Text>
            </View>
            <Text className="text-[11px] font-semibold text-gray-400">Kaydırın ›</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-3 px-3"
            contentContainerStyle={{ paddingRight: 12 }}
          >
            {newArrivals.map((item: GraphQLProduct) => {
              const imageUrl = getImageUrl(item.coverImage || undefined);
              const price = parseFloat(item.productAvrPrice) || 0;
              const rating = calculateAverageRating(item.comment);

              return (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(`/product/${item.id}`)}
                  className="w-36 bg-white rounded-2xl p-2.5 mr-3 border border-gray-100 shadow-sm active:opacity-90 relative"
                >
                  {/* "YENİ" Etiketi */}
                  <View className="absolute top-2 left-2 z-10 bg-orange-500 px-2 py-0.5 rounded-md shadow-sm">
                    <Text className="text-[9px] font-extrabold text-white uppercase tracking-wider">
                      Yeni
                    </Text>
                  </View>

                  {/* Görsel */}
                  <View className="w-full h-28 bg-gray-50 rounded-xl overflow-hidden mb-2 items-center justify-center border border-gray-50">
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
                    <Text className="text-[10px] font-bold text-gray-600">
                      {rating.toFixed(1)}
                    </Text>
                  </View>

                  <Text className="text-xs font-extrabold text-orange-600">
                    {price > 0
                      ? `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`
                      : 'Fiyat Yok'}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Kategori Filtre Çipleri */}
      {categories.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-4 -mx-3 px-3"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`mr-2 px-4 py-2 rounded-xl border ${
                  isSelected
                    ? 'bg-orange-500 border-orange-500 shadow-sm'
                    : 'bg-white border-gray-200 active:bg-gray-50'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* Ana Izgara Başlığı */}
      <View className="flex-row items-center justify-between mb-3 px-0.5">
        <View className="flex-row items-center gap-1.5">
          <Flame size={16} color="#EA580C" />
          <Text className="text-sm font-extrabold text-gray-900">
            {selectedCategory === 'Tümü' ? 'Öne Çıkan Ürünler' : `${selectedCategory} Ürünleri`}
          </Text>
        </View>
        <Text className="text-xs font-semibold text-gray-400">
          {filteredProducts.length} Ürün
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Sabit Arama Çubuğu */}
      <SearchBar compact={true} />

      {/* 2 Sütunlu Ana Ürün Izgarası */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-1 p-1.5">
            <ProductCard
              product={{
                id: item.id,
                brand: item.categories?.[0]?.categoryName || 'Genel',
                title: item.productName,
                imageUrl: getImageUrl(item.coverImage || undefined),
                price: parseFloat(item.productAvrPrice) || 0,
                rating: calculateAverageRating(item.comment),
              }}
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View className="py-16 items-center justify-center">
            <Text className="text-sm font-bold text-gray-700 mb-1">Ürün Bulunamadı</Text>
            <Text className="text-xs text-gray-400">
              Bu kategoride listelenmiş bir ürün bulunmuyor.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor="#F97316"
            colors={['#F97316']}
          />
        }
      />
    </View>
  );
}