import { api } from './authService';

export interface CreateOrderPayload {
  amount: number;
  currency: string;
  receipt: string;
  notes: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
    productIds: string[];
    productCounts: Record<string, number>;
  };
}

export interface CreateOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  notes: any;
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  order?: any;
  payment?: any;
}

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