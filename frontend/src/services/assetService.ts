import api from './api';
import type { ApiResponse, PaginatedResponse, Asset } from '../types';

export interface AssetFilters {
  status?: string;
  asset_type?: string;
  client_id?: number;
  brand?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CreateAssetData {
  asset_tag: string;
  asset_type: string;
  brand: string;
  model: string;
  serial_number?: string;
  specifications?: Record<string, string>;
  purchase_date?: string;
  purchase_price?: number;
  vendor?: string;
  warranty_expiry?: string;
  condition_status?: string;
  current_location?: string;
  notes?: string;
}

export const assetService = {
  async getAll(filters: AssetFilters = {}): Promise<PaginatedResponse<Asset>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const response = await api.get<PaginatedResponse<Asset>>(`/assets?${params}`);
    return response.data;
  },

  async getById(id: number): Promise<Asset> {
    const response = await api.get<ApiResponse<Asset>>(`/assets/${id}`);
    return response.data.data;
  },

  async create(data: CreateAssetData): Promise<Asset> {
    const response = await api.post<ApiResponse<Asset>>('/assets', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateAssetData>): Promise<Asset> {
    const response = await api.put<ApiResponse<Asset>>(`/assets/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/assets/${id}`);
  },

  async updateStatus(id: number, status: string): Promise<Asset> {
    const response = await api.patch<ApiResponse<Asset>>(`/assets/${id}/status`, { status });
    return response.data.data;
  },

  async getAvailable(assetType?: string): Promise<Asset[]> {
    const params = assetType ? `?asset_type=${assetType}` : '';
    const response = await api.get<ApiResponse<Asset[]>>(`/assets/available${params}`);
    return response.data.data;
  },

  async getHistory(id: number): Promise<{ asset: Asset; allocations: any[]; repairs: any[] }> {
    const response = await api.get(`/assets/${id}/history`);
    return response.data.data;
  },

  async uploadPhotos(id: number, photos: File[], photoType: string): Promise<void> {
    const formData = new FormData();
    photos.forEach((photo) => formData.append('photos[]', photo));
    formData.append('photo_type', photoType);
    await api.post(`/assets/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async getWarrantyExpiring(days: number = 30): Promise<Asset[]> {
    const response = await api.get<ApiResponse<Asset[]>>(`/assets/warranty-expiring?days=${days}`);
    return response.data.data;
  },
};
