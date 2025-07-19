import BaseService from './baseService';
import { ApiResponse } from '../types/api';

interface UploadResponse {
  url: string;
  filename: string;
}

class UploadService extends BaseService {
  async uploadFile(file: File): Promise<ApiResponse<UploadResponse>> {
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
    const uploadPromises = files.map(file => this.uploadFile(file));
    const results = await Promise.all(uploadPromises);
    
    return {
      code: 1000,
      message: 'Files uploaded successfully',
      result: results.map(r => r.result)
    };
  }
}

export const uploadService = new UploadService();