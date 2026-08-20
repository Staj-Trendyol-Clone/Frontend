// src/graphql/favorite.ts
import { gql } from '@apollo/client';

export const GET_MY_FAVORITES = gql`
  query GetMyFavorites {
    myFavorites {
      id
      createdAt
      product {
        id
        productName
        productAvrPrice
        coverImage
      }
    }
  }
`;

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($data: ToggleFavoriteInput!) {
    toggleFavorite(data: $data) {
      message
      isFavorited
      favorite {
        id
        product {
          id
          productName
          productAvrPrice
        }
      }
    }
  }
`;