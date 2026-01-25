<div align="center">

# 🚀 Flexi AMS
### Complete Asset Management Solution

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**A powerful, modern asset management system for tracking IT equipment, employee allocations, repairs, and transfers.**

[Features](#-features) • [Screenshots](#-screenshots) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Support](#-support)

---

### Developed by HRPSP
🌐 [www.hrpsp.net](https://www.hrpsp.net) • 📧 support@hrpsp.net • 📱 +92 300 7727981

</div>

---

## 💡 What is Flexi AMS?

**Flexi AMS** (Asset Management System) is a comprehensive, enterprise-grade solution designed to streamline the complete lifecycle of IT assets in your organization. From procurement to allocation, maintenance to retirement, Flexi AMS provides complete visibility and control over your asset inventory.

### 🎯 Why Flexi AMS?

<table>
<tr>
<td width="50%">

#### 📊 Complete Visibility
Track every asset from purchase to retirement with detailed history, current location, and holder information.

#### 💼 Smart Allocations
Manage both **installment-based purchases** and **rental agreements** with automated payment tracking.

</td>
<td width="50%">

#### 🔧 Maintenance Tracking
Log and monitor repair requests with priority management, warranty tracking, and cost analysis.

#### 📈 Real-time Analytics
Get instant insights with comprehensive dashboard showing asset utilization, pending repairs, and more.

</td>
</tr>
</table>

### 🌟 Perfect For

- 🏢 **HR Outsourcing Companies** managing assets across multiple client locations
- 🏭 **Manufacturing Units** tracking equipment and machinery
- 🏫 **Educational Institutions** managing IT labs and resources
- 🏥 **Healthcare Organizations** tracking medical and IT equipment
- 💻 **IT Service Providers** managing client deployments

---

## 📸 Screenshots

### 🔐 Login & Authentication
<img src="docs/screenshots/login.png" alt="Login Page" width="100%" />

*Secure login with demo credentials for testing*

### 📊 Dashboard Overview
<img src="docs/screenshots/dashboard.png" alt="Dashboard" width="100%" />

*Real-time statistics, alerts, and recent activity at a glance*

### 💻 Asset Management
<div align="center">
<table>
<tr>
<td width="50%">
<img src="docs/screenshots/assets-list.png" alt="Assets List" width="100%" />
<p align="center"><em>Powerful filtering and search</em></p>
</td>
<td width="50%">
<img src="docs/screenshots/asset-detail.png" alt="Asset Detail" width="100%" />
<p align="center"><em>Complete asset information</em></p>
</td>
</tr>
</table>
</div>

### 👥 Client & Employee Management
<img src="docs/screenshots/clients-list.png" alt="Clients List" width="100%" />

*Track clients with contact information and asset counts*

### 📦 Allocations & Repairs
<div align="center">
<table>
<tr>
<td width="50%">
<img src="docs/screenshots/allocations-list.png" alt="Allocations" width="100%" />
<p align="center"><em>Manage installments and rentals</em></p>
</td>
<td width="50%">
<img src="docs/screenshots/repairs-list.png" alt="Repairs" width="100%" />
<p align="center"><em>Track repair requests and status</em></p>
</td>
</tr>
</table>
</div>

> 📝 **Note**: Screenshots are captured from the live application. See [Screenshot Guide](docs/SCREENSHOT_GUIDE.md) for details.

---

## ✨ Features

### 🖥️ Asset Management
- ✅ Track **Laptops**, **Mobiles**, **Tablets**, and custom asset types
- ✅ Monitor asset **status**, **location**, and **condition**
- ✅ Upload and manage **multiple photos** per asset
- ✅ Maintain **purchase date**, **warranty**, and **vendor** information
- ✅ Store detailed **specifications** (processor, RAM, storage, etc.)
- ✅ Generate **asset tags** and **serial numbers**
- ✅ Track **warranty expiry** with automated alerts

### 👥 Employee & Client Management
- ✅ Comprehensive **employee records** with employment details
- ✅ **Client organizations** with contract and policy management
- ✅ Track **asset assignments** per employee/client
- ✅ Monitor **employment status** and history
- ✅ **Contact management** for clients and employees
- ✅ Department and designation tracking

### 📦 Smart Allocation System
- ✅ **Installment Plans**: Asset purchase through salary deductions
  - Configurable down payment and installment amounts
  - Automated payment schedule generation
  - Overdue installment tracking
  - Early settlement support
- ✅ **Rental Agreements**: Flexible asset rental
  - Configurable rental periods (daily/weekly/monthly)
  - Security deposit management
  - Rental payment tracking
  - Agreement renewal support
- ✅ **Handover & Return** documentation with condition tracking
- ✅ Complete **allocation history** per asset and employee

### 🔧 Repair Management
- ✅ Log and track **repair requests** with priority levels
- ✅ Monitor repair **status workflow** (Reported → Diagnosed → Sent for Repair → Repaired → Closed)
- ✅ **Warranty claim** tracking and verification
- ✅ Repair **cost management** and vendor tracking
- ✅ **Issue categorization** (Hardware, Software, Physical Damage, etc.)
- ✅ Estimated completion date tracking
- ✅ Days open calculation

### 🔄 Transfer Workflows
- ✅ **Asset transfer** between employees
- ✅ **Transfer checklist** and documentation
- ✅ Multi-step **approval workflows**
- ✅ Transfer **reason tracking**
- ✅ Complete **transfer history**

### 📊 Dashboard & Analytics
- ✅ **Real-time statistics**: Total, Available, Assigned, In Repair
- ✅ **Asset distribution** by type and client
- ✅ **Alerts** for warranty expiry and overdue payments
- ✅ **Recent activity** tracking
- ✅ **Client-wise asset distribution**
- ✅ **Repair status** overview

### 🔐 Security & Access Control
- ✅ **Role-based permissions** (Admin, IT Manager, IT Support, HR Operations)
- ✅ **Secure authentication** with Laravel Sanctum
- ✅ **Activity logging** for audit trails
- ✅ **Session management**
- ✅ **CSRF protection**

### 🎨 User Experience
- ✅ **Modern, responsive** UI built with React and Tailwind CSS
- ✅ **Intuitive navigation** with sidebar and breadcrumbs
- ✅ **Smart search** and **advanced filtering**
- ✅ **Pagination** for large datasets
- ✅ **Toast notifications** for user feedback
- ✅ **Loading states** and error handling
- ✅ **Mobile-friendly** design

---

## 🏗️ Technology Stack

<div align="center">

### Backend
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)

### Frontend
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

### Key Libraries
[![React Query](https://img.shields.io/badge/React_Query-5-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com)
[![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com)

</div>

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- Git

### Installation in 4 Steps

#### 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd Asset-Management-System
```

#### 2️⃣ Setup Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
```

#### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
echo "VITE_API_URL=http://localhost:8000/api" > .env
```

#### 4️⃣ Run Application
```bash
# Terminal 1 - Backend
cd backend && php artisan serve

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 🎉 Access Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Login**: `admin@hrpsp.com` / `password123`

You should see the dashboard with statistics, alerts, and recent activity!

---

## 🔐 Default Users

After running seeders, the following test accounts are available:

<table>
<tr>
<th>Email</th>
<th>Password</th>
<th>Role</th>
<th>Permissions</th>
</tr>
<tr>
<td>admin@hrpsp.com</td>
<td>password123</td>
<td>👑 Admin</td>
<td>Full system access</td>
</tr>
<tr>
<td>it.manager@hrpsp.com</td>
<td>password123</td>
<td>💼 IT Manager</td>
<td>Asset & allocation management</td>
</tr>
<tr>
<td>it.support@hrpsp.com</td>
<td>password123</td>
<td>🔧 IT Support</td>
<td>Repair & transfer management</td>
</tr>
<tr>
<td>hr.ops@hrpsp.com</td>
<td>password123</td>
<td>👥 HR Operations</td>
<td>Employee management</td>
</tr>
</table>

> ⚠️ **Security Warning**: Change these passwords immediately in production environments!

---

## 📁 Project Structure

```
Asset-Management-System/
│
├── 📂 backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/      # 🎮 API Controllers
│   │   │   └── Resources/        # 📦 API Resources (Transformers)
│   │   └── Models/               # 🗃️ Eloquent Models
│   ├── database/
│   │   ├── migrations/           # 🔄 Database Schema
│   │   └── seeders/              # 🌱 Sample Data
│   ├── routes/
│   │   └── api.php               # 🛣️ API Routes
│   └── storage/                  # 💾 File Storage
│
├── 📂 frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/           # ⚛️ React Components
│   │   │   ├── common/           # 🔧 Reusable UI Components
│   │   │   └── layout/           # 📐 Layout Components
│   │   ├── pages/                # 📄 Page Components
│   │   ├── services/             # 🌐 API Services
│   │   ├── types/                # 📝 TypeScript Types
│   │   ├── context/              # 🔄 React Context
│   │   └── App.tsx               # 🚀 Main App
│   └── dist/                     # 📦 Production Build
│
├── 📂 docs/                       # Documentation
│   ├── screenshots/              # 📸 Product Screenshots
│   └── SCREENSHOT_GUIDE.md       # 📷 Screenshot Instructions
│
├── 📄 README.md                   # You are here!
├── 📄 DEPLOYMENT_GUIDE.md         # 🚀 Deployment Instructions
└── 📄 LICENSE                     # ⚖️ License Information
```

---

## 🌐 API Overview

### Authentication Endpoints
```http
POST   /api/auth/login      # 🔐 User login
POST   /api/auth/logout     # 🚪 User logout
GET    /api/auth/me         # 👤 Get current user
```

### Resource Endpoints
```http
GET    /api/dashboard/stats        # 📊 Dashboard statistics
GET    /api/assets                 # 💻 List assets (with filters)
GET    /api/assets/{id}            # 🔍 Get asset details
POST   /api/assets                 # ➕ Create asset
PUT    /api/assets/{id}            # ✏️ Update asset
DELETE /api/assets/{id}            # 🗑️ Delete asset
GET    /api/clients                # 🏢 List clients
GET    /api/employees              # 👥 List employees
GET    /api/allocations            # 📦 List allocations
GET    /api/repairs                # 🔧 List repair requests
GET    /api/transfers              # 🔄 List transfer requests
```

### Features
- ✅ Token-based authentication (Laravel Sanctum)
- ✅ Pagination support on all list endpoints
- ✅ Advanced filtering and search
- ✅ JSON responses with consistent structure
- ✅ Proper error handling and status codes

📖 **Full API Documentation**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#api-documentation)

---

## 📚 Documentation

<table>
<tr>
<td align="center" width="33%">

### 📖 Quick Start
[README.md](README.md)

Basic installation and overview

</td>
<td align="center" width="33%">

### 🚀 Deployment
[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

Complete deployment instructions

</td>
<td align="center" width="33%">

### 📸 Screenshots
[SCREENSHOT_GUIDE.md](docs/SCREENSHOT_GUIDE.md)

How to capture screenshots

</td>
</tr>
</table>

### External Resources
- [Laravel Documentation](https://laravel.com/docs/11.x) - Backend framework
- [React Documentation](https://react.dev) - Frontend library
- [TypeScript Handbook](https://www.typescriptlang.org/docs) - Type safety
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework

---

## 🧪 Testing & Quality

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Build Verification
```bash
cd frontend
npm run build
npm run preview
```

### Manual Testing Checklist
- [x] Login functionality
- [x] Dashboard statistics display
- [x] Asset list with filters
- [x] Asset detail view
- [x] Client management
- [x] Employee management
- [x] Allocation tracking
- [x] Repair request management
- [x] Logout functionality

### Code Quality
- ✅ TypeScript for type safety
- ✅ ESLint for code linting
- ✅ Laravel best practices
- ✅ RESTful API design
- ✅ Responsive design
- ✅ Security best practices

---

## 🚀 Deployment

### Development
```bash
# Terminal 1 - Backend
cd backend && php artisan serve

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Output: dist/ folder ready for deployment
```

**Backend:**
```bash
cd backend
php artisan config:cache
php artisan route:cache
php artisan optimize
```

### Deployment Options

<table>
<tr>
<td width="33%" align="center">

#### 🖥️ VPS/Dedicated
Nginx + MySQL
Full control

</td>
<td width="33%" align="center">

#### 🌐 Shared Hosting
cPanel setup
Easy deployment

</td>
<td width="33%" align="center">

#### 🐳 Docker
Containerized
Portable

</td>
</tr>
</table>

📖 **Detailed deployment instructions**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#production-deployment)

---

## 🎯 Roadmap

### 🚧 Coming Soon
- [ ] 📧 Email notifications for alerts and workflows
- [ ] 🔐 Two-factor authentication (2FA)
- [ ] 📱 Mobile application (React Native)
- [ ] 📊 Advanced reporting and analytics
- [ ] 📤 Bulk import/export (CSV/Excel)
- [ ] 🔍 Advanced search with filters
- [ ] 📋 Custom workflows and approvals
- [ ] 🌍 Multi-language support
- [ ] 🌙 Dark mode theme
- [ ] 🔔 Push notifications
- [ ] 📷 Barcode/QR code scanning
- [ ] 📈 Depreciation calculation
- [ ] 🔗 API webhooks
- [ ] 📊 Custom report builder

### 💡 Feature Requests
Have an idea? Contact us at support@hrpsp.net

---

## 🤝 Support & Contact

<div align="center">

### 📞 Get in Touch

<table>
<tr>
<td align="center" width="33%">

#### 🌐 Website
[www.hrpsp.net](https://www.hrpsp.net)

Visit our website

</td>
<td align="center" width="33%">

#### 📧 Email
support@hrpsp.net

Technical support

</td>
<td align="center" width="33%">

#### 📱 Phone
+92 300 7727981

Direct contact

</td>
</tr>
</table>

### ⏰ Office Hours
**Monday - Friday**: 9:00 AM - 6:00 PM (PKT)
**Saturday**: 10:00 AM - 2:00 PM (PKT)

### 💬 What We Provide
✅ Technical support and troubleshooting
✅ Feature requests and custom development
✅ Training and onboarding assistance
✅ Deployment and configuration support

</div>

---

## 🛠️ Troubleshooting

### Common Issues

<details>
<summary><strong>❌ CORS Errors</strong></summary>

Check backend `.env`:
```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173,yourdomain.com
FRONTEND_URL=http://localhost:5173
```
</details>

<details>
<summary><strong>🔐 Authentication Issues</strong></summary>

1. Clear browser localStorage
2. Verify token in API requests
3. Check API URL in frontend `.env`
4. Re-login to get fresh token
</details>

<details>
<summary><strong>🏗️ Build Failures</strong></summary>

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```
</details>

<details>
<summary><strong>💾 Database Issues</strong></summary>

```bash
# Reset database
php artisan migrate:fresh --seed
```
</details>

📖 **Complete troubleshooting guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#troubleshooting)

---

## 📄 License

Proprietary software developed by **HRPSP**. All rights reserved.

For licensing inquiries, contact: support@hrpsp.net

---

## 🙏 Acknowledgments

Built with cutting-edge technologies:
- [Laravel](https://laravel.com) - The PHP Framework for Web Artisans
- [React](https://react.dev) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org) - JavaScript with syntax for types
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
- [Vite](https://vitejs.dev) - Next Generation Frontend Tooling

---

## 📈 Stats

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/hrpsp/Asset-Management-System?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/hrpsp/Asset-Management-System?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/hrpsp/Asset-Management-System?style=for-the-badge)

</div>

---

<div align="center">

### 🌟 Star this repository if you find it useful!

**Built with ❤️ by the HRPSP Development Team**

[🌐 Website](https://www.hrpsp.net) • [📧 Email](mailto:support@hrpsp.net) • [📱 Call](tel:+923007727981)

---

© 2026 HRPSP. All Rights Reserved.

</div>
