// Export all services from a single entry point
export { authService } from './authService';
export { productService } from './productService';
export { categoryService } from './categoryService';
export { tagService } from './tagService';
export { variantService } from './variantService';
export { reviewService } from './reviewService';
export { cartService } from './cartService';
export { wishlistService } from './wishlistService';
export { orderService } from './orderService';
export { searchService } from './searchService';
export { userService } from './userService';
export { analyticsService } from './analyticsService';
export { stockService } from './stockService';
export { uploadService } from './uploadService';

// Export base service for extending
export { default as BaseService } from './baseService';