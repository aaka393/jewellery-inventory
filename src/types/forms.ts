export interface ProductFormData {
  name: string;
  slug: string;
  category: string;
  description: string;
  initialPrice: number;
  price: number;
  comparePrice: number;
  images: string[];
  stock: boolean;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  image: string;
}

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  firstname: string;
  lastname: string;
  contact: string;
  username: string;
  password: string;
  confirmPassword: string;
}