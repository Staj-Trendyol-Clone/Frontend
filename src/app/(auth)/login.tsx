// src/app/login.tsx
import { useMutation } from '@apollo/client/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AlertCircle, Eye, EyeOff, Lock, LogIn, User, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TOKEN_AUTH } from '../graphql/authLogin'; // <-- TOKEN_AUTH import edildi
import { TokenAuthLoginResponse } from '../types/authLogin'; // <-- TokenAuthLoginResponse import edildi


export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Apollo useMutation hook'u
  const [tokenAuth, { loading }] = useMutation<TokenAuthLoginResponse>(TOKEN_AUTH);

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Lütfen kullanıcı adı ve şifrenizi eksiksiz giriniz.');
      return;
    }

    try {
      // 1. Mutasyonu çalıştır
      const response = await tokenAuth({
        variables: {
          username: username.trim(),
          password: password,
        },
      });

      // 2. Token değişkenini gelen yanıttan al (Hatanın çözümü)
      const token = response.data?.tokenAuth?.token;

      // 3. Token varsa kaydet ve yönlendir
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        router.replace('/(tabs)/profile');
      } else {
        setErrorMessage('Giriş yapılamadı. Kullanıcı adı veya şifre hatalı.');
      }
    } catch (err: any) {
      if (err.message?.includes('credentials') || err.message?.includes('authenticate')) {
        setErrorMessage('Kullanıcı adı veya şifre hatalı.');
      } else {
        setErrorMessage(err.message || 'Sunucuya bağlanırken bir hata oluştu.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="px-6 py-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Karşılama Alanı */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-orange-50 rounded-2xl items-center justify-center mb-3 border border-orange-100 shadow-sm">
            <LogIn size={32} color="#F97316" />
          </View>
          <Text className="text-2xl font-extrabold text-gray-900">Giriş Yap</Text>
          <Text className="text-xs text-gray-500 mt-1 text-center">
            Hesabınıza giriş yaparak alışverişinize kaldığınız yerden devam edin
          </Text>
        </View>

        {/* Hata Bildirimi Banner'ı */}
        {errorMessage && (
          <View className="bg-red-50 border border-red-200 p-3.5 rounded-xl mb-5 flex-row items-center gap-2.5">
            <AlertCircle size={18} color="#EF4444" />
            <Text className="text-xs text-red-700 font-medium flex-1 leading-4">
              {errorMessage}
            </Text>
          </View>
        )}

        {/* Form Alanı */}
        <View className="gap-4">
          {/* Kullanıcı Adı Input */}
          <View>
            <Text className="text-xs font-bold text-gray-700 mb-1.5 ml-1">Kullanıcı Adı</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3">
              <User size={18} color="#9CA3AF" />
              <TextInput
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrorMessage(null);
                }}
                autoCapitalize="none"
                placeholder="Kullanıcı Adı"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-sm text-gray-900"
              />
            </View>
          </View>

          {/* Şifre Input */}
          <View>
            <Text className="text-xs font-bold text-gray-700 mb-1.5 ml-1">Şifre</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3">
              <Lock size={18} color="#9CA3AF" />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMessage(null);
                }}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-sm text-gray-900"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} className="p-1">
                {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
              </Pressable>
            </View>
          </View>

          {/* Giriş Yap Butonu */}
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className="bg-orange-500 py-4 rounded-xl items-center justify-center mt-2 active:bg-orange-600 shadow-sm"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-white font-bold text-sm">Giriş Yap</Text>
            )}
          </Pressable>

          {/* Kayıt Ol Butonu */}
          <View className="items-center my-2">
            <Text className="text-xs text-gray-400 font-medium">veya</Text>
          </View>

          <Pressable
            onPress={() => router.push('/register')}
            className="border border-orange-500 py-3.5 rounded-xl flex-row items-center justify-center active:bg-orange-50"
          >
            <UserPlus size={18} color="#F97316" />
            <Text className="text-orange-600 font-bold text-sm ml-2">Yeni Hesap Oluştur</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}