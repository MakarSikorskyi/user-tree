<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * This is the model class for table "admin_user".
 *
 * @property int $id
 * @property string $username
 * @property string $password_hash
 * @property string $created_at
 */
class AdminUser extends ActiveRecord implements IdentityInterface
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'admin_user';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['username', 'password_hash'], 'required'],
            [['created_at'], 'safe'],
            [['username'], 'string', 'max' => 64],
            [['password_hash'], 'string', 'max' => 255],
            [['username'], 'unique'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'username' => 'Username',
            'password_hash' => 'Password Hash',
            'created_at' => 'Created At',
        ];
    }

    /**
     * {@inheritdoc}
     */
    public static function findIdentity($id)
    {
        return static::findOne($id);
    }

    /**
     * {@inheritdoc}
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        try {
            $jwtConfig = Yii::$app->params['jwt'];
            $decoded = JWT::decode($token, new Key($jwtConfig['key'], $jwtConfig['algorithm']));
            
            if (isset($decoded->uid)) {
                return static::findOne($decoded->uid);
            }
        } catch (\Exception $e) {
            return null;
        }
        
        return null;
    }

    /**
     * Finds user by username
     *
     * @param string $username
     * @return static|null
     */
    public static function findByUsername($username)
    {
        return static::findOne(['username' => $username]);
    }

    /**
     * {@inheritdoc}
     */
    public function getId()
    {
        return $this->getPrimaryKey();
    }

    /**
     * {@inheritdoc}
     */
    public function getAuthKey()
    {
        return null;
    }

    /**
     * {@inheritdoc}
     */
    public function validateAuthKey($authKey)
    {
        return false;
    }

    /**
     * Validates password
     *
     * @param string $password password to validate
     * @return bool if password provided is valid for current user
     */
    public function validatePassword($password)
    {
        return Yii::$app->security->validatePassword($password, $this->password_hash);
    }

    /**
     * Generates password hash from password and sets it to the model
     *
     * @param string $password
     */
    public function setPassword($password)
    {
        $this->password_hash = Yii::$app->security->generatePasswordHash($password);
    }

    /**
     * Generates JWT token for the user
     *
     * @return string
     */
    public function generateJwtToken()
    {
        $jwtConfig = Yii::$app->params['jwt'];
        
        $payload = [
            'uid' => $this->id,
            'username' => $this->username,
            'iat' => time(),
            'exp' => time() + $jwtConfig['expire'],
        ];

        return JWT::encode($payload, $jwtConfig['key'], $jwtConfig['algorithm']);
    }

    /**
     * Login form validation
     */
    public static function login($username, $password)
    {
        $user = static::findByUsername($username);
        
        if ($user && $user->validatePassword($password)) {
            return $user;
        }
        
        return null;
    }
}