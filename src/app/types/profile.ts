// src/types/profile.ts

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  birthDate?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
}

export interface UserProfileData {
  me: UserProfile | null;
}