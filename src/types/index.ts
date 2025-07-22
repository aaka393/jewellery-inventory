export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  contact: string;
  username: string;
  role?: 'Admin' | 'User';
  avatar?: string;
}

export interface Address {
  id: string;
  type: 'shipping' | 'billing';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
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

export interface Product {
  image: string | undefined;
  isNew: boolean;
  isSoldOut: any;
  isSoldOut: any;
  hoverImage: string | undefined;
  id: string;
  name: string;
  slug?: string; // SEO-friendly URL
  category: string; // slug or ObjectId reference
  description?: string;
  initialPrice: number; // what admin paid
  price: number; // selling price to customer
  comparePrice?: number; // optional MRP
  images: string[];
  stock: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string; // icon/banner
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  addedAt?: Date;
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
  image: string;
}

export interface Order {
  orderId: string; // Unique order ID
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
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
  images?: string[];
  stock?: boolean;
  id?: string; // Allow id for update operations
}