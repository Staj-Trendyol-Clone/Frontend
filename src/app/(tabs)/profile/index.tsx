// src/app/(tabs)/profile.tsx
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  CalendarDays,
  Heart,
  LogIn,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Phone,
  Save,
  ShoppingBag,
  UserCircle,
  UserPlus,
  X,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GET_USER_PROFILE, UPDATE_USER_PROFILE } from '../../graphql/profile';
import { UserProfileData } from '../../types/profile';

interface ProfileInputProps {
  icon: React.ElementType;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable: boolean;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
  icon: Icon,
  label,
  value,
  onChangeText,
  editable,
  placeholder,
  multiline = false,
  numberOfLines = 1,
}) => (
  <View className="mb-4 border-b border-gray-100 pb-2">
    <View className="flex-row items-center gap-2 mb-1">
      <Icon size={16} color={editable ? '#F97316' : '#6B7280'} />
      <Text className={`text-xs font-semibold ${editable ? 'text-gray-900' : 'text-gray-500'}`}>
        {label}
      </Text>
    </View>

    <TextInput
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      multiline={multiline}
      numberOfLines={numberOfLines}
      className={`text-sm ${
        editable
          ? 'text-gray-900 bg-gray-50 rounded-lg p-2.5 mt-1 border border-gray-200'
          : 'text-gray-800 p-0 font-medium'
      } ${multiline && editable ? 'min-h-[75px]' : ''}`}
      style={{
        paddingVertical: editable ? 8 : 0,
        textAlignVertical: multiline ? 'top' : 'center', // Android'de metni üste yaslar
      }}
    />
  </View>
);

type UpdateProfileUser = {
  id?: string | null;
  username?: string | null;
  phoneNumber?: string | null;
  birthDate?: string | null;
  address?: string | null;
};

type UpdateProfileResponse = {
  updateProfile: {
    message?: string | null;
    user?: UpdateProfileUser | null;
  };
};

type UpdateProfileVariables = {
  data: {
    username?: string | null;
    phoneNumber?: string | null;
    birthDate?: string | null;
    address?: string | null;
  };
};

export default function ProfileScreen() {
  const router = useRouter();
  const client = useApolloClient();

  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Form State'leri
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');

  // 1. TOKEN KONTROLÜ (Sayfaya her gelindiğinde çalışır)
  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem('userToken');
        setHasToken(!!token);
      };
      checkAuth();
    }, [])
  );

  // 2. APOLLO GRAPHQL QUERY
  const { data, loading, refetch } = useQuery<UserProfileData>(GET_USER_PROFILE, {
    skip: !hasToken || isLoggingOut,
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  });

  const [updateProfileMutation, { loading: updatingProfile }] = useMutation<
    UpdateProfileResponse,
    UpdateProfileVariables
  >(UPDATE_USER_PROFILE);

  // 3. GRAPHQL VERİSİNİ STATE'LERE AKTARMA
  useEffect(() => {
    if (data?.me) {
      setUsername(data.me.username || '');
      setPhoneNumber(data.me.phoneNumber || '');
      setBirthDate(data.me.birthDate || '');
      setAddress(data.me.address || '');
    }
  }, [data]);

  // Sayfaya odaklanıldığında veriyi yeniden çek
  useFocusEffect(
    useCallback(() => {
      if (hasToken && !isLoggingOut) {
        refetch();
      }
    }, [hasToken, isLoggingOut, refetch])
  );

  // 4. ÇIKIŞ YAPMA
  const handleLogout = async () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkış yapmak istediğinize emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          setIsLoggingOut(true);
          setHasToken(false);
          await AsyncStorage.removeItem('userToken');
          await client.clearStore();
          setIsEditing(false);
          router.replace('/');
        },
      },
    ]);
  };

  const handleSave = async () => {
    const trimmedUsername = username.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedBirthDate = birthDate.trim();
    const trimmedAddress = address.trim();

    if (!trimmedUsername) {
      Alert.alert('Eksik Bilgi', 'Kullanıcı adı boş bırakılamaz.');
      return;
    }

    setSaving(true);

    try {
      const response = await updateProfileMutation({
        variables: {
          data: {
            username: trimmedUsername,
            phoneNumber: trimmedPhone,
            birthDate: trimmedBirthDate,
            address: trimmedAddress,
          },
        },
      });

      const payload = response?.data?.updateProfile;

      if (!payload?.message && !payload?.user) {
        throw new Error('Profil bilgileri güncellenemedi.');
      }

      if (payload.user) {
        setUsername(payload.user.username ?? trimmedUsername);
        setPhoneNumber(payload.user.phoneNumber ?? trimmedPhone);
        setBirthDate(payload.user.birthDate ?? trimmedBirthDate);
        setAddress(payload.user.address ?? trimmedAddress);
      }

      setIsEditing(false);
      Alert.alert('Başarılı', payload.message || 'Profil bilgileriniz güncellendi.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profil bilgileri güncellenirken bir hata oluştu.';
      Alert.alert('Güncelleme Hatası', message);
    } finally {
      setSaving(false);
    }
  };

  // Yüklenme Durumu
  if (hasToken === null || (hasToken && loading && !data)) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  // GİRİŞ YAPILMAMIŞSA
  if (!hasToken) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-6">
        <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-5 border border-orange-100 shadow-sm">
          <UserCircle size={44} color="#F97316" />
        </View>

        <Text className="text-xl font-extrabold text-gray-900 mb-2">Giriş Yapmadınız</Text>
        <Text className="text-xs text-gray-500 text-center mb-8 px-4 leading-5">
          Profil bilgilerinizi görmek, siparişlerinizi ve favorilerinizi yönetmek için lütfen hesabınıza giriş yapın.
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
            <Text className="text-orange-600 font-bold text-sm">  Hesap Oluştur</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // GİRİŞ YAPILMIŞ VE VERİ GELMİŞSE
  return (
    <View className="flex-1 bg-gray-50">
      {/* Üst Header */}
      <View className="bg-white pt-12 pb-4 px-4 flex-row items-center justify-between border-b border-gray-100 shadow-sm">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center border border-gray-200">
            <UserCircle size={32} color="#9CA3AF" />
          </View>
          <View>
            <Text className="text-lg font-bold text-gray-900">
              {data?.me?.username || username}
            </Text>
            <Text className="text-xs text-gray-500">
              {data?.me?.email || 'Kullanıcı Hesabı'}
            </Text>
          </View>
        </View>

        {isEditing ? (
          <View className="flex-row items-center gap-2">
            <Pressable onPress={() => setIsEditing(false)} className="p-2 bg-gray-100 rounded-full">
              <X size={20} color="#374151" />
            </Pressable>
            <Pressable onPress={handleSave} disabled={saving || updatingProfile} className="p-2 bg-orange-100 rounded-full">
              {saving || updatingProfile ? (
                <ActivityIndicator size="small" color="#F97316" />
              ) : (
                <Save size={20} color="#F97316" />
              )}
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => setIsEditing(true)} className="p-2 bg-gray-100 rounded-full">
            <Pencil size={20} color="#374151" />
          </Pressable>
        )}
      </View>

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* GraphQL Bilgileri Formu */}
        <View className="bg-white p-4 rounded-2xl mb-6 border border-gray-100 shadow-sm">
          <Text className="text-sm font-bold text-gray-900 mb-5">Kişisel Bilgiler</Text>

          <ProfileInput
            icon={UserCircle}
            label="Kullanıcı Adı"
            value={username}
            onChangeText={setUsername}
            editable={isEditing}
            placeholder="Kullanıcı adı"
          />
          <ProfileInput
            icon={Phone}
            label="Telefon Numarası"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={isEditing}
            placeholder="Telefon numarası"
          />
          <ProfileInput
            icon={CalendarDays}
            label="Doğum Tarihi"
            value={birthDate}
            onChangeText={setBirthDate}
            editable={isEditing}
            placeholder="YYYY-MM-DD"
          />
          <ProfileInput
            icon={MapPin}
            label="Adres"
            value={address}
            onChangeText={setAddress}
            editable={isEditing}
            placeholder="Adres bilgisi"
            multiline
            numberOfLines={5}
          />
        </View>

        {/* Hızlı Menü */}
        <View className="mb-10">
          <Text className="text-sm font-bold text-gray-900 mb-4 px-1">Hesap İşlemleri</Text>

          <Pressable
            onPress={() => router.push('/(tabs)/profile/oldOrders')}
            className="flex-row items-center justify-between bg-white p-4 rounded-xl mb-3 border border-gray-100 active:bg-gray-50 shadow-sm"
          >
            <View className="flex-row items-center gap-3">
              <Package size={20} color="#374151" />
              <Text className="text-sm font-semibold text-gray-800">Geçmiş Siparişlerim</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/favorite')}
            className="flex-row items-center justify-between bg-white p-4 rounded-xl mb-3 border border-gray-100 active:bg-gray-50 shadow-sm"
          >
            <View className="flex-row items-center gap-3">
              <Heart size={20} color="#374151" />
              <Text className="text-sm font-semibold text-gray-800">Favorilerim</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/cart')}
            className="flex-row items-center justify-between bg-white p-4 rounded-xl mb-3 border border-gray-100 active:bg-gray-50 shadow-sm"
          >
            <View className="flex-row items-center gap-3">
              <ShoppingBag size={20} color="#374151" />
              <Text className="text-sm font-semibold text-gray-800">Sepetim</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </Pressable>

          {/* Çıkış Butonu */}
          <Pressable
            onPress={handleLogout}
            className="flex-row items-center justify-center bg-red-50 p-4 rounded-xl mt-4 active:bg-red-100 border border-red-100"
          >
            <LogOut size={18} color="#EF4444" />
            <Text className="text-sm font-bold text-red-600 ml-2">Çıkış Yap</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}