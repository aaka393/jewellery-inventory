import BaseService from './baseService';
import { API_ENDPOINTS } from '../constants/appConstants';
import { OrderRequest, PaymentVerificationPayload } from '../types';
import { ApiResponse } from '../types/api';

interface Order {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: string;
}

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: string;
}

class OrderService extends BaseService {
  async createOrder(orderData: OrderRequest): Promise<ApiResponse<{ id: string; amount: number; currency: string }>> {
    return this.post<{ id: string; amount: number; currency: string }>(API_ENDPOINTS.CREATE_ORDER, orderData, true);
  }

  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return this.get<Order>(`${API_ENDPOINTS.GET_ORDER}/${orderId}`, true);
  }

  async getOrderPayments(orderId: string): Promise<ApiResponse<Payment[]>> {
    return this.get<Payment[]>(`${API_ENDPOINTS.GET_ORDER_PAYMENTS}/${orderId}/payments`, true);
  }

  async listOrders(): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>(API_ENDPOINTS.LIST_ORDERS, true);
  }

  async verifyPayment(paymentData: PaymentVerificationPayload): Promise<ApiResponse<{ status: string }>> {
    return this.post<{ status: string }>(API_ENDPOINTS.VERIFY_PAYMENT, paymentData, true);
  }
}

  export const orderService = new OrderService();