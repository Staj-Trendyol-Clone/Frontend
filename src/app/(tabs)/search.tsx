// src/app/search.tsx (veya ilgili arama sayfası dosyası)
import { useLazyQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Sliders, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import '../../../global.css';
import { SearchBar } from '../../components/SearchBar';
import { getImageUrl } from '../graphql/getImageUrl';
import { SEARCH_PRODUCTS_QUERY } from '../graphql/searchQueries';
import { SearchProductsData } from '../types/search';

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'oldest';

interface FilterState {
  sort: SortOption;
  priceMin: number;
  priceMax: number;
  selectedCategories: string[];
  rating: number | null;
}

const DEFAULT_FILTERS: FilterState = {
  sort: 'relevance',
  priceMin: 0,
  priceMax: 100000,
  selectedCategories: [],
  rating: null,
};

const getProductRating = (comments: { stars: number }[] = []) => {
  if (comments.length === 0) return 0;
  return comments.reduce((total, comment) => total + comment.stars, 0) / comments.length;
};

const SearchPage = () => {
  const { query = '', category = '' } = useLocalSearchParams<{
    query?: string;
    category?: string;
  }>();
  const router = useRouter();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    selectedCategories: category ? [category] : [],
  });

  const [searchProducts, { data, loading }] =
    useLazyQuery<SearchProductsData>(SEARCH_PRODUCTS_QUERY);

  const products = useMemo(() => data?.allProducts ?? [], [data]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    products.forEach((product) => {
      product.categories.forEach((productCategory) => {
        if (productCategory.categoryName) uniqueCategories.add(productCategory.categoryName);
      });
    });
    return Array.from(uniqueCategories).sort((first, second) => first.localeCompare(second, 'tr'));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const matchingProducts = products.filter((product) => {
      const price = Number(product.productAvrPrice) || 0;
      const matchesPrice = price >= filters.priceMin && price <= filters.priceMax;
      const matchesCategory =
        filters.selectedCategories.length === 0 ||
        product.categories.some((productCategory) =>
          filters.selectedCategories.includes(productCategory.categoryName),
        );
      const matchesRating =
        filters.rating === null || getProductRating(product.comment) >= filters.rating;

      return matchesPrice && matchesCategory && matchesRating;
    });

    return [...matchingProducts].sort((firstProduct, secondProduct) => {
      const firstPrice = Number(firstProduct.productAvrPrice) || 0;
      const secondPrice = Number(secondProduct.productAvrPrice) || 0;

      switch (filters.sort) {
        case 'price_asc':
          return firstPrice - secondPrice;
        case 'price_desc':
          return secondPrice - firstPrice;
        case 'newest':
          return new Date(secondProduct.createdAt).getTime() - new Date(firstProduct.createdAt).getTime();
        case 'oldest':
          return new Date(firstProduct.createdAt).getTime() - new Date(secondProduct.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [filters, products]);

  useEffect(() => {
    if (query || category) {
      searchProducts({
        variables: {
          search: query || '',
          categoryName: category || '',
        },
      });
    }
  }, [query, category, searchProducts]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handlePriceChange = (field: 'priceMin' | 'priceMax', value: string) => {
    const numericValue = Number(value.replace(/\D/g, '')) || 0;
    setFilters((previousFilters) => ({
      ...previousFilters,
      [field]: field === 'priceMin'
        ? Math.min(numericValue, previousFilters.priceMax)
        : Math.max(numericValue, previousFilters.priceMin),
    }));
  };

  const handleProductSelect = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'İlgili', value: 'relevance' },
    { label: 'Fiyat: Artan', value: 'price_asc' },
    { label: 'Fiyat: Azalan', value: 'price_desc' },
    { label: 'Yeni → Eski', value: 'newest' },
    { label: 'Eski → Yeni', value: 'oldest' },
  ];

  const ratingOptions = [5, 4, 3, 2, 1];

  return (
    <View className="flex-1 bg-white">
      {/* Header (pb-0 ile alt boşluk sıfırlandı) */}
      <View className="pt-12 pb-0 border-b border-gray-100 shadow-sm">
        <View className="flex-row items-center justify-between px-4 pb-2">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">
              Arama Sonuçları
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            className="p-2 rounded-full bg-gray-100"
          >
            <Sliders size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar compact={true} />
      </View>

      {/* Results Count & Sort (py-1.5 ile dikey boşluk daraltıldı) */}
      {!loading && (
        <View className="px-4 py-1.5 border-b border-gray-100 bg-gray-50/50">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-500 font-medium">
              {filteredProducts.length > 0
                ? `${filteredProducts.length} ürün listeleniyor`
                : 'Sonuç bulunamadı'}
            </Text>
            {filters.sort !== 'relevance' && (
              <Text className="text-xs text-orange-600 font-medium">
                {sortOptions.find((opt) => opt.value === filters.sort)?.label}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Loading State */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      )}

      {/* Products List (paddingTop: 4 ile üst boşluk azaltıldı) */}
      {!loading && filteredProducts.length > 0 && (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 8, marginBottom: 8 }}
          contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 4, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleProductSelect(item.id)}
              className="bg-gray-50 rounded-xl p-2.5 mx-1 mb-2 border border-gray-100 shadow-sm"
              style={{ width: '48%' }}
            >
              {/* Product Image */}
              <View className="w-full h-32 bg-white rounded-lg mb-2 overflow-hidden items-center justify-center">
                <Image
                  source={{ uri: getImageUrl(item.coverImage || undefined) }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                  transition={150}
                />
              </View>

              {/* Product Info */}
              <Text
                className="text-xs font-semibold text-gray-900 mb-1 leading-4"
                numberOfLines={2}
              >
                {item.productName}
              </Text>

              {/* Stock Info */}
              <Text className="text-[11px] text-gray-500 mb-1">
                Stok: {item.productTotalQuantity} adet
              </Text>

              {/* Price */}
              <Text className="text-sm font-extrabold text-orange-600">
                ₺{Number(item.productAvrPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (query || products.length > 0) && (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-base font-bold text-gray-900 mb-1">
            Filtreye Uygun Ürün Bulunamadı
          </Text>
          <Text className="text-xs text-gray-500 text-center">
            Seçtiğiniz filtreleri değiştirerek tekrar deneyebilirsiniz.
          </Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 bg-white">
          <View className="pt-12 pb-4 border-b border-gray-100 flex-row items-center justify-between px-4">
            <Text className="text-lg font-semibold text-gray-900">
              Filtrele & Sırala
            </Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Sorting Section */}
            <View className="px-4 py-4 border-b border-gray-100">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Sıralama
              </Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleFilterChange({ sort: option.value })}
                  className="flex-row items-center py-3 border-b border-gray-50"
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      filters.sort === option.value
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {filters.sort === option.value && (
                      <View className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </View>
                  <Text className="text-sm text-gray-800">{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price Range Section */}
            <View className="px-4 py-4 border-b border-gray-100">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Fiyat Aralığı
              </Text>
              <View className="flex-row items-center justify-between mb-4">
                <TextInput
                  value={String(filters.priceMin)}
                  onChangeText={(value) => handlePriceChange('priceMin', value)}
                  keyboardType="numeric"
                  placeholder="Minimum"
                  className="w-[45%] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                />
                <TextInput
                  value={String(filters.priceMax)}
                  onChangeText={(value) => handlePriceChange('priceMax', value)}
                  keyboardType="numeric"
                  placeholder="Maksimum"
                  className="w-[45%] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                />
              </View>
              <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                <View
                  className="bg-orange-500 h-full"
                  style={{
                    width: `${Math.min((filters.priceMax / 100000) * 100, 100)}%`,
                  }}
                />
              </View>
            </View>

            {/* Category Filter Section */}
            <View className="px-4 py-4 border-b border-gray-100">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Kategoriler
              </Text>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    const isSelected = filters.selectedCategories.includes(cat);
                    handleFilterChange({
                      selectedCategories: isSelected
                        ? filters.selectedCategories.filter((c) => c !== cat)
                        : [...filters.selectedCategories, cat],
                    });
                  }}
                  className="flex-row items-center py-3 border-b border-gray-50"
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                      filters.selectedCategories.includes(cat)
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {filters.selectedCategories.includes(cat) && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </View>
                  <Text className="text-sm text-gray-800">{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Rating Filter Section */}
            <View className="px-4 py-4 border-b border-gray-100">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Değerlendirme
              </Text>
              {ratingOptions.map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() =>
                    handleFilterChange({
                      rating: filters.rating === rating ? null : rating,
                    })
                  }
                  className="flex-row items-center py-3 border-b border-gray-50"
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      filters.rating === rating
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {filters.rating === rating && (
                      <View className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </View>
                  <Text className="text-yellow-500 mr-2">
                    {'★'.repeat(rating)}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {rating} Yıldız ve Üzeri
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View className="border-t border-gray-100 px-4 py-4 flex-row gap-3">
            <TouchableOpacity
              onPress={handleResetFilters}
              className="flex-1 py-3 border border-gray-300 rounded-lg items-center"
            >
              <Text className="text-sm font-semibold text-gray-700">
                Sıfırla
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApplyFilters}
              className="flex-1 py-3 bg-orange-500 rounded-lg items-center"
            >
              <Text className="text-sm font-semibold text-white">
                Uygula
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SearchPage;