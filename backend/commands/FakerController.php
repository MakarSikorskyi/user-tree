<?php

namespace app\commands;

use yii\console\Controller;
use yii\console\ExitCode;
use Faker\Factory;
use app\models\Employee;

class FakerController extends Controller
{
    public function actionSeed($seeder = 'EmployeeSeeder', $count = 10000)
    {
        if ($seeder === 'EmployeeSeeder') {
            return $this->seedEmployees($count);
        }
        
        $this->stdout("Unknown seeder: $seeder\n");
        return ExitCode::DATAERR;
    }

    private function seedEmployees($count)
    {
        $this->stdout("Starting to seed $count employees...\n");

        $this->stdout("Clearing existing employee data...\n");
        Employee::deleteAll();
        
        $faker = Factory::create();
        $employees = [];
        $managers = [];

        $managerCount = (int)($count * 0.3);
        $regularEmployeeCount = $count - $managerCount;
        
        $this->stdout("Creating $managerCount managers and $regularEmployeeCount regular employees...\n");

        $rootManagersCount = min(5, $managerCount);
        for ($i = 0; $i < $rootManagersCount; $i++) {
            $employee = $this->createEmployee($faker, null, true);
            if ($employee->save()) {
                $employees[] = $employee;
                $managers[1][] = $employee->id;
                $this->stdout("Created root manager: {$employee->getFullName()}\n");
            }
        }
        
        $remainingManagers = $managerCount - $rootManagersCount;
        $currentLevel = 2;
        $maxLevel = rand(5, 8);

        while ($remainingManagers > 0 && $currentLevel <= $maxLevel && !empty($managers[$currentLevel - 1])) {
            $parentLevel = $currentLevel - 1;
            $managersAtThisLevel = min($remainingManagers, count($managers[$parentLevel]) * rand(2, 4));
            
            if ($managersAtThisLevel <= 0) {
                break;
            }
            
            $this->stdout("Creating $managersAtThisLevel managers at level $currentLevel...\n");
            
            for ($i = 0; $i < $managersAtThisLevel; $i++) {
                $parentId = $managers[$parentLevel][array_rand($managers[$parentLevel])];
                $employee = $this->createEmployee($faker, $parentId, true);
                
                if ($employee->save()) {
                    $employees[] = $employee;
                    $managers[$currentLevel][] = $employee->id;
                    $remainingManagers--;
                }
            }
            
            $currentLevel++;
        }

        $this->stdout("Creating regular employees...\n");
        $allManagerIds = [];
        foreach ($managers as $level => $levelManagers) {
            $allManagerIds = array_merge($allManagerIds, $levelManagers);
        }
        
        $batchSize = 1000;
        $created = 0;
        
        for ($i = 0; $i < $regularEmployeeCount; $i++) {
            $managerId = $allManagerIds[array_rand($allManagerIds)];
            $employee = $this->createEmployee($faker, $managerId, false);
            
            if ($employee->save()) {
                $employees[] = $employee;
                $created++;
                
                if ($created % $batchSize === 0) {
                    $this->stdout("Created $created regular employees...\n");
                }
            }
        }
        
        $totalCreated = count($employees);
        $this->stdout("Successfully created $totalCreated employees!\n");
        $this->stdout("Hierarchy levels: " . count($managers) . "\n");
        
        foreach ($managers as $level => $levelManagers) {
            $this->stdout("Level $level: " . count($levelManagers) . " managers\n");
        }
        
        return ExitCode::OK;
    }

    private function createEmployee($faker, $managerId = null, $isManager = false)
    {
        $employee = new Employee();
        
        $employee->first_name = $faker->firstName;
        $employee->last_name = $faker->lastName;
        $employee->email = $faker->unique()->email;
        $employee->manager_id = $managerId;

        if ($isManager) {
            $managerPositions = [
                'CEO', 'CTO', 'CFO', 'VP Engineering', 'VP Sales', 'VP Marketing',
                'Director of Engineering', 'Director of Sales', 'Director of Marketing',
                'Engineering Manager', 'Sales Manager', 'Marketing Manager',
                'Team Lead', 'Senior Manager', 'Department Head', 'Project Manager'
            ];
            $employee->position = $faker->randomElement($managerPositions);
        } else {
            $regularPositions = [
                'Software Engineer', 'Senior Software Engineer', 'Frontend Developer',
                'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
                'QA Engineer', 'Data Analyst', 'Product Manager', 'UX Designer',
                'UI Designer', 'Business Analyst', 'Sales Representative',
                'Marketing Specialist', 'HR Specialist', 'Accountant',
                'Customer Support', 'Technical Writer', 'System Administrator'
            ];
            $employee->position = $faker->randomElement($regularPositions);
        }

        if ($faker->boolean(70)) {
            $employee->home_phone = $faker->phoneNumber;
        }
        
        if ($faker->boolean(30)) {
            $employee->notes = $faker->sentence(rand(5, 15));
        }
        
        return $employee;
    }

    public function actionClear()
    {
        $this->stdout("Clearing all employee data...\n");
        $count = Employee::deleteAll();
        $this->stdout("Deleted $count employees.\n");
        
        return ExitCode::OK;
    }

    public function actionStats()
    {
        $total = Employee::find()->count();
        $managers = Employee::find()->where(['!=', 'manager_id', null])->count();
        $rootEmployees = Employee::find()->where(['manager_id' => null])->count();
        
        $this->stdout("Employee Statistics:\n");
        $this->stdout("Total employees: $total\n");
        $this->stdout("Root employees (no manager): $rootEmployees\n");
        $this->stdout("Employees with managers: $managers\n");

        $levels = [];
        $this->calculateLevels($levels);
        
        $this->stdout("\nHierarchy levels:\n");
        foreach ($levels as $level => $count) {
            $this->stdout("Level $level: $count employees\n");
        }
        
        return ExitCode::OK;
    }

    private function calculateLevels(&$levels, $parentId = null, $level = 1)
    {
        $employees = Employee::find()->where(['manager_id' => $parentId])->all();
        
        if (!empty($employees)) {
            $levels[$level] = ($levels[$level] ?? 0) + count($employees);
            
            foreach ($employees as $employee) {
                $this->calculateLevels($levels, $employee->id, $level + 1);
            }
        }
    }
}