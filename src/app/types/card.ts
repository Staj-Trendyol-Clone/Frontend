// src/types/card.ts

export interface VariationInfo {
  varName: string;
}

export interface VariantOptionInfo {
  varOptionValue: string;
  variation?: VariationInfo | null;
}

export interface BasketProduct {
  id?: string;
  productName: string;
  coverImage?: string | null;
}

export interface BasketProductVariant {
  id: string;
  varPrice: string | number;
  varStock?: number;
  product: BasketProduct;
  options?: VariantOptionInfo[];
}

export interface BasketItem {
  id: string;
  quantity: number;
  productVariant: BasketProductVariant;
}

export interface BasketData {
  id: string;
  isActive?: boolean;
  items: BasketItem[];
}

export interface UserBasketData {
  myBasket: BasketData | null;
}

// Tam Uyumlu Silme Mutasyonu Yanıt Tipi
export interface RemoveFromBasketData {
  removeFromBasket: {
    message: string;
    totalPrice: string | number;
    basket: {
      id: string;
      items: {
        id: string;
        quantity: number;
        productVariant: {
          id: string;
          varPrice: string | number;
          product: {
            productName: string;
            coverImage: string | null;
          };
        };
      }[];
    } | null;
  } | null;
}

export interface RemoveFromBasketVariables {
  basketItemId: string;
}

export interface AddToBasketData {
  addToBasket: {
    message?: string;
    totalPrice?: string | number;
    basket?: {
      id: string;
      isActive: boolean;
    };
  } | null;
}

export interface AddToBasketVariables {
  productVariantId: string;
  quantity?: number;
}