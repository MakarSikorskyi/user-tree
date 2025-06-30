<?php

namespace app\helpers;

use Yii;

class ResponseHelper
{
    public static function success($data = null, string $message = null, int $statusCode = 200): array
    {
        Yii::$app->response->statusCode = $statusCode;
        
        $response = ['success' => true];
        
        if ($message !== null) {
            $response['message'] = $message;
        }
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        return $response;
    }

    public static function error(string $message, int $statusCode = 400, $errors = null): array
    {
        Yii::$app->response->statusCode = $statusCode;
        
        $response = [
            'success' => false,
            'message' => $message
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        return $response;
    }

    public static function paginated($data, array $pagination, string $message = null): array
    {
        $response = [
            'success' => true,
            'data' => $data,
            'pagination' => $pagination
        ];
        
        if ($message !== null) {
            $response['message'] = $message;
        }
        
        return $response;
    }

    public static function withMeta($data, array $meta, string $message = null): array
    {
        $response = [
            'success' => true,
            'data' => $data,
            'meta' => $meta
        ];
        
        if ($message !== null) {
            $response['message'] = $message;
        }
        
        return $response;
    }

    public static function created($data = null, string $message = 'Resource created successfully'): array
    {
        return self::success($data, $message, 201);
    }

    public static function validationError($errors, string $message = 'Validation failed'): array
    {
        return self::error($message, 400, $errors);
    }

    public static function unauthorized(string $message = 'Unauthorized'): array
    {
        return self::error($message, 401);
    }

    public static function forbidden(string $message = 'Forbidden'): array
    {
        return self::error($message, 403);
    }

    public static function notFound(string $message = 'Resource not found'): array
    {
        return self::error($message, 404);
    }

    public static function conflict(string $message = 'Conflict'): array
    {
        return self::error($message, 409);
    }

    public static function serverError(string $message = 'Internal server error'): array
    {
        return self::error($message, 500);
    }
}