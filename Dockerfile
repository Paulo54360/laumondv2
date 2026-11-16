# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy necessary files from builder with correct ownership
COPY --chown=node:node --from=builder /app/.output ./.output
# Optional: Copy public folder if you have static assets not handled by Nuxt build
# COPY --from=builder /app/public ./public

# Use non-root user for security
USER node

# Expose the listening port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
