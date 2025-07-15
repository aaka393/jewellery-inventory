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
