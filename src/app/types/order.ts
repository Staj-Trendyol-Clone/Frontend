// src/types/order.ts
export interface VariantOption {
  id?: string;
  varOptionValue: string;
}

export interface OrderProduct {
  id: string;
  productName: string;
  coverImage?: string | null;
}

export interface OrderProductVariant {
  id: string;
  varPrice: string | number;
  options?: VariantOption[];
  product: OrderProduct;
}

export interface OrderItem {
  id: string;
  quantity: number;
  priceAtTimeOfPurchase: string | number;
  productVariant: OrderProductVariant;
}

export interface OrderUser {
  username: string;
  address?: string;
}

export interface Order {
  id: string;
  totalAmount: string | number;
  shippingAddress?: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  user?: OrderUser;
}

export interface GetMyOrdersData {
  myOrders: Order[];
}

export interface CheckoutBasketData {
  checkoutBasket: {
    message: string;
    order: Order;
  };
}