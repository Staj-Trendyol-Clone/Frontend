import { useLazyQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Sliders } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import '../../../global.css';
import { SearchBar } from '../../components/SearchBar';
import { FilterModal } from '../../components/search/FilterModal';
import { getImageUrl } from '../graphql/getImageUrl';
import { SEARCH_PRODUCTS_QUERY } from '../graphql/searchQueries';
import { SearchProductsData } from '../types/search';
import {
  DEFAULT_FILTERS,
  FilterState,
  SORT_OPTIONS,
  countActiveFilters,
  extractCategories,
  filterAndSortProducts,
  filtersFromParams,
} from '../utils/productFilters';

const SearchPage = () => {
  const { query = '', category = '' } = useLocalSearchParams<{
    query?: string;
    category?: string;
  }>();
  const searchQuery = Array.isArray(query) ? query[0] : query;
  const categoryParam = Array.isArray(category) ? category[0] : category;

  const router = useRouter();

  const [showFilterModal, setShowFilterModal] = useState(false);
  // Listeye yansıyan filtreler
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(() =>
    filtersFromParams(categoryParam),
  );
  // Modal içinde düzenlenen taslak (Uygula'ya basılmadan listeyi etkilemez)
  const [draftFilters, setDraftFilters] = useState<FilterState>(appliedFilters);

  const [searchProducts, { data, loading }] =
    useLazyQuery<SearchProductsData>(SEARCH_PRODUCTS_QUERY);

  const products = useMemo(() => data?.allProducts ?? [], [data]);

  // Kategori seçenekleri: sunucudan gelen ham sonuçlardan üretilir
  // (istemci filtresi uygulanmadan önce — böylece seçenekler daralmaz)
  const categories = useMemo(() => extractCategories(products), [products]);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, appliedFilters),
    [products, appliedFilters],
  );

  const activeFilterCount = useMemo(
    () => countActiveFilters(appliedFilters),
    [appliedFilters],
  );

  // URL değişince aramayı yenile.
  // Metin araması varsa kategori sunucuya gönderilmez; kategori istemcide filtrelenir.
  // Sadece kategori ile gelindiyse sunucuya categoryName verilir.
  useEffect(() => {
    if (!searchQuery && !categoryParam) return;

    searchProducts({
      variables: {
        search: searchQuery || '',
        categoryName: searchQuery ? '' : categoryParam || '',
      },
    });
  }, [searchQuery, categoryParam, searchProducts]);

  // URL'deki kategori değişince uygulanan filtreleri senkronla
  useEffect(() => {
    setAppliedFilters(filtersFromParams(categoryParam));
  }, [categoryParam, searchQuery]);

  const openFilterModal = () => {
    setDraftFilters(appliedFilters);
    setShowFilterModal(true);
  };

  const closeFilterModal = () => {
    setShowFilterModal(false);
    setDraftFilters(appliedFilters);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setShowFilterModal(false);
  };

  const handleResetDraft = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const handleProductSelect = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const currentSortLabel = SORT_OPTIONS.find(
    (option) => option.value === appliedFilters.sort,
  )?.label;

  return (
    <View className="flex-1 bg-white">
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
            onPress={openFilterModal}
            className="p-2 rounded-full bg-gray-100 relative"
            accessibilityLabel="Filtrele"
          >
            <Sliders size={20} color="#1F2937" />
            {activeFilterCount > 0 && (
              <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 items-center justify-center">
                <Text className="text-[10px] font-bold text-white">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <SearchBar key={searchQuery} compact={true} initialQuery={searchQuery} />
      </View>

      {!loading && (
        <View className="px-4 py-1.5 border-b border-gray-100 bg-gray-50/50">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-500 font-medium">
              {filteredProducts.length > 0
                ? `${filteredProducts.length} ürün listeleniyor`
                : 'Sonuç bulunamadı'}
            </Text>
            {appliedFilters.sort !== 'relevance' && (
              <Text className="text-xs text-orange-600 font-medium">
                {currentSortLabel}
              </Text>
            )}
          </View>
        </View>
      )}

      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      )}

      {!loading && filteredProducts.length > 0 && (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 8, marginBottom: 8 }}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingTop: 4,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleProductSelect(item.id)}
              className="bg-gray-50 rounded-xl p-2.5 mx-1 mb-2 border border-gray-100 shadow-sm"
              style={{ width: '48%' }}
            >
              <View className="w-full h-32 bg-white rounded-lg mb-2 overflow-hidden items-center justify-center">
                <Image
                  source={{ uri: getImageUrl(item.coverImage || undefined) }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                  transition={150}
                />
              </View>

              <Text
                className="text-xs font-semibold text-gray-900 mb-1 leading-4"
                numberOfLines={2}
              >
                {item.productName}
              </Text>

              <Text className="text-[11px] text-gray-500 mb-1">
                Stok: {item.productTotalQuantity} adet
              </Text>

              <Text className="text-sm font-extrabold text-orange-600">
                ₺
                {Number(item.productAvrPrice).toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {!loading &&
        filteredProducts.length === 0 &&
        (searchQuery || categoryParam || products.length > 0) && (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-base font-bold text-gray-900 mb-1">
              Filtreye Uygun Ürün Bulunamadı
            </Text>
            <Text className="text-xs text-gray-500 text-center mb-4">
              Seçtiğiniz filtreleri değiştirerek tekrar deneyebilirsiniz.
            </Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setAppliedFilters(DEFAULT_FILTERS);
                  setDraftFilters(DEFAULT_FILTERS);
                }}
                className="px-4 py-2 bg-orange-500 rounded-lg"
              >
                <Text className="text-sm font-semibold text-white">
                  Filtreleri Temizle
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      <FilterModal
        visible={showFilterModal}
        draft={draftFilters}
        categories={categories}
        onChange={setDraftFilters}
        onClose={closeFilterModal}
        onApply={handleApplyFilters}
        onReset={handleResetDraft}
      />
    </View>
  );
};

export default SearchPage;
