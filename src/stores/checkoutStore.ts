import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CheckoutFormData {
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
}

interface CheckoutState {
  formData: CheckoutFormData;
  isProcessing: boolean;
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  setProcessing: (processing: boolean) => void;
  resetForm: () => void;
}

const initialFormData: CheckoutFormData = {
  email: '',
  mobile: '',
  firstName: '',
  lastName: ''
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      isProcessing: false,

      updateFormData: (data: Partial<CheckoutFormData>) => {
        set({
          formData: { ...get().formData, ...data }
        });
      },

      setProcessing: (processing: boolean) => {
        set({ isProcessing: processing });
      },

      resetForm: () => {
        set({ formData: initialFormData, isProcessing: false });
      }
    }),
    {
      name: 'checkout-storage'
    }
  )
);