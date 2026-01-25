# Contributing to Flexi AMS

Thank you for your interest in contributing to **Flexi AMS**! This document provides guidelines for contributing to the project.

## 📞 Contact Information

**HRPSP (Human Resource Professional Services Pakistan)**
- 🌐 Website: [www.hrpsp.net](https://www.hrpsp.net)
- 📧 Email: support@hrpsp.net
- 📱 Phone: +92 300 7727981

**Office Hours:**
- Monday - Friday: 9:00 AM - 6:00 PM (PKT)
- Saturday: 10:00 AM - 2:00 PM (PKT)

---

## 🚀 Getting Started

### Prerequisites
1. Read the [README.md](README.md) for project overview
2. Follow the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for setup
3. Familiarize yourself with the codebase structure

### Development Setup
```bash
# Clone the repository
git clone <repository-url>
cd Asset-Management-System

# Setup backend
cd backend
composer install
php artisan key:generate
php artisan migrate --seed

# Setup frontend
cd ../frontend
npm install
npm run dev
```

---

## 🔄 Contribution Process

### 1. Create an Issue
Before starting work, create an issue describing:
- What you want to change
- Why the change is needed
- How you plan to implement it

### 2. Fork & Branch
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Asset-Management-System.git

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix-name
```

### 3. Make Changes
- Follow the coding standards (see below)
- Write clean, readable code
- Add comments where necessary
- Update documentation if needed

### 4. Test Your Changes
```bash
# Backend tests
cd backend
php artisan test

# Frontend build test
cd frontend
npm run build
npm run preview
```

### 5. Commit Changes
```bash
git add .
git commit -m "feat: add new feature description"
# or
git commit -m "fix: resolve specific bug"
```

**Commit Message Convention:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 6. Push & Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Link to related issue
- Screenshots (if UI changes)
- Test results

---

## 📝 Coding Standards

### Backend (Laravel/PHP)

#### General Guidelines
- Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) coding standards
- Use Laravel best practices
- Follow SOLID principles

#### Code Style
```php
// Good
public function getUserAssets(User $user): Collection
{
    return $user->assets()
        ->where('status', 'Active')
        ->with(['client', 'employee'])
        ->get();
}

// Bad
public function getUserAssets($user) {
  return $user->assets()->where('status','Active')->with(['client','employee'])->get();
}
```

#### Naming Conventions
- Controllers: `PascalCase` + `Controller` suffix (e.g., `AssetController`)
- Models: `PascalCase` singular (e.g., `Asset`)
- Methods: `camelCase` (e.g., `getUserAssets`)
- Variables: `camelCase` (e.g., `$activeAssets`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_UPLOAD_SIZE`)

#### Database
- Table names: `snake_case` plural (e.g., `asset_allocations`)
- Column names: `snake_case` (e.g., `created_at`)
- Foreign keys: `table_id` (e.g., `user_id`)

### Frontend (React/TypeScript)

#### General Guidelines
- Use TypeScript for type safety
- Follow React hooks best practices
- Use functional components
- Keep components small and focused

#### Code Style
```typescript
// Good
interface AssetProps {
  asset: Asset;
  onUpdate: (asset: Asset) => void;
}

export const AssetCard: React.FC<AssetProps> = ({ asset, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card>
      {asset.name}
    </Card>
  );
};

// Bad
export const AssetCard = (props) => {
  return <div>{props.asset.name}</div>
}
```

#### Naming Conventions
- Components: `PascalCase` (e.g., `AssetCard`)
- Functions: `camelCase` (e.g., `handleSubmit`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- Types/Interfaces: `PascalCase` (e.g., `Asset`, `AssetProps`)

#### File Structure
```
src/
├── components/
│   ├── common/        # Reusable components
│   └── layout/        # Layout components
├── pages/             # Page components
├── services/          # API services
├── types/             # TypeScript types
├── context/           # React context
└── utils/             # Utility functions
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
php artisan test

# Run specific test file
php artisan test --filter AssetTest

# Run with coverage
php artisan test --coverage
```

### Frontend Tests
```bash
cd frontend

# Type check
npm run type-check

# Build test
npm run build

# Preview build
npm run preview
```

### Manual Testing Checklist
- [ ] Login/Logout works
- [ ] All CRUD operations function
- [ ] Filters and search work
- [ ] Pagination works
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] API returns correct data
- [ ] Error handling works

---

## 🔒 Security Guidelines

### Backend
- ✅ Validate all input data
- ✅ Use Laravel's built-in security features
- ✅ Sanitize output to prevent XSS
- ✅ Use parameterized queries (Eloquent does this)
- ✅ Implement proper authentication
- ✅ Use HTTPS in production
- ❌ Never expose sensitive data in responses
- ❌ Never commit `.env` files
- ❌ Never hardcode credentials

### Frontend
- ✅ Validate user input
- ✅ Sanitize data before rendering
- ✅ Use HTTPS for API calls
- ✅ Store tokens securely
- ✅ Implement CSRF protection
- ❌ Never store sensitive data in localStorage
- ❌ Never trust user input
- ❌ Never expose API keys in frontend code

---

## 📚 Documentation

### Code Comments
```php
/**
 * Allocate an asset to an employee
 *
 * @param Asset $asset The asset to allocate
 * @param Employee $employee The employee receiving the asset
 * @param string $type Allocation type (Installment or Rental)
 * @return Allocation The created allocation
 * @throws \Exception If asset is not available
 */
public function allocateAsset(Asset $asset, Employee $employee, string $type): Allocation
{
    // Implementation
}
```

### Update Documentation
When making changes, update:
- [ ] Code comments
- [ ] README.md (if adding features)
- [ ] DEPLOYMENT_GUIDE.md (if changing setup)
- [ ] API documentation (if changing endpoints)

---

## 🐛 Bug Reports

### Before Reporting
1. Check if the issue already exists
2. Verify it's reproducible
3. Test on the latest version

### Report Should Include
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, PHP, Node versions)
- Screenshots (if applicable)
- Error messages/logs

---

## ✨ Feature Requests

### Before Requesting
1. Check if feature already exists
2. Search existing feature requests
3. Consider if it aligns with project goals

### Request Should Include
- Clear description of the feature
- Use case and benefits
- Proposed implementation (if known)
- Mockups or examples (if applicable)

---

## 🚫 What NOT to Contribute

Please avoid:
- Breaking changes without discussion
- Code that doesn't follow standards
- Features without proper testing
- Undocumented changes
- Direct commits to main branch
- Incomplete pull requests
- Code with security vulnerabilities

---

## 📋 Pull Request Checklist

Before submitting, ensure:
- [ ] Code follows project standards
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors/warnings
- [ ] Code is well-commented
- [ ] Commits have clear messages
- [ ] PR description is complete
- [ ] Related issue is linked
- [ ] Screenshots added (if UI changes)

---

## 🤝 Code Review Process

### What We Look For
1. **Functionality**: Does it work as expected?
2. **Code Quality**: Is it clean and maintainable?
3. **Performance**: Is it efficient?
4. **Security**: Are there vulnerabilities?
5. **Testing**: Is it properly tested?
6. **Documentation**: Is it well-documented?

### Review Timeline
- Initial review: Within 2-3 business days
- Follow-up reviews: Within 1-2 business days
- Merge: After approval and CI passes

---

## 🎯 Priority Areas

We especially welcome contributions in:
- 🐛 Bug fixes
- 📝 Documentation improvements
- ✨ UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage
- 🌍 Accessibility improvements

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project (Proprietary License).

---

## 💬 Questions?

### For Technical Questions
- Create an issue with the `question` label
- Email: support@hrpsp.net

### For Custom Development
- Contact: +92 300 7727981
- Email: support@hrpsp.net
- Website: www.hrpsp.net

---

## 🙏 Thank You

Thank you for contributing to Flexi AMS! Your efforts help make this project better for everyone.

**Built with ❤️ by the HRPSP Development Team**

---

© 2026 HRPSP. All Rights Reserved.
