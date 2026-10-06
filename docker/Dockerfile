# ⚡ ZYRO - Tech Accessories Platform
# Docker Production Build (Multi-stage: Node v22 → Nginx)
# Build: docker build -t we3ds-solution/zyro-electric:latest .
# Run:   docker run -p 3030:80 we3ds-solution/zyro-electric:latest
# Push:  docker push we3ds-solution/zyro-electric:latest

# ── Stage 1: Build Angular App with Node 22 ────────────────────────────────────
FROM node:22-alpine AS builder

LABEL maintainer="ZYRO Dev Team <dev@zyro.tech>"
LABEL description="ZYRO - Premium Tech Accessories E-Commerce Platform (Production Build)"
LABEL brand="ZYRO - Tech. Organized. Elevated."

# Set shell for Alpine to enable pipefail
SHELL ["/bin/ash", "-o", "pipefail", "-c"]

WORKDIR /app

# Copy frontend dependency files
COPY frontend/package.json frontend/package-lock.json ./

# Install ALL dependencies (need devDependencies for build)
RUN npm ci --legacy-peer-deps

# Copy frontend source code
COPY frontend/ ./

# Build the production bundle (optimized)
RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

LABEL maintainer="ZYRO Dev Team <dev@zyro.tech>"
LABEL description="ZYRO - Tech Accessories E-Commerce Platform"

WORKDIR /etc/nginx

# Remove default Nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom Nginx config (optimized for SPA routing)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist/market /usr/share/nginx/html

# Set permissions (nginx user already exists in nginx base image)
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html

# Expose port 80 (Nginx listens on 80, docker-compose maps to 3030)
EXPOSE 80

# Health check - verify Nginx is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
