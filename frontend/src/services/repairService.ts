import api from './api';
import { ApiResponse, PaginatedResponse, RepairRequest } from '../types';

export interface RepairFilters {
  status?: string;
  priority?: string;
  issue_category?: string;
  asset_id?: number;
  page?: number;
  per_page?: number;
}

export interface CreateRepairData {
  asset_id: number;
  reported_by: string;
  reported_date: string;
  issue_description: string;
  issue_category: string;
  priority?: string;
}

export interface UpdateRepairStatusData {
  status: string;
  diagnosis_notes?: string;
  repair_vendor?: string;
  repair_description?: string;
  repair_cost?: number;
  resolution_notes?: string;
  assigned_to?: number;
  is_warranty_claim?: boolean;
  warranty_claim_status?: string;
}

export const repairService = {
  async getAll(filters: RepairFilters = {}): Promise<PaginatedResponse<RepairRequest>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const response = await api.get<PaginatedResponse<RepairRequest>>(`/repairs?${params}`);
    return response.data;
  },

  async getById(id: number): Promise<RepairRequest> {
    const response = await api.get<ApiResponse<RepairRequest>>(`/repairs/${id}`);
    return response.data.data;
  },

  async create(data: CreateRepairData): Promise<RepairRequest> {
    const response = await api.post<ApiResponse<RepairRequest>>('/repairs', data);
    return response.data.data;
  },

  async updateStatus(id: number, data: UpdateRepairStatusData): Promise<RepairRequest> {
    const response = await api.patch<ApiResponse<RepairRequest>>(`/repairs/${id}/status`, data);
    return response.data.data;
  },

  async getQueue(): Promise<RepairRequest[]> {
    const response = await api.get<ApiResponse<RepairRequest[]>>('/repairs/queue');
    return response.data.data;
  },

  async issueSpare(id: number, spareAssetId: number): Promise<RepairRequest> {
    const response = await api.post<ApiResponse<RepairRequest>>(`/repairs/${id}/spare`, {
      spare_asset_id: spareAssetId,
    });
    return response.data.data;
  },

  async getAssetHistory(assetId: number): Promise<RepairRequest[]> {
    const response = await api.get<ApiResponse<RepairRequest[]>>(`/assets/${assetId}/repairs`);
    return response.data.data;
  },
};
