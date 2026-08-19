import { useLazyQuery } from '@apollo/client/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Sliders, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import '../../../global.css';
import { SearchBar } from '../../components/SearchBar';
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

const SearchPage = () => {
  const { query = '', category = '' } = useLocalSearchParams<{
    query?: string;
    category?: string;
  }>();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(category || '');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sort: 'relevance',
    priceMin: 0,
    priceMax: 100000,
    selectedCategories: selectedCategory ? [selectedCategory] : [],
    rating: null,
  });

  const [searchProducts, { data, loading, refetch }] =
    useLazyQuery<SearchProductsData>(SEARCH_PRODUCTS_QUERY);

  const products = data?.allProducts || [];

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
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    // Filters will be applied via callback when queries are available
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFilters({
      sort: 'relevance',
      priceMin: 0,
      priceMax: 100000,
      selectedCategories: [],
      rating: null,
    });
  };

  const handleProductSelect = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleRefresh = () => {
    if (query) {
      refetch({
        search: query,
        categoryName: selectedCategory || '',
      });
    }
  };

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'İlgili', value: 'relevance' },
    { label: 'Fiyat: Artan', value: 'price_asc' },
    { label: 'Fiyat: Azalan', value: 'price_desc' },
    { label: 'Yeni → Eski', value: 'newest' },
    { label: 'Eski → Yeni', value: 'oldest' },
  ];

  const categories = [
    'Elektronik',
    'Giyim',
    'Ev & Bahçe',
    'Spor',
    'Kitap',
    'Oyuncak',
  ];

  const ratingOptions = [5, 4, 3, 2, 1];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-12 pb-2 border-b border-gray-100 shadow-sm">
        <View className="flex-row items-center justify-between px-4 pb-3">
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

      {/* Results Count & Sort */}
      {!loading && (
        <View className="px-4 py-3 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">
              {products.length > 0
                ? `${products.length} ürün bulundu`
                : 'Sonuç bulunamadı'}
            </Text>
            {filters.sort !== 'relevance' && (
              <Text className="text-xs text-blue-600 font-medium">
                {sortOptions.find(opt => opt.value === filters.sort)?.label}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Loading State */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      )}

      {/* Products List */}
      {!loading && products.length > 0 && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 8, marginBottom: 8 }}
          contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleProductSelect(item.id)}
              className="flex-1 bg-gray-50 rounded-lg p-3 mx-1 mb-4"
            >
              {/* Product Image Placeholder */}
              <View className="w-full h-32 bg-gray-200 rounded-lg mb-2 items-center justify-center">
                <Text className="text-xs text-gray-500">Görsel</Text>
              </View>

              {/* Product Info */}
              <Text
                className="text-sm font-semibold text-gray-900 mb-1"
                numberOfLines={2}
              >
                {item.productName}
              </Text>

              {/* Stock Info */}
              <Text className="text-xs text-gray-500 mb-2">
                Stok: {item.productTotalQuantity} adet
              </Text>

              {/* Price */}
              <Text className="text-lg font-bold text-orange-500">
                ₺{Number(item.productAvrPrice).toLocaleString('tr-TR')}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && query && (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Sonuç Bulunamadı
          </Text>
          <Text className="text-sm text-gray-600 text-center">
            "{query}" için bir sonuç bulunamadı. Farklı bir arama yapabilirsiniz.
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
          {/* Modal Header */}
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
                        ? 'bg-blue-600 border-blue-600'
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
                <Text className="text-sm text-gray-600">
                  ₺{filters.priceMin.toLocaleString('tr-TR')}
                </Text>
                <Text className="text-sm text-gray-600">
                  ₺{filters.priceMax.toLocaleString('tr-TR')}
                </Text>
              </View>
              <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                <View
                  className="bg-blue-600 h-full"
                  style={{
                    width: `${(filters.priceMax / 100000) * 100}%`,
                  }}
                />
              </View>
              <Text className="text-xs text-gray-500 mt-2 text-center">
                Kaydırıcı özelliği sorgu eklenince aktif olacak
              </Text>
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
                        ? filters.selectedCategories.filter(c => c !== cat)
                        : [...filters.selectedCategories, cat],
                    });
                  }}
                  className="flex-row items-center py-3 border-b border-gray-50"
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                      filters.selectedCategories.includes(cat)
                        ? 'bg-blue-600 border-blue-600'
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
                        ? 'bg-blue-600 border-blue-600'
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

            {/* Subcategory Section (Example for active category) */}
            {filters.selectedCategories.length > 0 && (
              <View className="px-4 py-4 border-b border-gray-100">
                <Text className="text-base font-semibold text-gray-900 mb-3">
                  {filters.selectedCategories[0]} - Alt Kategoriler
                </Text>
                <View className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <Text className="text-sm text-blue-700">
                    Bu kategori için alt filtreleme seçenekleri sorgu eklenince aktif olacak
                  </Text>
                </View>
              </View>
            )}
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
              className="flex-1 py-3 bg-blue-600 rounded-lg items-center"
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