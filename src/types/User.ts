export interface User {
  id: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
  preferences?: {
    favoriteCategories: string[];
    notifications: boolean;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}