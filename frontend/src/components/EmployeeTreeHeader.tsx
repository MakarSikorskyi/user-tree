import React from 'react';
import { Layout, Typography, Dropdown, Button, MenuProps } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { User } from '@/types';

const { Header } = Layout;
const { Title } = Typography;

interface EmployeeTreeHeaderProps {
  user: User | null;
  onLogout: () => void;
}

const EmployeeTreeHeader: React.FC<EmployeeTreeHeaderProps> = ({ user, onLogout }) => {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: onLogout,
    },
  ];

  return (
    <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          Employee Management System
        </Title>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Button type="text" icon={<UserOutlined />}>
            {user?.username}
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
};

export default EmployeeTreeHeader;