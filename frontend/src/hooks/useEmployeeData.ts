import { useState, useEffect } from 'react';
import { message } from 'antd';
import { employeeService } from '../services/employeeService';
import { Employee } from '@/types';

export const useEmployeeData = (employeeId?: number | null) => {
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (employeeId) {
      loadEmployee();
    }
  }, [employeeId]);

  const loadEmployee = async () => {
    if (!employeeId) return;

    setLoading(true);
    try {
      const response = await employeeService.getEmployee(employeeId);
      if (response.success && response.data) {
        setEmployee(response.data);
      } else {
        message.error(response.message || 'Failed to load employee data');
      }
    } catch (error) {
      console.error('Error loading employee:', error);
      message.error('Failed to load employee data');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    employee,
    refetch: loadEmployee,
  };
};