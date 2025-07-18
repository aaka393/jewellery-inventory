import { 
  authService, 
  productService, 
  categoryService, 
  tagService, 
  variantService, 
  reviewService, 
  cartService, 
  wishlistService, 
  orderService,
  userService,
  analyticsService,
  fileUploadService,
  paymentService,
  adminService
} from './index';
import { Product, Category, Tag, Review, CartItem, WishlistItem, ProductFilters, ProductImport, Order, User } from '../types';

class ApiService {
  // Auth methods
  async login(credentials: { username: string; password: string }) {
    const response = await authService.login(credentials);
    return response.result;
  }

  async register(userData: any) {
    const response = await authService.register(userData);
    return response.result;
  }

  async verifyToken() {
    return await authService.verifyToken();
  }

  async logout() {
    return await authService.logout();
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    try {
      const response = await productService.getProducts();
      return response?.result || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await productService.getFeaturedProducts();
      return response?.result || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  async getProductsByTag(tag: string): Promise<Product[]> {
    try {
      const response = await productService.getProductsByTag(tag);
      return response?.result || [];
    } catch (error) {
      console.error('Error fetching products by tag:', error);
      return [];
    }
  }

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await productService.getProductBySlug(slug);
      return response?.result || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async filterProducts(filters: ProductFilters): Promise<Product[]> {
    try {
      const response = await productService.filterProducts(filters);
      return response?.result || [];
    } catch (error) {
      console.error('Error filtering products:', error);
      return [];
    }
  }

  async searchProducts(query: string): Promise<{ products: Product[]; total: number; suggestions?: any[] }> {
    try {
      const response = await productService.searchProducts(query);
      return response?.result || { products: [], total: 0 };
    } catch (error) {
      console.error('Error searching products:', error);
      return { products: [], total: 0 };
    }
  }

  async getSearchSuggestions(query: string): Promise<any[]> {
    try {
      const response = await productService.getSearchSuggestions(query);
      return response?.result || [];
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      return [];
    }
  }

  async createProduct(products: ProductImport[]): Promise<void> {
    await productService.createProduct(products);
  }

  async uploadProductImage(file: File): Promise<{ url: string }> {
    const response = await productService.uploadProductImage(file);
    return response.result;
  }

  async updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
    const response = await productService.updateProduct(productId, productData);
    return response.result;
  }

  async updateProductStock(productId: string, quantity: number): Promise<void> {
    await productService.updateProductStock(productId, quantity);
  }

  async deleteProducts(): Promise<void> {
    await productService.deleteProducts();
  }

  async deleteProductById(productId: string): Promise<void> {
    await productService.deleteProductById(productId);
  }

  // Product Reviews
  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      const response = await productService.getProductReviews(productId);
      return response?.result || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  async addProductReview(productId: string, review: Omit<Review, 'id' | 'productId' | 'createdAt'>): Promise<Review> {
    const response = await productService.addProductReview(productId, review);
    return response.result;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    try {
      const response = await categoryService.getCategories();
      return response?.result || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const response = await categoryService.createCategory(category);
    return response.result;
  }

  async deleteCategory(id: string): Promise<void> {
    await categoryService.deleteCategory(id);
  }

  // Tag methods
  async getTags(): Promise<Tag[]> {
    try {
      const response = await tagService.getTags();
      return response?.result || [];
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }

  async createTag(tag: Omit<Tag, 'id'>): Promise<Tag> {
    const response = await tagService.createTag(tag);
    return response.result;
  }

  async updateProductTags(productId: string, tags: string[]): Promise<void> {
    await tagService.updateProductTags(productId, tags);
  }

  // Variant methods
  async getVariants() {
    const response = await variantService.getVariants();
    return response.result;
  }

  async createVariant(variant: { type: 'size' | 'metal' | 'stone'; value: string }) {
    const response = await variantService.createVariant(variant);
    return response.result;
  }

  // Review methods
  async addReview(productId: string, review: Omit<Review, 'id' | 'productId' | 'createdAt'>): Promise<Review> {
    const response = await reviewService.addReview(productId, review);
    return response.result;
  }

  // Cart methods
  async addToCart(productId: string, quantity: number): Promise<void> {
    await cartService.addToCart(productId, quantity);
  }

  async getCart(): Promise<CartItem[]> {
    const response = await cartService.getCart();
    return response.result;
  }

  // Wishlist methods
  async addToWishlist(productId: string): Promise<void> {
    await wishlistService.addToWishlist(productId);
  }

  async getWishlist(): Promise<WishlistItem[]> {
    const response = await wishlistService.getWishlist();
    return response.result;
  }

  // Order methods
  async createOrder(orderData: { amount: number; currency: string; receipt?: string; notes?: Record<string, string> }) {
    const response = await orderService.createOrder(orderData);
    return response.result;
  }

  async getOrder(orderId: string) {
    const response = await orderService.getOrder(orderId);
    return response.result;
  }

  async getOrderPayments(orderId: string) {
    const response = await orderService.getOrderPayments(orderId);
    return response.result;
  }

  async listOrders() {
    const response = await orderService.listOrders();
    return response.result;
  }

  async verifyPayment(paymentData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    const response = await orderService.verifyPayment(paymentData);
    return response.result;
  }

  // User methods
  async getUserProfile() {
    const response = await userService.getUserProfile();
    return response.result;
  }

  async updateUserProfile(profileData: any) {
    const response = await userService.updateUserProfile(profileData);
    return response.result;
  }

  async getUserOrders(): Promise<Order[]> {
    const response = await userService.getUserOrders();
    return response.result;
  }

  // File upload methods
  async uploadFile(file: File): Promise<{ url: string }> {
    const response = await fileUploadService.uploadSingleFile(file);
    return response.result;
  }

  async uploadFiles(files: File[]): Promise<{ url: string }[]> {
    const response = await fileUploadService.uploadMultipleFiles(files);
    return response.result;
  }

  // Payment methods
  async createPaymentOrder(orderData: any) {
    const response = await paymentService.createPaymentOrder(orderData);
    return response.result;
  }

  async verifyPaymentSignature(paymentData: any) {
    const response = await paymentService.verifyPayment(paymentData);
    return response.result;
  }

  // Analytics methods
  async trackEvent(event: any) {
    await analyticsService.trackEvent(event);
  }

  async getPopularProducts() {
    const response = await analyticsService.getPopularProducts();
    return response.result;
  }

  async getSalesSummary() {
    const response = await analyticsService.getSalesSummary();
    return response.result;
  }

  // Admin methods
  async getProductStats() {
    const response = await adminService.getProductStats();
    return response.result;
  }

  async getOrderStats() {
    const response = await adminService.getOrderStats();
    return response.result;
  }

  async getAllOrders(): Promise<Order[]> {
    const response = await adminService.getAllOrders();
    return response.result;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await adminService.getAllUsers();
    return response.result;
  }

  async updateOrderStatus(orderId: string, status: string) {
    await adminService.updateOrderStatus(orderId, status);
  }

  async updateUserRole(userId: string, role: string) {
    await adminService.updateUserRole(userId, role);
  }

  async bulkUpdateProductTags(updates: { productId: string; tags: string[] }[]) {
    await adminService.bulkUpdateProductTags(updates);
  }
}

export const apiService = new ApiService();