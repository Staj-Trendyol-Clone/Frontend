// src/components/profile/ProfileInput.tsx
import React from 'react';
import { Text, TextInput, View } from 'react-native';

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

export const ProfileInput: React.FC<ProfileInputProps> = ({
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
        textAlignVertical: multiline ? 'top' : 'center',
      }}
    />
  </View>
);