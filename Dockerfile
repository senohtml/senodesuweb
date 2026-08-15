FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY senodesu-project/backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend application
COPY senodesu-project/backend/ .

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
