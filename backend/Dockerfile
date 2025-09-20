# Multi-stage Dockerfile for Backend

# Base stage
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache curl dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma/ ./prisma/

# Development stage
FROM base AS development

# Install all dependencies (including devDependencies)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Create directories
RUN mkdir -p uploads logs

# Expose port and debug port
EXPOSE 3000 9229

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start development server with nodemon
CMD ["dumb-init", "npm", "run", "dev"]

# Production build stage
FROM base AS builder

# Install all dependencies for building
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM base AS production

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copy other necessary files
COPY package*.json ./

# Create directories
RUN mkdir -p uploads logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["dumb-init", "npm", "start"]