import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { dbService } from '@/utils/database';
import authRoutes from '@/routes/auth';
import financialRoutes from '@/routes/financial';
import checkRoutes from '@/routes/checks';
import payrollRoutes from '@/routes/payroll';
import salesRoutes from '@/routes/sales';
import inventoryRoutes from '@/routes/inventory';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbHealth = await dbService.healthCheck();
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbHealth
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/checks', checkRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/inventory', inventoryRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await dbService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await dbService.disconnect();
  process.exit(0);
});

// Initialize database connection and start server
async function startServer() {
  try {
    // Start the server first
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
      logger.info(`💊 Health check available at http://localhost:${PORT}/health`);
    });
    
    // Try to connect to database with retries
    connectToDatabase();
    
    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Connect to database with retry logic
async function connectToDatabase(maxRetries: number = 5, delay: number = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await dbService.connect();
      logger.info('✅ Database connected successfully');
      return;
    } catch (error) {
      logger.warn(`Database connection attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt === maxRetries) {
        logger.error('❌ Failed to connect to database after all attempts. Server will continue running without database.');
        return;
      }
      
      logger.info(`Retrying database connection in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

export default app;