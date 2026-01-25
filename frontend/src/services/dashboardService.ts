import api from './api';
import type { ApiResponse, DashboardStats } from '../types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data;
  },

  async getRecentActivity(): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/dashboard/recent-activity');
    return response.data.data;
  },

  async getAlerts(): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/dashboard/alerts');
    return response.data.data;
  },

  async getAssetsByClient(): Promise<{ client: string; code: string; count: number }[]> {
    const response = await api.get<ApiResponse<any[]>>('/dashboard/assets-by-client');
    return response.data.data;
  },
};
