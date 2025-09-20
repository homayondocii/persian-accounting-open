import express, { Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticate, authorize, AuthRequest } from '@/middleware/auth';
import { dbService } from '@/utils/database';

const router = express.Router();
const prisma = dbService.getClient();

// Get all transactions
router.get('/transactions', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, type, categoryId, startDate, endDate } = req.query;
  
  const where: any = {
    account: {
      companyId: req.user!.companyId
    }
  };

  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      account: {
        select: { name: true, type: true }
      },
      category: {
        select: { name: true, type: true }
      }
    },
    orderBy: { date: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  });

  const total = await prisma.transaction.count({ where });

  res.json({
    success: true,
    data: {
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
}));

// Create transaction
router.post('/transactions', authenticate, authorize('ADMIN', 'ACCOUNTANT'), 
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { accountId, categoryId, amount, type, description, date } = req.body;

    // Verify account belongs to user's company
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        companyId: req.user!.companyId || undefined
      }
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        accountId,
        categoryId,
        amount: parseFloat(amount),
        type,
        description,
        date: new Date(date)
      },
      include: {
        account: {
          select: { name: true, type: true }
        },
        category: {
          select: { name: true, type: true }
        }
      }
    });

    // Update account balance
    const balanceChange = type === 'INCOME' ? parseFloat(amount) : -parseFloat(amount);
    await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: balanceChange
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: { transaction }
    });
  })
);

// Get financial summary
router.get('/summary', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { startDate, endDate } = req.query;
  
  const where: any = {
    account: {
      companyId: req.user!.companyId
    }
  };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  const [income, expenses, accountsBalance] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...where, type: 'INCOME' },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true }
    }),
    prisma.account.aggregate({
      where: { companyId: req.user!.companyId || undefined },
      _sum: { balance: true }
    })
  ]);

  res.json({
    success: true,
    data: {
      totalIncome: income._sum.amount || 0,
      totalExpenses: expenses._sum.amount || 0,
      netIncome: (Number(income._sum.amount) || 0) - (Number(expenses._sum.amount) || 0),
      totalBalance: Number(accountsBalance._sum?.balance) || 0
    }
  });
}));

// Get accounts
router.get('/accounts', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const accounts = await prisma.account.findMany({
    where: {
      companyId: req.user!.companyId || undefined,
      isActive: true
    },
    orderBy: { name: 'asc' }
  });

  res.json({
    success: true,
    data: { accounts }
  });
}));

// Create account
router.post('/accounts', authenticate, authorize('ADMIN', 'ACCOUNTANT'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, type, balance = 0 } = req.body;

    const account = await prisma.account.create({
      data: {
        name,
        type,
        balance: parseFloat(balance),
        companyId: req.user!.companyId!
      }
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { account }
    });
  })
);

export default router;