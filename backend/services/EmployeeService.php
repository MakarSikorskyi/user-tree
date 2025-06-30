<?php

namespace app\services;

use app\models\Employee;
use app\exceptions\ValidationException;
use yii\web\NotFoundHttpException;
use yii\web\ConflictHttpException;

class EmployeeService
{
    const DEFAULT_PAGE_SIZE = 50;
    const MIN_PAGE_SIZE = 10;
    const MAX_PAGE_SIZE = 100;

    public function getEmployeesList(int $page = 1, int $limit = self::DEFAULT_PAGE_SIZE, string $search = ''): array
    {
        $page = max(1, $page);
        $limit = min(self::MAX_PAGE_SIZE, max(self::MIN_PAGE_SIZE, $limit));
        $search = trim($search);

        $query = Employee::find()->orderBy(['last_name' => SORT_ASC, 'first_name' => SORT_ASC]);

        if (!empty($search)) {
            $query = $this->applySearchFilter($query, $search);
        }

        $totalCount = $query->count();
        $totalPages = ceil($totalCount / $limit);
        $offset = ($page - 1) * $limit;

        $employees = $query->offset($offset)->limit($limit)->all();

        return [
            'employees' => $employees,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total_count' => $totalCount,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1
            ]
        ];
    }

    public function getEmployeeTree(?int $parentId = null): array
    {
        $startTime = microtime(true);
        $treeData = Employee::getTreeData($parentId);
        $executionTime = (microtime(true) - $startTime) * 1000;

        $totalEmployees = null;
        if ($parentId === null) {
            $totalEmployees = Employee::getTotalCount();
        }

        return [
            'data' => $treeData,
            'meta' => [
                'execution_time_ms' => round($executionTime, 2),
                'parent_id' => $parentId,
                'total_employees' => $totalEmployees,
            ]
        ];
    }

    public function findEmployee(int $id): Employee
    {
        $employee = Employee::findOne($id);
        if ($employee === null) {
            throw new NotFoundHttpException('Employee not found');
        }
        return $employee;
    }

    public function createEmployee(array $data): Employee
    {
        $employee = new Employee();
        $this->populateEmployeeData($employee, $data);

        if (!$employee->save()) {
            throw new ValidationException('Validation failed', $employee->errors);
        }

        return $employee;
    }

    public function updateEmployee(int $id, array $data): Employee
    {
        $employee = $this->findEmployee($id);
        $this->populateEmployeeData($employee, $data, true);

        if (!$employee->save()) {
            throw new ValidationException('Validation failed', $employee->errors);
        }

        return $employee;
    }

    public function deleteEmployee(int $id): bool
    {
        $employee = $this->findEmployee($id);

        if ($employee->hasSubordinates()) {
            throw new ConflictHttpException('Cannot delete employee with subordinates');
        }

        return $employee->delete() !== false;
    }

    private function applySearchFilter($query, string $search)
    {
        return $query->andWhere([
            'or',
            ['like', 'first_name', $search],
            ['like', 'last_name', $search],
            ['like', 'email', $search],
            ['like', 'position', $search],
            ['like', "CONCAT(first_name, ' ', last_name)", $search]
        ]);
    }

    private function populateEmployeeData(Employee $employee, array $data, bool $isUpdate = false): void
    {
        $employee->first_name = $data['first_name'] ?? ($isUpdate ? $employee->first_name : null);
        $employee->last_name = $data['last_name'] ?? ($isUpdate ? $employee->last_name : null);
        $employee->position = $data['position'] ?? null;
        $employee->email = $data['email'] ?? ($isUpdate ? $employee->email : null);
        $employee->home_phone = $data['home_phone'] ?? null;
        $employee->notes = $data['notes'] ?? null;
        $employee->manager_id = !empty($data['manager_id']) ? (int)$data['manager_id'] : null;
    }
}
