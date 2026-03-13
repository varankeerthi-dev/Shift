FROM php:8.4-cli

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Install Composer the clean way
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# copy full repo
COPY . /var/www

# move into Laravel backend folder
WORKDIR /var/www/backend

# install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000