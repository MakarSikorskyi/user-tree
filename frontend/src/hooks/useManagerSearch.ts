import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import { Employee } from '@/types';

interface PaginationState {
  page: number;
  hasMore: boolean;
  totalCount: number;
}

export const useManagerSearch = (currentEmployeeId?: number | null) => {
  const [managers, setManagers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    hasMore: true,
    totalCount: 0,
  });
  const [currentSearch, setCurrentSearch] = useState<string>('');

  useEffect(() => {
    loadInitialManagers();
  }, [currentEmployeeId]);

  const filterAvailableManagers = (employees: Employee[]) => {
    return employees.filter(emp => emp.id !== currentEmployeeId);
  };

  const loadInitialManagers = async () => {
    setLoading(true);
    setManagers([]);

    try {
      const response = await employeeService.getEmployees({
        page: 1,
        limit: 50,
      });

      if (response.success && response.data) {
        const availableManagers = filterAvailableManagers(response.data);
        setManagers(availableManagers);

        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            hasMore: response.pagination.has_next,
            totalCount: response.pagination.total_count,
          });
        }
      }
    } catch (error: any) {
      console.error('Error loading managers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreManagers = async () => {
    if (!pagination.hasMore || loading || searching) {
      return;
    }

    setLoading(true);

    try {
      const response = await employeeService.getEmployees({
        page: pagination.page + 1,
        limit: 50,
        search: currentSearch || undefined,
      });

      if (response.success && response.data) {
        const availableManagers = filterAvailableManagers(response.data);
        setManagers(prev => [...prev, ...availableManagers]);

        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            hasMore: response.pagination.has_next,
            totalCount: response.pagination.total_count,
          });
        }
      }
    } catch (error: any) {
      console.error('Error loading more managers:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchManagers = useCallback(async (search: string) => {
    setCurrentSearch(search);
    setSearching(true);
    setManagers([]);

    try {
      const response = await employeeService.getEmployees({
        page: 1,
        limit: 50,
        search: search || undefined,
      });

      if (response.success && response.data) {
        const availableManagers = filterAvailableManagers(response.data);
        setManagers(availableManagers);

        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            hasMore: response.pagination.has_next,
            totalCount: response.pagination.total_count,
          });
        }
      }
    } catch (error: any) {
      console.error('Error searching managers:', error);
    } finally {
      setSearching(false);
    }
  }, [currentEmployeeId]);

  return {
    managers,
    loading,
    searching,
    hasMore: pagination.hasMore,
    totalCount: pagination.totalCount,
    searchManagers,
    loadMoreManagers,
  };
};
