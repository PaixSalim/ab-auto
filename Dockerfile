FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN npm run build

# Production stage
# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app

# Créer un stub pour le dialecte sqlite3 manquant
RUN mkdir -p /app/node_modules/@adonisjs/lucid/node_modules/knex/lib/dialects && \
    echo "module.exports = {}" > /app/node_modules/@adonisjs/lucid/node_modules/knex/lib/dialects/sqlite3.js

EXPOSE 8080
CMD ["node", "./bin/server.js"]
