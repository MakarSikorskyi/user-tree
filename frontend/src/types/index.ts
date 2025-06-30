export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  position?: string;
  email: string;
  home_phone?: string;
  notes?: string;
  manager_id?: number;
  manager_name?: string;
  subordinates_count?: number;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  position?: string;
  email: string;
  home_phone?: string;
  notes?: string;
  manager_id?: number;
}

export interface TreeNode {
  key: string;
  title: string;
  data: {
    id: number;
    first_name: string;
    last_name: string;
    position?: string;
    email: string;
    manager_id?: number;
    subordinates_count?: number;
  };
  isLeaf: boolean;
  children?: TreeNode[] | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: {
    execution_time_ms?: number;
    parent_id?: number | null;
    total_employees?: number | null;
  };
  pagination?: {
    page: number;
    limit: number;
    total_count: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export interface User {
  id: number;
  username: string;
}

export interface TreeParams {
  parent_id?: number | null;
}
