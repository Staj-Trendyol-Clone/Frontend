// src/graphql/authRegister.ts
import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($data: RegisterInput!) {
    createUser(data: $data) {
      user {
        id
        username
        email
        phoneNumber
        birthDate
        address
      }
      token
    }
  }
`;