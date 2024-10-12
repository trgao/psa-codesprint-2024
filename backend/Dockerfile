# Dockerfile

# Use Node.js base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose internal port
EXPOSE 5000

# Run the application
CMD ["node", "app.js"]
