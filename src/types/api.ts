export interface ApiResponse<T = any> {
  code: number;
  message: string;
  result: T;
}

export interface LoginResponse {
  contact: string;
  createdDate: string;
  email: string;
  firstname: string;
  id: string;
  keycloakId: string;
  lastname: string;
  role?: string;
  username: string;
}

export interface RegisterResponse extends LoginResponse {}

export interface TokenVerificationResponse extends LoginResponse {}