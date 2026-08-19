// src/graphql/queries.ts
// Get products querys
// SearchBar querys
import { TypedDocumentNode, gql } from '@apollo/client';
import { AllProductsData } from '../types/product';

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    allProducts {
      id
      productName
      productAvrPrice
      coverImage
      categories {
        categoryName
      }
      comment {
        stars
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!, $categoryName: String) {
    allProducts(filter: { search: $search, categoryName: $categoryName }) {
      id
      productName
      productAvrPrice
      coverImage
      categories {
        categoryName
      }
      comment {
        stars
      }
    }
  }
`;

export const CATEGORY_SUGGESTIONS = gql`
  query CategorySuggestions($searchText: String!) {
    categorySuggestions(searchText: $searchText) {
      id
      categoryIsActive
      categoryName
    }
  }
`;

export const GET_PRODUCT_BY_ID: TypedDocumentNode<AllProductsData> = gql`
  query GetProductById($id: ID!) {
    productDetail(id: $id) {
      id
      productName
      productDescription
      productIsActive
      categories {
        id
        categoryName
      }
      comment {
        id
        stars
        comment
      }
      variations {
        id
        varName
        options {
          id
          varOptionValue
        }
      }
      variants {
        id
        varPrice
        varStock
        options {
          id
          varOptionValue
        }
        images {
          id
          image
        }
      }
    }
  }
`;