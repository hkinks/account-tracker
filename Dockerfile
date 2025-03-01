# Build the client
FROM node:18-alpine as client-build

WORKDIR /app/client

# Copy client package files
COPY client/package.json client/package-lock.json* client/tsconfig.json ./

# Install client dependencies
RUN npm ci

# Copy client source code
COPY client/src/ ./src/
COPY client/public/ ./public/

# Build the client
RUN npm run build

# Build the server
FROM node:18-alpine as server-build

WORKDIR /app/server

# Copy server package files
COPY server/package.json server/package-lock.json* server/tsconfig.json ./

# Install server dependencies
RUN npm ci

# Copy server source code
COPY server/src/ ./src/

# Build the server
RUN npm run build

# Production stage
FROM node:18-alpine

# Install nginx
RUN apk add --no-cache nginx

WORKDIR /app

# Copy server package files and install production dependencies
COPY server/package.json server/package-lock.json* ./
RUN npm ci --production

# Copy built server from build stage
COPY --from=server-build /app/server/dist ./dist

# Copy built client files to nginx serve directory
COPY --from=client-build /app/client/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose only nginx port
EXPOSE 80

# Start script to run both nginx and node server
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"] 