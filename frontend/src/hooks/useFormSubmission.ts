import { useState } from 'react';
import { FormInstance, message } from 'antd';
import { employeeService } from '../services/employeeService';
import { EmployeeFormData } from '@/types';

interface UseFormSubmissionProps {
  employeeId?: number | null;
  form: FormInstance;
  onSuccess: () => void;
}

export const useFormSubmission = ({ employeeId, form, onSuccess }: UseFormSubmissionProps) => {
  const [saving, setSaving] = useState(false);

  const handleValidationErrors = (errors: Record<string, string[]>) => {
    const formErrors = Object.keys(errors).map(name => ({
      name,
      errors: errors[name],
    }));
    form.setFields(formErrors);
  };

  const handleSubmit = async (values: EmployeeFormData) => {
    setSaving(true);
    try {
      const response = employeeId
        ? await employeeService.updateEmployee(employeeId, values)
        : await employeeService.createEmployee(values);

      if (response.success) {

        message.success(
          employeeId 
            ? 'Employee updated successfully' 
            : 'Employee created successfully'
        );
        onSuccess();
      } else {
        if (response.errors) {
          handleValidationErrors(response.errors);
        } else {
          message.error(response.message || 'Failed to save employee');
        }
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      message.error('Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    handleSubmit,
  };
};