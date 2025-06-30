import { apiClient } from './apiClient';
import { ApiResponse, LoginResponse } from '@/types';

class AuthService {
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append('username', username);
    urlEncodedData.append('password', password);

    return await apiClient.post<LoginResponse>('/login', urlEncodedData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async verifyToken(): Promise<ApiResponse<{ user: { id: number; username: string } }>> {
    return await apiClient.get('/verify-token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService();
