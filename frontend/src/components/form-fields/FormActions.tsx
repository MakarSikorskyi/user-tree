import React from 'react';
import { Form, Button, Space } from 'antd';

interface FormActionsProps {
  onCancel: () => void;
  saving: boolean;
  isEditing: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  saving,
  isEditing,
}) => {
  return (
    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
      <Space>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={saving}
        >
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </Space>
    </Form.Item>
  );
};