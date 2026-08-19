// src/components/Header.tsx
import React from 'react';
import { View } from 'react-native';
import "../../global.css"; // Tailwind CSS'i dahil et
import { SearchBar } from './SearchBar';

export const Header: React.FC = () => {
  return (
    <View className="bg-white pt-12 pb-3 border-b border-gray-100 shadow-sm">
      {/* Arama Alanı */}
      <SearchBar compact={true} />
    </View>
  );
};