# ============================================================
# Pagina web NEXA — Dockerfile
# Multi-stage: build con Node, serve con nginx
# ============================================================

# --- Stage 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar dependencias primero (aprovecha cache de Docker)
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Copiar el resto del código y buildear
COPY . .
RUN npm run build

# --- Stage 2: Serve ---
FROM nginx:1.27-alpine AS production

# Copiar el build al directorio de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración nginx para SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
