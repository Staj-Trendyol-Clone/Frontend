// src/app/checkout/succes.tsx
import { useRouter } from 'expo-router';
import { ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

export default function OrderSuccessScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <View className="w-20 h-20 bg-green-50 rounded-full items-center justify-center mb-4 border border-green-100 shadow-sm">
        <CheckCircle2 size={46} color="#16A34A" />
      </View>

      <Text className="text-xl font-extrabold text-gray-900 mb-1">Siparişiniz Alındı!</Text>
      <Text className="text-xs text-gray-500 text-center mb-8 px-4 leading-5">
        Ödemeniz başarıyla tamamlandı ve siparişiniz veritabanına işlendi. Siparişinizin hazırlık sürecini profilinizdeki geçmiş siparişler alanından takip edebilirsiniz.
      </Text>

      <View className="w-full gap-3">
        <Pressable
          onPress={() => router.replace('/(tabs)/profile/oldOrders')}
          className="w-full bg-orange-500 py-3.5 rounded-xl flex-row items-center justify-center active:bg-orange-600 shadow-sm"
        >
          <ShoppingBag size={18} color="#FFFFFF" />
          <Text className="text-white font-bold text-sm ml-2">Sipariş Detayına Git</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace('/(tabs)')}
          className="w-full border border-gray-200 py-3.5 rounded-xl flex-row items-center justify-center active:bg-gray-50"
        >
          <Text className="text-gray-700 font-semibold text-sm mr-1">Alışverişe Devam Et</Text>
          <ArrowRight size={16} color="#374151" />
        </Pressable>
      </View>
    </View>
  );
}