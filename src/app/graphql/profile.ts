// src/graphql/profile.ts
import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
query GetUserProfile {
  me {
    id
    username
    email
    birthDate
    address
    phoneNumber
  }
}
`;

// Profil güncelleme mutasyonu
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      message
      user {
        id
        username
        phoneNumber
        birthDate
        address
      }
    }
  }
`;