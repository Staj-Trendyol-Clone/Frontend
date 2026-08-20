// src/graphql/order.ts
import { gql } from '@apollo/client';

export const CHECKOUT_BASKET = gql`
  mutation CheckoutBasket {
    checkoutBasket {
      message
      order {
        id
        totalAmount
        shippingAddress
        status
        createdAt
        user {
          username
          address
        }
        items {
          id
          quantity
          priceAtTimeOfPurchase
          productVariant {
            id
            varPrice
            product {
              id
              productName
              coverImage
            }
          }
        }
      }
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      totalAmount
      shippingAddress
      status
      createdAt
      items {
        id
        quantity
        priceAtTimeOfPurchase
        productVariant {
          id
          varPrice
          product {
            id
            productName
            coverImage
          }
        }
      }
    }
  }
`;