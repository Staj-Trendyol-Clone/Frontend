export interface SearchProduct {
  id: string;
  productName: string;
  productAvrPrice: string;
  productTotalQuantity: number;
  coverImage: string | null;
  createdAt: string;
}

export interface SearchProductsData {
  allProducts: SearchProduct[];
}
