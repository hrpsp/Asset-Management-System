import api from './api';
import { ApiResponse, PaginatedResponse, TransferRequest, TransferChecklist } from '../types';

export interface TransferFilters {
  status?: string;
  transfer_type?: string;
  assigned_to?: number;
  page?: number;
  per_page?: number;
}

export interface CreateTransferData {
  allocation_id: number;
  transfer_type: string;
  trigger_reason?: string;
  reason_details?: string;
  deadline_date?: string;
  assigned_to?: number;
  notes?: string;
}

export const transferService = {
  async getAll(filters: TransferFilters = {}): Promise<PaginatedResponse<TransferRequest>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const response = await api.get<PaginatedResponse<TransferRequest>>(`/transfers?${params}`);
    return response.data;
  },

  async getById(id: number): Promise<TransferRequest> {
    const response = await api.get<ApiResponse<TransferRequest>>(`/transfers/${id}`);
    return response.data.data;
  },

  async create(data: CreateTransferData): Promise<TransferRequest> {
    const response = await api.post<ApiResponse<TransferRequest>>('/transfers', data);
    return response.data.data;
  },

  async updateStatus(id: number, status: string, notes?: string): Promise<TransferRequest> {
    const response = await api.patch<ApiResponse<TransferRequest>>(`/transfers/${id}/status`, {
      status,
      notes,
    });
    return response.data.data;
  },

  async updateChecklist(id: number, checklist: TransferChecklist): Promise<TransferRequest> {
    const response = await api.patch<ApiResponse<TransferRequest>>(`/transfers/${id}/checklist`, {
      checklist,
    });
    return response.data.data;
  },

  async getPending(): Promise<TransferRequest[]> {
    const response = await api.get<ApiResponse<TransferRequest[]>>('/transfers/pending');
    return response.data.data;
  },
};
