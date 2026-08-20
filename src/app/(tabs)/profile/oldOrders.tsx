// src/app/(tabs)/profile/oldOrders.tsx
import { useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck
} from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { getImageUrl } from '../../graphql/getImageUrl';
import { GET_MY_ORDERS } from '../../graphql/order';
import { GetMyOrdersData, Order, OrderItem } from '../../types/order';

export default function OldOrdersScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Sipariş verilerini çek
  const { data, loading, error, refetch } = useQuery<GetMyOrdersData>(GET_MY_ORDERS, {
    fetchPolicy: 'network-only',
  });

  const orders = data?.myOrders || [];

  // Sayfayı yenileme (Pull to Refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Sipariş Durumu Rozeti
  const renderStatusBadge = (status: string) => {
    const formattedStatus = status ? status.toUpperCase() : '';

    switch (formattedStatus) {
      case 'DELIVERED':
      case 'TESLIM_EDILDI':
      case 'COMPLETED':
        return (
          <View className="flex-row items-center bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            <CheckCircle2 size={12} color="#16A34A" />
            <Text className="text-[11px] font-bold text-green-700 ml-1">Teslim Edildi</Text>
          </View>
        );
      case 'IN_CARGO':
      case 'SHIPPED':
      case 'KARGODA':
        return (
          <View className="flex-row items-center bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            <Truck size={12} color="#2563EB" />
            <Text className="text-[11px] font-bold text-blue-700 ml-1">Kargoda</Text>
          </View>
        );
      case 'PREPARING':
      case 'HAZIRLANIYOR':
      case 'PROCESSING':
        return (
          <View className="flex-row items-center bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Clock size={12} color="#D97706" />
            <Text className="text-[11px] font-bold text-amber-700 ml-1">Hazırlanıyor</Text>
          </View>
        );
      case 'CANCELLED':
      case 'IPTAL':
        return (
          <View className="flex-row items-center bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
            <AlertCircle size={12} color="#DC2626" />
            <Text className="text-[11px] font-bold text-red-700 ml-1">İptal Edildi</Text>
          </View>
        );
      default:
        return (
          <View className="flex-row items-center bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
            <Text className="text-[11px] font-bold text-gray-700">{status || 'Bilinmiyor'}</Text>
          </View>
        );
    }
  };

  // Tarih Formatlayıcı
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // Boş Sipariş Durumu
  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-24 px-6">
      <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4 border border-orange-100 shadow-sm">
        <Package size={36} color="#F97316" />
      </View>
      <Text className="text-lg font-bold text-gray-900 mb-1">Henüz Siparişiniz Yok</Text>
      <Text className="text-xs text-gray-500 text-center mb-6 leading-5">
        Geçmişte verdiğiniz siparişler burada listelenecektir. Hemen alışverişe başlayabilirsiniz.
      </Text>
      <Pressable
        onPress={() => router.push('/(tabs)')}
        className="bg-orange-500 px-6 py-3 rounded-xl active:bg-orange-600 shadow-sm"
      >
        <Text className="text-white font-bold text-xs">Alışverişe Başla</Text>
      </Pressable>
    </View>
  );

  // Tekil Sipariş Kartı
  const renderOrderItem = ({ item }: { item: Order }) => {
    const totalAmountNum = Number(item.totalAmount) || 0;

    return (
      <View className="bg-white rounded-2xl mb-4 p-4 border border-gray-100 shadow-sm">
        {/* Sipariş No & Durum */}
        <View className="flex-row items-center justify-between pb-3 border-b border-gray-50">
          <View>
            <Text className="text-xs font-extrabold text-gray-900">Sipariş #{item.id}</Text>
            <Text className="text-[11px] text-gray-400 mt-0.5">{formatDate(item.createdAt)}</Text>
          </View>
          {renderStatusBadge(item.status)}
        </View>

        {/* Sipariş Edilen Ürünlerin Listesi */}
        <View className="py-3 gap-3">
          {item.items.map((orderItem: OrderItem) => {
            const product = orderItem.productVariant?.product;
            const imageUrl = getImageUrl(product?.coverImage || undefined);
            const itemPrice = Number(orderItem.priceAtTimeOfPurchase) || 0;

            return (
              <View key={orderItem.id} className="flex-row items-center">
                <View className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden mr-3 border border-gray-100">
                  <Image
                    source={{ uri: imageUrl }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="contain"
                  />
                </View>

                <View className="flex-1">
                  <Text numberOfLines={1} className="text-xs font-semibold text-gray-900">
                    {product?.productName || 'Ürün Adı Belirtilmemiş'}
                  </Text>
                  <Text className="text-xs font-bold text-orange-600 mt-1">
                    {itemPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    <Text className="text-gray-400 font-normal"> x {orderItem.quantity}</Text>
                  </Text>
                </View>

                <Text className="text-xs font-bold text-gray-900">
                  {(itemPrice * orderItem.quantity).toLocaleString('tr-TR', {
                    minimumFractionDigits: 2,
                  })}{' '}
                  TL
                </Text>
              </View>
            );
          })}
        </View>

        {/* Teslimat Adresi Özeti */}
        {item.shippingAddress ? (
          <View className="py-2.5 px-3 bg-gray-50 rounded-xl mb-3 flex-row items-center">
            <Text numberOfLines={3} className="text-[11px] text-gray-600 flex-1">
              {item.shippingAddress}
            </Text>
          </View>
        ) : null}

        {/* Toplam Tutar */}
        <View className="pt-3 border-t border-gray-50 flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] text-gray-400 font-medium">Toplam Tutar</Text>
            <Text className="text-base font-extrabold text-orange-600">
              {totalAmountNum.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
            </Text>
          </View>

          <View className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Text className="text-[11px] font-semibold text-gray-600">
              {item.items.reduce((acc, it) => acc + it.quantity, 0)} Ürün
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="text-xs text-gray-500 mt-2 font-medium">Siparişler yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <AlertCircle size={40} color="#EF4444" />
        <Text className="text-sm font-bold text-gray-900 mt-2">Siparişler Alınamadı</Text>
        <Text className="text-xs text-gray-500 text-center mt-1 mb-4">{error.message}</Text>
        <Pressable
          onPress={() => refetch()}
          className="bg-orange-500 px-5 py-2.5 rounded-xl active:bg-orange-600"
        >
          <Text className="text-white text-xs font-bold">Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Üst Header */}
      <View className="pt-12 pb-3.5 px-4 bg-white border-b border-gray-100 flex-row items-center justify-between shadow-sm">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center border border-gray-100 active:bg-gray-100"
        >
          <ArrowLeft size={18} color="#1F2937" />
        </Pressable>

        <Text className="text-base font-extrabold text-gray-900">Geçmiş Siparişlerim</Text>

        <View className="w-9" />
      </View>

      {/* Sipariş Listesi */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />
        }
      />
    </View>
  );
}