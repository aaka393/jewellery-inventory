export interface Product {
  id: string;
  name: string;
  category: 'Silver' | 'Diamond' | 'Platinum' | 'Gold';
  description: string;
  price: number;
  images: string[];
  preorderAvailable: boolean;
  inStock: boolean;
  specifications?: {
    material?: string;
    weight?: string;
    dimensions?: string;
    gemstone?: string;
  };
  rating?: number;
  reviews?: number;
}

export type ProductCategory = 'Silver' | 'Diamond' | 'Platinum' | 'Gold';

export interface ProductFilter {
  category?: ProductCategory;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  preorderOnly?: boolean;
}