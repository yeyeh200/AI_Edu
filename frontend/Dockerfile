FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source code
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]