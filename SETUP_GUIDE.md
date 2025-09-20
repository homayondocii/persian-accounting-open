# Setup Guide - Comprehensive Accounting System

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Git

### 1. Clone and Setup Backend

```bash
# Clone the project
git clone <repository-url>
cd accounting-system

# Setup backend
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Start backend
npm run dev
```

### 2. Setup Frontend

```bash
# In a new terminal
cd frontend
npm install

# Start frontend
npm run dev
```

### 3. Setup Database (PostgreSQL)

```sql
-- Create database
CREATE DATABASE accounting_db;

-- Create user
CREATE USER accounting_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE accounting_db TO accounting_user;
```

### 4. Setup Redis (Optional - for caching)

```bash
# Install Redis
# Ubuntu/Debian
sudo apt install redis-server

# macOS
brew install redis

# Start Redis
redis-server
```

## 🐳 Docker Deployment

### Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: accounting_db
      POSTGRES_USER: accounting_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://accounting_user:your_password@postgres:5432/accounting_db
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-jwt-secret
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## 📱 Mobile App Development (React Native)

### Setup React Native

```bash
# Create React Native project
npx react-native init AccountingMobile --template react-native-template-typescript

cd AccountingMobile

# Install dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-vector-icons
npm install @reduxjs/toolkit react-redux
npm install axios
npm install react-native-paper
```

### Shared Code Structure

```
shared/
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
├── services/        # API services
└── constants/       # App constants

mobile/
├── src/
│   ├── components/  # React Native components
│   ├── screens/     # App screens
│   ├── navigation/  # Navigation setup
│   └── store/       # Redux store
```

## 🔧 Development Workflow

### Git Workflow

```bash
# Feature development
git checkout -b feature/financial-module
# Make changes
git add .
git commit -m "feat: add transaction management"
git push origin feature/financial-module
# Create pull request
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Testing
npm run test

# Build
npm run build
```

## 📋 Project Structure

```
accounting-system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   └── tests/               # Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   └── tests/               # Frontend tests
├── mobile/                  # React Native app
├── shared/                  # Shared code
├── docs/                    # Documentation
└── deploy/                  # Deployment configs
```

## 🧪 Testing Strategy

### Backend Testing

```javascript
// Example test file
import request from 'supertest';
import app from '../src/index';

describe('Authentication', () => {
  test('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

### Frontend Testing

```javascript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Auth/Login';

test('should submit login form', () => {
  render(<Login />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  // Add assertions
});
```

## 📊 Performance Optimization

### Backend Optimization

```javascript
// Database query optimization
const getTransactionsOptimized = async (filters) => {
  return await prisma.transaction.findMany({
    where: filters,
    select: {
      id: true,
      amount: true,
      date: true,
      account: {
        select: {
          name: true,
          type: true
        }
      }
    },
    take: 50,
    orderBy: { date: 'desc' }
  });
};

// Caching strategy
const getAccountBalance = async (accountId) => {
  const cacheKey = `account:${accountId}:balance`;
  let balance = await redis.get(cacheKey);
  
  if (!balance) {
    balance = await calculateBalance(accountId);
    await redis.setex(cacheKey, 300, balance); // 5 minutes cache
  }
  
  return parseFloat(balance);
};
```

### Frontend Optimization

```javascript
// Code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Financial = lazy(() => import('./pages/Financial'));

// Memoization
const TransactionList = memo(({ transactions }) => {
  return (
    <div>
      {transactions.map(transaction => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
});
```

## 🌐 Production Deployment

### Environment Setup

```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/accounting_db
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=super-secure-jwt-secret
FRONTEND_URL=https://accounting.yourcompany.com
```

### SSL Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name accounting.yourcompany.com;
    
    ssl_certificate /etc/ssl/certs/accounting.crt;
    ssl_certificate_key /etc/ssl/private/accounting.key;
    
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔍 Monitoring & Logging

### Application Monitoring

```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      disk: await checkDiskSpace()
    }
  };
  
  res.json(health);
});
```

### Log Management

```javascript
// Structured logging
logger.info('User login', {
  userId: user.id,
  email: user.email,
  ip: req.ip,
  userAgent: req.get('User-Agent')
});

logger.error('Database error', {
  error: error.message,
  stack: error.stack,
  query: failedQuery
});
```

This comprehensive setup guide provides everything needed to develop, test, and deploy your accounting system successfully.