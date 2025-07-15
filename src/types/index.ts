export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  password: string;
  mobile: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface Specifications {
  material: string;
  weight: string;
  dimensions: string;
  gemstone: string;
}

export interface TableData {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number | string; 
  images: string[];
  preorderAvailable: boolean;
  inStock: boolean;
  specifications: Specifications;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  availability?: string; // For backward compatibility
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface CartItem extends TableData {
  quantity: number;
  image?: string;
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
}

export type Category = 'Gold' | 'Silver' | 'Platinum' | 'Diamond' | 'All' | 'rings' | 'pendants' | 'earrings' | 'bracelets' | 'necklaces';