<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;

class SiteController extends Controller
{

    public function actionError()
    {
        $exception = Yii::$app->errorHandler->exception;
        if ($exception !== null) {
            return [
                'success' => false,
                'message' => $exception->getMessage(),
                'code' => $exception->getCode(),
            ];
        }
        
        return [
            'success' => false,
            'message' => 'An error occurred',
        ];
    }
}