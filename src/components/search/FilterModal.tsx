import { X } from 'lucide-react-native';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FilterState,
  PRICE_CEILING,
  RATING_OPTIONS,
  SORT_OPTIONS,
  clampPriceField,
} from '../../app/utils/productFilters';
import { PriceRangeSlider } from './PriceRangeSlider';

interface FilterModalProps {
  visible: boolean;
  draft: FilterState;
  categories: string[];
  onChange: (next: FilterState) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
}

export function FilterModal({
  visible,
  draft,
  categories,
  onChange,
  onClose,
  onApply,
  onReset,
}: FilterModalProps) {
  const [sliderDragging, setSliderDragging] = useState(false);

  const toggleCategory = (category: string) => {
    const isSelected = draft.selectedCategories.includes(category);
    onChange({
      ...draft,
      selectedCategories: isSelected
        ? draft.selectedCategories.filter((item) => item !== category)
        : [...draft.selectedCategories, category],
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        <View className="pt-12 pb-4 border-b border-gray-100 flex-row items-center justify-between px-4">
          <Text className="text-lg font-semibold text-gray-900">
            Filtrele & Sırala
          </Text>
          <TouchableOpacity onPress={onClose} accessibilityLabel="Kapat">
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!sliderDragging}
        >
          <View className="px-4 py-4 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Sıralama
            </Text>
            {SORT_OPTIONS.map((option) => {
              const selected = draft.sort === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => onChange({ ...draft, sort: option.value })}
                  className="flex-row items-center py-3 border-b border-gray-50"
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      selected
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selected && (
                      <View className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </View>
                  <Text className="text-sm text-gray-800">{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="px-4 py-4 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Fiyat Aralığı
            </Text>
            <View className="flex-row items-center justify-between mb-3">
              <TextInput
                value={String(draft.priceMin)}
                onChangeText={(value) =>
                  onChange(clampPriceField(draft, 'priceMin', value))
                }
                keyboardType="numeric"
                placeholder="Minimum"
                className="w-[45%] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
              />
              <Text className="text-gray-400">–</Text>
              <TextInput
                value={String(draft.priceMax)}
                onChangeText={(value) =>
                  onChange(clampPriceField(draft, 'priceMax', value))
                }
                keyboardType="numeric"
                placeholder="Maksimum"
                className="w-[45%] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
              />
            </View>

            <PriceRangeSlider
              min={0}
              max={PRICE_CEILING}
              low={draft.priceMin}
              high={draft.priceMax}
              step={100}
              onChange={(priceMin, priceMax) =>
                onChange({ ...draft, priceMin, priceMax })
              }
              onDragStart={() => setSliderDragging(true)}
              onDragEnd={() => setSliderDragging(false)}
            />

            <Text className="text-xs text-gray-500 mt-1">
              ₺{draft.priceMin.toLocaleString('tr-TR')} – ₺
              {draft.priceMax.toLocaleString('tr-TR')}
            </Text>
          </View>

          {categories.length > 0 && (
            <View className="px-4 py-4 border-b border-gray-100">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Kategoriler
              </Text>
              {categories.map((category) => {
                const selected = draft.selectedCategories.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    onPress={() => toggleCategory(category)}
                    className="flex-row items-center py-3 border-b border-gray-50"
                  >
                    <View
                      className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                        selected
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selected && (
                        <Text className="text-white text-xs font-bold">✓</Text>
                      )}
                    </View>
                    <Text className="text-sm text-gray-800">{category}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View className="px-4 py-4 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Değerlendirme
            </Text>
            {RATING_OPTIONS.map((rating) => {
              const selected = draft.rating === rating;
              return (
                <TouchableOpacity
                  key={rating}
                  onPress={() =>
                    onChange({
                      ...draft,
                      rating: selected ? null : rating,
                    })
                  }
                  className="flex-row items-center py-3 border-b border-gray-50"
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      selected
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selected && (
                      <View className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </View>
                  <Text className="text-yellow-500 mr-2">
                    {'★'.repeat(rating)}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {rating} Yıldız ve Üzeri
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View className="border-t border-gray-100 px-4 py-4 flex-row gap-3">
          <TouchableOpacity
            onPress={onReset}
            className="flex-1 py-3 border border-gray-300 rounded-lg items-center"
          >
            <Text className="text-sm font-semibold text-gray-700">Sıfırla</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onApply}
            className="flex-1 py-3 bg-orange-500 rounded-lg items-center"
          >
            <Text className="text-sm font-semibold text-white">Uygula</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
