// src/app/(tabs)/cart.tsx
import { useMutation, useQuery } from '@apollo/client/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ArrowRight,
  LogIn,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UserPlus,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import { Header } from '@/components/Header';
import { ADD_TO_BASKET, GET_MY_BASKET, REMOVE_FROM_BASKET } from '../graphql/card';
import { getImageUrl } from '../graphql/getImageUrl';
import {
  AddToBasketData,
  AddToBasketVariables,
  BasketItem,
  RemoveFromBasketData,
  RemoveFromBasketVariables,
  UserBasketData,
} from '../types/card';

export default function CartScreen() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  // 1. JWT Token Kontrolü (Her odaklanıldığında AsyncStorage kontrol edilir)
  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem('userToken');
        setHasToken(!!token);
      };
      checkAuth();
    }, [])
  );

  // 2. Sepet Verisini Çekme
  const { data, loading, refetch } = useQuery<UserBasketData>(GET_MY_BASKET, {
    skip: !hasToken,
    fetchPolicy: 'network-only',
  });

  useFocusEffect(
    useCallback(() => {
      if (hasToken) {
        refetch();
      }
    }, [hasToken, refetch])
  );

  // 3. Mutasyonlar
  const [addToBasket] = useMutation<AddToBasketData, AddToBasketVariables>(ADD_TO_BASKET, {
    refetchQueries: [{ query: GET_MY_BASKET }],
  });

  const [removeFromBasket, { loading: isRemoving }] = useMutation<
    RemoveFromBasketData,
    RemoveFromBasketVariables
  >(REMOVE_FROM_BASKET, {
    refetchQueries: [{ query: GET_MY_BASKET }],
  });

  const basketItems = data?.myBasket?.items || [];

  // Toplam Tutar: sum(quantity * varPrice)
  const totalPrice = basketItems.reduce((acc, item) => {
    const price = Number(item.productVariant?.varPrice) || 0;
    return acc + price * item.quantity;
  }, 0);

  // 4. Miktar Değiştirme
  const handleQuantityChange = async (item: BasketItem, change: number) => {
    const variant = item.productVariant;
    const currentQty = item.quantity;
    const newQty = currentQty + change;

    // Adet 0 veya altına düşerse satır ID'si ile sil
    if (newQty <= 0) {
      handleRemoveItem(item.id);
      return;
    }

    if (variant.varStock && newQty > variant.varStock) {
      Alert.alert('Yetersiz Stok', `Bu üründen en fazla ${variant.varStock} adet satın alabilirsiniz.`);
      return;
    }

    try {
      await addToBasket({
        variables: {
          productVariantId: variant.id,
          quantity: change,
        },
      });
    } catch (err: any) {
      Alert.alert('Hata', err.message || 'Miktar güncellenirken bir sorun oluştu.');
    }
  };

  // 5. Sepetten Silme İşlemi (basketItemId ve Header ile çalışır)
  const handleRemoveItem = (basketItemId: string) => {
    Alert.alert('Ürünü Sil', 'Bu ürünü sepetinizden kaldırmak istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await removeFromBasket({
              variables: {
                basketItemId: String(basketItemId),
              },
            });

            const res = response.data?.removeFromBasket;
            if (res?.message) {
              console.log('Sunucu Mesajı:', res.message);
            }
          } catch (err: any) {
            Alert.alert('Hata', err.message || 'Ürün sepetten silinemedi.');
          }
        },
      },
    ]);
  };

  // Yüklenme Durumu
  if (hasToken === null || (hasToken && loading && !data)) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="text-xs text-gray-500 mt-2 font-medium">Sepetiniz yükleniyor...</Text>
      </View>
    );
  }

  // Giriş Yapılmamışsa
  if (!hasToken) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-6">
        <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-5 border border-orange-100 shadow-sm">
          <ShoppingBag size={44} color="#F97316" />
        </View>

        <Text className="text-xl font-extrabold text-gray-900 mb-2">Giriş Yapmadınız</Text>
        <Text className="text-xs text-gray-500 text-center mb-8 px-4 leading-5">
          Sepetinizi görüntülemek ve ürünleri yönetmek için lütfen hesabınıza giriş yapın.
        </Text>

        <View className="w-full gap-3">
          <Pressable
            onPress={() => router.push('/login')}
            className="w-full bg-orange-500 py-4 rounded-xl flex-row items-center justify-center active:bg-orange-600 shadow-sm"
          >
            <LogIn size={18} color="#FFFFFF" />
            <Text className="text-white font-bold text-sm ml-2">Giriş Yap</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/register')}
            className="w-full border border-orange-500 py-3.5 rounded-xl flex-row items-center justify-center active:bg-orange-50"
          >
            <UserPlus size={18} color="#F97316" />
            <Text className="text-orange-600 font-bold text-sm ml-2">Hesap Oluştur</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Boş Sepet
  const renderEmptyCart = () => (
    <View className="flex-1 justify-center items-center py-24 px-6">
      <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4 border border-orange-100">
        <ShoppingBag size={36} color="#F97316" />
      </View>
      <Text className="text-lg font-bold text-gray-900 mb-1">Sepetiniz Boş</Text>
      <Text className="text-xs text-gray-500 text-center mb-6 leading-5">
        Sepetinizde henüz ürün bulunmamaktadır. Alışverişe başlayarak ürün ekleyebilirsiniz.
      </Text>
      <Pressable
        onPress={() => router.push('/')}
        className="bg-orange-500 px-6 py-3 rounded-xl active:bg-orange-600 shadow-sm"
      >
        <Text className="text-white font-bold text-xs">Ürünleri Keşfet</Text>
      </Pressable>
    </View>
  );

  // Tekil Sepet Kartı Render
  const renderBasketItem = ({ item }: { item: BasketItem }) => {
    const variant = item.productVariant;
    const price = Number(variant?.varPrice) || 0;
    const imageUrl = getImageUrl(variant?.product?.coverImage || undefined);

    const optionsText = variant?.options
      ?.map((opt) =>
        opt.variation?.varName ? `${opt.variation.varName}: ${opt.varOptionValue}` : opt.varOptionValue
      )
      .join(' / ');

    return (
      <View className="bg-white p-3.5 rounded-2xl mb-3 border border-gray-100 flex-row items-center shadow-sm">
        {/* Görsel */}
        <Pressable
          onPress={() => variant.product.id && router.push(`/product/${variant.product.id}`)}
          className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden mr-3.5"
        >
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
            transition={150}
          />
        </Pressable>

        {/* Detaylar */}
        <View className="flex-1 h-24 justify-between py-0.5">
          <View>
            <Text numberOfLines={1} className="text-xs font-semibold text-gray-900">
              {variant.product.productName}
            </Text>
            {optionsText ? (
              <Text numberOfLines={2} className="text-[11px] text-gray-500 mt-1 font-medium leading-4">
                {optionsText}
              </Text>
            ) : null}
          </View>

          <Text className="text-sm font-extrabold text-gray-900">
            {price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
          </Text>
        </View>

        {/* Butonlar */}
        <View className="h-24 justify-between items-end pl-2">
          <Pressable
            disabled={isRemoving}
            onPress={() => handleRemoveItem(item.id)}
            className="p-1 active:opacity-60"
          >
            <Trash2 size={16} color="#9CA3AF" />
          </Pressable>

          <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
            <Pressable
              onPress={() => handleQuantityChange(item, -1)}
              className="w-6 h-6 items-center justify-center bg-white rounded-lg active:bg-gray-100 shadow-sm"
            >
              <Minus size={12} color="#374151" />
            </Pressable>

            <Text className="text-xs font-bold text-gray-900 px-2.5">
              {item.quantity}
            </Text>

            <Pressable
              onPress={() => handleQuantityChange(item, 1)}
              className="w-6 h-6 items-center justify-center bg-white rounded-lg active:bg-gray-100 shadow-sm"
            >
              <Plus size={12} color="#374151" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header />

      {/* Başlık */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <Text className="text-base font-bold text-gray-900">Sepetim</Text>
        <Text className="text-xs font-medium text-gray-500">{basketItems.length} Ürün</Text>
      </View>

      {/* Liste */}
      <FlatList
        data={basketItems}
        keyExtractor={(item) => item.id}
        renderItem={renderBasketItem}
        ListEmptyComponent={renderEmptyCart}
        contentContainerStyle={{ padding: 14, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Sabit Alt Ödeme Barı */}
      {basketItems.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-white border-t border-gray-100 flex-row items-center justify-between shadow-2xl">
          <View>
            <Text className="text-xs text-gray-400 font-medium">Ödenecek Tutar</Text>
            <Text className="text-xl font-extrabold text-orange-600">
              {totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/checkout')}
            className="bg-orange-500 flex-row items-center px-6 py-3.5 rounded-xl active:bg-orange-600 shadow-sm"
          >
            <Text className="text-white font-bold text-sm mr-2">Sepeti Onayla</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </View>
  );
}