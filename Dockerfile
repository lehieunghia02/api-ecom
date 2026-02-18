# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Copy source code (cần cho build)
COPY tsconfig.json ./
COPY . .

# Install và build (bỏ postinstall để tránh build 2 lần)
RUN npm ci --ignore-scripts && npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install production dependencies only (bỏ postinstall vì không cần build)
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/build ./build

# Create upload directories
RUN mkdir -p upload/product upload/avatar

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "build/index.js", "production"]
