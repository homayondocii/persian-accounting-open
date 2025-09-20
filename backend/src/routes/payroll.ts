import express, { Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticate, authorize, AuthRequest } from '@/middleware/auth';
import { dbService } from '@/utils/database';

const router = express.Router();
const prisma = dbService.getClient();

// Get all employees
router.get('/employees', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, search, department } = req.query;
  
  const where: any = {
    companyId: req.user!.companyId,
    isActive: true
  };

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { employeeCode: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } }
    ];
  }

  if (department) where.department = department;

  const employees = await prisma.employee.findMany({
    where,
    orderBy: { name: 'asc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  });

  const total = await prisma.employee.count({ where });

  res.json({
    success: true,
    data: {
      employees,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
}));

// Create employee
router.post('/employees', authenticate, authorize('ADMIN', 'ACCOUNTANT'), 
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { 
      employeeCode,
      name, 
      email, 
      phone, 
      position, 
      department, 
      hireDate, 
      salary 
    } = req.body;

    // Check if employee code already exists
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        companyId: req.user!.companyId || undefined,
        employeeCode
      }
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee code already exists'
      });
    }

    const employee = await prisma.employee.create({
      data: {
        employeeCode,
        name,
        email,
        phone,
        position,
        department,
        hireDate: new Date(hireDate),
        salary: parseFloat(salary),
        companyId: req.user!.companyId!
      }
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: { employee }
    });
  })
);

// Get payroll records
router.get('/payroll', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, period, employeeId } = req.query;
  
  const where: any = {
    employee: {
      companyId: req.user!.companyId
    }
  };

  if (period) where.period = period;
  if (employeeId) where.employeeId = employeeId;

  const payrollRecords = await prisma.payrollRecord.findMany({
    where,
    include: {
      employee: {
        select: {
          name: true,
          employeeCode: true,
          position: true
        }
      },
      items: true
    },
    orderBy: { createdAt: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  });

  const total = await prisma.payrollRecord.count({ where });

  res.json({
    success: true,
    data: {
      payrollRecords,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
}));

// Create payroll record
router.post('/payroll', authenticate, authorize('ADMIN', 'ACCOUNTANT'),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { employeeId, period, items } = req.body;

    // Verify employee belongs to company
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        companyId: req.user!.companyId!
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Calculate totals
    const grossPay = items
      .filter((item: any) => ['SALARY', 'BONUS', 'OVERTIME'].includes(item.type))
      .reduce((sum: number, item: any) => sum + parseFloat(item.amount), 0);

    const deductions = items
      .filter((item: any) => ['DEDUCTION', 'TAX', 'INSURANCE'].includes(item.type))
      .reduce((sum: number, item: any) => sum + parseFloat(item.amount), 0);

    const netPay = grossPay - deductions;

    const payrollRecord = await prisma.payrollRecord.create({
      data: {
        employeeId,
        period,
        grossPay,
        deductions,
        netPay,
        items: {
          create: items.map((item: any) => ({
            type: item.type,
            description: item.description,
            amount: parseFloat(item.amount)
          }))
        }
      },
      include: {
        employee: true,
        items: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Payroll record created successfully',
      data: { payrollRecord }
    });
  })
);

// Update payroll status
router.put('/payroll/:id/status', authenticate, authorize('ADMIN', 'ACCOUNTANT'),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const { status } = req.body;

    const payrollRecord = await prisma.payrollRecord.findFirst({
      where: {
        id,
        employee: {
          companyId: req.user!.companyId!
        }
      }
    });

    if (!payrollRecord) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found'
      });
    }

    const updatedRecord = await prisma.payrollRecord.update({
      where: { id },
      data: { status },
      include: {
        employee: true,
        items: true
      }
    });

    res.json({
      success: true,
      message: 'Payroll status updated successfully',
      data: { payrollRecord: updatedRecord }
    });
  })
);

export default router;