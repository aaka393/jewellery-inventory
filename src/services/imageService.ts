import { apiClient } from './api';
import { UploadedImage, TryOnResult, TryOnRequest, ApiResponse } from '../types';

export class ImageService {
  async uploadImage(file: File): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.upload<ApiResponse<UploadedImage>>('/images/upload', formData);
    return response.data;
  }

  async getUserImages(): Promise<UploadedImage[]> {
    const response = await apiClient.get<ApiResponse<UploadedImage[]>>('/images/user');
    return response.data;
  }

  async deleteImage(imageId: string): Promise<void> {
    await apiClient.delete(`/images/${imageId}`);
  }

  async processImageForTryOn(imageId: string): Promise<UploadedImage> {
    const response = await apiClient.post<ApiResponse<UploadedImage>>(`/images/${imageId}/process`);
    return response.data;
  }

  async createTryOn(request: TryOnRequest): Promise<TryOnResult> {
    const response = await apiClient.post<ApiResponse<TryOnResult>>('/try-on/create', request);
    return response.data;
  }

  async getTryOnResults(): Promise<TryOnResult[]> {
    const response = await apiClient.get<ApiResponse<TryOnResult[]>>('/try-on/results');
    return response.data;
  }

  async getTryOnResult(resultId: string): Promise<TryOnResult> {
    const response = await apiClient.get<ApiResponse<TryOnResult>>(`/try-on/results/${resultId}`);
    return response.data;
  }

  async updateTryOnAdjustments(
    resultId: string,
    adjustments: TryOnRequest['adjustments']
  ): Promise<TryOnResult> {
    const response = await apiClient.put<ApiResponse<TryOnResult>>(`/try-on/results/${resultId}`, {
      adjustments,
    });
    return response.data;
  }

  async deleteTryOnResult(resultId: string): Promise<void> {
    await apiClient.delete(`/try-on/results/${resultId}`);
  }

  async saveTryOnResult(resultId: string): Promise<UploadedImage> {
    const response = await apiClient.post<ApiResponse<UploadedImage>>(`/try-on/results/${resultId}/save`);
    return response.data;
  }

  async shareTryOnResult(resultId: string): Promise<{ shareUrl: string }> {
    const response = await apiClient.post<ApiResponse<{ shareUrl: string }>>(`/try-on/results/${resultId}/share`);
    return response.data;
  }
}

export const imageService = new ImageService();