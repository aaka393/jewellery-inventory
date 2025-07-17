export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  contact: string;
  username: string;
  role?: 'Admin' | 'User';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  firstname: string;
  lastname: string;
  contact: string;
  username: string;
  password: string;
}

export interface Specifications {
  material: string;
  weight: string;
  dimensions: string;
  gemstone: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  description: string;
  price: number;
  images: string[];
  preorderAvailable: boolean;
  inStock: boolean;
  specifications: Specifications;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  tags: string[];
  noOfProducts: number;
  variants: {
    size?: string;
    metal?: string;
    stone?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export interface OrderRequest {
  amount: number;
  currency: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface ProductFilters {
  category?: string;
  price_min?: number;
  price_max?: number;
  tags?: string[];
}

export interface ProductImport {
  name: string;
  slug?: string;
  category: string;
  description: string;
  price: number;
  images: string[];
  preorderAvailable: boolean;
  inStock: boolean;
  specifications: Specifications;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  tags: string[];
  variants: Record<string, string>;
}