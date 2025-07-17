import BaseService from './baseService';
import { API_ENDPOINTS } from '../constants/appConstants';
import { LoginRequest, RegisterRequest } from '../types';
import { ApiResponse, LoginResponse, RegisterResponse, TokenVerificationResponse } from '../types/api';

class AuthService extends BaseService {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return this.post<RegisterResponse>(API_ENDPOINTS.REGISTER, userData);
  }

  async verifyToken(): Promise<ApiResponse<TokenVerificationResponse>> {
    return this.post<TokenVerificationResponse>(API_ENDPOINTS.VERIFY_TOKEN, true);
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.LOGOUT, {}, true);
  }
}

export const authService = new AuthService();