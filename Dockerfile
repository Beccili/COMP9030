FROM php:8.2-cli

# Install required PHP extensions (if needed in future)
# RUN docker-php-ext-install pdo pdo_mysql

# Set working directory
WORKDIR /app

# Copy source code
COPY src/ /app/

# Copy custom php.ini configuration
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

# Expose port 8080
EXPOSE 8080

# Start PHP built-in web server
CMD ["php", "-S", "0.0.0.0:8080", "-t", "/app", "-c", "/usr/local/etc/php/conf.d/custom.ini"]
