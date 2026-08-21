// src/types/comment.ts
export interface AddCommentInput {
  productId: string;
  stars: number;
  comment: string;
}

// Variables objesi 'data' kapsayıcısını içerir
export interface AddCommentVariables {
  data: AddCommentInput;
}

export interface AddCommentResponse {
  addComment: {
    message: string;
    comment: {
      id: string;
      stars: number;
      comment: string;
      createdAt?: string;
      user?: {
        username: string;
      };
      product?: {
        id: string;
        productName: string;
      };
    };
  };
}

export interface DeleteCommentInput {
  commentId: string;
}

export interface DeleteCommentVariables {
  data: DeleteCommentInput;
}

export interface DeleteCommentResponse {
  deleteComment: {
    message: string;
    success?: boolean;
  };
}