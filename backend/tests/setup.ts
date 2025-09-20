// Test setup file
import { PrismaClient } from '@prisma/client';

// Mock Prisma client for tests
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}));

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Increase timeout for tests
jest.setTimeout(30000);