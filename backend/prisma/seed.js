"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Start seeding...');
    const company = await prisma.company.upsert({
        where: { id: 'demo-company' },
        update: {},
        create: {
            id: 'demo-company',
            name: 'شرکت نمونه حسابداری',
            address: 'تهران، خیابان آزادی',
            phone: '021-12345678',
            email: 'info@example.com',
            taxId: '123456789',
        },
    });
    const hashedPassword = await bcryptjs_1.default.hash('admin123', 12);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'مدیر سیستم',
            role: 'ADMIN',
            companyId: company.id,
        },
    });
    const accounts = await Promise.all([
        prisma.account.upsert({
            where: { id: 'cash-account' },
            update: {},
            create: {
                id: 'cash-account',
                name: 'صندوق',
                type: 'ASSET',
                balance: 1000000,
                companyId: company.id,
            },
        }),
        prisma.account.upsert({
            where: { id: 'bank-account' },
            update: {},
            create: {
                id: 'bank-account',
                name: 'حساب بانکی',
                type: 'ASSET',
                balance: 5000000,
                companyId: company.id,
            },
        }),
    ]);
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { id: 'salary-expense' },
            update: {},
            create: {
                id: 'salary-expense',
                name: 'حقوق و دستمزد',
                type: 'EXPENSE',
                companyId: company.id,
            },
        }),
        prisma.category.upsert({
            where: { id: 'sales-income' },
            update: {},
            create: {
                id: 'sales-income',
                name: 'درآمد فروش',
                type: 'INCOME',
                companyId: company.id,
            },
        }),
    ]);
    const customers = await Promise.all([
        prisma.customer.upsert({
            where: { id: 'customer-1' },
            update: {},
            create: {
                id: 'customer-1',
                name: 'احمد محمدی',
                email: 'ahmad@example.com',
                phone: '09123456789',
                address: 'تهران، میدان آزادی',
                companyId: company.id,
            },
        }),
        prisma.customer.upsert({
            where: { id: 'customer-2' },
            update: {},
            create: {
                id: 'customer-2',
                name: 'شرکت تجاری ایران',
                email: 'info@iran-trade.com',
                phone: '021-87654321',
                address: 'تهران، خیابان ولیعصر',
                taxId: '987654321',
                companyId: company.id,
            },
        }),
    ]);
    const employees = await Promise.all([
        prisma.employee.upsert({
            where: { id: 'employee-1' },
            update: {},
            create: {
                id: 'employee-1',
                employeeCode: 'EMP001',
                name: 'علی احمدی',
                email: 'ali@example.com',
                phone: '09121234567',
                position: 'حسابدار',
                department: 'مالی',
                hireDate: new Date('2023-01-01'),
                salary: 15000000,
                companyId: company.id,
            },
        }),
        prisma.employee.upsert({
            where: { id: 'employee-2' },
            update: {},
            create: {
                id: 'employee-2',
                employeeCode: 'EMP002',
                name: 'مریم کریمی',
                email: 'maryam@example.com',
                phone: '09129876543',
                position: 'فروشنده',
                department: 'فروش',
                hireDate: new Date('2023-02-01'),
                salary: 12000000,
                companyId: company.id,
            },
        }),
    ]);
    const products = await Promise.all([
        prisma.product.upsert({
            where: { id: 'product-1' },
            update: {},
            create: {
                id: 'product-1',
                name: 'لپ تاپ ایسوس',
                description: 'لپ تاپ ایسوس 15 اینچ',
                sku: 'ASUS-001',
                price: 25000000,
                cost: 20000000,
                stockQuantity: 10,
                lowStockThreshold: 3,
                companyId: company.id,
            },
        }),
        prisma.product.upsert({
            where: { id: 'product-2' },
            update: {},
            create: {
                id: 'product-2',
                name: 'ماوس بی‌سیم',
                description: 'ماوس بی‌سیم لاجیتک',
                sku: 'MOUSE-001',
                price: 500000,
                cost: 300000,
                stockQuantity: 2,
                lowStockThreshold: 5,
                companyId: company.id,
            },
        }),
    ]);
    await Promise.all([
        prisma.transaction.create({
            data: {
                accountId: accounts[0].id,
                categoryId: categories[1].id,
                amount: 5000000,
                type: 'INCOME',
                description: 'فروش محصولات',
                date: new Date(),
            },
        }),
        prisma.transaction.create({
            data: {
                accountId: accounts[1].id,
                categoryId: categories[0].id,
                amount: 2000000,
                type: 'EXPENSE',
                description: 'پرداخت حقوق',
                date: new Date(),
            },
        }),
    ]);
    await prisma.check.create({
        data: {
            type: 'RECEIVABLE',
            amount: 3000000,
            checkNumber: '123456',
            bankName: 'بانک ملی',
            accountNumber: '1234567890',
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            description: 'چک دریافتی از مشتری',
            companyId: company.id,
        },
    });
    console.log('Seeding finished.');
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map