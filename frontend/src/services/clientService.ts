import api from './api';
import { ApiResponse, Client, Asset } from '../types';

export interface CreateClientData {
  name: string;
  code: string;
  contract_reference?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  asset_policies?: Record<string, any>;
  notes?: string;
}

export const clientService = {
  async getAll(search?: string, isActive?: boolean): Promise<Client[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (isActive !== undefined) params.append('is_active', String(isActive));
    const response = await api.get<ApiResponse<Client[]>>(`/clients?${params}`);
    return response.data.data;
  },

  async getById(id: number): Promise<Client> {
    const response = await api.get<ApiResponse<Client>>(`/clients/${id}`);
    return response.data.data;
  },

  async create(data: CreateClientData): Promise<Client> {
    const response = await api.post<ApiResponse<Client>>('/clients', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateClientData>): Promise<Client> {
    const response = await api.put<ApiResponse<Client>>(`/clients/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clients/${id}`);
  },

  async getAssets(id: number): Promise<Asset[]> {
    const response = await api.get<ApiResponse<Asset[]>>(`/clients/${id}/assets`);
    return response.data.data;
  },

  async uploadDocument(id: number, file: File, documentType: 'sla' | 'tor'): Promise<Client> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_type', documentType);
    const response = await api.post<ApiResponse<Client>>(`/clients/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
