<?php

namespace app\controllers;

use Yii;
use yii\rest\Controller;
use yii\web\Response;
use yii\filters\Cors;
use yii\filters\ContentNegotiator;
use yii\filters\auth\HttpBearerAuth;

abstract class BaseApiController extends Controller
{

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['corsFilter'] = [
            'class' => Cors::class,
            'cors' => Yii::$app->params['cors'],
        ];

        $behaviors['contentNegotiator'] = [
            'class' => ContentNegotiator::class,
            'formats' => [
                'application/json' => Response::FORMAT_JSON,
            ],
        ];

        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::class,
            'except' => $this->getUnauthenticatedActions(),
        ];

        return $behaviors;
    }

    public function actionOptions()
    {
        return '';
    }

    protected function getUnauthenticatedActions(): array
    {
        return ['options'];
    }

    protected function getRequestData(): array
    {
        $request = Yii::$app->request;
        return $request->isPost || $request->isPut ? $request->post() : [];
    }

    protected function getQueryParams(): array
    {
        return Yii::$app->request->queryParams;
    }
}