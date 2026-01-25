# Screenshot Guide for Flexi AMS

This guide explains how to capture and add screenshots to the repository.

## Required Screenshots

### 1. Login Page (`login.png`)
- **URL**: http://localhost:5173/login
- **What to capture**: Full login page showing:
  - Flexi AMS logo/title
  - Login form with email and password fields
  - Demo credentials box
  - Login button

### 2. Dashboard (`dashboard.png`)
- **URL**: http://localhost:5173/
- **What to capture**: Dashboard after login showing:
  - Statistics cards (Total Assets, Available, Assigned, etc.)
  - Alerts section
  - Recent allocations table
  - Assets by client chart

### 3. Assets List (`assets-list.png`)
- **URL**: http://localhost:5173/assets
- **What to capture**: Assets list page showing:
  - Search and filter options
  - Asset type, status, client filters
  - Assets table with multiple entries
  - Pagination

### 4. Asset Detail (`asset-detail.png`)
- **URL**: http://localhost:5173/assets/1
- **What to capture**: Asset detail page showing:
  - Asset information
  - Specifications
  - Current holder details
  - Allocation and repair history

### 5. Clients List (`clients-list.png`)
- **URL**: http://localhost:5173/clients
- **What to capture**: Clients list showing:
  - Search functionality
  - Client cards with icons
  - Contact information
  - Employee and asset counts

### 6. Allocations List (`allocations-list.png`)
- **URL**: http://localhost:5173/allocations
- **What to capture**: Allocations page showing:
  - Filter options (Status, Type, Client)
  - Allocations table
  - Asset and employee details

### 7. Repairs List (`repairs-list.png`)
- **URL**: http://localhost:5173/repairs
- **What to capture**: Repairs page showing:
  - Filter options (Status, Priority)
  - Repairs table
  - Status and priority badges

## How to Take Screenshots

### Using Browser Developer Tools

1. Start both servers:
```bash
# Terminal 1
cd backend && php artisan serve

# Terminal 2
cd frontend && npm run dev
```

2. Open browser at http://localhost:5173

3. Login with: admin@hrpsp.com / password123

4. For each page:
   - Navigate to the page
   - Press F12 to open DevTools
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "Capture full size screenshot"
   - Press Enter

5. Save screenshots to `docs/screenshots/` with appropriate names

### Using Screenshot Tool

**Windows:**
- Use Windows Snipping Tool or Snip & Sketch (Win + Shift + S)

**Mac:**
- Use Cmd + Shift + 4 to capture selection
- Or Cmd + Shift + 3 for full screen

**Linux:**
- Use gnome-screenshot or spectacle
- Or press PrtScn key

### Screenshot Requirements

- **Format**: PNG (preferred) or JPG
- **Size**: Full page width, optimized for web
- **Quality**: High resolution, but compressed for GitHub
- **Naming**: Use lowercase with hyphens (e.g., `asset-detail.png`)

## Adding Screenshots to Repository

1. Save screenshots to `docs/screenshots/`

2. Add to git:
```bash
git add docs/screenshots/*.png
git commit -m "Add product screenshots"
git push
```

3. Screenshots will automatically appear in README.md

## Optional: Hero Image

Create a banner image combining:
- Flexi AMS logo
- Tagline: "Complete Asset Management Solution"
- HRPSP branding
- Mockup of dashboard

Save as: `docs/screenshots/hero-banner.png`

Recommended dimensions: 1200x630px
