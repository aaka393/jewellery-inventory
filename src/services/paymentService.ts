import { api } from './authService';
import {
  CreateOrderPayload,
  CreateOrderResponse,
  PaymentVerificationPayload,
  PaymentVerificationResponse,
} from '../types/paymentTypes';

export const paymentService = {
  createOrder: async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  const response = await api.post('/order', {
    ...payload,
    notes: {
      ...payload.notes,
      productIds: JSON.stringify(payload.notes.productIds),
      productCounts: JSON.stringify(payload.notes.productCounts),
    },
  });
  return response.data.result;
},

  verifyPayment: async (payload: PaymentVerificationPayload): Promise<PaymentVerificationResponse> => {
    const response = await api.post('/payment/verify', payload);
    return response.data;
  },

  getOrder: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.result;
  },

  getOrderPayments: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}/payments`);
    return response.data.result;
  }
};