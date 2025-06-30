import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { employeeService } from '../services/employeeService';
import { TreeNode } from '@/types';

interface UseEmployeeTreeReturn {
  treeData: TreeNode[];
  loading: boolean;
  expandedKeys: React.Key[];
  totalEmployees: number | null;
  setExpandedKeys: (keys: React.Key[]) => void;
  loadTreeData: (parentId?: number | null) => Promise<void>;
  refreshTree: () => Promise<void>;
  onLoadData: (info: { key: React.Key; children?: any[] }) => Promise<void>;
  handleExpand: (newExpandedKeys: React.Key[], info: any) => void;
}

export const useEmployeeTree = (): UseEmployeeTreeReturn => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);
  const [loadingNodes, setLoadingNodes] = useState<Set<React.Key>>(new Set());

  const updateTreeData = useCallback((data: TreeNode[], key: number, children: TreeNode[]): TreeNode[] => {
    return data.map(node => {
      if (node.data.id === key) {
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
      }
      return node;
    });
  }, []);

  const loadTreeData = useCallback(async (parentId?: number | null): Promise<void> => {
    setLoading(true);
    try {
      const response = await employeeService.getEmployeeTree({
        parent_id: parentId,
      });

      if (response.success && response.data) {
        if (parentId === undefined || parentId === null) {
          setTreeData(response.data);
          if (response.meta?.total_employees !== undefined) {
            setTotalEmployees(response.meta.total_employees);
          }
        } else {
          setTreeData(prevData => updateTreeData(prevData, parentId, response.data || []));
        }

        if (response.meta?.execution_time_ms) {
          console.log(`Tree loaded in ${response.meta.execution_time_ms}ms`);
        }
      } else {
        message.error(response.message || 'Failed to load employee tree');
      }
    } catch (error) {
      console.error('Error loading tree data:', error);
      message.error('Failed to load employee tree');
    } finally {
      setLoading(false);
    }
  }, [updateTreeData]);

  const refreshTree = useCallback(async (): Promise<void> => {
    const currentExpandedKeys = expandedKeys;
    await loadTreeData(null);
    setExpandedKeys(currentExpandedKeys);
  }, [expandedKeys, loadTreeData]);

  const onLoadData = useCallback(({ key, children }: { key: React.Key; children?: any[] }): Promise<void> => {
    return new Promise((resolve) => {
      if (children && children.length > 0) {
        resolve();
        return;
      }

      if (loadingNodes.has(key)) {
        resolve();
        return;
      }

      const nodeId = parseInt(key.toString());
      setLoadingNodes(prev => new Set(prev).add(key));

      loadTreeData(nodeId).then(() => {
        setLoadingNodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
        resolve();
      });
    });
  }, [loadTreeData, loadingNodes]);

  const handleExpand = useCallback((newExpandedKeys: React.Key[], info: any) => {
    setExpandedKeys(newExpandedKeys);
    console.log('onExpand', info);

    if (info.expanded) {
      const nodeKey = info.node.key;
      const nodeChildren = info.node.children;

      if (!nodeChildren || nodeChildren.length === 0) {
        const nodeId = parseInt(nodeKey.toString());
        console.log(`Expanding node ${nodeId}, loading children...`);

        if (!loadingNodes.has(nodeKey)) {
          setLoadingNodes(prev => new Set(prev).add(nodeKey));
          loadTreeData(nodeId).then(() => {
            setLoadingNodes(prev => {
              const newSet = new Set(prev);
              newSet.delete(nodeKey);
              return newSet;
            });
          });
        }
      }
    }
  }, [loadTreeData, loadingNodes]);

  useEffect(() => {
    loadTreeData(null);
  }, [loadTreeData]);

  return {
    treeData,
    loading,
    expandedKeys,
    totalEmployees,
    setExpandedKeys,
    loadTreeData,
    refreshTree,
    onLoadData,
    handleExpand,
  };
};
