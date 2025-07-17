import BaseService from './baseService';
import { ApiResponse } from '../types/api';

interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

class FileUploadService extends BaseService {
  async uploadSingleFile(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/upload-file`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  async uploadMultipleFiles(files: File[]): Promise<ApiResponse<UploadResponse[]>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    const response = await fetch(`${this.baseURL}/upload-files`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  async uploadProductImages(files: File[]): Promise<string[]> {
    try {
      const response = await this.uploadMultipleFiles(files);
      return response.result.map(file => file.url);
    } catch (error) {
      console.error('Error uploading product images:', error);
      throw error;
    }
  }

  async uploadUserAvatar(file: File): Promise<string> {
    try {
      const response = await this.uploadSingleFile(file);
      return response.result.url;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }
}

export const fileUploadService = new FileUploadService();