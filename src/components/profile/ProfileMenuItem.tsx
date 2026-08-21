// src/components/profile/ProfileMenuItem.tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ProfileMenuItemProps {
  icon: React.ElementType;
  title: string;
  onPress: () => void;
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon: Icon,
  title,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-between bg-white p-4 rounded-xl mb-3 border border-gray-100 active:bg-gray-50 shadow-sm"
  >
    <View className="flex-row items-center gap-3">
      <Icon size={20} color="#374151" />
      <Text className="text-sm font-semibold text-gray-800">{title}</Text>
    </View>
    <Text className="text-gray-400 text-lg">›</Text>
  </Pressable>
);