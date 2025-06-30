<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\db\Query;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "employee".
 *
 * @property int $id
 * @property string $first_name
 * @property string $last_name
 * @property string|null $position
 * @property string $email
 * @property string|null $home_phone
 * @property string|null $notes
 * @property int|null $manager_id
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Employee $manager
 * @property Employee[] $subordinates
 */
class Employee extends ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'employee';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['first_name', 'last_name', 'email'], 'required'],
            [['manager_id'], 'integer'],
            [['notes'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['first_name', 'last_name', 'position'], 'string', 'max' => 64],
            [['email'], 'string', 'max' => 128],
            [['home_phone'], 'string', 'max' => 32],
            [['email'], 'unique'],
            [['email'], 'email'],
            [['manager_id'], 'exist', 'skipOnError' => true, 'targetClass' => Employee::class, 'targetAttribute' => ['manager_id' => 'id']],
            [['manager_id'], 'validateManagerHierarchy'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'position' => 'Position',
            'email' => 'Email',
            'home_phone' => 'Home Phone',
            'notes' => 'Notes',
            'manager_id' => 'Manager ID',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }

    /**
     * Validate manager hierarchy to prevent circular references
     */
    public function validateManagerHierarchy($attribute, $params)
    {
        if ($this->manager_id && !$this->isNewRecord) {
            if ($this->manager_id == $this->id) {
                $this->addError($attribute, 'Employee cannot be their own manager.');
                return;
            }

            // Check for circular reference
            $managerId = $this->manager_id;
            $visited = [$this->id];

            while ($managerId) {
                if (in_array($managerId, $visited)) {
                    $this->addError($attribute, 'Circular reference detected in management hierarchy.');
                    return;
                }

                $visited[] = $managerId;
                $manager = static::findOne($managerId);
                $managerId = $manager ? $manager->manager_id : null;
            }
        }
    }

    /**
     * Gets query for [[Manager]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getManager()
    {
        return $this->hasOne(Employee::class, ['id' => 'manager_id']);
    }

    /**
     * Gets query for [[Subordinates]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getSubordinates()
    {
        return $this->hasMany(Employee::class, ['manager_id' => 'id']);
    }

    /**
     * Get full name
     */
    public function getFullName()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Check if employee has subordinates
     */
    public function hasSubordinates()
    {
        return $this->getSubordinates()->exists();
    }

    /**
     * Get tree structure for lazy loading
     */
    public static function getTreeData($parentId = null)
    {
        $query = static::find()
            ->select(['id', 'first_name', 'last_name', 'position', 'email', 'manager_id'])
            ->where(['manager_id' => $parentId]);

        $employees = $query->orderBy(['last_name' => SORT_ASC, 'first_name' => SORT_ASC])->all();

        $result = [];
        foreach ($employees as $employee) {
            $hasChildren = static::find()->where(['manager_id' => $employee->id])->exists();
            $subordinatesCount = static::find()->where(['manager_id' => $employee->id])->count();

            $result[] = [
                'key' => (string)$employee->id,
                'title' => $employee->getFullName() . ($subordinatesCount > 0 ? " ({$subordinatesCount})" : ''),
                'data' => [
                    'id' => $employee->id,
                    'first_name' => $employee->first_name,
                    'last_name' => $employee->last_name,
                    'position' => $employee->position,
                    'email' => $employee->email,
                    'manager_id' => $employee->manager_id,
                    'subordinates_count' => $subordinatesCount,
                ],
                'isLeaf' => !$hasChildren,
                'children' => $hasChildren ? [] : null,
            ];
        }

        return $result;
    }

    /**
     * Get total count of all employees
     */
    public static function getTotalCount()
    {
        return static::find()->count();
    }

    /**
     * Get all subordinates recursively
     */
    public function getAllSubordinates()
    {
        $subordinates = [];
        $this->collectSubordinates($this->id, $subordinates);
        return $subordinates;
    }

    /**
     * Recursively collect subordinates
     */
    private function collectSubordinates($managerId, &$subordinates)
    {
        $directSubordinates = static::find()->where(['manager_id' => $managerId])->all();

        foreach ($directSubordinates as $subordinate) {
            $subordinates[] = $subordinate;
            $this->collectSubordinates($subordinate->id, $subordinates);
        }
    }

    /**
     * Before delete validation
     */
    public function beforeDelete()
    {
        if ($this->hasSubordinates()) {
            return false;
        }
        return parent::beforeDelete();
    }
}
