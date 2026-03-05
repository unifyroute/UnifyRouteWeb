FROM ubuntu:22.04 AS builder

# Install Hugo
RUN apt-get update && apt-get install -y \
    wget \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Download and install latest Hugo
RUN wget https://github.com/gohugoio/hugo/releases/download/v0.120.0/hugo_0.120.0_linux-amd64.deb && \
    apt-get install -y ./hugo_0.120.0_linux-amd64.deb && \
    rm hugo_0.120.0_linux-amd64.deb

# Copy website source
WORKDIR /app
COPY . .

# Build the website
RUN ./build.sh

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy built website from builder
COPY --from=builder /app/public /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
