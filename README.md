# 📊 Comprehensive Accounting System

A modern, full-stack accounting system for small businesses with Persian (Farsi) localization, built with Node.js, React, and PostgreSQL.

## 🚀 Features

- **Financial Management**: Track income, expenses, accounts, and generate financial reports
- **Check Management**: Manage receivable/payable checks with automated reminders
- **Payroll System**: Employee management with salary calculations and deductions
- **Sales & Invoicing**: Customer management, invoice generation, and sales tracking
- **Inventory Management**: Product catalog, stock tracking, and low-stock alerts
- **Multi-language Support**: Persian and English localization
- **Role-based Access Control**: Admin, Accountant, User, and Viewer roles
- **Real-time Dashboard**: Analytics and insights with charts
- **Cross-platform**: Web application with responsive design

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Caching**: Redis
- **Validation**: Joi
- **Logging**: Winston

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Charts**: Recharts
- **Build Tool**: Vite

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database Migration**: Prisma Migrate
- **Testing**: Jest & React Testing Library

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Redis 6 or higher (optional, for caching)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/comprehensive-accounting-system.git
cd comprehensive-accounting-system
\`\`\`

### 2. Setup with Docker (Recommended)

\`\`\`bash
# Start all services
docker-compose up -d

# Initialize database
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
\`\`\`

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs

### 3. Manual Setup

#### Backend Setup

\`\`\`bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed

# Start development server
npm run dev
\`\`\`

#### Frontend Setup

\`\`\`bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### 4. Database Setup

#### PostgreSQL Setup

\`\`\`sql
-- Create database
CREATE DATABASE accounting_db;

-- Create user
CREATE USER accounting_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE accounting_db TO accounting_user;
\`\`\`

#### Redis Setup (Optional)

\`\`\`bash
# Ubuntu/Debian
sudo apt install redis-server

# macOS
brew install redis

# Start Redis
redis-server
\`\`\`

## 🔐 Default Login Credentials

After seeding the database, you can login with:

- **Email**: admin@example.com
- **Password**: admin123

## 📚 API Documentation

The API documentation is automatically generated and available at:
- Development: http://localhost:3000/api-docs
- Production: https://your-domain.com/api-docs

### Key API Endpoints

\`\`\`
POST   /api/auth/login              # User login
POST   /api/auth/register           # User registration
GET    /api/financial/transactions  # Get transactions
POST   /api/financial/transactions  # Create transaction
GET    /api/checks                  # Get checks
POST   /api/checks                  # Create check
GET    /api/payroll/employees       # Get employees
POST   /api/payroll/employees       # Create employee
GET    /api/sales/customers         # Get customers
POST   /api/sales/invoices          # Create invoice
GET    /api/inventory/products      # Get products
\`\`\`

## 🗂️ Project Structure

\`\`\`
accounting-system/
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   └── index.ts           # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── migrations/        # Database migrations
│   │   └── seed.ts            # Database seeding
│   └── tests/                 # Backend tests
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store
│   │   ├── services/          # API services
│   │   └── types/             # TypeScript types
│   └── tests/                 # Frontend tests
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md        # System architecture
│   ├── DATABASE_SCHEMA.md     # Database design
│   └── SECURITY_BACKUP.md     # Security & backup guide
└── docker-compose.yml         # Docker setup
\`\`\`

## 🧪 Testing

### Backend Tests

\`\`\`bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage
\`\`\`

### Frontend Tests

\`\`\`bash
cd frontend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage
\`\`\`

## 🚀 Production Deployment

### 1. Environment Configuration

\`\`\`bash
# Copy production environment template
cp backend/.env.production backend/.env

# Edit with your production values
nano backend/.env
\`\`\`

### 2. Build and Deploy

\`\`\`bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build

# Deploy with Docker
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### 3. Database Migration

\`\`\`bash
# Run migrations in production
docker-compose exec backend npx prisma migrate deploy
\`\`\`

## 🔒 Security Considerations

- Change default JWT secret in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Configure proper CORS origins
- Set up rate limiting
- Regular security updates
- Database backups and monitoring

See [SECURITY_BACKUP.md](docs/SECURITY_BACKUP.md) for detailed security guidelines.

## 📊 Monitoring and Logging

- Application logs are stored in \`backend/logs/\`
- Health check endpoint: \`/health\`
- Metrics endpoint: \`/metrics\`
- Error tracking with structured logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](issues)
- Email: support@example.com

## 🎯 Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced reporting with PDF export
- [ ] Integration with external APIs
- [ ] Multi-currency support
- [ ] Advanced inventory features
- [ ] Automated backup to cloud storage
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard

---

Made with ❤️ for small businesses in Iran