import React, { useState } from 'react';
import {
  Layout,
  Tree,
  Button,
  Typography,
  Modal,
  Spin,
  Card,
} from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';
import { User } from '@/types';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTreeHeader from '../components/EmployeeTreeHeader';
import EmployeeTreeNode from '../components/EmployeeTreeNode';
import { useEmployeeTree } from '../hooks/useEmployeeTree';
import { useEmployeeOperations } from '../hooks/useEmployeeOperations';

const { Content } = Layout;
const { Title } = Typography;

interface EmployeeTreePageProps {
  user: User | null;
  onLogout: () => void;
}

const EmployeeTreePage: React.FC<EmployeeTreePageProps> = ({ user, onLogout }) => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const {
    treeData,
    loading,
    expandedKeys,
    totalEmployees,
    refreshTree,
    handleExpand,
  } = useEmployeeTree();

  const {
    isModalVisible,
    editingEmployee,
    modalKey,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    handleModalClose,
    handleEmployeeSaved,
  } = useEmployeeOperations({ onEmployeeChanged: refreshTree });

  const renderTreeNode = (node: any) => (
    <EmployeeTreeNode
      key={node.key}
      node={node}
      onEdit={handleEditEmployee}
      onDelete={handleDeleteEmployee}
    />
  );

  return (
    <Layout className="app-layout">
      <EmployeeTreeHeader user={user} onLogout={onLogout} />

      <Content style={{ padding: '24px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Employee Hierarchy
                {totalEmployees !== null && (
                  <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#666', marginLeft: '8px' }}>
                    (Total: {totalEmployees} employees)
                  </span>
                )}
              </Title>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddEmployee}
            >
              Add Employee
            </Button>
          </div>

          <div className="tree-container">
            <Spin spinning={loading}>
              <Tree
                className="employee-tree"
                treeData={treeData}
                expandedKeys={expandedKeys}
                selectedKeys={selectedKeys}
                onExpand={handleExpand}
                onSelect={setSelectedKeys}
                titleRender={renderTreeNode}
                showLine={{ showLeafIcon: false }}
                blockNode
              />
            </Spin>
          </div>
        </Card>
      </Content>

      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <EmployeeForm
          key={modalKey}
          employeeId={editingEmployee}
          onSave={handleEmployeeSaved}
          onCancel={handleModalClose}
        />
      </Modal>
    </Layout>
  );
};

export default EmployeeTreePage;
