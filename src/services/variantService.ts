import BaseService from './baseService';
import { API_ENDPOINTS } from '../constants/appConstants';
import { ApiResponse } from '../types/api';

interface Variant {
  id: string;
  type: 'size' | 'metal' | 'stone';
  value: string;
}

class VariantService extends BaseService {
  async getVariants(): Promise<ApiResponse<Variant[]>> {
    return this.get<Variant[]>(API_ENDPOINTS.VARIANTS);
  }

  async createVariant(variant: { type: 'size' | 'metal' | 'stone'; value: string }): Promise<ApiResponse<Variant>> {
    return this.post<Variant>(API_ENDPOINTS.CREATE_VARIANT, variant, true);
  }
}

export const variantService = new VariantService();