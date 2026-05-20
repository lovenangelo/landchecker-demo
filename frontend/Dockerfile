# syntax=docker/dockerfile:1

# Build stage
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-slim AS build

WORKDIR /app

# Enable pnpm
RUN corepack enable pnpm

# Install dependencies
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Build
COPY . .

ARG VITE_API_URL=https://landchecker.lovenangelo.dev
ARG VITE_USE_MOCK=false
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_MOCK=$VITE_USE_MOCK

RUN pnpm build

# Production stage
FROM nginx:alpine AS production

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config: SPA routing + API proxy to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
