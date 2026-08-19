// src/types/product.ts

export interface ProductCategory {
  categoryName: string;
}

export interface ProductComment {
  stars: number;
}

export interface GraphQLProduct {
  id: string;
  productName: string;
  productAvrPrice: string;
  coverImage: string | null; // <-- Yeni kapak görseli alanı
  categories: ProductCategory[];
  comment: ProductComment[];
}

export interface AllProductsData {
  allProducts: GraphQLProduct[];
}