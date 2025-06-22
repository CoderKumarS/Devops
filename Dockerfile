# Use an official Node.js 14 runtime as a parent image
FROM node:18-alpine

#enable the corepack (pnpm support)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install the dependencies
RUN pnpm install

# Copy the application code
COPY . .

# Expose the port
EXPOSE 3000

# Run the command to start the application
CMD ["pnpm", "dev"]