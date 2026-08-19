import { useLazyQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import '../../global.css';
import { CATEGORY_SUGGESTIONS, SEARCH_PRODUCTS_QUERY } from '../app/graphql/searchQueries';
import { SearchProductsData } from '../app/types/search';

interface Category {
  id: string;
  categoryIsActive: boolean;
  categoryName: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  compact?: boolean;
  initialQuery?: string;
  onQueryChange?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Marka, ürün veya kategori ara',
  compact = false,
  initialQuery = '',
  onQueryChange,
}) => {
  const [searchText, setSearchText] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const router = useRouter();

  // Search Products Query
  const [searchProducts, { data: productsData, loading: productsLoading }] =
    useLazyQuery<SearchProductsData>(SEARCH_PRODUCTS_QUERY);

  // Category Suggestions Query
  const [getCategorySuggestions, { data: categoriesData, loading: categoriesLoading }] =
    useLazyQuery<{ categorySuggestions: Category[] }>(CATEGORY_SUGGESTIONS);

  // Clear search state when component mounts fresh (for search page)
  useEffect(() => {
    if (!initialQuery) {
      setSelectedCategory('');
      setSearchText('');
    }
  }, []);
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchText.trim()) {
        setShowSuggestions(true);
        // Search for products
        searchProducts({
          variables: {
            search: searchText,
            categoryName: selectedCategory || '',
          },
        });
        // Get category suggestions
        getCategorySuggestions({
          variables: {
            searchText: searchText,
          },
        });
        onSearch?.(searchText);
        onQueryChange?.(searchText);
      } else {
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchText, selectedCategory, searchProducts, getCategorySuggestions, onSearch, onQueryChange]);

  const handleCategorySelect = (categoryName: string) => {
    // Navigate to search page with ONLY category filter (no search text)
    router.push({
      pathname: '/(tabs)/search',
      params: {
        query: '', // Empty query - search only by category
        category: categoryName,
      },
    });
    // Clear search text and category state
    setSearchText('');
    setSelectedCategory('');
    setShowSuggestions(false);
  };

  const handleProductSelect = (productName: string) => {
    // Navigate to search page with product name as query
    router.push({
      pathname: '/(tabs)/search',
      params: {
        query: productName,
        category: selectedCategory || '',
      },
    });
    // Clear search text and suggestions
    setSearchText('');
    setShowSuggestions(false);
  };

  const handleViewAll = () => {
    // Navigate to search page with full results
    router.push({
      pathname: '/(tabs)/search',
      params: {
        query: searchText,
        category: selectedCategory || '',
      },
    });
    // Clear search text and suggestions
    setSearchText('');
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchText('');
    setSelectedCategory('');
    setShowSuggestions(false);
    onQueryChange?.('');
  };

  const isLoading = productsLoading || categoriesLoading;
  const products = productsData?.allProducts || [];
  const categories = categoriesData?.categorySuggestions || [];

  return (
    <View className={compact ? 'px-4 py-2' : 'px-4 py-3'}>
      {/* Search Input */}
      <View className="flex-row items-center bg-gray-100 rounded-full px-3.5 py-2">
        <Search size={18} color="#9CA3AF" />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
          onFocus={() => searchText && setShowSuggestions(true)}
          className="flex-1 ml-2 text-sm text-gray-800 p-0"
          maxLength={50}
        />
        {searchText && (
          <TouchableOpacity onPress={handleClear} className="p-1">
            <X size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Selected Category Badge */}
      {selectedCategory && (
        <View className="mt-2 flex-row items-center">
          <View className="bg-blue-100 rounded-full px-3 py-1 flex-row items-center">
            <Text className="text-sm text-blue-700 mr-2">{selectedCategory}</Text>
            <TouchableOpacity onPress={() => setSelectedCategory('')}>
              <X size={14} color="#1D4ED8" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && searchText.trim() && (
        <View className="bg-white border border-gray-200 rounded-lg mt-2 shadow-sm z-50">
          {isLoading && (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#0066CC" />
            </View>
          )}

          {!isLoading && (products.length > 0 || categories.length > 0) && (
            <>
              {/* Category Suggestions */}
              {categories.length > 0 && (
                <>
                  <Text className="text-xs font-semibold text-gray-500 px-4 pt-3 pb-2">
                    KATEGORİLER
                  </Text>
                  <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleCategorySelect(item.categoryName)}
                        className="px-4 py-2 border-b border-gray-100"
                      >
                        <Text className="text-sm text-gray-800">
                          {item.categoryName}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </>
              )}

              {/* Product Results Preview */}
              {products.length > 0 && (
                <>
                  <Text className="text-xs font-semibold text-gray-500 px-4 pt-3 pb-2">
                    ÜRÜNLER
                  </Text>
                  <FlatList
                    data={products.slice(0, 3)} // Show top 3 products
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleProductSelect(item.productName)}
                        className="px-4 py-3 border-b border-gray-100 flex-row"
                      >
                        <View className="flex-1">
                          <Text className="text-sm font-medium text-gray-800" numberOfLines={1}>
                            {item.productName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </>
              )}

              {/* View All Results Button */}
              {products.length > 0 && (
                <TouchableOpacity
                  onPress={handleViewAll}
                  className="px-4 py-3 items-center border-t border-gray-100 bg-blue-50"
                >
                  <Text className="text-sm text-blue-600 font-bold">
                    Tümünü Gör ({products.length})
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {!isLoading && products.length === 0 && categories.length === 0 && (
            <View className="py-4 items-center">
              <Text className="text-sm text-gray-500">Sonuç bulunamadı</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
