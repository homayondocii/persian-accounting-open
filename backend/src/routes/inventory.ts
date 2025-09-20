import express, { Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticate, authorize, AuthRequest } from '@/middleware/auth';
import { dbService } from '@/utils/database';

const router = express.Router();
const prisma = dbService.getClient();

// Get all products
router.get('/products', authenticate, asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
  const { page = 1, limit = 10, search, lowStock } = req.query;
  
  let where: any = {
    companyId: req.user!.companyId!,
    isActive: true
  };

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { sku: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } }
    ];
  }

  let products;
  let total;

  if (lowStock === 'true') {
    // Get all products first, then filter
    const allProducts = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' }
    });
    
    products = allProducts.filter((product: any) => 
      product.stockQuantity <= product.lowStockThreshold
    );
    
    total = products.length;
    
    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    products = products.slice(startIndex, endIndex);
  } else {
    products = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });
    
    total = await prisma.product.count({ where });
  }

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
}));

// Create product
router.post('/products', authenticate, authorize('ADMIN', 'ACCOUNTANT'), 
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { 
      name, 
      description, 
      sku, 
      price, 
      cost, 
      stockQuantity, 
      lowStockThreshold 
    } = req.body;

    // Check if SKU already exists
    if (sku) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          companyId: req.user!.companyId!!,
          sku
        }
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'SKU already exists'
        });
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        sku,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : null,
        stockQuantity: parseInt(stockQuantity) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 0,
        companyId: req.user!.companyId!!
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  })
);

// Update product stock
router.put('/products/:id/stock', authenticate, authorize('ADMIN', 'ACCOUNTANT'),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

    const product = await prisma.product.findFirst({
      where: {
        id,
        companyId: req.user!.companyId!!
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = operation === 'add' 
      ? { stockQuantity: { increment: parseInt(quantity) } }
      : { stockQuantity: { decrement: parseInt(quantity) } };

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: { product: updatedProduct }
    });
  })
);

// Get all services
router.get('/services', authenticate, asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
  const { page = 1, limit = 10, search } = req.query;
  
  const where: any = {
    companyId: req.user!.companyId!,
    isActive: true
  };

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } }
    ];
  }

  const services = await prisma.service.findMany({
    where,
    orderBy: { name: 'asc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  });

  const total = await prisma.service.count({ where });

  res.json({
    success: true,
    data: {
      services,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
}));

// Create service
router.post('/services', authenticate, authorize('ADMIN', 'ACCOUNTANT'),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
    const { name, description, price } = req.body;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        companyId: req.user!.companyId!!
      }
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: { service }
    });
  })
);

// Get low stock alerts
router.get('/alerts/low-stock', authenticate, asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
  const allProducts = await prisma.product.findMany({
    where: {
      companyId: req.user!.companyId!,
      isActive: true
    },
    orderBy: { stockQuantity: 'asc' }
  });

  const lowStockProducts = allProducts.filter((product: any) => 
    product.stockQuantity <= product.lowStockThreshold
  );

  res.json({
    success: true,
    data: { products: lowStockProducts }
  });
}));

// Get inventory summary
router.get('/summary', authenticate, asyncHandler(async (req: AuthRequest, res: Response): Promise<any> => {
  const [
    totalProducts,
    totalServices,
    totalStockValue,
    allProducts
  ] = await Promise.all([
    prisma.product.count({
      where: {
        companyId: req.user!.companyId!!,
        isActive: true
      }
    }),
    prisma.service.count({
      where: {
        companyId: req.user!.companyId!!,
        isActive: true
      }
    }),
    prisma.product.aggregate({
      where: {
        companyId: req.user!.companyId! || undefined,
        isActive: true
      },
      _sum: {
        stockQuantity: true
      }
    }),
    prisma.product.findMany({
      where: {
        companyId: req.user!.companyId!!,
        isActive: true
      }
    })
  ]);

  const lowStockCount = allProducts.filter((product: any) => 
    product.stockQuantity <= product.lowStockThreshold
  ).length;

  res.json({
    success: true,
    data: {
      totalProducts,
      totalServices,
      lowStockCount,
      totalStockQuantity: totalStockValue._sum?.stockQuantity || 0
    }
  });
}));

export default router;