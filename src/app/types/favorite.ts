// src/types/favorite.ts
export interface FavoriteProduct {
  id: string;
  productName: string;
  productAvrPrice?: string | number | null;
  coverImage?: string | null;
}

export interface FavoriteItem {
  id: string;
  createdAt?: string;
  product: FavoriteProduct;
}

export interface MyFavoritesData {
  myFavorites: FavoriteItem[];
}

export interface ToggleFavoriteInput {
  productId: string;
}

export interface ToggleFavoriteVariables {
  data: ToggleFavoriteInput;
}

export interface ToggleFavoriteData {
  toggleFavorite: {
    message: string;
    isFavorited: boolean;
    favorite?: {
      id: string;
      product: {
        id: string;
        productName: string;
        productAvrPrice?: string | number | null;
      };
    } | null;
  };
}