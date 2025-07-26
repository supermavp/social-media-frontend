# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker cache
# This step only runs if package.json or lock files change
COPY package.json package-lock.json ./
# If you are using yarn, use: COPY package.json yarn.lock ./

# Install dependencies
RUN npm install
# If you are using yarn, use: RUN yarn install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build the React application for production
# Ensure your package.json has a "build" script that outputs to 'dist'
# Example: "build": "tsc && vite build"
RUN npm run build
# If you are using yarn, use: RUN yarn build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from the builder stage into Nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add a custom Nginx configuration for single-page applications (SPA)
# This is crucial for client-side routing (e.g., React Router)
COPY nginx/nginx.conf /etc/nginx/conf.d/nginx.conf

# Expose port 80, which Nginx will listen on
EXPOSE 80

# Command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]