# ── Stage 1: Build Spring Boot backend ───────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app/backend
COPY backend/pom.xml ./
# Download dependencies first (layer-cached unless pom.xml changes)
RUN mvn dependency:go-offline -q

COPY backend/src ./src
RUN mvn clean package -DskipTests -q

# ── Stage 2: Build React frontend ─────────────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Inject the API URL so the frontend can reach the Spring Boot backend
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ── Stage 3: Production image ──────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Copy Spring Boot jar
COPY --from=backend-build /app/backend/target/*.jar /app/backend/app.jar

# Copy React build output to nginx web root
# react-router build outputs to build/client for static assets
COPY --from=frontend-build /app/build/client /usr/share/nginx/html

# nginx and supervisord configuration
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisord.conf

# Ensure required directories exist and web root is readable by nginx worker
RUN mkdir -p /run/nginx /var/log/nginx /var/log /var/run && \
    chown -R nginx:nginx /usr/share/nginx/html /run/nginx && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 3000 8080

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
