<?php

namespace app\controllers;

use app\services\EmployeeService;
use app\dto\EmployeeDTO;
use app\helpers\ResponseHelper;
use app\exceptions\ValidationException;
use yii\web\NotFoundHttpException;
use yii\web\ConflictHttpException;

class EmployeeController extends BaseApiController
{
    private EmployeeService $employeeService;

    public function __construct($id, $module, $config = [])
    {
        parent::__construct($id, $module, $config);
        $this->employeeService = new EmployeeService();
    }

    public function actionIndex()
    {
        $params = $this->getQueryParams();
        $page = (int)($params['page'] ?? 1);
        $limit = (int)($params['limit'] ?? EmployeeService::DEFAULT_PAGE_SIZE);
        $search = $params['search'] ?? '';

        $result = $this->employeeService->getEmployeesList($page, $limit, $search);
        $employeesData = EmployeeDTO::toArrayList($result['employees']);

        return ResponseHelper::paginated($employeesData, $result['pagination']);
    }

    public function actionTree()
    {
        $params = $this->getQueryParams();
        $parentId = $params['parent_id'] ?? null;

        if ($parentId === '') {
            $parentId = null;
        } elseif ($parentId !== null) {
            $parentId = (int)$parentId;
        }

        $result = $this->employeeService->getEmployeeTree($parentId);

        return ResponseHelper::withMeta($result['data'], $result['meta']);
    }

    public function actionView($id)
    {
        $employee = $this->employeeService->findEmployee((int)$id);
        $employeeData = EmployeeDTO::toArray($employee);

        return ResponseHelper::success($employeeData);
    }

    public function actionCreate()
    {
        try {
            $data = $this->getRequestData();
            $employee = $this->employeeService->createEmployee($data);
            $employeeData = EmployeeDTO::toBasicArray($employee);

            return ResponseHelper::created($employeeData, 'Employee created successfully');
        } catch (ValidationException $e) {
            return ResponseHelper::validationError($e->getErrors());
        } catch (\Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function actionUpdate($id)
    {
        try {
            $data = $this->getRequestData();
            $employee = $this->employeeService->updateEmployee((int)$id, $data);
            $employeeData = EmployeeDTO::toBasicArray($employee);

            return ResponseHelper::success($employeeData, 'Employee updated successfully');
        } catch (NotFoundHttpException $e) {
            return ResponseHelper::notFound($e->getMessage());
        } catch (ValidationException $e) {
            return ResponseHelper::validationError($e->getErrors());
        } catch (\Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function actionDelete($id)
    {
        try {
            $this->employeeService->deleteEmployee((int)$id);
            return ResponseHelper::success(null, 'Employee deleted successfully');
        } catch (NotFoundHttpException $e) {
            return ResponseHelper::notFound($e->getMessage());
        } catch (ConflictHttpException $e) {
            return ResponseHelper::conflict($e->getMessage());
        } catch (\Exception $e) {
            return ResponseHelper::serverError('Failed to delete employee');
        }
    }

}
