# -----------------------
# 1) Build stage for React frontend
# -----------------------
FROM node:18-alpine AS builder

# Install yarn globally
RUN apk add --no-cache yarn

WORKDIR /app/frontend

# Copy only package files first (caching)
COPY frontend/package.json frontend/yarn.lock ./

# If BuildKit is enabled, use the caching approach
RUN --mount=type=cache,target=/root/.yarn \
    YARN_CACHE_FOLDER=/root/.yarn \
    yarn install

# Copy the rest of the frontend source
COPY frontend/ ./

# Build the frontend (outputs to /app/frontend/dist by default)
RUN yarn build

# -----------------------
# 2) Production stage for Node backend
# -----------------------
FROM node:18-alpine

# Install yarn and SQLite
RUN apk add --no-cache yarn sqlite sqlite-dev

WORKDIR /app

# Copy backend package files
COPY backend/package.json backend/yarn.lock ./

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

# Create data directory for SQLite
RUN mkdir -p /app/data && \
    chown -R node:node /app/data

# Copy backend code
COPY backend/ ./

# Copy the React build from builder stage
COPY --from=builder /app/frontend/dist ./dist

# Set database path environment variable
ENV SQLITE_DB_PATH=/app/data/finance.db

# HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost:5000 || exit 1

ENV PATH="/app/node_modules/.bin:$PATH"
ENV NODE_ENV=production

# Use node user instead of creating new user
USER node

EXPOSE 5000
CMD ["node", "server.js"]
