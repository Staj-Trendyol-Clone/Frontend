// src/graphql/card.ts
import { gql } from '@apollo/client';

// 1. Sepet Listesini Getiren Sorgu
export const GET_MY_BASKET = gql`
  query GetMyBasket {
    myBasket {
      id
      items {
        id
        quantity
        productVariant {
          id
          varPrice
          varStock
          product {
            id
            productName
            coverImage
          }
          options {
            varOptionValue
            variation {
              varName
            }
          }
        }
      }
    }
  }
`;

// 2. Sepete Ekleme / Miktar Artırma Mutasyonu
export const ADD_TO_BASKET = gql`
  mutation AddToBasket($productVariantId: ID!, $quantity: Int) {
    addToBasket(data: { productVariantId: $productVariantId, quantity: $quantity }) {
      message
      totalPrice
      basket {
        id
        isActive
      }
    }
  }
`;

// 3. İstenen Dönen Alanlara Sahip Sepetten Silme Mutasyonu
export const REMOVE_FROM_BASKET = gql`
  mutation RemoveFromBasket($basketItemId: ID!) {
    removeFromBasket(data: { basketItemId: $basketItemId }) {
      message
      totalPrice
      basket {
        id
        items {
          id
          quantity
          productVariant {
            id
            varPrice
            product {
              productName
              coverImage
            }
          }
        }
      }
    }
  }
`;