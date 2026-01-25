# Flexi AMS - Deployment Guide for Developers

**Flexi Asset Management System**
A comprehensive solution for managing IT assets, employee allocations, repairs, and transfers.

**Developed by HRPSP**
Website: [www.hrpsp.net](https://www.hrpsp.net)
Email: support@hrpsp.net
Mobile: +92 300 7727981

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Building for Production](#building-for-production)
8. [Production Deployment](#production-deployment)
9. [API Documentation](#api-documentation)
10. [Troubleshooting](#troubleshooting)
11. [Support](#support)

---

## System Overview

**Flexi AMS** is a full-stack asset management system built with:

### Backend
- **Laravel 11** - PHP framework
- **SQLite/MySQL** - Database
- **Laravel Sanctum** - API authentication
- **RESTful API** - JSON-based communication

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Router** - Navigation

### Key Features
- Asset tracking (Laptops, Mobiles, Tablets)
- Employee and client management
- Allocation management (Installment/Rental)
- Repair request tracking
- Transfer workflows
- Dashboard analytics
- Photo uploads
- Document management

---

## Prerequisites

### Required Software

1. **PHP 8.2 or higher**
   ```bash
   php --version
   ```

2. **Composer** (PHP dependency manager)
   ```bash
   composer --version
   ```

3. **Node.js 18+ and npm**
   ```bash
   node --version
   npm --version
   ```

4. **Git**
   ```bash
   git --version
   ```

### Optional but Recommended

- **MySQL 8.0+** (for production)
- **Redis** (for caching and queues)
- **Nginx/Apache** (for production web server)

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Asset-Management-System
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database (for development)
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed

# Create storage symlink
php artisan storage:link
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install Node.js dependencies
npm install

# Create environment file
cp .env.example .env
# Or manually create .env with:
echo "VITE_API_URL=http://localhost:8000/api" > .env
```

---

## Environment Configuration

### Backend Environment (.env)

Edit `backend/.env`:

```env
APP_NAME="Flexi AMS"
APP_ENV=local
APP_KEY=base64:... # Auto-generated
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database - SQLite (Development)
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite

# Database - MySQL (Production)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=flexi_ams
# DB_USERNAME=root
# DB_PASSWORD=

# Session & Cache
SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync

# File Storage
FILESYSTEM_DISK=local

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment (.env)

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

For production:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Database Setup

### Development (SQLite)

SQLite is configured by default for easy development.

```bash
cd backend
touch database/database.sqlite
php artisan migrate --seed
```

### Production (MySQL)

1. Create MySQL database:
```sql
CREATE DATABASE flexi_ams CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'flexi_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON flexi_ams.* TO 'flexi_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Update `backend/.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=flexi_ams
DB_USERNAME=flexi_user
DB_PASSWORD=secure_password
```

3. Run migrations:
```bash
php artisan migrate --seed
```

### Default Users

After seeding, you'll have these users:

| Email | Password | Role |
|-------|----------|------|
| admin@hrpsp.com | password123 | Admin (Full Access) |
| it.manager@hrpsp.com | password123 | IT Manager |
| it.support@hrpsp.com | password123 | IT Support |
| hr.ops@hrpsp.com | password123 | HR Operations |

**⚠️ IMPORTANT**: Change these passwords in production!

---

## Running the Application

### Development Mode

You need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
# Server running at: http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Server running at: http://localhost:5173
```

### Accessing the Application

1. Open browser: http://localhost:5173
2. Login with: `admin@hrpsp.com` / `password123`
3. You should see the dashboard with statistics

### Verify Setup

Run these tests to verify everything works:

```bash
# Test 1: Check backend is running
curl http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hrpsp.com","password":"password123"}'

# Test 2: Check database
cd backend
php artisan tinker
>>> App\Models\Asset::count();
>>> App\Models\User::count();

# Test 3: Check frontend build
cd frontend
npm run build
```

---

## Building for Production

### Backend Optimization

```bash
cd backend

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Set environment to production
# Edit .env: APP_ENV=production, APP_DEBUG=false
```

### Frontend Build

```bash
cd frontend

# Build for production
npm run build

# Output will be in frontend/dist/
# Files are optimized and minified

# Preview production build locally
npm run preview
```

### Build Output

The frontend build creates:
- `dist/index.html` - Entry point
- `dist/assets/` - Optimized JS and CSS
- Total size: ~354 KB JS (gzipped: ~112 KB)

---

## Production Deployment

### Option 1: Traditional Server (VPS/Dedicated)

#### Backend Setup

1. **Upload Laravel files:**
```bash
# Upload entire backend folder to server
# Recommended path: /var/www/flexi-ams
```

2. **Configure web server (Nginx):**

Create `/etc/nginx/sites-available/flexi-ams`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    root /var/www/flexi-ams/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/flexi-ams /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. **Set permissions:**
```bash
cd /var/www/flexi-ams
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

4. **Install SSL (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

#### Frontend Deployment

1. **Build frontend locally:**
```bash
cd frontend
npm run build
```

2. **Upload `dist/` folder to server**

3. **Configure Nginx for frontend:**

Create `/etc/nginx/sites-available/flexi-ams-frontend`:
```nginx
server {
    listen 80;
    server_name app.yourdomain.com;
    root /var/www/flexi-ams-frontend;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. **Install SSL:**
```bash
sudo certbot --nginx -d app.yourdomain.com
```

### Option 2: Shared Hosting (cPanel)

#### Backend Deployment

1. Upload Laravel files via FTP/cPanel File Manager
2. Move `public` folder contents to `public_html`
3. Update `public_html/index.php` to point to Laravel:
```php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require_once __DIR__.'/../backend/bootstrap/app.php';
```
4. Set folder permissions via cPanel
5. Configure database through cPanel MySQL

#### Frontend Deployment

1. Build locally: `npm run build`
2. Upload `dist/` contents to a subdomain or subdirectory
3. Update `.env` with production API URL

### Option 3: Docker Deployment

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=production
      - DB_CONNECTION=mysql
      - DB_HOST=db
    volumes:
      - ./backend:/var/www
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: flexi_ams
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Deploy:
```bash
docker-compose up -d
```

---

## API Documentation

### Authentication

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@hrpsp.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "token": "1|abc123..."
  }
}
```

**Authenticated Requests:**
```http
GET /api/assets
Authorization: Bearer 1|abc123...
```

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | User logout |
| GET | /api/auth/me | Get current user |
| GET | /api/dashboard/stats | Dashboard statistics |
| GET | /api/assets | List assets (paginated) |
| GET | /api/assets/{id} | Get asset details |
| POST | /api/assets | Create asset |
| PUT | /api/assets/{id} | Update asset |
| DELETE | /api/assets/{id} | Delete asset |
| GET | /api/clients | List clients |
| GET | /api/employees | List employees |
| GET | /api/allocations | List allocations |
| GET | /api/repairs | List repair requests |
| GET | /api/transfers | List transfer requests |

### Filtering & Pagination

All list endpoints support:
```http
GET /api/assets?page=1&per_page=10&search=laptop&status=Available
```

Parameters:
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 15)
- `search` - Search query
- Additional filters (status, type, client_id, etc.)

---

## Troubleshooting

### Backend Issues

**Problem: 500 Internal Server Error**
```bash
# Check logs
tail -f backend/storage/logs/laravel.log

# Clear cache
php artisan config:clear
php artisan cache:clear
```

**Problem: Database connection failed**
```bash
# Verify database exists
php artisan db:show

# Re-run migrations
php artisan migrate:fresh --seed
```

**Problem: Permission denied**
```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

**Problem: CORS errors**
```env
# Update backend/.env
SANCTUM_STATEFUL_DOMAINS=localhost:5173,yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Frontend Issues

**Problem: API connection failed**
```bash
# Check .env
cat frontend/.env
# Should have: VITE_API_URL=http://localhost:8000/api

# Rebuild
npm run build
```

**Problem: Build fails**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Problem: TypeScript errors**
```bash
# Check TypeScript version
npm list typescript

# Rebuild
npm run build
```

### Common Issues

**Issue: Login fails with 401**
- Check database has users (run seeders)
- Verify credentials are correct
- Check Laravel logs

**Issue: Token expired/invalid**
- Clear localStorage in browser
- Re-login to get new token

**Issue: File uploads fail**
- Check storage symlink: `php artisan storage:link`
- Verify folder permissions
- Check `upload_max_filesize` in php.ini

---

## Performance Optimization

### Backend

1. **Enable caching:**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

2. **Use Redis for cache/sessions:**
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

3. **Enable OPcache** (php.ini):
```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
```

### Frontend

1. **Enable production mode:**
```bash
npm run build
# Automatically minifies and optimizes
```

2. **Enable CDN for static assets**

3. **Configure caching headers** (Nginx):
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Backup & Recovery

### Database Backup

**SQLite:**
```bash
cp backend/database/database.sqlite backup-$(date +%Y%m%d).sqlite
```

**MySQL:**
```bash
mysqldump -u flexi_user -p flexi_ams > backup-$(date +%Y%m%d).sql
```

### Automated Backups

Create cron job:
```bash
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

### Recovery

```bash
# SQLite
cp backup-20260125.sqlite backend/database/database.sqlite

# MySQL
mysql -u flexi_user -p flexi_ams < backup-20260125.sql
```

---

## Security Checklist

### Production Security

- [ ] Change all default passwords
- [ ] Set `APP_DEBUG=false` in production
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall (UFW/iptables)
- [ ] Set proper file permissions (775 for directories, 664 for files)
- [ ] Enable CSRF protection (Laravel default)
- [ ] Configure rate limiting
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor error logs
- [ ] Use environment variables for secrets
- [ ] Enable 2FA for admin accounts (future feature)

### Recommended PHP Settings

```ini
upload_max_filesize = 20M
post_max_size = 20M
memory_limit = 256M
max_execution_time = 300
```

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check disk space
- Verify backups

**Weekly:**
- Update dependencies
- Review user activity
- Clean old sessions

**Monthly:**
- Security updates
- Database optimization
- Performance review

### Update Commands

```bash
# Update Laravel dependencies
cd backend
composer update

# Update Node dependencies
cd frontend
npm update

# Clear caches after updates
php artisan optimize:clear
```

---

## Support

### HRPSP Contact Information

**Technical Support:**
- Email: support@hrpsp.net
- Website: [www.hrpsp.net](https://www.hrpsp.net)
- Mobile: +92 300 7727981

**Office Hours:**
- Monday - Friday: 9:00 AM - 6:00 PM (PKT)
- Saturday: 10:00 AM - 2:00 PM (PKT)

### Getting Help

For technical support, please provide:
1. Error message/logs
2. Steps to reproduce
3. Environment details (OS, PHP version, etc.)
4. Screenshots (if applicable)

### Resources

- Laravel Documentation: https://laravel.com/docs
- React Documentation: https://react.dev
- TypeScript Documentation: https://www.typescriptlang.org/docs

---

## Appendix

### System Requirements

**Minimum:**
- PHP 8.2+
- MySQL 8.0+ or SQLite 3
- Node.js 18+
- 2 GB RAM
- 10 GB disk space

**Recommended:**
- PHP 8.3+
- MySQL 8.0+
- Node.js 20+
- 4 GB RAM
- 20 GB disk space
- Redis for caching
- SSD storage

### Technology Stack

**Backend:**
- Laravel 11
- PHP 8.2+
- SQLite/MySQL
- Laravel Sanctum (Auth)
- Laravel Eloquent (ORM)

**Frontend:**
- React 19
- TypeScript
- Vite 5
- Tailwind CSS 3
- React Query (TanStack Query)
- React Router DOM 6
- Axios
- Headless UI
- Lucide React (Icons)
- React Hot Toast

### License

Proprietary software developed by HRPSP.
All rights reserved.

---

**Document Version:** 1.0
**Last Updated:** January 25, 2026
**Prepared by:** HRPSP Development Team

For the latest version of this guide, visit: www.hrpsp.net
