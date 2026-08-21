// src/graphql/comment.ts
import { gql } from '@apollo/client';

export const ADD_COMMENT = gql`
  mutation AddComment($data: CommentInput!) {
    addComment(data: $data) {
      message
      comment {
        id
        stars
        comment
        createdAt
        user {
          username
        }
        product {
          id
          productName
        }
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($data: DeleteCommentInput!) {
    deleteComment(data: $data) {
      message
      success
    }
  }
`;