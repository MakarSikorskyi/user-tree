import React, { useEffect } from 'react';
import { Form, Spin } from 'antd';
import { useEmployeeData } from '../hooks/useEmployeeData';
import { useManagerSearch } from '../hooks/useManagerSearch';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { EmployeeBasicFields } from './form-fields/EmployeeBasicFields';
import { ManagerSelectField } from './form-fields/ManagerSelectField';
import { FormActions } from './form-fields/FormActions';

interface EmployeeFormProps {
  employeeId?: number | null;
  onSave: () => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employeeId,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const { loading, employee } = useEmployeeData(employeeId);
  const { 
    managers, 
    loading: managersLoading, 
    searching, 
    hasMore, 
    totalCount, 
    searchManagers, 
    loadMoreManagers 
  } = useManagerSearch(employeeId);
  const { saving, handleSubmit } = useFormSubmission({
    employeeId,
    form,
    onSuccess: onSave,
  });

  useEffect(() => {
    form.resetFields();
  }, [employeeId, form]);

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        first_name: employee.first_name,
        last_name: employee.last_name,
        position: employee.position,
        email: employee.email,
        home_phone: employee.home_phone,
        notes: employee.notes,
        manager_id: employee.manager_id,
      });
    }
  }, [employee, form]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="employee-form"
    >
      <EmployeeBasicFields />

      <ManagerSelectField
        managers={managers}
        loading={managersLoading}
        searching={searching}
        hasMore={hasMore}
        totalCount={totalCount}
        onSearch={searchManagers}
        onLoadMore={loadMoreManagers}
      />

      <FormActions
        onCancel={onCancel}
        saving={saving}
        isEditing={!!employeeId}
      />
    </Form>
  );
};

export default EmployeeForm;
