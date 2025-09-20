// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

// User & Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  company?: Company;
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxId?: string;
  settings?: Record<string, any>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export type UserRole = 'ADMIN' | 'ACCOUNTANT' | 'USER' | 'VIEWER';

// Financial
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  companyId: string;
}

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface Transaction {
  id: string;
  accountId: string;
  account?: Account;
  categoryId?: string;
  category?: Category;
  amount: number;
  type: TransactionType;
  description?: string;
  reference?: string;
  date: string;
  createdAt: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  companyId: string;
}

export type CategoryType = 'INCOME' | 'EXPENSE';

// Checks
export interface Check {
  id: string;
  type: CheckType;
  amount: number;
  checkNumber?: string;
  bankName?: string;
  accountNumber?: string;
  issueDate: string;
  dueDate: string;
  status: CheckStatus;
  description?: string;
  companyId: string;
}

export type CheckType = 'RECEIVABLE' | 'PAYABLE';
export type CheckStatus = 'PENDING' | 'CLEARED' | 'BOUNCED' | 'CANCELLED';

// Payroll
export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email?: string;
  phone?: string;
  position: string;
  department?: string;
  hireDate: string;
  salary: number;
  isActive: boolean;
  companyId: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employee?: Employee;
  period: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: PayrollStatus;
  items?: PayrollItem[];
}

export type PayrollStatus = 'DRAFT' | 'APPROVED' | 'PAID';

export interface PayrollItem {
  id: string;
  payrollId: string;
  type: PayrollItemType;
  description: string;
  amount: number;
}

export type PayrollItemType = 'SALARY' | 'BONUS' | 'OVERTIME' | 'DEDUCTION' | 'TAX' | 'INSURANCE';

// Sales & Customers
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  companyId: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer?: Customer;
  date: string;
  dueDate?: string;
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  items?: InvoiceItem[];
}

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId?: string;
  product?: Product;
  serviceId?: string;
  service?: Service;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

// Inventory
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price: number;
  cost?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  companyId: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  companyId: string;
}

// Common
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
  companyName: string;
}

export interface TransactionForm {
  accountId: string;
  categoryId?: string;
  amount: number;
  type: TransactionType;
  description?: string;
  date: string;
}