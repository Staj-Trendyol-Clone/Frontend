// src/types/schema.ts

export interface ImageEntity {
  id: string;
  product_id: string;
  images: string;
}

export interface CommentEntity {
  id: string;
  product_id: string;
  stars: number;
  comment: string;
}

export interface VariationOptionEntity {
  id: string;
  var_id: string;
  var_option_value: string;
}

export interface VariationEntity {
  id: string;
  product_id: string;
  var_name: string; // örn: "Renk", "Beden"
  options: VariationOptionEntity[];
}

export interface ProductVariantEntity {
  id: string;
  product_id: string;
  var_opt_id: string; // VariationOption.id
  var_stock: number;
  var_price: number;
}

export interface CategoryEntity {
  id: string;
  category_name: string;
  category_is_active: boolean;
}

export interface Product {
  id: string;
  product_name: string;
  product_description: string;
  product_avr_price: number;
  product_total_quantity: number;
  product_is_active: boolean;
  
  // İlişkili Katmanlar (Hydrated Relations)
  images: ImageEntity[];
  comments: CommentEntity[];
  variations: VariationEntity[];
  variants: ProductVariantEntity[];
  categories: CategoryEntity[];
  
  // Client-side durum
  isFavorite?: boolean;
}