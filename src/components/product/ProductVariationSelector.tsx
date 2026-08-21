// src/components/product/ProductVariationSelector.tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface VariationOption {
  id: string;
  varOptionValue: string;
}

export interface Variation {
  id: string;
  varName: string;
  options: VariationOption[];
}

interface ProductVariationSelectorProps {
  variations: Variation[];
  selectedOptions: Record<string, string>;
  isOptionAvailable: (varIndex: number, optionId: string) => boolean;
  onSelectOption: (varIndex: number, variationId: string, optionId: string) => void;
}

export const ProductVariationSelector: React.FC<ProductVariationSelectorProps> = ({
  variations,
  selectedOptions,
  isOptionAvailable,
  onSelectOption,
}) => {
  if (!variations || variations.length === 0) return null;

  return (
    <View className="mt-5 border-t border-gray-100 pt-3">
      {variations.map((variation: Variation, varIndex: number) => (
        <View key={variation.id} className="mb-3">
          <Text className="text-xs font-bold text-gray-900 mb-2">
            {variation.varName} Seçiniz:
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {variation.options?.map((option: VariationOption) => {
              const isSelected = selectedOptions[variation.id] === option.id;
              const isAvailable = isOptionAvailable(varIndex, option.id);

              return (
                <Pressable
                  key={option.id}
                  disabled={!isAvailable}
                  onPress={() => onSelectOption(varIndex, variation.id, option.id)}
                  className={`px-4 py-2 rounded-xl border ${
                    !isAvailable
                      ? 'border-gray-200 bg-gray-100 opacity-40'
                      : isSelected
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white active:bg-gray-50'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      !isAvailable
                        ? 'text-gray-400 line-through'
                        : isSelected
                        ? 'text-orange-600 font-bold'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.varOptionValue}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};