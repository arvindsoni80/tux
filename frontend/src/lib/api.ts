// API client
import axios from 'axios';
import { PRData, APIResponse } from '@/types/pr.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPR = async (prUrl: string): Promise<PRData> => {
  try {
    const response = await apiClient.post<APIResponse>('/api/pr/fetch', {
      prUrl,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch PR data');
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      throw new Error(`Failed to fetch PR: ${message}`);
    }
    throw error;
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/api/pr/health');
    return response.data.success;
  } catch (error) {
    return false;
  }
};