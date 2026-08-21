// src/components/product/ProductComments.tsx
import { useMutation, useQuery } from '@apollo/client/react';
import { Star, Trash2, UserCircle } from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    Text,
    View,
} from 'react-native';

import { DELETE_COMMENT } from '../../app/graphql/comment';
import { GET_USER_PROFILE } from '../../app/graphql/profile';
import { GET_PRODUCT_BY_ID } from '../../app/graphql/queries';
import { DeleteCommentResponse, DeleteCommentVariables } from '../../app/types/comment';
import { UserProfileData } from '../../app/types/profile';

export interface ProductCommentUser {
  id?: string;
  username?: string | null;
}

export interface ProductCommentItem {
  id?: string;
  stars: number;
  comment?: string;
  user?: ProductCommentUser | null;
  username?: string;
}

interface ProductCommentsProps {
  productId: string;
  comments?: ProductCommentItem[];
}

export const ProductComments: React.FC<ProductCommentsProps> = ({
  productId,
  comments,
}) => {
  // 1. Giriş Yapmış Kullanıcının Bilgilerini Çek
  const { data: userData } = useQuery<UserProfileData>(GET_USER_PROFILE, {
    errorPolicy: 'ignore',
  });

  const currentUsername = userData?.me?.username;

  // 2. Yorum Silme Mutasyonu
  const [deleteCommentMutation, { loading: deleting }] = useMutation<
    DeleteCommentResponse,
    DeleteCommentVariables
  >(DELETE_COMMENT, {
    refetchQueries: [
      {
        query: GET_PRODUCT_BY_ID,
        variables: { id: productId },
      },
    ],
  });

  if (!comments || comments.length === 0) return null;

  const handleDelete = (commentId?: string) => {
    if (!commentId) return;

    Alert.alert(
      'Yorumu Sil',
      'Yaptığınız değerlendirmeyi silmek istediğinize emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteCommentMutation({
                variables: {
                  data: { commentId: String(commentId) },
                },
              });

              if (response.data?.deleteComment) {
                Alert.alert(
                  'Başarılı',
                  response.data.deleteComment.message || 'Değerlendirmeniz silindi.'
                );
              }
            } catch (err: any) {
              Alert.alert(
                'Hata',
                err.graphQLErrors?.[0]?.message ||
                  err.message ||
                  'Yorum silinirken bir sorun oluştu.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View className="mt-6 border-t border-gray-100 pt-4">
      <Text className="text-sm font-bold text-gray-900 mb-3">
        Müşteri Değerlendirmeleri ({comments.length})
      </Text>

      {comments.map((c, index) => {
        const starCount = Math.min(Math.max(c.stars || 5, 1), 5);
        const commentAuthor = c.user?.username || c.username || 'Kullanıcı';
        // Sadece yorumun sahibi olan kullanıcıya silme butonunu göster
        const isMyComment = !!currentUsername && currentUsername === commentAuthor;

        return (
          <View
            key={c.id || index}
            className="bg-gray-50 p-3 rounded-xl mb-2.5 border border-gray-100"
          >
            {/* Üst Satır: Kullanıcı Adı, Yıldızlar ve Silme Butonu */}
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center gap-1.5">
                <UserCircle size={15} color="#6B7280" />
                <Text className="text-xs font-semibold text-gray-800">
                  {commentAuthor}
                  {isMyComment ? (
                    <Text className="text-[10px] text-orange-600 font-bold"> (Siz)</Text>
                  ) : null}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <View className="flex-row items-center gap-0.5">
                  {[...Array(starCount)].map((_, i) => (
                    <Star key={i} size={11} color="#EAB308" fill="#EAB308" />
                  ))}
                </View>

                {/* Sadece Kendi Yorumuysa Gözüken Silme Butonu */}
                {isMyComment && c.id && (
                  <Pressable
                    onPress={() => handleDelete(c.id)}
                    disabled={deleting}
                    hitSlop={8}
                    className="p-1 active:opacity-60 ml-1"
                  >
                    {deleting ? (
                      <ActivityIndicator size="small" color="#EF4444" />
                    ) : (
                      <Trash2 size={14} color="#EF4444" />
                    )}
                  </Pressable>
                )}
              </View>
            </View>

            {/* Yorum Metni */}
            {c.comment ? (
              <Text className="text-xs text-gray-600 leading-4">{c.comment}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};