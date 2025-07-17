export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_TOKEN: '/verifyToken',
  LOGOUT: '/logout',
  
  // Product endpoints
  PRODUCTS: '/auth/products',
  FEATURED_PRODUCTS: '/products/featured',
  PRODUCTS_BY_TAG: '/products/by-tag',
  SEARCH_PRODUCTS: '/products/search',
  SEARCH_SUGGESTIONS: '/products/suggestions',
  UPDATE_PRODUCT: '/product/id',
  PRODUCT_BY_SLUG: '/auth/products',
  FILTER_PRODUCTS: '/auth/products/filter',
  IMPORT_PRODUCTS: '/importproducts',
  UPLOAD_IMAGE: '/auth/products/image-upload',
  DELETE_PRODUCTS: '/deleteProducts',
  DELETE_PRODUCT: '/products',
  
  // Category endpoints
  CATEGORIES: '/auth/categories',
  CREATE_CATEGORY: '/categories',
  DELETE_CATEGORY: '/categories',
  
  // Tag endpoints
  TAGS: '/auth/tags',
  CREATE_TAG: '/tags',
  UPDATE_PRODUCT_TAGS: '/products',
  
  // Variant endpoints
  VARIANTS: '/auth/variants',
  CREATE_VARIANT: '/variants',
  
  // Review endpoints
  PRODUCT_REVIEWS: '/auth/products',
  ADD_REVIEW: '/products',
  
  // Cart endpoints
  ADD_TO_CART: '/cart/add',
  GET_CART: '/cart',
  
  // Wishlist endpoints
  ADD_TO_WISHLIST: '/wishlist/add',
  GET_WISHLIST: '/wishlist',
  
  // Order endpoints
  CREATE_ORDER: '/order',
  UPDATE_ORDER_STATUS: '/admin/orders',
  GET_ORDER: '/orders',
  GET_ORDER_PAYMENTS: '/orders',
  LIST_ORDERS: '/orderservice',
  VERIFY_PAYMENT: '/payments/payment/verify',
  
  // User endpoints
  USER_PROFILE: '/user/profile',
  USER_ORDERS: '/user/orders',
  USER_CART: '/user/cart',
  MERGE_CART: '/cart/merge',
  UPDATE_CART: '/cart/update',
  REMOVE_FROM_CART: '/cart/remove',
  
  // Stock endpoints
  UPDATE_STOCK: '/products',
  BULK_UPDATE_STOCK: '/products/stock/bulk-update',
  STOCK_ALERTS: '/products/stock/alerts',
  STOCK_HISTORY: '/products/stock/history',
  
  // Analytics endpoints
  ANALYTICS_TRACK: '/analytics/track',
  ANALYTICS_POPULAR: '/analytics/products/popular',
  ANALYTICS_SALES: '/analytics/sales/summary',
  ANALYTICS_USERS: '/analytics/users/activity',
  
  // File upload
  UPLOAD_FILE: '/upload-file',
  UPLOAD_FILES: '/upload-files',
};

export const RESPONSE_CODES = {
  SUCCESS: 1000,
  TOKEN_VERIFIED: 1040,
  LOGIN_SUCCESS: 1003,
  REGISTER_SUCCESS: 1001,
  ERROR: 2000,
  UNAUTHORIZED: 2001,
  NOT_FOUND: 2004,
  VALIDATION_ERROR: 2002,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART_DATA: 'cart_data',
  WISHLIST_DATA: 'wishlist_data',
};