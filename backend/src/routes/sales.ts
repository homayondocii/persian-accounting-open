import express, { Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticate, authorize, AuthRequest } from '@/middleware/auth';
import { dbService } from '@/utils/database';

const router = express.Router();
const prisma = dbService.getClient();

// Get all customers
router.get('/customers', authenticate, asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
  const { page = 1, limit = 10, search } = req.query;
  
  const where: any = {
    companyId: req.user!.companyId!
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } }
    ];
  }

  const customers = await prisma.customer.findMany({
    where,
    orderBy: { name: 'asc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  });

  const total = await prisma.customer.count({ where });

  res.json({
    success: true,
    data: {
      customers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
}));

// Create customer
router.post('/customers', authenticate, authorize('ADMIN', 'ACCOUNTANT'), 
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { name, email, phone, address, taxId } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        taxId,
        companyId: req.user!.companyId!!
      }
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: { customer }
    });
  })
);

// Get all invoices
router.get('/invoices', authenticate, asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
  const { page = 1, limit = 10, status, customerId } = req.query;
  
  const where: any = {
    customer: {
      companyId: req.user!.companyId!
    }
  };

  if (status) where.status = status;
  if (customerId) where.customerId = customerId;

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      customer: {
        select: {
          name: true,
          email: true
        }
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              sku: true
            }
          },
          service: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: { date: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  });

  const total = await prisma.invoice.count({ where });

  res.json({
    success: true,
    data: {
      invoices,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
}));

// Create invoice
router.post('/invoices', authenticate, authorize('ADMIN', 'ACCOUNTANT'),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { 
      customerId, 
      invoiceNumber, 
      dueDate, 
      items, 
      tax = 0, 
      notes 
    } = req.body;

    // Verify customer belongs to company
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        companyId: req.user!.companyId!!
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (parseFloat(item.price) * item.quantity), 0
    );
    const total = subtotal + parseFloat(tax);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId,
        dueDate: dueDate ? new Date(dueDate) : null,
        subtotal,
        tax: parseFloat(tax),
        total,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || null,
            serviceId: item.serviceId || null,
            description: item.description,
            quantity: item.quantity,
            price: parseFloat(item.price),
            total: parseFloat(item.price) * item.quantity
          }))
        }
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            service: true
          }
        }
      }
    });

    // Update product stock if applicable
    for (const item of items) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: { invoice }
    });
  })
);

// Update invoice status
router.put('/invoices/:id/status', authenticate, authorize('ADMIN', 'ACCOUNTANT'),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const { status } = req.body;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        customer: {
          companyId: req.user!.companyId!!
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        items: true
      }
    });

    res.json({
      success: true,
      message: 'Invoice status updated successfully',
      data: { invoice: updatedInvoice }
    });
  })
);

export default router;