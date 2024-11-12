# Stage 1: Build the application
FROM node:18-alpine as builder

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) for dependency installation
COPY package*.json ./

# Install all dependencies including 'devDependencies'
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Setup production image
FROM node:18-alpine

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the built application from the previous stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy package.json and package-lock.json (or yarn.lock) for dependency installation
COPY package*.json ./

# Install only 'production' dependencies
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]