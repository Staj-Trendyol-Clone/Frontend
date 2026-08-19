// src/app/product/[id].tsx
import { Header } from '@/components/Header';
import { useMutation, useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertCircle, ArrowLeft, Heart, ShoppingBag, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { ADD_TO_BASKET, GET_MY_BASKET } from '../graphql/card';
import { getImageUrl } from '../graphql/getImageUrl';
import { GET_PRODUCT_BY_ID } from '../graphql/queries';
import { ProductComment, ProductDetailData, Variation, VariationOption } from '../types/id';

// Ortalama puan hesaplama
const calculateRating = (comments: ProductComment[] = []) => {
  if (!comments || comments.length === 0) return '5.0';
  const total = comments.reduce((sum, c) => sum + c.stars, 0);
  return (total / comments.length).toFixed(1);
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // 1. Apollo Query & Mutation
  const { data, loading, error } = useQuery<ProductDetailData>(GET_PRODUCT_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const [addToBasket, { loading: addingToCart }] = useMutation<{
    addToBasket: {
      message?: string;
      totalPrice?: number | string;
      basket?: {
        id: string;
        isActive: boolean;
        createdAt?: string;
      };
    };
  }>(ADD_TO_BASKET, {
    refetchQueries: [{ query: GET_MY_BASKET }],
  });

  const product = data?.productDetail;

  // State Yönetimi
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // 2. İlk açılışta ilk varyantın seçeneklerini seç
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

  // Seçenek değiştiğinde görsel indeksini sıfırla
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedOptions]);

  // 3. HİYERARŞİK SEÇENEK KONTROLÜ (Kat sayısı kilitlenmez, Renk kat sayısına bakar)
  const isOptionAvailable = (varIndex: number, optionId: string) => {
    if (!product?.variants || !product?.variations) return true;

    // 1. Sıradaki varyasyon grubu (Kat Sayısı) her zaman tıklanabilir
    if (varIndex === 0) {
      return product.variants.some((v) =>
        v.options.some((opt) => opt.id === optionId || opt.varOptionValue === optionId)
      );
    }

    // Alt varyasyonlar (Renk vb.) kendinden önceki üst varyasyonların seçimine bakar
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

  // 4. VARYASYON DEĞİŞTİRME & OTOMATİK GEÇERLİ RENK SEÇİMİ
  const handleSelectOption = (varIndex: number, variationId: string, optionId: string) => {
    if (!isOptionAvailable(varIndex, optionId)) return;

    const nextSelections = { ...selectedOptions, [variationId]: optionId };

    // Üst varyasyon (Kat Sayısı) değiştiğinde alt varyasyonun (Renk) geçerliliğini kontrol et
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

        // Seçili renk yeni kat sayısında yoksa, o kat sayısındaki ilk geçerli rengi seç
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

  // 5. Aktif Varyant Tespiti
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

  // 6. Sepete Ekleme
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
        variables: {
          productVariantId: activeVariant.id,
          quantity: 1,
        },
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
    <View className="flex-1 bg-white">
      <Header />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 1. GÖRSEL ALANI */}
        <View className="relative w-full h-96 bg-gray-50 overflow-hidden items-center justify-center">
          <View className="absolute top-4 left-0 right-0 px-4 flex-row items-center justify-between z-10">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-md active:bg-gray-100"
            >
              <ArrowLeft size={20} color="#1F2937" />
            </Pressable>

            <Pressable
              onPress={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-md active:bg-gray-100"
            >
              <Heart
                size={20}
                color={isFavorite ? '#F97316' : '#1F2937'}
                fill={isFavorite ? '#F97316' : 'transparent'}
              />
            </Pressable>
          </View>

          <Image
            source={{ uri: mainImageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
            transition={150}
          />
        </View>

        {/* Çoklu Görsel Önizlemeleri */}
        {variantImages.length > 1 && (
          <View className="flex-row p-3 gap-2 bg-gray-50 border-b border-gray-100">
            {variantImages.map((img, idx) => (
              <Pressable
                key={img.id || idx}
                onPress={() => setSelectedImageIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden bg-white border-2 ${
                  selectedImageIndex === idx ? 'border-orange-500' : 'border-gray-200'
                }`}
              >
                <Image
                  source={{ uri: getImageUrl(img.image) }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </Pressable>
            ))}
          </View>
        )}

        {/* 2. ÜRÜN BİLGİLERİ */}
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

          {/* 3. VARYASYON SEÇİM ALANI */}
          {product.variations && product.variations.length > 0 && (
            <View className="mt-5 border-t border-gray-100 pt-3">
              {product.variations.map((variation: Variation, varIndex: number) => (
                <View key={variation.id} className="mb-3">
                  <Text className="text-xs font-bold text-gray-900 mb-2">
                    {variation.varName} Seçiniz:
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {variation.options?.map((option: VariationOption) => {
                      const isSelected = selectedOptions[variation.id] === option.id;
                      const isAvailable = isOptionAvailable(varIndex, option.id);

                      return (
                        <Pressable
                          key={option.id}
                          disabled={!isAvailable}
                          onPress={() => handleSelectOption(varIndex, variation.id, option.id)}
                          className={`px-4 py-2 rounded-xl border ${
                            !isAvailable
                              ? 'border-gray-200 bg-gray-100 opacity-40'
                              : isSelected
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 bg-white active:bg-gray-50'
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              !isAvailable
                                ? 'text-gray-400 line-through'
                                : isSelected
                                ? 'text-orange-600 font-bold'
                                : 'text-gray-700'
                            }`}
                          >
                            {option.varOptionValue}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* 4. AÇIKLAMA */}
          <View className="mt-4 border-t border-gray-100 pt-4">
            <Text className="text-sm font-bold text-gray-900 mb-1">Ürün Açıklaması</Text>
            <Text className="text-xs text-gray-600 leading-5">
              {product.productDescription || 'Bu ürün için detaylı bir açıklama belirtilmemiş.'}
            </Text>
          </View>

          {/* 5. YORUMLAR */}
          {product.comment && product.comment.length > 0 && (
            <View className="mt-6 border-t border-gray-100 pt-4">
              <Text className="text-sm font-bold text-gray-900 mb-3">
                Müşteri Değerlendirmeleri ({product.comment.length})
              </Text>
              {product.comment.map((c: ProductComment, index: number) => (
                <View key={c.id || index} className="bg-gray-50 p-3 rounded-xl mb-2.5 border border-gray-100">
                  <View className="flex-row items-center gap-1 mb-1">
                    {[...Array(c.stars || 5)].map((_, i) => (
                      <Star key={i} size={10} color="#EAB308" fill="#EAB308" />
                    ))}
                  </View>
                  <Text className="text-xs text-gray-700 leading-4">{c.comment}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 6. SABİT ALT BAR */}
      <View className="p-4 pb-8 bg-white border-t border-gray-100 flex-row items-center justify-between shadow-lg">
        <View>
          <Text className="text-xs text-gray-400 font-medium">Toplam Tutar</Text>
          <Text className="text-xl font-extrabold text-gray-900">
            {currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
          </Text>
        </View>

        <Pressable
          onPress={handleAddToCart}
          disabled={currentStock <= 0 || addingToCart}
          className={`flex-row items-center px-6 py-3.5 rounded-xl shadow-sm ${
            currentStock > 0 ? 'bg-orange-500 active:bg-orange-600' : 'bg-gray-300'
          }`}
        >
          {addingToCart ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <ShoppingBag size={18} color="#FFFFFF" />
              <Text className="text-white font-bold text-sm ml-2">
                {currentStock > 0 ? 'Sepete Ekle' : 'Tükendi'}
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}