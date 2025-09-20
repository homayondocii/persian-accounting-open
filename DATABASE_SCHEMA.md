# Database Schema Design

## Core Entities

### Users & Companies
- `users`: id, email, password, role, company_id
- `companies`: id, name, address, tax_id, settings
- `user_permissions`: user_id, module, permissions

### Financial Management
- `accounts`: id, name, type, balance, company_id
- `transactions`: id, account_id, amount, type, category, date, description
- `transaction_categories`: id, name, type, company_id

### Check Management
- `checks`: id, type, amount, due_date, status, bank_info, company_id
- `check_reminders`: id, check_id, reminder_date, sent

### Payroll
- `employees`: id, name, position, salary, hire_date, company_id
- `payroll_records`: id, employee_id, period, gross_pay, deductions, net_pay
- `payroll_items`: id, payroll_id, type, amount

### Sales & Inventory
- `customers`: id, name, contact_info, company_id
- `products`: id, name, price, stock_quantity, low_stock_threshold
- `invoices`: id, customer_id, total, date, status
- `invoice_items`: id, invoice_id, product_id, quantity, price

### Reporting & Audit
- `audit_logs`: id, table_name, record_id, action, old_values, new_values
- `reports`: id, type, parameters, generated_at, file_path

## Key Relationships
- Companies have many users, transactions, employees
- Transactions belong to accounts and categories
- Invoices have many items linking to products
- All entities include audit trails and soft deletes