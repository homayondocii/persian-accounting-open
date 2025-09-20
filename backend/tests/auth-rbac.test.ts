import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index';

describe('Role-Based Access Control (RBAC)', () => {
  let adminToken: string;
  let accountantToken: string;
  let viewerToken: string;

  beforeAll(() => {
    const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    
    // Create mock tokens for different roles
    adminToken = jwt.sign({ 
      id: 'admin-id', 
      email: 'admin@test.com', 
      role: 'ADMIN',
      companyId: 'test-company' 
    }, JWT_SECRET);
    
    accountantToken = jwt.sign({ 
      id: 'accountant-id', 
      email: 'accountant@test.com', 
      role: 'ACCOUNTANT',
      companyId: 'test-company' 
    }, JWT_SECRET);
    
    viewerToken = jwt.sign({ 
      id: 'viewer-id', 
      email: 'viewer@test.com', 
      role: 'VIEWER',
      companyId: 'test-company' 
    }, JWT_SECRET);
  });

  describe('Admin Access', () => {
    it('should allow admin to access all endpoints', async () => {
      const endpoints = [
        '/api/financial/accounts',
        '/api/checks',
        '/api/payroll/employees',
        '/api/sales/customers',
        '/api/inventory/products'
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)
          .get(endpoint)
          .set('Authorization', `Bearer ${adminToken}`);
        
        // Admin should have access (not 403)
        expect(response.status).not.toBe(403);
      }
    });
  });

  describe('Accountant Access', () => {
    it('should allow accountant to access financial endpoints', async () => {
      const response = await request(app)
        .get('/api/financial/accounts')
        .set('Authorization', `Bearer ${accountantToken}`);
      
      expect(response.status).not.toBe(403);
    });

    it('should allow accountant to create transactions', async () => {
      const transactionData = {
        accountId: 'test-account',
        amount: 1000,
        type: 'INCOME',
        description: 'Test transaction',
        date: new Date().toISOString()
      };

      const response = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', `Bearer ${accountantToken}`)
        .send(transactionData);
      
      expect(response.status).not.toBe(403);
    });
  });

  describe('Viewer Access', () => {
    it('should deny viewer access to create operations', async () => {
      const transactionData = {
        accountId: 'test-account',
        amount: 1000,
        type: 'INCOME',
        description: 'Test transaction',
        date: new Date().toISOString()
      };

      const response = await request(app)
        .post('/api/financial/transactions')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send(transactionData);
      
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Required roles');
    });
  });

  describe('Unauthorized Access', () => {
    it('should deny access without token', async () => {
      const response = await request(app)
        .get('/api/financial/accounts');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should deny access with invalid token', async () => {
      const response = await request(app)
        .get('/api/financial/accounts')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});