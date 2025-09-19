# Docker Deployment Guide for Ubuntu Server

This guide covers deploying the blog application on an Ubuntu server using Docker and Docker Compose for the application services, with nginx running natively on Ubuntu as a reverse proxy.

## Prerequisites

1. Ubuntu Server 20.04+ with root access
2. Domain name pointing to your server (optional for local testing)
3. Basic knowledge of Docker and Linux commands
4. Nginx will be installed natively (not in Docker)

## Initial Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and back in for group changes to take effect
logout
```

### 3. Install Git and Clone Repository
```bash
sudo apt install git -y
git clone https://github.com/josephclaytonhansen/blog-jhd.git
cd blog-jhd
```

## Quick Setup (Automated)

For a quick setup, you can use the automated nginx setup script:

```bash
# Make script executable and run
chmod +x scripts/setup-nginx.sh
sudo ./scripts/setup-nginx.sh
```

This script will:
- Install nginx
- Configure the blog site
- Set up SSL with Let's Encrypt (optional)
- Configure firewall rules

## Manual Configuration

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

Fill in your actual values:
- `MONGO_STRING`: MongoDB connection string (e.g., `mongodb://username:password@mongodb:27017/blog?authSource=admin`)
- `JWT_SECRET`: Random string for JWT tokens
- `COOKIE_PARSER_SECRET`: Random string for cookies
- `GITHUB_TOKEN`: GitHub Personal Access Token
- `EMAIL_FROM_USERNAME` and `EMAIL_FROM_PASSWORD`: Email credentials
- `FRONTEND_URLS`: Your domain(s)
- `VUE_APP_SERVER_URL`: Your API domain

### 2. GitHub Token Setup
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with these scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
3. Copy the token and add it to your `.env` file

### 3. Install and Configure Nginx
```bash
# Install nginx
sudo apt install nginx -y

# Stop nginx for now
sudo systemctl stop nginx
```

### 4. SSL Certificate Setup

#### Option A: Let's Encrypt (Recommended for production)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate (nginx plugin will configure automatically)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Option B: Manual Let's Encrypt (if above doesn't work)
```bash
# Stop nginx temporarily
sudo systemctl stop nginx

# Get certificate manually
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Start nginx back up
sudo systemctl start nginx
```

### 5. Configure Nginx
```bash
# Copy the nginx configuration to your server
sudo cp nginx/conf.d/default.conf /etc/nginx/sites-available/blog-jhd

# Update the configuration with your domain and paths
sudo nano /etc/nginx/sites-available/blog-jhd

# Enable the site
sudo ln -s /etc/nginx/sites-available/blog-jhd /etc/nginx/sites-enabled/

# Remove default nginx site
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Deployment

### 1. Development Mode
```bash
# Start all services in development mode
docker-compose up -d

# View logs
docker-compose logs -f
```

### 2. Production Mode
```bash
# Start backend and database services
docker-compose up -d mongodb backend

# Build frontend for production (one-time)
docker-compose run --rm frontend npm run build

# Copy built files to nginx directory
sudo mkdir -p /var/www/blog-jhd/frontend
sudo cp -r frontend/dist/* /var/www/blog-jhd/frontend/dist/
sudo chown -R www-data:www-data /var/www/blog-jhd

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
docker-compose ps
sudo systemctl status nginx
```

### 3. Build Automation
```bash
# Run buildbot (one-time)
chmod +x scripts/buildbot.sh
./scripts/buildbot.sh

# Or run commit automation
chmod +x scripts/commit.sh
./scripts/commit.sh
```

## Service Management

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart a Specific Service
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart nginx
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f nginx
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart Docker services
docker-compose restart backend
docker-compose run --rm frontend npm run build

# Update nginx served files
sudo cp -r frontend/dist/* /var/www/blog-jhd/frontend/dist/
sudo chown -R www-data:www-data /var/www/blog-jhd

# Reload nginx configuration if changed
sudo nginx -t && sudo systemctl reload nginx
```

## Scheduled Tasks (Optional)

### Setup Cron for Automated Builds
```bash
# Edit crontab
crontab -e

# Add these lines for automated builds/commits
# Run buildbot every hour
0 * * * * cd /path/to/blog-jhd && ./scripts/buildbot.sh >> /var/log/buildbot.log 2>&1

# Run commit automation daily at 2 AM
0 2 * * * cd /path/to/blog-jhd && ./scripts/commit.sh >> /var/log/commit.log 2>&1
```

## Monitoring

### Check Service Health
```bash
# Check if containers are running
docker-compose ps

# Check resource usage
docker stats

# Check nginx access logs
docker-compose logs nginx

# Check backend logs for errors
docker-compose logs backend | grep ERROR
```

### Database Backup
```bash
# Create backup script
cat > scripts/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
# Get MONGO_STRING from .env file
source .env
docker-compose exec -T mongodb mongodump --uri="$MONGO_STRING" --archive > "backups/backup_$DATE.archive"
echo "Backup completed: backup_$DATE.archive"
EOF

chmod +x scripts/backup-db.sh

# Create backups directory
mkdir -p backups

# Run backup
./scripts/backup-db.sh
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   sudo netstat -tulpn | grep :80
   sudo systemctl stop apache2 nginx
   ```

2. **Permission Denied**
   ```bash
   sudo chown -R $USER:$USER .
   chmod +x scripts/*.sh
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate validity
   openssl x509 -in nginx/ssl/cert.pem -text -noout
   
   # Renew Let's Encrypt certificate
   sudo certbot renew
   ```

4. **MongoDB Connection Issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Test connection using your MONGO_STRING
   source .env
   docker-compose exec mongodb mongo "$MONGO_STRING"
   ```

5. **GitHub Token Issues**
   ```bash
   # Test token validity
   curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
   ```

## Security Considerations

1. **Firewall Setup**
   ```bash
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   ```

2. **Regular Updates**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Update Docker images
   docker-compose pull
   docker-compose up -d --build
   ```

3. **Environment Security**
   - Keep `.env` file secure (never commit to git)
   - Use strong passwords
   - Rotate secrets regularly
   - Monitor logs for suspicious activity

## Maintenance Commands

```bash
# Clean up Docker resources
docker system prune -f

# View disk usage
docker system df

# Remove unused volumes
docker volume prune -f

# Restart all services
docker-compose restart

# Scale services (if needed)
docker-compose up -d --scale backend=2
```

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f [service-name]`
2. Verify environment variables in `.env`
3. Ensure all required ports are available
4. Check Docker and Docker Compose versions
5. Review nginx configuration for syntax errors

For additional help, check the project repository issues or create a new issue with relevant logs and configuration details.