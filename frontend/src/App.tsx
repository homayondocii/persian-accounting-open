import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeContextProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout/Layout';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import Dashboard from '@/pages/Dashboard/Dashboard';
import { Box, Typography } from '@mui/material';

// Simple placeholder components
const Accounts = () => <Box sx={{ p: 3 }}><Typography variant="h4">مدیریت حساب‌ها</Typography></Box>;
const Transactions = () => <Box sx={{ p: 3 }}><Typography variant="h4">مدیریت تراکنش‌ها</Typography></Box>;
const Checks = () => <Box sx={{ p: 3 }}><Typography variant="h4">مدیریت چک‌ها</Typography></Box>;
const Employees = () => <Box sx={{ p: 3 }}><Typography variant="h4">مدیریت کارکنان</Typography></Box>;
const Payroll = () => <Box sx={{ p: 3 }}><Typography variant="h4">حقوق و دستمزد</Typography></Box>;
const Customers = () => <Box sx={{ p: 3 }}><Typography variant="h4">مدیریت مشتریان</Typography></Box>;
const Invoices = () => <Box sx={{ p: 3 }}><Typography variant="h4">مدیریت فاکتورها</Typography></Box>;
const Products = () => <Box sx={{ p: 3 }}><Typography variant="h4">مدیریت محصولات</Typography></Box>;
const Reports = () => <Box sx={{ p: 3 }}><Typography variant="h4">گزارشات</Typography></Box>;

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/financial/accounts" element={<Accounts />} />
                    <Route path="/financial/transactions" element={<Transactions />} />
                    <Route path="/checks" element={<Checks />} />
                    <Route path="/payroll/employees" element={<Employees />} />
                    <Route path="/payroll/records" element={<Payroll />} />
                    <Route path="/sales/customers" element={<Customers />} />
                    <Route path="/sales/invoices" element={<Invoices />} />
                    <Route path="/inventory/products" element={<Products />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeContextProvider>
    </Provider>
  );
};

export default App;