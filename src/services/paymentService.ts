import { apiClient } from './api';
import { Payment, PaymentIntent, PaymentMethod, Order, ApiResponse } from '../types';

export class PaymentService {
  async createPaymentIntent(orderId: string): Promise<PaymentIntent> {
    const response = await apiClient.post<ApiResponse<PaymentIntent>>('/payments/create-intent', {
      orderId,
    });
    return response.data;
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<Payment> {
    const response = await apiClient.post<ApiResponse<Payment>>('/payments/confirm', {
      paymentIntentId,
      paymentMethodId,
    });
    return response.data;
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get<ApiResponse<PaymentMethod[]>>('/payments/methods');
    return response.data;
  }

  async addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    const response = await apiClient.post<ApiResponse<PaymentMethod>>('/payments/methods', paymentMethod);
    return response.data;
  }

  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    await apiClient.delete(`/payments/methods/${paymentMethodId}`);
  }

  async getPaymentHistory(): Promise<Payment[]> {
    const response = await apiClient.get<ApiResponse<Payment[]>>('/payments/history');
    return response.data;
  }

  async getPaymentById(paymentId: string): Promise<Payment> {
    const response = await apiClient.get<ApiResponse<Payment>>(`/payments/${paymentId}`);
    return response.data;
  }

  async processRefund(paymentId: string, amount?: number): Promise<Payment> {
    const response = await apiClient.post<ApiResponse<Payment>>(`/payments/${paymentId}/refund`, {
      amount,
    });
    return response.data;
  }

  async createOrder(orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      isPreorder: boolean;
    }>;
    shippingAddress: any;
    billingAddress: any;
  }): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', orderData);
    return response.data;
  }

  async getOrders(): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
    return response.data;
  }

  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/cancel`);
    return response.data;
  }
}

export const paymentService = new PaymentService();