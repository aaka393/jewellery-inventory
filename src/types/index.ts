import { AddressFormData } from "./address";

export interface User {
  id: string;
  email: string;
  contact: string;
  username: string;
  role?: 'Admin' | 'User';
  avatar?: string;
  latestOrderId?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  contact: string;
  username: string;
  password: string;
}

export interface Product {
  updatedAt: string | number | Date;
  image: string | undefined;
  isNew: boolean;
  isSoldOut: any;
  hoverImage: string | undefined;
  id: string;
  name: string;
  slug?: string;
  category: string;
  description?: string;
  initialPrice: number;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: boolean;
  createdAt: string;
  details: string;
  review: string;
  isLatest?: boolean;
  isHalfPaymentAvailable?: boolean;
  halfPaymentAmount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  sizeOptions?: string[];
  categoryType: 'handmade' | 'handloom';
}




export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedSize?: string;
  product: Product;
}
export interface GuestCartItem {
  id: string,
  productId: string;
  quantity: number;
  selectedSize?: string;
  product: Product;
}
export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  image: string;
  description?: string;
}

export interface Order {
  id: string;
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  currency: string;
  entity: string;
  status: 'created' | 'attempted' | 'paid';
  notes: {
    itemCount: string;
    userEmail: string;
    userId: string;
  };
  receipt: string;
  offer_id: string | null;
  createdAt: string;
  items: OrderItem[];
  trackingNumber: string | null;
  shippingAddress: AddressFormData;
  isHalfPaid?: boolean;
  remainingAmount?: number;
  halfPaymentStatus?: 'pending' | 'paid' | 'not_applicable';
  enableRemainingPayment?: boolean;
}


export interface OrderItemRequest {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface OrderRequest {
  amount: number; // In paise (i.e., smallest currency unit)
  currency: 'INR'; // Could be generalized if needed
  receipt?: string;
  items: OrderItem[];
  shippingAddress: AddressFormData; // Define this below
  isHalfPaid?: boolean;
  remainingAmount?: number;
  notes?: {
    userId?: string;
    userEmail?: string;
    itemCount?: string;
    paymentType?: string;
    [key: string]: string | undefined;
  };

}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: string;
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  q?: string; // Search query
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductImport {
  name: string;
  slug?: string;
  category: string;
  description?: string;
  initialPrice: number;
  price: number;
  comparePrice?: number;
  details?: string;
  images?: string[];
  stock?: boolean;
  id?: string;
  review?: string;
  isLatest?: boolean;
  isHalfPaymentAvailable?: boolean;
  halfPaymentAmount?: number;
}


export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
}