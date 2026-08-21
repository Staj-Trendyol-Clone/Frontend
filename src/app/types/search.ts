export interface SearchProduct {
  id: string;
  productName: string;
  productAvrPrice: string;
  productTotalQuantity: number;
  coverImage: string | null;
  createdAt: string;
  categories: {
    categoryName: string;
  }[];
  comment: {
    stars: number;
  }[];
}

export interface SearchProductsData {
  allProducts: SearchProduct[];
}
