import api from './api';
import { ApiResponse, PaginatedResponse, Employee, Allocation } from '../types';

export interface EmployeeFilters {
  client_id?: number;
  employment_status?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CreateEmployeeData {
  employee_code: string;
  name: string;
  cnic?: string;
  email?: string;
  phone?: string;
  client_id: number;
  department?: string;
  designation?: string;
  employment_status?: string;
  joining_date?: string;
}

export const employeeService = {
  async getAll(filters: EmployeeFilters = {}): Promise<PaginatedResponse<Employee>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const response = await api.get<PaginatedResponse<Employee>>(`/employees?${params}`);
    return response.data;
  },

  async getById(id: number): Promise<Employee> {
    const response = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data.data;
  },

  async create(data: CreateEmployeeData): Promise<Employee> {
    const response = await api.post<ApiResponse<Employee>>('/employees', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateEmployeeData>): Promise<Employee> {
    const response = await api.put<ApiResponse<Employee>>(`/employees/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/employees/${id}`);
  },

  async getAssets(id: number): Promise<Allocation[]> {
    const response = await api.get<ApiResponse<Allocation[]>>(`/employees/${id}/assets`);
    return response.data.data;
  },

  async getActive(clientId?: number): Promise<Employee[]> {
    const params = clientId ? `?client_id=${clientId}` : '';
    const response = await api.get<ApiResponse<Employee[]>>(`/employees/active${params}`);
    return response.data.data;
  },
};
