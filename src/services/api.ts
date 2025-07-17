import { 
  authService, 
  productService, 
  categoryService, 
  tagService, 
  variantService, 
  reviewService, 
  cartService, 
  wishlistService, 
  orderService 
} from './index';
import { Product, Category, Tag, Review, CartItem, WishlistItem, ProductFilters, ProductImport } from '../types';

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

  async importProducts(products: ProductImport[]): Promise<void> {
    await productService.importProducts(products);
  }

  async uploadProductImage(file: File): Promise<{ url: string }> {
    const response = await productService.uploadProductImage(file);
    return response.result;
  }

  async updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
    const response = await productService.updateProduct(productId, productData);
    return response.result;
  }

  async deleteProducts(): Promise<void> {
    await productService.deleteProducts();
  }

  async deleteProductById(productId: string): Promise<void> {
    await productService.deleteProductById(productId);
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
  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      const response = await reviewService.getProductReviews(productId);
      return response?.result || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

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
}

export const apiService = new ApiService();