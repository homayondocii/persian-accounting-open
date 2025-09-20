import express, { Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticate, authorize, AuthRequest } from '@/middleware/auth';
import { dbService } from '@/utils/database';

const router = express.Router();
const prisma = dbService.getClient();

// Get all checks
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, type, status } = req.query;
  
  const where: any = {
    companyId: req.user!.companyId
  };

  if (type) where.type = type;
  if (status) where.status = status;

  const checks = await prisma.check.findMany({
    where,
    orderBy: { dueDate: 'asc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    include: {
      reminders: true
    }
  });

  const total = await prisma.check.count({ where });

  res.json({
    success: true,
    data: {
      checks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
}));

// Create check
router.post('/', authenticate, authorize('ADMIN', 'ACCOUNTANT'), 
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { 
      type, 
      amount, 
      checkNumber, 
      bankName, 
      accountNumber, 
      issueDate, 
      dueDate, 
      description 
    } = req.body;

    const check = await prisma.check.create({
      data: {
        type,
        amount: parseFloat(amount),
        checkNumber,
        bankName,
        accountNumber,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        description,
        companyId: req.user!.companyId!
      }
    });

    res.status(201).json({
      success: true,
      message: 'Check created successfully',
      data: { check }
    });
  })
);

// Update check status
router.put('/:id/status', authenticate, authorize('ADMIN', 'ACCOUNTANT'),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const { status } = req.body;

    const check = await prisma.check.findFirst({
      where: {
        id,
        companyId: req.user!.companyId!
      }
    });

    if (!check) {
      return res.status(404).json({
        success: false,
        message: 'Check not found'
      });
    }

    const updatedCheck = await prisma.check.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      message: 'Check status updated successfully',
      data: { check: updatedCheck }
    });
  })
);

// Get checks due soon
router.get('/due-soon', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const daysAhead = Number(req.query.days) || 7;
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  const checks = await prisma.check.findMany({
    where: {
      companyId: req.user!.companyId!,
      status: 'PENDING',
      dueDate: {
        lte: futureDate,
        gte: new Date()
      }
    },
    orderBy: { dueDate: 'asc' }
  });

  res.json({
    success: true,
    data: { checks }
  });
}));

export default router;