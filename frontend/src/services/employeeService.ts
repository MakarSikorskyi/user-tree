import { apiClient } from './apiClient';
import {
  ApiResponse,
  Employee,
  EmployeeFormData,
  TreeNode,
  TreeParams,
} from '@/types';

class EmployeeService {

  async getEmployees(params?: {
    page?: number;
    limit?: number;
    search?: string;
    signal?: AbortSignal;
  }): Promise<ApiResponse<Employee[]>> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const url = `/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<Employee[]>(url, {
      signal: params?.signal
    });
  }

  async getEmployeeTree(params?: TreeParams): Promise<ApiResponse<TreeNode[]>> {
    const queryParams = new URLSearchParams();

    if (params?.parent_id !== undefined) {
      queryParams.append('parent_id', params.parent_id?.toString() || '');
    }

    const url = `/employees/tree${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<TreeNode[]>(url);
  }

  async getEmployee(id: number): Promise<ApiResponse<Employee>> {
    return await apiClient.get<Employee>(`/employees/${id}`);
  }

  async createEmployee(data: EmployeeFormData): Promise<ApiResponse<Employee>> {
    const urlEncodedData = new URLSearchParams();
    Object.keys(data).forEach(key => {
      const value = data[key as keyof EmployeeFormData];
      if (value !== null && value !== undefined) {
        urlEncodedData.append(key, value.toString());
      }
    });

    return await apiClient.post<Employee>('/employees', urlEncodedData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async updateEmployee(id: number, data: Partial<EmployeeFormData>): Promise<ApiResponse<Employee>> {
    const urlEncodedData = new URLSearchParams();
    Object.keys(data).forEach(key => {
      const value = data[key as keyof EmployeeFormData];
      if (value !== null && value !== undefined) {
        urlEncodedData.append(key, value.toString());
      }
    });

    return await apiClient.put<Employee>(`/employees/${id}`, urlEncodedData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async deleteEmployee(id: number): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(`/employees/${id}`);
  }
}

export const employeeService = new EmployeeService();
