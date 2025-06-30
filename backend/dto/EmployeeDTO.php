<?php

namespace app\dto;

use app\models\Employee;

class EmployeeDTO
{
    public static function toArray(Employee $employee, bool $includeRelations = true): array
    {
        $data = [
            'id' => $employee->id,
            'first_name' => $employee->first_name,
            'last_name' => $employee->last_name,
            'full_name' => $employee->getFullName(),
            'position' => $employee->position,
            'email' => $employee->email,
            'home_phone' => $employee->home_phone,
            'notes' => $employee->notes,
            'manager_id' => $employee->manager_id,
            'created_at' => $employee->created_at,
            'updated_at' => $employee->updated_at,
        ];

        if ($includeRelations) {
            $data['manager_name'] = $employee->manager ? $employee->manager->getFullName() : null;
            $data['subordinates_count'] = $employee->getSubordinates()->count();
        }

        return $data;
    }

    public static function toArrayList(array $employees, bool $includeRelations = true): array
    {
        return array_map(function (Employee $employee) use ($includeRelations) {
            return self::toArray($employee, $includeRelations);
        }, $employees);
    }

    public static function toBasicArray(Employee $employee): array
    {
        return self::toArray($employee, false);
    }
}