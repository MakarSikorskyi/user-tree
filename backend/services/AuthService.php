<?php

namespace app\services;

use app\models\AdminUser;
use yii\web\UnauthorizedHttpException;

class AuthService
{
    public function login(string $username, string $password): array
    {
        if (empty($username) || empty($password)) {
            throw new \InvalidArgumentException('Username and password are required');
        }

        $user = AdminUser::login($username, $password);
        
        if (!$user) {
            throw new UnauthorizedHttpException('Invalid username or password');
        }

        $token = $user->generateJwtToken();

        return [
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
            ]
        ];
    }

    public function verifyToken(string $token): array
    {
        $user = AdminUser::findIdentityByAccessToken($token);
        
        if (!$user) {
            throw new UnauthorizedHttpException('Invalid or expired token');
        }

        return [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
            ]
        ];
    }

    public function extractTokenFromHeader(string $authHeader): string
    {
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            throw new \InvalidArgumentException('Authorization header format is invalid');
        }

        return $matches[1];
    }
}