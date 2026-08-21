// src/app/product/[id].tsx
import { useMutation, useQuery } from '@apollo/client/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertCircle, Star } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AddCommentForm } from '../../components/product/AddCommentForm';
import { ProductBottomBar } from '../../components/product/ProductBottomBar';
import { ProductComments } from '../../components/product/ProductComments';
import { ProductImageGallery } from '../../components/product/ProductImageGallery';
import {
  ProductVariationSelector,
  Variation,
  VariationOption,
} from '../../components/product/ProductVariationSelector';
import { SimilarProducts } from '../../components/product/SimilarProducts';
import { SearchBar } from '../../components/SearchBar';

import { ADD_TO_BASKET, GET_MY_BASKET } from '../graphql/card';
import { GET_MY_FAVORITES, TOGGLE_FAVORITE } from '../graphql/favorite';
import { getImageUrl } from '../graphql/getImageUrl';
import { GET_PRODUCT_BY_ID } from '../graphql/queries';
import {
  MyFavoritesData,
  ToggleFavoriteData,
  ToggleFavoriteVariables,
} from '../types/favorite';
import { ProductComment, ProductDetailData } from '../types/id';

type AddToBasketMutationData = {
  addToBasket?: {
    message?: string;
  } | null;
};

type AddToBasketMutationVariables = {
  productVariantId: string;
  quantity: number;
};

const calculateRating = (comments: ProductComment[] = []) => {
  if (!comments || comments.length === 0) return '5.0';
  const total = comments.reduce((sum, c) => sum + (c.stars || 5), 0);
  return (total / comments.length).toFixed(1);
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // 1. Favori İşlemleri
  const { data: favData } = useQuery<MyFavoritesData>(GET_MY_FAVORITES);

  const isFavorited = useMemo(() => {
    return favData?.myFavorites?.some((fav) => fav.product.id === id) ?? false;
  }, [favData, id]);

  const [toggleFavorite, { loading: toggling }] = useMutation<
    ToggleFavoriteData,
    ToggleFavoriteVariables
  >(TOGGLE_FAVORITE, {
    refetchQueries: [{ query: GET_MY_FAVORITES }],
  });

  const handleToggleFavorite = async () => {
    if (!id || toggling) return;
    try {
      await toggleFavorite({
        variables: { data: { productId: id } },
      });
    } catch (err: any) {
      Alert.alert('Hata', err.message || 'Favori durumu güncellenemedi.');
    }
  };

  // 2. Ürün Detay ve Sepet İşlemleri
  const { data, loading, error } = useQuery<ProductDetailData>(GET_PRODUCT_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const [addToBasket, { loading: addingToCart }] = useMutation<
    AddToBasketMutationData,
    AddToBasketMutationVariables
  >(ADD_TO_BASKET, {
    refetchQueries: [{ query: GET_MY_BASKET }],
  });

  const product = data?.productDetail;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product?.variants?.[0]?.options && product?.variations) {
      const initialSelections: Record<string, string> = {};
      const firstVariant = product.variants[0];

      product.variations.forEach((variation: Variation) => {
        const matchingOption = variation.options.find((opt: VariationOption) =>
          firstVariant.options.some(
            (vOpt) => vOpt.id === opt.id || vOpt.varOptionValue === opt.varOptionValue
          )
        );
        if (matchingOption) {
          initialSelections[variation.id] = matchingOption.id;
        } else if (variation.options[0]) {
          initialSelections[variation.id] = variation.options[0].id;
        }
      });

      setSelectedOptions(initialSelections);
    }
  }, [product]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedOptions]);

  const isOptionAvailable = (varIndex: number, optionId: string) => {
    if (!product?.variants || !product?.variations) return true;

    if (varIndex === 0) {
      return product.variants.some((v) =>
        v.options.some((opt) => opt.id === optionId || opt.varOptionValue === optionId)
      );
    }

    const priorVariations = product.variations.slice(0, varIndex);

    return product.variants.some((variant) => {
      const hasTargetOption = variant.options.some(
        (opt) => opt.id === optionId || opt.varOptionValue === optionId
      );
      if (!hasTargetOption) return false;

      return priorVariations.every((prevVar: Variation) => {
        const selectedId = selectedOptions[prevVar.id];
        if (!selectedId) return true;
        return variant.options.some(
          (opt) => opt.id === selectedId || opt.varOptionValue === selectedId
        );
      });
    });
  };

  const handleSelectOption = (varIndex: number, variationId: string, optionId: string) => {
    if (!isOptionAvailable(varIndex, optionId)) return;

    const nextSelections = { ...selectedOptions, [variationId]: optionId };

    if (product?.variations && product?.variants) {
      for (let i = varIndex + 1; i < product.variations.length; i++) {
        const subVar = product.variations[i];
        const currentSubOptId = nextSelections[subVar.id];

        const isValid = product.variants.some((variant) => {
          const matchesPriors = product.variations.slice(0, i).every((pVar: Variation) => {
            const pSel = nextSelections[pVar.id];
            return variant.options.some((opt) => opt.id === pSel || opt.varOptionValue === pSel);
          });
          const matchesCurrent = variant.options.some(
            (opt) => opt.id === currentSubOptId || opt.varOptionValue === currentSubOptId
          );
          return matchesPriors && matchesCurrent;
        });

        if (!isValid) {
          const validVariant = product.variants.find((variant) =>
            product.variations.slice(0, i).every((pVar: Variation) => {
              const pSel = nextSelections[pVar.id];
              return variant.options.some((opt) => opt.id === pSel || opt.varOptionValue === pSel);
            })
          );

          if (validVariant) {
            const validOption = subVar.options.find((opt: VariationOption) =>
              validVariant.options.some(
                (vOpt) => vOpt.id === opt.id || vOpt.varOptionValue === opt.varOptionValue
              )
            );
            if (validOption) {
              nextSelections[subVar.id] = validOption.id;
            }
          }
        }
      }
    }

    setSelectedOptions(nextSelections);
  };

  const activeVariant =
    product?.variants?.find((variant) => {
      const selectedOptionIds = Object.values(selectedOptions);
      return selectedOptionIds.every((selId) =>
        variant.options.some((opt) => opt.id === selId || opt.varOptionValue === selId)
      );
    }) || product?.variants?.[0];

  const currentPrice = activeVariant ? Number(activeVariant.varPrice) : 0;
  const currentStock = activeVariant ? activeVariant.varStock : 0;
  const variantImages = activeVariant?.images || [];
  const mainImageUrl = getImageUrl(variantImages[selectedImageIndex]?.image);

  const handleAddToCart = async () => {
    if (!activeVariant) {
      Alert.alert('Uyarı', 'Lütfen geçerli bir ürün kombinasyonu belirleyin.');
      return;
    }

    if (currentStock <= 0) {
      Alert.alert('Stok Tükendi', 'Bu ürün seçeneği için stok bulunmamaktadır.');
      return;
    }

    try {
      const response = await addToBasket({
        variables: { productVariantId: activeVariant.id, quantity: 1 },
      });

      const result = response.data?.addToBasket;
      if (result) {
        Alert.alert('Başarılı 🎉', result.message || 'Ürün sepete eklendi.', [
          { text: 'Alışverişe Devam Et', style: 'cancel' },
          { text: 'Sepete Git', onPress: () => router.push('/(tabs)/cart') },
        ]);
      }
    } catch (err: any) {
      Alert.alert('Hata', err.message || 'Sunucu bağlantısı sırasında bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="text-xs text-gray-500 mt-2 font-medium">Ürün Detayı Yükleniyor...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <AlertCircle size={40} color="#EF4444" className="mb-2" />
        <Text className="text-base font-bold text-gray-900 mb-1">Ürün Bilgisi Yüklenemedi</Text>
        <Text className="text-xs text-gray-500 text-center mb-4">
          {error?.message || 'Aradığınız ürün mevcut değil veya kaldırılmış olabilir.'}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-orange-500 px-5 py-2.5 rounded-xl active:bg-orange-600 shadow-sm"
        >
          <Text className="text-white font-bold text-xs">Geri Dön</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      className="flex-1 bg-white"
    >
      <SearchBar compact={true} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
      >
        {/* 1. Görsel Galerisi */}
        <ProductImageGallery
          mainImageUrl={mainImageUrl}
          images={variantImages}
          selectedIndex={selectedImageIndex}
          onSelectIndex={setSelectedImageIndex}
          isFavorited={isFavorited}
          toggling={toggling}
          onToggleFavorite={handleToggleFavorite}
          onBack={() => router.back()}
        />

        {/* 2. Temel Bilgiler */}
        <View className="p-4">
          <Text className="text-xs font-bold text-orange-600 uppercase">
            {product.categories?.[0]?.categoryName || 'Genel'}
          </Text>
          <Text className="text-lg font-bold text-gray-900 mt-1">{product.productName}</Text>

          <View className="flex-row items-center justify-between mt-3">
            <View className="flex-row items-center bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <Star size={12} color="#EAB308" fill="#EAB308" />
              <Text className="text-xs font-bold text-amber-700 ml-1">
                {calculateRating(product.comment)} ({product.comment?.length || 0} Değerlendirme)
              </Text>
            </View>
            <Text className="text-xs text-gray-500 font-medium">
              Stok: <Text className="font-bold text-gray-800">{currentStock} adet</Text>
            </Text>
          </View>

          {/* 3. Varyasyon Seçici */}
          <ProductVariationSelector
            variations={product.variations || []}
            selectedOptions={selectedOptions}
            isOptionAvailable={isOptionAvailable}
            onSelectOption={handleSelectOption}
          />

          {/* 4. Ürün Açıklaması */}
          <View className="mt-4 border-t border-gray-100 pt-4">
            <Text className="text-sm font-bold text-gray-900 mb-1">Ürün Açıklaması</Text>
            <Text className="text-xs text-gray-600 leading-5">
              {product.productDescription || 'Bu ürün için detaylı bir açıklama belirtilmemiş.'}
            </Text>
          </View>

          {/* 5. Müşteri Yorumları */}
          <ProductComments productId={id} comments={product.comment} />

          {/* 6. Yorum Yapma Formu */}
          {id && <AddCommentForm productId={id} />}

          {/* 7. Benzer / Aynı Kategorideki Ürünler Carousel */}
          {id && (
            <SimilarProducts
              currentProductId={id}
              categoryName={product.categories?.[0]?.categoryName}
            />
          )}
        </View>
      </ScrollView>

      {/* 8. Sabit Alt Satın Alma Barı */}
      <ProductBottomBar
        price={currentPrice}
        stock={currentStock}
        addingToCart={addingToCart}
        onAddToCart={handleAddToCart}
      />
    </KeyboardAvoidingView>
  );
}