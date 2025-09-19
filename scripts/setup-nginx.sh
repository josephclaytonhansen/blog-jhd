#!/bin/bash

# Nginx Setup Script for Ubuntu Server
# This script configures nginx to work with the Dockerized blog application

set -e

echo "🌐 Setting up Nginx for Blog Application"
echo "========================================"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script with sudo or as root"
    exit 1
fi

# Get the current directory (should be the blog project root)
PROJECT_DIR=$(pwd)
NGINX_SITE_NAME="blog-jhd"

echo "📁 Project directory: $PROJECT_DIR"

# Install nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing nginx..."
    apt update
    apt install -y nginx
else
    echo "✅ Nginx is already installed"
fi

# Stop nginx temporarily
echo "⏸️  Stopping nginx..."
systemctl stop nginx

# Create web directory
echo "📁 Creating web directories..."
mkdir -p /var/www/blog-jhd/frontend/dist
chown -R www-data:www-data /var/www/blog-jhd

# Copy nginx configuration
echo "⚙️  Configuring nginx..."
cp "$PROJECT_DIR/nginx/conf.d/default.conf" "/etc/nginx/sites-available/$NGINX_SITE_NAME"

# Prompt for domain configuration
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN_NAME
if [ -n "$DOMAIN_NAME" ]; then
    echo "🔧 Updating configuration with domain: $DOMAIN_NAME"
    sed -i "s/yourdomain.com/$DOMAIN_NAME/g" "/etc/nginx/sites-available/$NGINX_SITE_NAME"
    sed -i "s/server_name _;/server_name $DOMAIN_NAME www.$DOMAIN_NAME;/" "/etc/nginx/sites-available/$NGINX_SITE_NAME"
fi

# Update paths in nginx config
sed -i "s|/var/www/blog-jhd/frontend/dist|$PROJECT_DIR/frontend/dist|g" "/etc/nginx/sites-available/$NGINX_SITE_NAME"

# Enable the site
echo "✅ Enabling nginx site..."
ln -sf "/etc/nginx/sites-available/$NGINX_SITE_NAME" "/etc/nginx/sites-enabled/"

# Remove default nginx site
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors. Please check the config file."
    exit 1
fi

# Ask about SSL setup
echo ""
echo "🔒 SSL Certificate Setup"
echo "1) Install Let's Encrypt certificate (recommended)"
echo "2) Skip SSL setup for now"
read -p "Choose option (1-2): " ssl_choice

case $ssl_choice in
    1)
        if [ -n "$DOMAIN_NAME" ]; then
            echo "📜 Installing certbot..."
            apt install -y certbot python3-certbot-nginx
            
            echo "🔐 Getting SSL certificate..."
            certbot --nginx -d "$DOMAIN_NAME" -d "www.$DOMAIN_NAME" --non-interactive --agree-tos --email "webmaster@$DOMAIN_NAME" || {
                echo "⚠️  SSL setup failed. You can run 'sudo certbot --nginx' manually later."
            }
        else
            echo "⚠️  Domain name required for SSL setup. Skipping..."
        fi
        ;;
    2)
        echo "⚠️  Skipping SSL setup. Remember to configure HTTPS for production!"
        ;;
esac

# Start and enable nginx
echo "🚀 Starting nginx..."
systemctl start nginx
systemctl enable nginx

# Configure firewall if ufw is available
if command -v ufw &> /dev/null; then
    echo "🔥 Configuring firewall..."
    ufw allow 'Nginx Full'
    ufw --force enable
fi

echo ""
echo "✅ Nginx setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start your Docker containers: docker-compose up -d"
echo "2. Build your frontend: docker-compose run --rm frontend npm run build"
echo "3. Copy built files: sudo cp -r frontend/dist/* /var/www/blog-jhd/frontend/dist/"
echo "4. Test your site: curl -I http://localhost"
echo ""
echo "📁 Configuration files:"
echo "   Nginx site: /etc/nginx/sites-available/$NGINX_SITE_NAME"
echo "   Web root: /var/www/blog-jhd/frontend/dist"
echo ""
echo "🔧 Useful commands:"
echo "   Test config: sudo nginx -t"
echo "   Reload nginx: sudo systemctl reload nginx"
echo "   View logs: sudo tail -f /var/log/nginx/error.log"