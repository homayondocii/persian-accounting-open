import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticate, AuthRequest } from '@/middleware/auth';
import { dbService } from '@/utils/database';

const router = express.Router();
const prisma = dbService.getClient();

// Register
router.post('/register', asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { email, password, name, companyName } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create company first
  const company = await prisma.company.create({
    data: {
      name: companyName,
    }
  });

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
      companyId: company.id
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      companyId: true
    }
  });

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions
  );

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  });
}));

// Login
router.post('/login', asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  // Check if user exists and is active
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      company: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials or inactive account'
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions
  );

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company
      },
      token
    }
  });
}));

// Get current user
router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      company: {
        select: {
          id: true,
          name: true,
          settings: true
        }
      }
    }
  });

  res.json({
    success: true,
    data: { user }
  });
}));

// Update profile
router.put('/profile', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: updatedUser }
  });
}));

export default router;