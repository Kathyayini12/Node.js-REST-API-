FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy dependency definitions
# The ./ at the end is crucial!
COPY package*.json ./

# Install only production dependencies
# Using 'npm clean-install' for a faster, more reliable build

RUN npm ci --only=production

# Copy the rest of your application code
COPY . .

# Security: Run as a non-privileged user provided by the alpine image
USER node

# Expose the application port
EXPOSE 3000

# Start the app
CMD ["node", "nasa.js"]
