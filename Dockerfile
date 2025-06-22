# 간단한 NestJS Dockerfile

# Base image
FROM node:22.15.1-alpine AS base
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Development stage
FROM base AS development
# Install all dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 4011

# Start development server
CMD ["pnpm", "run", "start:dev"]

# Production stage (나중에 사용)
FROM base AS production
# Install only production dependencies
RUN pnpm install --prod

# Copy source code and build
COPY . .
RUN pnpm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs
USER nestjs

# Expose port
EXPOSE 4011

# Start production server
CMD ["node", "dist/main"]