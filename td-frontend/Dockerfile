# =============================================================================
# Stage 1: Build the React+Vite application
# =============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for optimal Docker layer caching.
# This layer is only rebuilt when package.json or package-lock.json change.
COPY package.json package-lock.json ./

# Clean install — faster and more deterministic than `npm install`
RUN npm ci

# Copy the rest of the source code
COPY . .

# TypeScript check + Vite production build → outputs to dist/
RUN npx tsc -b && npx vite build

# =============================================================================
# Stage 2: Serve the built bundle with nginx
# =============================================================================
FROM nginx:alpine

# Install openssl and generate a self-signed certificate
RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=US/ST=State/L=City/O=TechDepot/CN=localhost"

# Remove the default nginx site config
RUN rm /etc/nginx/conf.d/default.conf

# Write a custom nginx config that:
#   - Serves the SPA static files
#   - Proxies /api/ requests to the backend Docker service
#   - Supports client-side (SPA) routing via try_files fallback
RUN cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    listen 443 ssl;
    server_name localhost;
    
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Copy the production build from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80 443

# nginx runs in the foreground by default with the base image's CMD
