# Use an official Node.js 14 runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files and pnpm-lock.yaml
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install the dependencies
RUN pnpm install

# Copy the application code
COPY . .

# Expose the port
EXPOSE 3000

# Run the command to start the application
CMD ["pnpm", "start"]