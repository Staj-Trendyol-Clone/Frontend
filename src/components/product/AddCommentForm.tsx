// src/components/product/AddCommentForm.tsx
import { useMutation } from '@apollo/client/react';
import { Send, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';

import { ADD_COMMENT } from '../../app/graphql/comment';
import { GET_PRODUCT_BY_ID } from '../../app/graphql/queries';
import { AddCommentResponse, AddCommentVariables } from '../../app/types/comment';

interface AddCommentFormProps {
  productId: string;
  onFocus?: () => void; // <-- Klavye açıldığında kaydırmak için eklendi
}

export const AddCommentForm: React.FC<AddCommentFormProps> = ({ productId, onFocus }) => {
  const [stars, setStars] = useState(5);
  const [commentText, setCommentText] = useState('');

  const [addCommentMutation, { loading }] = useMutation<
    AddCommentResponse,
    AddCommentVariables
  >(ADD_COMMENT, {
    refetchQueries: [
      {
        query: GET_PRODUCT_BY_ID,
        variables: { id: productId },
      },
    ],
  });

  const handleSubmitComment = async () => {
    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      Alert.alert('Eksik Bilgi', 'Lütfen ürün hakkında bir değerlendirme yazın.');
      return;
    }

    try {
      const response = await addCommentMutation({
        variables: {
          data: {
            productId: String(productId),
            stars: Number(stars),
            comment: trimmedComment,
          },
        },
      });

      if (response.data?.addComment?.comment) {
        Alert.alert('Başarılı 🎉', response.data.addComment.message || 'Değerlendirmeniz kaydedildi.');
        setCommentText('');
        setStars(5);
      }
    } catch (err: any) {
      const errorMessage =
        err.graphQLErrors?.[0]?.message ||
        err.networkError?.result?.errors?.[0]?.message ||
        err.message ||
        'Yorum eklenirken bir sorun oluştu.';

      Alert.alert('Değerlendirme Uyarısı', errorMessage);
    }
  };

  return (
    <View className="mt-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <Text className="text-sm font-bold text-gray-900 mb-3">Değerlendirme Yap</Text>

      {/* Yıldız Seçimi */}
      <View className="flex-row items-center mb-3">
        <Text className="text-xs text-gray-600 mr-3">Puanınız:</Text>
        <View className="flex-row items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((rate) => (
            <Pressable
              key={rate}
              onPress={() => setStars(rate)}
              hitSlop={6}
              className="p-1"
            >
              <Star
                size={22}
                color={rate <= stars ? '#EAB308' : '#D1D5DB'}
                fill={rate <= stars ? '#EAB308' : 'none'}
              />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Yorum Giriş Alanı */}
      <TextInput
        value={commentText}
        onChangeText={setCommentText}
        onFocus={onFocus} // <-- Tıklanınca sayfayı yukarı kaydırma tetiklenir
        multiline
        numberOfLines={3}
        placeholder="Ürünle ilgili deneyimlerinizi paylaşın..."
        placeholderTextColor="#9CA3AF"
        className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 min-h-[75px]"
        style={{ textAlignVertical: 'top' }}
      />

      {/* Gönder Butonu */}
      <Pressable
        onPress={handleSubmitComment}
        disabled={loading}
        className={`mt-3 py-3 px-4 rounded-xl flex-row items-center justify-center ${
          loading ? 'bg-orange-400' : 'bg-orange-500 active:bg-orange-600'
        }`}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Send size={15} color="#FFFFFF" className="mr-1.5" />
            <Text className="text-white text-xs font-bold">Yorumu Gönder</Text>
          </>
        )}
      </Pressable>
    </View>
  );
};