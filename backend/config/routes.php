<?php

return [
    // Authentication routes
    'POST api/login' => 'auth/login',
    'GET api/verify-token' => 'auth/verify-token',
    
    // Employee management routes
    'GET api/employees' => 'employee/index',
    'GET api/employees/tree' => 'employee/tree',
    'POST api/employees' => 'employee/create',
    'PUT api/employees/<id:\d+>' => 'employee/update',
    'DELETE api/employees/<id:\d+>' => 'employee/delete',
    'GET api/employees/<id:\d+>' => 'employee/view',
    
    // CORS preflight requests
    'OPTIONS api/<path:.*>' => 'site/options',
];