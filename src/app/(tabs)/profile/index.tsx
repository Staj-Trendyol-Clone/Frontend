// src/app/(tabs)/profile/index.tsx
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  CalendarDays,
  Heart,
  LogOut,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  UserCircle,
} from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { ProfileAuthPrompt } from '../../../components/profile/ProfileAuthPromt';
import { ProfileHeader } from '../../../components/profile/ProfileHeader';
import { ProfileInput } from '../../../components/profile/ProfileInput';
import { ProfileMenuItem } from '../../../components/profile/ProfileMenuItem';
import { GET_USER_PROFILE, UPDATE_USER_PROFILE } from '../../graphql/profile';
import { UserProfileData } from '../../types/profile';

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

  // Oturum Kontrolü
  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem('userToken');
        setHasToken(!!token);
      };
      checkAuth();
    }, [])
  );

  // Profil Verisi
  const { data, loading, refetch } = useQuery<UserProfileData>(GET_USER_PROFILE, {
    skip: !hasToken || isLoggingOut,
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  });

  const [updateProfileMutation, { loading: updatingProfile }] =
    useMutation<any, UpdateProfileVariables>(UPDATE_USER_PROFILE);

  useEffect(() => {
    if (data?.me) {
      setUsername(data.me.username || '');
      setPhoneNumber(data.me.phoneNumber || '');
      setBirthDate(data.me.birthDate || '');
      setAddress(data.me.address || '');
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      if (hasToken && !isLoggingOut) {
        refetch();
      }
    }, [hasToken, isLoggingOut, refetch])
  );

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
            phoneNumber: phoneNumber.trim(),
            birthDate: birthDate.trim(),
            address: address.trim(),
          },
        },
      });

      const payload = response?.data?.updateProfile;
      if (payload?.user) {
        setUsername(payload.user.username ?? trimmedUsername);
        setPhoneNumber(payload.user.phoneNumber ?? phoneNumber);
        setBirthDate(payload.user.birthDate ?? birthDate);
        setAddress(payload.user.address ?? address);
      }

      setIsEditing(false);
      Alert.alert('Başarılı', payload?.message || 'Profil bilgileriniz güncellendi.');
    } catch (error: any) {
      Alert.alert('Güncelleme Hatası', error.message || 'Profil güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (hasToken === null || (hasToken && loading && !data)) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (!hasToken) {
    return <ProfileAuthPrompt />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ProfileHeader
        username={data?.me?.username || username}
        email={data?.me?.email}
        isEditing={isEditing}
        isSaving={saving || updatingProfile}
        onEditPress={() => setIsEditing(true)}
        onCancelPress={() => setIsEditing(false)}
        onSavePress={handleSave}
      />

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Kişisel Bilgiler Formu */}
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
            numberOfLines={4}
          />
        </View>

        {/* Hesap İşlemleri Menüsü */}
        <View className="mb-10">
          <Text className="text-sm font-bold text-gray-900 mb-4 px-1">Hesap İşlemleri</Text>

          <ProfileMenuItem
            icon={Package}
            title="Geçmiş Siparişlerim"
            onPress={() => router.push('/(tabs)/profile/oldOrders')}
          />
          <ProfileMenuItem
            icon={Heart}
            title="Favorilerim"
            onPress={() => router.push('/(tabs)/favorite')}
          />
          <ProfileMenuItem
            icon={ShoppingBag}
            title="Sepetim"
            onPress={() => router.push('/(tabs)/cart')}
          />

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