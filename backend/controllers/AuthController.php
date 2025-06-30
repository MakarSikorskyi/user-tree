<?php

namespace app\controllers;

use Yii;
use app\services\AuthService;
use app\helpers\ResponseHelper;
use yii\web\UnauthorizedHttpException;

class AuthController extends BaseApiController
{
    private AuthService $authService;

    public function __construct($id, $module, $config = [])
    {
        parent::__construct($id, $module, $config);
        $this->authService = new AuthService();
    }

    protected function getUnauthenticatedActions(): array
    {
        return ['options', 'login'];
    }
    public function actionLogin()
    {
        try {
            $data = $this->getRequestData();
            $username = $data['username'] ?? '';
            $password = $data['password'] ?? '';

            $result = $this->authService->login($username, $password);

            return ResponseHelper::success($result, 'Login successful');
        } catch (\InvalidArgumentException $e) {
            return ResponseHelper::error($e->getMessage(), 400);
        } catch (UnauthorizedHttpException $e) {
            return ResponseHelper::unauthorized($e->getMessage());
        } catch (\Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function actionVerifyToken()
    {
        try {
            $authHeader = Yii::$app->request->getHeaders()->get('Authorization');

            if (!$authHeader) {
                return ResponseHelper::unauthorized('Authorization header missing or invalid');
            }

            $token = $this->authService->extractTokenFromHeader($authHeader);
            $result = $this->authService->verifyToken($token);

            return ResponseHelper::success($result, 'Token is valid');
        } catch (\InvalidArgumentException $e) {
            return ResponseHelper::unauthorized($e->getMessage());
        } catch (UnauthorizedHttpException $e) {
            return ResponseHelper::unauthorized($e->getMessage());
        } catch (\Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

}
