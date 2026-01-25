# Flexi AMS - Asset Management System

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Laravel](https://img.shields.io/badge/Laravel-11-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org)

A comprehensive, full-stack asset management system for tracking IT assets, employee allocations, repairs, and transfers.

**Developed by HRPSP**
Website: [www.hrpsp.net](https://www.hrpsp.net)
Email: support@hrpsp.net
Mobile: +92 300 7727981

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Asset-Management-System
```

2. **Setup Backend**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

3. **Setup Frontend** (in new terminal)
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000/api" > .env
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Login: `admin@hrpsp.com` / `password123`

📖 **For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

---

## 🎯 Features

### Asset Management
- Track laptops, mobiles, tablets, and other IT equipment
- Monitor asset status, location, and condition
- Upload and manage asset photos
- Maintain purchase and warranty information
- Comprehensive asset specifications

### Employee & Client Management
- Manage employee records with employment details
- Track client contracts and policies
- Monitor asset assignments per employee/client
- Generate employee and client reports

### Allocation System
- **Installment Plans**: Asset purchase through salary deductions
- **Rental Agreements**: Asset rental with periodic payments
- Track allocation history and returns
- Handover and return documentation

### Repair Management
- Log and track repair requests
- Monitor repair status and priority
- Warranty claim tracking
- Repair cost management
- Vendor repair tracking

### Transfer Workflows
- Asset transfer between employees
- Transfer checklist and documentation
- Approval workflows
- Transfer history tracking

### Dashboard & Analytics
- Real-time statistics
- Asset distribution by type and client
- Alerts for warranty expiry
- Recent activity tracking
- Overdue installment monitoring

---

## 🏗️ Technology Stack

### Backend
- **Framework**: Laravel 11
- **Language**: PHP 8.2+
- **Database**: SQLite (dev) / MySQL (prod)
- **Authentication**: Laravel Sanctum
- **API**: RESTful JSON API

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM 6
- **HTTP Client**: Axios
- **UI Components**: Headless UI
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## 📁 Project Structure

```
Asset-Management-System/
├── backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # API Controllers
│   │   │   └── Resources/     # API Resources
│   │   └── Models/            # Eloquent Models
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/           # Database Seeders
│   ├── routes/
│   │   └── api.php            # API Routes
│   └── storage/               # File Storage
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React Components
│   │   │   ├── common/        # Reusable UI Components
│   │   │   └── layout/        # Layout Components
│   │   ├── pages/             # Page Components
│   │   ├── services/          # API Services
│   │   ├── types/             # TypeScript Types
│   │   ├── context/           # React Context
│   │   └── App.tsx            # Main App Component
│   └── dist/                  # Production Build
│
├── DEPLOYMENT_GUIDE.md        # Comprehensive Deployment Guide
└── README.md                  # This file
```

---

## 🔐 Default Users

After running seeders, the following users are available:

| Email | Password | Role |
|-------|----------|------|
| admin@hrpsp.com | password123 | Admin (Full Access) |
| it.manager@hrpsp.com | password123 | IT Manager |
| it.support@hrpsp.com | password123 | IT Support |
| hr.ops@hrpsp.com | password123 | HR Operations |

**⚠️ Important**: Change these passwords immediately in production!

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Resources
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/assets` - List assets (with filters)
- `GET /api/assets/{id}` - Get asset details
- `POST /api/assets` - Create asset
- `PUT /api/assets/{id}` - Update asset
- `DELETE /api/assets/{id}` - Delete asset
- `GET /api/clients` - List clients
- `GET /api/employees` - List employees
- `GET /api/allocations` - List allocations
- `GET /api/repairs` - List repair requests
- `GET /api/transfers` - List transfer requests

All list endpoints support pagination, filtering, and search.

📖 **For complete API documentation, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#api-documentation)**

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Build Test
```bash
cd frontend
npm run build
```

### Manual Testing Checklist
- [ ] Login functionality
- [ ] Dashboard statistics display
- [ ] Asset list with filters
- [ ] Asset detail view
- [ ] Client list
- [ ] Employee list
- [ ] Allocation list
- [ ] Repair requests list
- [ ] Logout

---

## 🚀 Deployment

### Development
```bash
# Terminal 1 - Backend
cd backend && php artisan serve

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Production

**Build frontend:**
```bash
cd frontend
npm run build
```

**Optimize backend:**
```bash
cd backend
php artisan config:cache
php artisan route:cache
php artisan optimize
```

📖 **For detailed production deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#production-deployment)**

Deployment options covered:
- Traditional Server (VPS/Dedicated with Nginx)
- Shared Hosting (cPanel)
- Docker Deployment

---

## 🔧 Configuration

### Backend Environment
Key settings in `backend/.env`:
```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
FRONTEND_URL=https://yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

### Frontend Environment
Key settings in `frontend/.env`:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 📊 Database Schema

### Main Tables
- `users` - System users with role-based permissions
- `clients` - Client organizations
- `employees` - Employee records
- `assets` - IT assets with specifications
- `asset_photos` - Asset images
- `allocations` - Asset allocations to employees
- `installment_plans` - Installment payment plans
- `installment_schedules` - Individual installment payments
- `rental_agreements` - Rental contracts
- `rental_periods` - Rental payment periods
- `repair_requests` - Repair tracking
- `transfer_requests` - Asset transfer requests
- `activity_logs` - Audit trail

---

## 🛠️ Development

### Backend Development
```bash
cd backend

# Run migrations
php artisan migrate

# Create new migration
php artisan make:migration create_table_name

# Create new controller
php artisan make:controller ControllerName

# Create new model
php artisan make:model ModelName -m
```

### Frontend Development
```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

---

## 🐛 Troubleshooting

### Common Issues

**CORS Errors:**
- Check `SANCTUM_STATEFUL_DOMAINS` in backend `.env`
- Verify `FRONTEND_URL` matches frontend domain

**Authentication Issues:**
- Clear browser localStorage
- Check token in request headers
- Verify API URL in frontend `.env`

**Build Failures:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

📖 **For comprehensive troubleshooting, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#troubleshooting)**

---

## 📝 License

Proprietary software developed by HRPSP. All rights reserved.

---

## 👥 Support

### Technical Support
- **Email**: support@hrpsp.net
- **Website**: [www.hrpsp.net](https://www.hrpsp.net)
- **Mobile**: +92 300 7727981

### Office Hours
- Monday - Friday: 9:00 AM - 6:00 PM (PKT)
- Saturday: 10:00 AM - 2:00 PM (PKT)

---

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [API Documentation](DEPLOYMENT_GUIDE.md#api-documentation) - API endpoints and usage
- [Laravel Documentation](https://laravel.com/docs/11.x)
- [React Documentation](https://react.dev)

---

## 🎯 Roadmap

### Upcoming Features
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] Two-factor authentication (2FA)
- [ ] Mobile application
- [ ] Barcode/QR code scanning
- [ ] Bulk import/export
- [ ] Advanced search filters
- [ ] Custom workflows
- [ ] Multi-language support
- [ ] Dark mode

---

## 🤝 Contributing

This is proprietary software. For feature requests or bug reports, please contact:
- Email: support@hrpsp.net

---

## 📄 Changelog

### Version 1.0.0 (January 2026)
- Initial release
- Complete asset management system
- Employee and client management
- Allocation system (Installment/Rental)
- Repair tracking
- Transfer workflows
- Dashboard analytics
- RESTful API
- React frontend with TypeScript

---

**Built with ❤️ by HRPSP Development Team**

For more information, visit [www.hrpsp.net](https://www.hrpsp.net)
