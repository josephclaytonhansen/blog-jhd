FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S frontend -u 1001

# Change ownership of the app directory
RUN chown -R frontend:nodejs /app
USER frontend

EXPOSE 5173

CMD ["npm", "run", "dev"]