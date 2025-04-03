# Use Node.js base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app
RUN npm run build

# Expose frontend port
EXPOSE 5173 

# Run React app
CMD ["npm", "run", "dev"] # Change if using `create-react-app` (serve -s build)
