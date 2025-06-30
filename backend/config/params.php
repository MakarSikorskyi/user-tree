<?php

return [
    'adminEmail' => 'admin@example.com',
    'senderEmail' => 'noreply@example.com',
    'senderName' => 'Employee Management System',
    
    'jwt' => [
        'key' => 'employee-management-jwt-secret-key-2024',
        'algorithm' => 'HS256',
        'expire' => 3600,
    ],
    
    'pageSize' => 20,
    'maxPageSize' => 100,
    
    'treeLoadLimit' => 1000,

    'cors' => [
        'Origin' => ['*'],
        'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'Access-Control-Request-Headers' => ['*'],
        'Access-Control-Allow-Credentials' => false,
        'Access-Control-Max-Age' => 86400,
    ],
];