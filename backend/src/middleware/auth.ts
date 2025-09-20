import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './errorHandler';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    companyId: string | null;
  };
}

export const authenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          role: true,
          companyId: true,
          isActive: true
        }
      });

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Token is invalid or user is inactive'
        });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      };
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token is invalid'
      });
    }
  }
);

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate.'
      });
    }

    // Admin has access to everything
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}. Your role: ${req.user.role}`
      });
    }

    next();
  };
};