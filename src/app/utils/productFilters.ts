import { SearchProduct } from '../types/search';

export type SortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'oldest';

export interface FilterState {
  sort: SortOption;
  priceMin: number;
  priceMax: number;
  selectedCategories: string[];
  rating: number | null;
}

export const PRICE_CEILING = 100_000;

export const DEFAULT_FILTERS: FilterState = {
  sort: 'relevance',
  priceMin: 0,
  priceMax: PRICE_CEILING,
  selectedCategories: [],
  rating: null,
};

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'İlgili', value: 'relevance' },
  { label: 'Fiyat: Artan', value: 'price_asc' },
  { label: 'Fiyat: Azalan', value: 'price_desc' },
  { label: 'Yeni → Eski', value: 'newest' },
  { label: 'Eski → Yeni', value: 'oldest' },
];

export const RATING_OPTIONS = [5, 4, 3, 2, 1] as const;

/** Yorumlardan ortalama puan hesaplar. Yorum yoksa 0. */
export function getAverageRating(comments: { stars: number }[] = []): number {
  if (comments.length === 0) return 0;
  const total = comments.reduce((sum, comment) => sum + comment.stars, 0);
  return total / comments.length;
}

/** Ürün listesinden benzersiz kategori adlarını çıkarır. */
export function extractCategories(
  products: Pick<SearchProduct, 'categories'>[],
): string[] {
  const unique = new Set<string>();
  products.forEach((product) => {
    product.categories.forEach((category) => {
      if (category.categoryName) unique.add(category.categoryName);
    });
  });
  return Array.from(unique).sort((a, b) => a.localeCompare(b, 'tr'));
}

/** Varsayılandan sapmış aktif filtre sayısını döner (badge için). */
export function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.sort !== 'relevance') count += 1;
  if (filters.priceMin > DEFAULT_FILTERS.priceMin) count += 1;
  if (filters.priceMax < DEFAULT_FILTERS.priceMax) count += 1;
  if (filters.selectedCategories.length > 0) count += 1;
  if (filters.rating !== null) count += 1;
  return count;
}

function matchesPrice(product: SearchProduct, filters: FilterState): boolean {
  const price = Number(product.productAvrPrice) || 0;
  return price >= filters.priceMin && price <= filters.priceMax;
}

function matchesCategory(product: SearchProduct, filters: FilterState): boolean {
  if (filters.selectedCategories.length === 0) return true;
  return product.categories.some((category) =>
    filters.selectedCategories.includes(category.categoryName),
  );
}

function matchesRating(product: SearchProduct, filters: FilterState): boolean {
  if (filters.rating === null) return true;
  return getAverageRating(product.comment) >= filters.rating;
}

function compareProducts(
  first: SearchProduct,
  second: SearchProduct,
  sort: SortOption,
): number {
  const firstPrice = Number(first.productAvrPrice) || 0;
  const secondPrice = Number(second.productAvrPrice) || 0;

  switch (sort) {
    case 'price_asc':
      return firstPrice - secondPrice;
    case 'price_desc':
      return secondPrice - firstPrice;
    case 'newest':
      return (
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
      );
    case 'oldest':
      return (
        new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
      );
    case 'relevance':
    default:
      return 0;
  }
}

/**
 * Ürünleri istemci tarafında filtreler ve sıralar.
 * Sunucu zaten metin/kategori araması yaptıktan sonra bu katman çalışır.
 */
export function filterAndSortProducts(
  products: SearchProduct[],
  filters: FilterState,
): SearchProduct[] {
  const matched = products.filter(
    (product) =>
      matchesPrice(product, filters) &&
      matchesCategory(product, filters) &&
      matchesRating(product, filters),
  );

  if (filters.sort === 'relevance') return matched;

  return [...matched].sort((a, b) => compareProducts(a, b, filters.sort));
}

/** URL parametresinden başlangıç filtre state'i üretir. */
export function filtersFromParams(category?: string): FilterState {
  return {
    ...DEFAULT_FILTERS,
    selectedCategories: category ? [category] : [],
  };
}

/**
 * Fiyat alanını güvenli şekilde günceller.
 * Min, max'ı aşamaz; max, min'in altına inemez.
 */
export function clampPriceField(
  filters: FilterState,
  field: 'priceMin' | 'priceMax',
  rawValue: string,
): FilterState {
  const numericValue = Number(rawValue.replace(/\D/g, '')) || 0;

  if (field === 'priceMin') {
    return {
      ...filters,
      priceMin: Math.min(numericValue, filters.priceMax),
    };
  }

  return {
    ...filters,
    priceMax: Math.max(numericValue, filters.priceMin),
  };
}
