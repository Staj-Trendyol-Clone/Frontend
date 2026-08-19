// src/types/authRegister.ts

export interface RegisterInput {
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
  birthDate?: string;
  address?: string;
}

export interface CreatedUser {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  birthDate?: string | null;
  address?: string | null;
}

export interface CreateUserData {
  createUser: {
    user: CreatedUser;
    token?: string;
  } | null;
}