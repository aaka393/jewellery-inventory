import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { paymentService } from '../services/paymentService';
import { CreateOrderPayload, PaymentVerificationPayload } from '../types/paymentTypes';

interface PaymentState {
  isProcessing: boolean;
  currentOrder: any;
  paymentHistory: any[];
  error: string | null;
  success: boolean;
  createOrder: (payload: CreateOrderPayload) => Promise<any>;
  verifyPayment: (payload: PaymentVerificationPayload) => Promise<boolean>;
  getOrderPayments: (orderId: string) => Promise<any[]>; 
  clearPaymentState: () => void;
  setProcessing: (processing: boolean) => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      isProcessing: false,
      currentOrder: null,
      paymentHistory: [],
      error: null,
      success: false,

      createOrder: async (payload: CreateOrderPayload) => {
        set({ isProcessing: true, error: null });
        try {
          const order = await paymentService.createOrder(payload);
          set({ currentOrder: order, isProcessing: false });
          return order;
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to create order', 
            isProcessing: false 
          });
          throw error;
        }
      },

      verifyPayment: async (payload: PaymentVerificationPayload) => {
        set({ isProcessing: true, error: null });
        try {
          const result = await paymentService.verifyPayment(payload);
          if (result.success) {
            set({ 
              success: true, 
              isProcessing: false,
              paymentHistory: [...get().paymentHistory, result]
            });
            return true;
          } else {
            set({ 
              error: result.message || 'Payment verification failed', 
              isProcessing: false 
            });
            return false;
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'Payment verification failed', 
            isProcessing: false 
          });
          return false;
        }
      },

      getOrderPayments: async (orderId: string) => {
        try {
          return await paymentService.getOrderPayments(orderId);
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch payments' });
          return [];
        }
      },

      clearPaymentState: () => {
        set({ 
          isProcessing: false, 
          currentOrder: null, 
          error: null, 
          success: false 
        });
      },

      setProcessing: (processing: boolean) => {
        set({ isProcessing: processing });
      }
    }),
    {
      name: 'payment-storage'
    }
  )
);
