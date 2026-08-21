// src/components/profile/ProfileHeader.tsx
import { Pencil, Save, UserCircle, X } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface ProfileHeaderProps {
  username: string;
  email?: string;
  isEditing: boolean;
  isSaving: boolean;
  onEditPress: () => void;
  onCancelPress: () => void;
  onSavePress: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  email,
  isEditing,
  isSaving,
  onEditPress,
  onCancelPress,
  onSavePress,
}) => (
  <View className="bg-white pt-12 pb-4 px-4 flex-row items-center justify-between border-b border-gray-100 shadow-sm">
    <View className="flex-row items-center gap-3">
      <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center border border-gray-200">
        <UserCircle size={32} color="#9CA3AF" />
      </View>
      <View>
        <Text className="text-lg font-bold text-gray-900">{username || 'Kullanıcı'}</Text>
        <Text className="text-xs text-gray-500">{email || 'Kullanıcı Hesabı'}</Text>
      </View>
    </View>

    {isEditing ? (
      <View className="flex-row items-center gap-2">
        <Pressable onPress={onCancelPress} className="p-2 bg-gray-100 rounded-full active:bg-gray-200">
          <X size={20} color="#374151" />
        </Pressable>
        <Pressable
          onPress={onSavePress}
          disabled={isSaving}
          className="p-2 bg-orange-100 rounded-full active:bg-orange-200"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#F97316" />
          ) : (
            <Save size={20} color="#F97316" />
          )}
        </Pressable>
      </View>
    ) : (
      <Pressable onPress={onEditPress} className="p-2 bg-gray-100 rounded-full active:bg-gray-200">
        <Pencil size={20} color="#374151" />
      </Pressable>
    )}
  </View>
);