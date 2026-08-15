FROM node:18-alpine

WORKDIR /app

# Install http-server untuk serve static files
RUN npm install -g http-server

# Copy frontend files
COPY . .

# Expose port
EXPOSE 3000

# Serve frontend
CMD ["http-server", ".", "-p", "3000", "--cors"]
