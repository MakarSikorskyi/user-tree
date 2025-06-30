import { useState } from 'react';
import { Modal, message } from 'antd';
import { employeeService } from '../services/employeeService';

interface UseEmployeeOperationsReturn {
  isModalVisible: boolean;
  editingEmployee: number | null;
  modalKey: number;
  handleAddEmployee: () => void;
  handleEditEmployee: (employeeId: number) => void;
  handleDeleteEmployee: (employeeId: number) => Promise<void>;
  handleModalClose: () => void;
  handleEmployeeSaved: () => void;
}

interface UseEmployeeOperationsProps {
  onEmployeeChanged: () => Promise<void>;
}

export const useEmployeeOperations = ({ onEmployeeChanged }: UseEmployeeOperationsProps): UseEmployeeOperationsReturn => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<number | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setModalKey(prev => prev + 1);
    setIsModalVisible(true);
  };

  const handleEditEmployee = (employeeId: number) => {
    setEditingEmployee(employeeId);
    setModalKey(prev => prev + 1);
    setIsModalVisible(true);
  };

  const handleDeleteEmployee = async (employeeId: number): Promise<void> => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: 'Delete Employee',
        content: 'Are you sure you want to delete this employee? This action cannot be undone.',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            const response = await employeeService.deleteEmployee(employeeId);
            if (response.success) {
              message.success('Employee deleted successfully');
              await onEmployeeChanged();
            } else {
              message.error(response.message || 'Failed to delete employee');
            }
          } catch (error) {
            console.error('Error deleting employee:', error);
            message.error('Failed to delete employee');
          } finally {
            resolve();
          }
        },
        onCancel: () => {
          resolve();
        },
      });
    });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingEmployee(null);
  };

  const handleEmployeeSaved = async () => {
    setIsModalVisible(false);
    setEditingEmployee(null);
    await onEmployeeChanged();
  };

  return {
    isModalVisible,
    editingEmployee,
    modalKey,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    handleModalClose,
    handleEmployeeSaved,
  };
};