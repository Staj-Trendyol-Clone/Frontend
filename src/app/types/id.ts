interface VariantImage {
  id: string;
  image: string;
}

interface VariantOption {
  id: string;
  varOptionValue: string;
}

interface ProductVariant {
  id: string;
  varPrice: string | number;
  varStock: number;
  options: VariantOption[];
  images: VariantImage[];
}

interface VariationOption {
  id: string;
  varOptionValue: string;
}

interface Variation {
  id: string;
  varName: string;
  options: VariationOption[];
}

interface ProductCategory {
  id: string;
  categoryName: string;
}

interface ProductComment {
  id: string;
  stars: number;
  comment: string;
}

interface ProductDetailData {
  productDetail: {
    id: string;
    productName: string;
    productDescription: string;
    productIsActive: boolean;
    categories: ProductCategory[];
    comment: ProductComment[];
    variations: Variation[];
    variants: ProductVariant[];
  } | null;
}
// src/types/id.ts dosyasının en altındaki export satırını güncelleyin:
export type {
    ProductCategory,
    ProductComment,
    ProductDetailData,
    ProductVariant,
    VariantImage,
    VariantOption,
    Variation,
    VariationOption
};
