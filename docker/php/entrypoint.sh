#!/bin/bash
set -e

echo "Starting PHP-FPM container initialization..."

echo "Waiting for database to be ready..."
while ! nc -z mariadb 3306; do
  echo "Database not ready, waiting..."
  sleep 2
done
echo "Database is ready!"

cd /var/www/html/backend

# Wait for the volume to be mounted and composer.json to be available
echo "Waiting for composer.json to be available..."
while [ ! -f "composer.json" ]; do
    echo "composer.json not found, waiting for volume mount..."
    sleep 2
done
echo "composer.json found!"

if [ ! -d "vendor" ]; then
    echo "Installing composer dependencies..."
    composer install --no-dev --optimize-autoloader
fi

sleep 5

echo "Checking if database needs seeding..."
EMPLOYEE_COUNT=$(php -r "
require_once 'vendor/autoload.php';
require_once 'vendor/yiisoft/yii2/Yii.php';
\$config = require 'config/console.php';
new yii\console\Application(\$config);
try {
    echo \app\models\Employee::find()->count();
} catch (Exception \$e) {
    echo '0';
}
" 2>/dev/null || echo "0")

if [ "$EMPLOYEE_COUNT" = "0" ]; then
    echo "Database is empty, running seeder..."
    php yii faker/seed EmployeeSeeder 25400
    echo "Seeding completed!"
else
    echo "Database already has $EMPLOYEE_COUNT employees, skipping seeding."
fi

echo "Starting PHP-FPM..."
exec php-fpm
