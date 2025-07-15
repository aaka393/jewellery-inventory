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
}

export interface CartItem extends TableData {
  quantity: number;
  id: string;
  image?: string;
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
}

export type Category = 'Gold' | 'Silver' | 'Platinum' | 'Diamond' | 'All';
