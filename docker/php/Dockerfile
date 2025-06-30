FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    icu-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    netcat-openbsd \
    bash \
    fcgi

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html/backend

RUN composer global require phpstan/phpstan

ENV PATH="${PATH}:/root/.composer/vendor/bin"

COPY php.ini /usr/local/etc/php/conf.d/custom.ini

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

RUN printf '#!/bin/sh\nCGI_FCGI_CONNECT_TIMEOUT=1 cgi-fcgi -bind -connect 127.0.0.1:9000\n' > /usr/local/bin/php-fpm-healthcheck \
    && chmod +x /usr/local/bin/php-fpm-healthcheck

RUN chown -R www-data:www-data /var/www/html

USER www-data

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD /usr/local/bin/php-fpm-healthcheck || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
