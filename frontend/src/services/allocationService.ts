import api from './api';
import type { ApiResponse, PaginatedResponse, Allocation } from '../types';

export interface AllocationFilters {
  is_active?: boolean;
  allocation_type?: string;
  client_id?: number;
  employee_id?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CreateAllocationData {
  asset_id: number;
  employee_id: number;
  client_id: number;
  allocation_type: 'Installment' | 'Rental';
  allocation_date: string;
  handover_condition: string;
  handover_notes?: string;
  // Installment fields
  total_amount?: number;
  down_payment?: number;
  number_of_installments?: number;
  start_date?: string;
  // Rental fields
  monthly_rental?: number;
  billing_day?: number;
  security_deposit?: number;
  rental_start_date?: string;
  minimum_period_months?: number;
}

export interface ReturnData {
  return_date: string;
  return_condition: string;
  return_notes?: string;
  asset_status: 'Available' | 'In Repair' | 'Retired';
  deposit_status?: 'Returned' | 'Forfeited' | 'Adjusted';
}

export const allocationService = {
  async getAll(filters: AllocationFilters = {}): Promise<PaginatedResponse<Allocation>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const response = await api.get<PaginatedResponse<Allocation>>(`/allocations?${params}`);
    return response.data;
  },

  async getById(id: number): Promise<Allocation> {
    const response = await api.get<ApiResponse<Allocation>>(`/allocations/${id}`);
    return response.data.data;
  },

  async create(data: CreateAllocationData): Promise<Allocation> {
    const response = await api.post<ApiResponse<Allocation>>('/allocations', data);
    return response.data.data;
  },

  async processReturn(id: number, data: ReturnData): Promise<Allocation> {
    const response = await api.post<ApiResponse<Allocation>>(`/allocations/${id}/return`, data);
    return response.data.data;
  },

  async uploadPhotos(id: number, photos: File[], photoType: 'Handover' | 'Return'): Promise<void> {
    const formData = new FormData();
    photos.forEach((photo) => formData.append('photos[]', photo));
    formData.append('photo_type', photoType);
    await api.post(`/allocations/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
