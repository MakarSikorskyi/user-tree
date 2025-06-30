import React from 'react';
import { Form, Select, Spin, Button } from 'antd';
import { Employee } from '@/types';

const { Option } = Select;

interface ManagerSelectFieldProps {
  managers: Employee[];
  loading: boolean;
  searching: boolean;
  hasMore: boolean;
  totalCount: number;
  onSearch: (value: string) => void;
  onLoadMore: () => void;
}

export const ManagerSelectField: React.FC<ManagerSelectFieldProps> = ({
  managers,
  loading,
  searching,
  hasMore,
  totalCount,
  onSearch,
  onLoadMore,
}) => {
  const isLoading = loading || searching;

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { target } = e;
    const element = target as HTMLDivElement;

    if (element.scrollTop + element.offsetHeight >= element.scrollHeight - 10) {
      if (hasMore && !isLoading) {
        onLoadMore();
      }
    }
  };

  const getNotFoundContent = () => {
    if (isLoading) {
      return <Spin size="small" />;
    }

    if (managers.length === 0) {
      return 'No managers found';
    }

    return null;
  };

  const getDropdownRender = (menu: React.ReactElement) => (
    <div>
      {menu}
      {hasMore && !isLoading && managers.length > 0 && (
        <div style={{ padding: '8px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
          <Button 
            type="link" 
            size="small" 
            onClick={onLoadMore}
            style={{ padding: 0 }}
          >
            Load more managers...
          </Button>
        </div>
      )}
      {isLoading && managers.length > 0 && (
        <div style={{ padding: '8px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
          <Spin size="small" />
        </div>
      )}
      {totalCount > 0 && (
        <div style={{ 
          padding: '4px 8px', 
          fontSize: '12px', 
          color: '#999', 
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          Showing {managers.length} of {totalCount} managers
        </div>
      )}
    </div>
  );

  return (
    <Form.Item
      name="manager_id"
      label="Manager"
    >
      <Select
        placeholder="Select manager (optional)"
        allowClear
        showSearch
        loading={isLoading && managers.length === 0}
        filterOption={false}
        onSearch={onSearch}
        onPopupScroll={handlePopupScroll}
        dropdownRender={getDropdownRender}
        notFoundContent={getNotFoundContent()}
      >
        {managers.map(manager => (
          <Option key={manager.id} value={manager.id}>
            {manager.full_name} {manager.position && `- ${manager.position}`}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};
