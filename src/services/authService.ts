// authService.ts
import { API_BASE_URL } from '../constant/appConstants';
import { LoginPayload, RegisterPayload } from '../types';
import axios from 'axios';

// Axios instance with baseURL and credentials
export const api = axios.create({
  baseURL: API_BASE_URL, // Use the constant here
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensure cookies are included in requests
});

// REGISTER
export const register = async (data: RegisterPayload): Promise<void> => {
  try {
    const payload = {
      ...data,
      username: data.email, // FastAPI expects 'username'
    };

    const response = await api.post('/register', payload);
    return response.data.result;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail || 'Registration failed. Please try again.';
    throw new Error(errorMessage);
  }
};

// LOGIN
export const login = async (payload: LoginPayload) => {
  try {
    const response = await api.post('/login', payload);
    // Cookies should be set automatically here due to `withCredentials: true`
    return response.data; // { user, token?, etc. }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail || 'Login failed. Please try again.';
    throw new Error(errorMessage);
  }
};
