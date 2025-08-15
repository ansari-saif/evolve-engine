# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set environment variables
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    curl

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies using yarn (including dev dependencies for build)
RUN yarn install --frozen-lockfile --production=false

# Copy project files
COPY . .

# Build for production if NODE_ENV is production
RUN if [ "$NODE_ENV" = "production" ]; then \
        echo "Building for production..." && \
        yarn build && \
        yarn global add serve && \
        echo "Production build complete"; \
    else \
        echo "Skipping production build"; \
    fi

# Copy start script

# Expose port
EXPOSE 3000

# Make start script executable

# Start server based on environment
CMD if [ "$NODE_ENV" = "production" ]; then serve -s dist -l 3000; else yarn dev --host 0.0.0.0 --port 3000; fi
