# Install Node.js
FROM node:14-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app files
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD [ "npm", "start" ]
