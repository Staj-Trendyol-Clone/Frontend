// src/app/(auth)/register.tsx
import { useMutation } from '@apollo/client/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  UserPlus,
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
import { CREATE_USER } from '../graphql/authRegister';
import { CreateUserData, RegisterInput } from '../types/authRegister';

export default function RegisterScreen() {
  const router = useRouter();

  // Form State'leri
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Apollo CreateUser Mutation
  const [createUser, { loading }] = useMutation<CreateUserData, { data: RegisterInput }>(CREATE_USER);

  // Kayıt Ol Buton Fonksiyonu
  const handleRegister = async () => {
    setErrorMessage(null);

    // Zorunlu alan doğrulaması
    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Kullanıcı adı, e-posta ve şifre alanları zorunludur.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    try {
      const response = await createUser({
        variables: {
          data: {
            username: username.trim(),
            email: email.trim(),
            password: password,
            phoneNumber: phoneNumber.trim() || undefined,
            birthDate: birthDate.trim() || undefined,
            address: address.trim() || undefined,
          },
        },
      });

      const result = response.data?.createUser;

      if (result?.user) {
        if (result.token) {
          await AsyncStorage.setItem('userToken', result.token);
          Alert.alert('Hoş Geldiniz 🎉', 'Hesabınız başarıyla oluşturuldu.', [
            {
              text: 'Alışverişe Başla',
              onPress: () => router.replace('/(tabs)'),
            },
          ]);
        } else {
          Alert.alert('Başarılı', 'Hesabınız oluşturuldu. Lütfen giriş yapınız.', [
            {
              text: 'Giriş Yap',
              onPress: () => router.replace('/login'),
            },
          ]);
        }
      } else {
        setErrorMessage('Kayıt oluşturulamadı. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err: any) {
      if (err.message?.includes('already exists') || err.message?.includes('unique')) {
        setErrorMessage('Bu kullanıcı adı veya e-posta adresi zaten kullanımda.');
      } else {
        setErrorMessage(err.message || 'Kayıt sırasında bir hata oluştu.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        className="px-6 py-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
      >
        {/* Geri Dön Butonu */}
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100 mb-4 active:bg-gray-100"
        >
          <ArrowLeft size={20} color="#1F2937" />
        </Pressable>

        {/* Başlık Alanı */}
        <View className="mb-6">
          <Text className="text-2xl font-extrabold text-gray-900">Hesap Oluştur</Text>
          <Text className="text-xs text-gray-500 mt-1">
            Avantajlı fiyatlardan ve hızlı sipariş imkanından yararlanın
          </Text>
        </View>

        {/* Hata Bildirimi */}
        {errorMessage && (
          <View className="bg-red-50 border border-red-200 p-3.5 rounded-xl mb-5 flex-row items-center gap-2.5">
            <AlertCircle size={18} color="#EF4444" />
            <Text className="text-xs text-red-700 font-medium flex-1 leading-4">
              {errorMessage}
            </Text>
          </View>
        )}

        {/* Form Alanları */}
        <View className="gap-3.5">
          {/* Kullanıcı Adı */}
          <View>
            <Text className="text-xs font-bold text-gray-700 mb-1 ml-1">
              Kullanıcı Adı <Text className="text-orange-500">*</Text>
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5">
              <User size={18} color="#9CA3AF" />
              <TextInput
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrorMessage(null);
                }}
                autoCapitalize="none"
                placeholder="ornek_kullanici"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-sm text-gray-900"
              />
            </View>
          </View>

          {/* E-posta */}
          <View>
            <Text className="text-xs font-bold text-gray-700 mb-1 ml-1">
              E-posta <Text className="text-orange-500">*</Text>
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 ">
              <Mail size={18} color="#9CA3AF" />
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMessage(null);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="ornek@mail.com"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-sm text-gray-900"
              />
            </View>
          </View>

          {/* Şifre */}
          <View>
            <Text className="text-xs font-bold text-gray-700 mb-1 ml-1">
              Şifre <Text className="text-orange-500">*</Text>
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 ">
              <Lock size={18} color="#9CA3AF" />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMessage(null);
                }}
                secureTextEntry={!showPassword}
                placeholder="En az 6 karakter"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-sm text-gray-900"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} className="p-1">
                {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
              </Pressable>
            </View>
          </View>

          {/* Telefon Numarası */}
          <View>
            <Text className="text-xs font-bold text-gray-700 mb-1 ml-1">Telefon Numarası</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 ">
              <Phone size={18} color="#9CA3AF" />
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="05XXXXXXXXX"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-sm text-gray-900"
              />
            </View>
          </View>

          {/* Doğum Tarihi */}
          <View>
            <Text className="text-xs font-bold text-gray-700 mb-1 ml-1">Doğum Tarihi</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 ">
              <CalendarDays size={18} color="#9CA3AF" />
              <TextInput
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="YYYY-MM-DD (örn: 1998-05-20)"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-sm text-gray-900"
              />
            </View>
          </View>

          {/* Adres (Multline - Klavye fixli) */}
          <View>
            <Text className="text-xs font-bold text-gray-700 mb-1 ml-1">Adres</Text>
            <View className="flex-row items-start bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3">
              <MapPin size={18} color="#9CA3AF" style={{ marginTop: 2 }} />
              <TextInput
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
                placeholder="Mahalle, sokak, bina ve daire no..."
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-sm text-gray-900"
                style={{ textAlignVertical: 'top' }}
              />
            </View>
          </View>

          {/* Kayıt Ol Butonu */}
          <Pressable
            onPress={handleRegister}
            disabled={loading}
            className="bg-orange-500 py-4 rounded-xl items-center justify-center mt-3 active:bg-orange-600 shadow-sm"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <View className="flex-row items-center">
                <UserPlus size={18} color="#FFFFFF" />
                <Text className="text-white font-bold text-sm ml-2">Kayıt Ol</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Giriş Yap Linki */}
        <View className="flex-row items-center justify-center mt-6 gap-1 pb-4">
          <Text className="text-xs text-gray-500">Zaten hesabınız var mı?</Text>
          <Pressable onPress={() => router.replace('/login')}>
            <Text className="text-xs font-bold text-orange-600">Giriş Yap</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}