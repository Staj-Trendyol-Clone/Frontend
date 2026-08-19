// src/app/checkout/index.tsx
import { useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckSquare,
  ChevronDown,
  CreditCard,
  FileText,
  Lock,
  ShieldCheck,
  Square,
  Truck
} from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { GET_MY_BASKET } from '../graphql/card';
import { getImageUrl } from '../graphql/getImageUrl';
import { GET_USER_PROFILE } from '../graphql/profile';
import { BasketItem, UserBasketData, VariantOptionInfo } from '../types/card';
import { UserProfileData } from '../types/profile';

export default function CheckoutScreen() {
  const router = useRouter();

  // 1. GraphQL Verilerini Çekme (Sepet ve DB Kayıtlı Profil)
  const { data: basketData, loading: basketLoading } = useQuery<UserBasketData>(GET_MY_BASKET);
  const { data: profileData, loading: profileLoading } = useQuery<UserProfileData>(GET_USER_PROFILE, {
    fetchPolicy: 'network-only',
  });

  const basketItems = basketData?.myBasket?.items || [];
  const totalPrice = basketItems.reduce(
    (acc, item) => acc + (Number(item.productVariant?.varPrice) || 0) * item.quantity,
    0
  );

  // DB'den gelen sabit teslimat adresi
  const deliveryAddress = profileData?.me?.address || '';
  const recipientName = profileData?.me?.username || '';
  const recipientPhone = profileData?.me?.phoneNumber || '';

  // 2. Form State'leri
  const [isSameBilling, setIsSameBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState('');

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const [isContractAccepted, setIsContractAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Kart Formatlayıcıları
  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setExpiryDate(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiryDate(cleaned);
    }
  };

  // 4. Doğrulama ve Siparişi Tamamlama
  const handleCompleteOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert(
        'Teslimat Adresi Bulunamadı',
        'Siparişi tamamlamak için lütfen profil sayfanızdan bir teslimat adresi tanımlayın.',
        [
          { text: 'Vazgeç', style: 'cancel' },
          { text: 'Profile Git', onPress: () => router.push('/(tabs)/profile') },
        ]
      );
      return;
    }

    if (!isSameBilling && !billingAddress.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen fatura adresinizi giriniz.');
      return;
    }

    if (!cardHolder.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen kart üzerindeki isim ve soyismi giriniz.');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Geçersiz Kart', 'Lütfen 16 haneli kart numarasını eksiksiz giriniz.');
      return;
    }

    if (expiryDate.length < 5) {
      Alert.alert('Geçersiz Tarih', 'Lütfen son kullanma tarihini (AA/YY) formatında giriniz.');
      return;
    }

    if (cvv.length < 3) {
      Alert.alert('Geçersiz CVV', 'Lütfen 3 haneli güvenlik kodunu giriniz.');
      return;
    }

    if (!isContractAccepted) {
      Alert.alert('Onay Gerekli', 'Lütfen Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formunu onaylayınız.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.replace('/checkout/succes');
    }, 1200);
  };

  if (basketLoading || profileLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="text-xs text-gray-500 mt-2">Sipariş bilgileri hazırlanıyor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-gray-50"
    >
      {/* 1. HEADER */}
      <View className="pt-12 pb-3.5 px-4 bg-white border-b border-gray-100 flex-row items-center justify-between shadow-sm">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center border border-gray-100 active:bg-gray-100"
        >
          <ArrowLeft size={18} color="#1F2937" />
        </Pressable>

        <View className="flex-row items-center gap-1.5">
          <ShieldCheck size={20} color="#16A34A" />
          <Text className="text-base font-extrabold text-gray-900">Güvenli Ödeme</Text>
        </View>

        <View className="w-9 items-center justify-center">
          <Lock size={16} color="#9CA3AF" />
        </View>
      </View>

      {/* ANA KAYDIRMA ALANI */}
      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* 2. SEPETTEKİ ÜRÜNLER ÖZETİ */}
        <View className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm">
          <Text className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">
            Sipariş Özeti ({basketItems.length} Ürün)
          </Text>

          {basketItems.map((item: BasketItem) => {
            const variant = item.productVariant;
            const price = Number(variant?.varPrice) || 0;
            const imgUrl = getImageUrl(variant?.product?.coverImage || undefined);
            const optionsText = variant?.options?.map((o: VariantOptionInfo) => o.varOptionValue).join(', ');

            return (
              <View
                key={item.id}
                className="flex-row items-center py-2.5 border-b border-gray-50 last:border-b-0"
              >
                <View className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden mr-3 border border-gray-100">
                  <Image
                    source={{ uri: imgUrl }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="contain"
                  />
                </View>

                <View className="flex-1">
                  <Text numberOfLines={1} className="text-xs font-semibold text-gray-900">
                    {variant?.product?.productName}
                  </Text>
                  {optionsText ? (
                    <Text className="text-[11px] text-gray-500 font-medium mt-0.5">
                      {optionsText}
                    </Text>
                  ) : null}
                  <Text className="text-xs font-bold text-orange-600 mt-1">
                    {price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    <Text className="text-gray-400 font-normal"> x {item.quantity}</Text>
                  </Text>
                </View>

                <Text className="text-xs font-extrabold text-gray-900 pl-2">
                  {(price * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                </Text>
              </View>
            );
          })}
        </View>

        {/* 3. DB'DEN GELEN SABİT TESLİMAT ADRESİ (DÜZENLEME KAPALI) */}
        <View className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Truck size={16} color="#F97316" />
              <Text className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Teslimat Adresi
              </Text>
            </View>
            <View className="bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
              <Text className="text-[10px] font-bold text-green-700">Kayıtlı Adres</Text>
            </View>
          </View>

          {deliveryAddress ? (
            <View className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex-row items-start">
              <View className="flex-1">
                <Text className="text-xs font-bold text-gray-900 mb-0.5">
                  {recipientName} {recipientPhone ? `(${recipientPhone})` : ''}
                </Text>
                <Text className="text-xs text-gray-600 leading-4">{deliveryAddress}</Text>
              </View>
            </View>
          ) : (
            <View className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <Text className="text-xs font-semibold text-amber-800 mb-2">
                Profilinizde kayıtlı bir teslimat adresi bulunmuyor.
              </Text>
              <Pressable
                onPress={() => router.push('/(tabs)/profile')}
                className="bg-amber-500 py-2 px-3 rounded-lg self-start active:bg-amber-600"
              >
                <Text className="text-white text-xs font-bold">Profilde Adres Tanımla</Text>
              </Pressable>
            </View>
          )}

          {/* Faturayı aynı adrese gönder Checkbox */}
          <Pressable
            onPress={() => setIsSameBilling(!isSameBilling)}
            className="flex-row items-center mt-3 active:opacity-70"
          >
            {isSameBilling ? (
              <CheckSquare size={18} color="#F97316" />
            ) : (
              <Square size={18} color="#9CA3AF" />
            )}
            <Text className="text-xs font-medium text-gray-700 ml-2">
              Faturayı teslimat adresi ile aynı adrese gönder
            </Text>
          </Pressable>

          {/* Fatura Adresi Kutusu (Yalnızca tik kaldırıldığında düzenlenebilir) */}
          {!isSameBilling && (
            <View className="mt-3 pt-3 border-t border-gray-100">
              <Text className="text-xs font-semibold text-gray-700 mb-1 ml-0.5">Fatura Adresi</Text>
              <TextInput
                value={billingAddress}
                onChangeText={setBillingAddress}
                multiline
                numberOfLines={2}
                placeholder="Fatura için geçerli adres veya şirket bilgileri..."
                placeholderTextColor="#9CA3AF"
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900"
                style={{ textAlignVertical: 'top' }}
              />
            </View>
          )}
        </View>

        {/* 4. ÖDEME BİLGİLERİ */}
        <View className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <CreditCard size={16} color="#F97316" />
            <Text className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Kart Bilgileri
            </Text>
          </View>

          <View className="gap-3">
            <View>
              <Text className="text-xs font-semibold text-gray-700 mb-1 ml-0.5">Kart Üzerindeki İsim</Text>
              <TextInput
                value={cardHolder}
                onChangeText={setCardHolder}
                autoCapitalize="characters"
                placeholder="AD SOYAD"
                placeholderTextColor="#9CA3AF"
                className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900"
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-700 mb-1 ml-0.5">Kart Numarası</Text>
              <TextInput
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                maxLength={19}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="#9CA3AF"
                className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900"
              />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-gray-700 mb-1 ml-0.5">Son Kullanma (AA/YY)</Text>
                <TextInput
                  value={expiryDate}
                  onChangeText={handleExpiryChange}
                  keyboardType="numeric"
                  maxLength={5}
                  placeholder="AA/YY"
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 text-center"
                />
              </View>

              <View className="flex-1">
                <Text className="text-xs font-semibold text-gray-700 mb-1 ml-0.5">Güvenlik Kodu (CVV)</Text>
                <TextInput
                  value={cvv}
                  onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 3))}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={3}
                  placeholder="•••"
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 text-center"
                />
              </View>
            </View>
          </View>
        </View>

        {/* 5. SÖZLEŞME METNİ */}
        <View className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-1.5">
              <FileText size={16} color="#F97316" />
              <Text className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Mesafeli Satış Sözleşmesi
              </Text>
            </View>
            <ChevronDown size={14} color="#9CA3AF" />
          </View>

          <View className="h-32 bg-gray-50 border border-gray-200 rounded-xl p-3 my-2">
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
              <Text className="text-[11px] font-bold text-gray-800 mb-1">
                MADDE 1 - TARAFLAR VE KONU:
              </Text>
              <Text className="text-[11px] text-gray-600 leading-4 mb-2">
                İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait mobil uygulama üzerinden elektronik ortamda siparişini yaptığı ürünlerin satışı, teslimi ve 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamındaki hak ve yükümlülüklerin belirlenmesidir.
              </Text>

              <Text className="text-[11px] font-bold text-gray-800 mb-1">
                MADDE 2 - TESLİMAT VE CAYMA HAKKI:
              </Text>
              <Text className="text-[11px] text-gray-600 leading-4 mb-2">
                Sipariş konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile ALICI'nın sistemde kayıtlı teslimat adresine teslim edilir. ALICI, ürün teslim tarihinden itibaren 14 gün içinde cayma hakkına sahiptir.
              </Text>

              <Text className="text-[11px] font-bold text-gray-800 mb-1">
                MADDE 3 - ÖDEME VE GÜVENLİK:
              </Text>
              <Text className="text-[11px] text-gray-600 leading-4">
                Ödemeler 256-bit SSL güvenlik sertifikası ile korunmaktadır. Kart bilgileriniz kesinlikle sunucularda saklanmaz.
              </Text>
            </ScrollView>
          </View>

          <Pressable
            onPress={() => setIsContractAccepted(!isContractAccepted)}
            className="flex-row items-center mt-2 active:opacity-70"
          >
            {isContractAccepted ? (
              <CheckSquare size={18} color="#F97316" />
            ) : (
              <Square size={18} color="#9CA3AF" />
            )}
            <Text className="text-xs font-medium text-gray-700 ml-2 flex-1 leading-4">
              Ön bilgilendirme koşullarını ve Mesafeli Satış Sözleşmesi'ni okudum, onaylıyorum.
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* 6. SABİT ALT BUTON BAR */}
      <View className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-white border-t border-gray-100 flex-row items-center justify-between shadow-2xl">
        <View>
          <Text className="text-xs text-gray-400 font-medium">Toplam Tutar</Text>
          <Text className="text-xl font-extrabold text-orange-600">
            {totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
          </Text>
        </View>

        <Pressable
          onPress={handleCompleteOrder}
          disabled={isSubmitting}
          className={`px-7 py-3.5 rounded-xl shadow-sm flex-row items-center ${
            isSubmitting ? 'bg-orange-400' : 'bg-orange-500 active:bg-orange-600'
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-sm">Onayla ve Bitir</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}