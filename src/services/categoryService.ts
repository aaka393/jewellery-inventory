import BaseService from './baseService';
import { API_ENDPOINTS } from '../constants/appConstants';
import { Category } from '../types';
import { ApiResponse } from '../types/api';

// Define interfaces for image file and form data shape
interface ImageFile {
  uploaded?: boolean;
  url?: string;
  file?: File;
  id?: string; // Added id for consistency with CategoryManagement.tsx
  preview?: string; // Added preview for consistency with CategoryManagement.tsx
}

interface FormDataShape {
  image?: string;
  [key: string]: any; // Allow for other properties in formData
}

class CategoryService extends BaseService {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.get<Category[]>(API_ENDPOINTS.CATEGORIES, true);
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<ApiResponse<Category>> {
    return this.post<Category>(API_ENDPOINTS.CREATE_CATEGORY, category, true);
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${API_ENDPOINTS.DELETE_CATEGORY}/${id}`, true);
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.put<Category>(`${API_ENDPOINTS.UPDATE_CATEGORY}/${id}`, data, true);
  }

  /**
   * Uploads a category image to the server.
   * @param imageFiles - Array of image files, typically containing one file for category images.
   * @param formData - The form data containing the existing image URL if no new file is selected.
   * @returns A promise that resolves to the URL of the uploaded image.
   */
  async uploadImage(imageFiles: ImageFile[], formData: FormDataShape): Promise<string> {
    if (imageFiles.length === 0) {
      return formData.image ?? ''; // Return existing image URL if no new image, or empty string if undefined
    }

    const imageFile = imageFiles[0];
    if (imageFile.uploaded && imageFile.url) {
      return imageFile.url; // Image is already uploaded and has a URL
    }

    if (imageFile.file) {
      try {
        const formDataUpload = new FormData();
        // CRITICAL FIX: Change 'file' to 'files' to match server expectation
        formDataUpload.append('files', imageFile.file);

        const response = await fetch('/api/upload-files', {
          method: 'POST',
          body: formDataUpload,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }

        const result = await response.json();
        if (result.code === 2100 && Array.isArray(result.result) && result.result.length > 0) {
          return result.result[0]; // return the filename only
        } else {
          console.error('Unexpected upload response:', result);
          throw new Error('Invalid upload response');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    }

    return ''; // No file to upload
  }
}

export const categoryService = new CategoryService();
