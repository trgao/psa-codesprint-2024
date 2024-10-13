# Dockerfile

# Use Node.js base image
FROM node:16

# Set the working directory
WORKDIR /app

RUN apt-get update && apt-get install -y build-essential

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

RUN g++ -o ./services/hungarian ./services/hungarian.cpp

# Expose internal port
EXPOSE 8000

# Run the application
CMD ["node", "app.js"]
