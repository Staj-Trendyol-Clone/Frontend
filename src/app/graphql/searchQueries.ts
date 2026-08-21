import { TypedDocumentNode, gql } from '@apollo/client';
import { SearchProductsData } from '../types/search';

export const SEARCH_PRODUCTS_QUERY: TypedDocumentNode<SearchProductsData> = gql`
  query SearchProducts($search: String, $categoryName: String) {
    allProducts(filter: { search: $search, categoryName: $categoryName }) {
      id
      productName
      productAvrPrice
      productTotalQuantity
      coverImage
      createdAt
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
