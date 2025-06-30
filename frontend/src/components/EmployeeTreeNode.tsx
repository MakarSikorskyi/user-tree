import React from 'react';
import { Button, Dropdown, MenuProps } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { TreeNode } from '@/types';

interface EmployeeTreeNodeProps {
  node: TreeNode;
  onEdit: (employeeId: number) => void;
  onDelete: (employeeId: number) => Promise<void>;
}

const EmployeeTreeNode: React.FC<EmployeeTreeNodeProps> = ({ node, onEdit, onDelete }) => {
  const getNodeMenuItems = (): MenuProps['items'] => [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: () => onEdit(node.data.id),
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete(node.data.id),
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '4px',
      }}
    >
      <div>
        <strong>{node.title}</strong>
        {node.data.position && (
          <span style={{ marginLeft: 8, color: '#666' }}>
            - {node.data.position}
          </span>
        )}
      </div>
      <Dropdown
        menu={{ items: getNodeMenuItems() }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Button
          type="text"
          size="small"
          icon={<MoreOutlined />}
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>
    </div>
  );
};

export default EmployeeTreeNode;