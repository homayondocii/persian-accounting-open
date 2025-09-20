import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export class DatabaseService {
  private prisma: PrismaClient;
  
  constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['error'],
      errorFormat: 'minimal',
    });
  }

  async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info('Database connected successfully');
      
      // Check database type from connection string
      const databaseUrl = process.env.DATABASE_URL || '';
      const isPostgreSQL = databaseUrl.includes('postgresql://');
      const isSQLite = databaseUrl.includes('file:') || databaseUrl.includes('.db');
      
      if (isPostgreSQL) {
        logger.info('Using PostgreSQL database');
      } else if (isSQLite) {
        logger.info('Using SQLite database');
      } else {
        logger.warn('Unknown database type');
      }
      
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Database disconnection failed:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; database: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      
      const databaseUrl = process.env.DATABASE_URL || '';
      const databaseType = databaseUrl.includes('postgresql://') ? 'PostgreSQL' : 
                          databaseUrl.includes('file:') ? 'SQLite' : 'Unknown';
      
      return {
        status: 'healthy',
        database: databaseType
      };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        database: 'Unknown'
      };
    }
  }

  getClient(): PrismaClient {
    return this.prisma;
  }
}

export const dbService = new DatabaseService();