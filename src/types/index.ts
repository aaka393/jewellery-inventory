export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  contact: string;
  username: string;
  role?: 'Admin' | 'User';
  avatar?: string;
  dateOfBirth?: Date;
  gender?: string;
  preferences?: {
    categories: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  addresses: Address[];
  wishlist: string[]; // Product IDs
  cart: CartItem[];
  lastLogin?: Date;
  isActive: boolean;
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

export interface Specifications {
  material?: string;
  weight?: string;
  dimensions?: string;
  gemstone?: string;
  [key: string]: any;
}

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
}

export interface ProductVariants {
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  size?: string;
  metal?: string;
  stone?: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  description?: string;
  price: number;
  comparePrice?: number; // Original price for discount display
  images: string[];
  preorderAvailable?: boolean;
  inStock: boolean;
  specifications?: Specifications;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  tags: string[];
  noOfProducts: number;
  variants?: ProductVariants;
  visibility?: boolean; // Product visibility (default: true)
  sortOrder?: number; // Display order
  createdAt?: Date;
  updatedAt?: Date;
  viewCount?: number; // Track product views
  salesCount?: number; // Track sales
  stockAlert?: number; // Low stock alert threshold
  dimensions?: ProductDimensions;
  seoKeywords?: string[]; // SEO keywords
  relatedProducts?: string[]; // Related product IDs
  metaTitle?: string; // SEO meta title
  metaDescription?: string; // SEO meta description
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug?: string; // SEO-friendly URL
  image?: string; // Category image
  parentCategory?: string; // For subcategories
  sortOrder?: number;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  productCount?: number; // Cached product count
}

export interface Tag {
  id: string;
  name: string;
  slug?: string;
  color?: string; // Display color
  isActive?: boolean;
  sortOrder?: number;
  productCount?: number; // Cached count
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  images?: string[]; // Review images
  isVerifiedPurchase?: boolean;
  isApproved?: boolean; // For moderation
  helpfulCount?: number;
  createdAt: string;
  updatedAt?: string;
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
  tags?: string[];
  q?: string; // Search query
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductImport {
  name?: string;
  slug?: string;
  category?: string;
  description?: string;
  price?: number;
  comparePrice?: number;
  images?: string[];
  preorderAvailable?: boolean;
  inStock?: boolean;
  specifications?: Specifications;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  tags?: string[];
  variants?: ProductVariants;
  noOfProducts?: number;
  visibility?: boolean;
  sortOrder?: number;
  viewCount?: number;
  salesCount?: number;
  stockAlert?: number;
  relatedProducts?: string[];
  dimensions?: ProductDimensions;
  seoKeywords?: string[];
  metaTitle?: string;
  metaDescription?: string;
  id?: string; // Allow id for update operations
}

export interface AnalyticsEvent {
  type: 'product_view' | 'purchase' | 'search' | 'add_to_cart' | 'add_to_wishlist';
  userId?: string;
  productId?: string;
  sessionId: string;
  data?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface SearchSuggestion {
  query: string;
  type: 'product' | 'category' | 'tag';
  count: number;
}

export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  category: string;
}

export interface StockHistory {
  id: string;
  productId: string;
  previousQuantity: number;
  newQuantity: number;
  operation: string;
  reason: string;
  timestamp: string;
  userId?: string;
}