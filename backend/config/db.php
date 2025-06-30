<?php

return [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=' . (getenv('DB_HOST') ?: 'mariadb') . ';dbname=' . (getenv('DB_NAME') ?: 'employee_db'),
    'username' => getenv('DB_USER') ?: 'root',
    'password' => getenv('DB_PASSWORD') ?: 'rootpassword',
    'charset' => 'utf8mb4',

    'enableSchemaCache' => true,
    'schemaCacheDuration' => 60,
    'schemaCache' => 'cache',

    'enableLogging' => YII_DEBUG,
    'enableProfiling' => YII_DEBUG,

    'attributes' => [
        PDO::ATTR_TIMEOUT => 30,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ],
];