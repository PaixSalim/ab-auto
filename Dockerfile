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
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app

# Neutraliser tous les dialectes SQLite chargés inconditionnellement par lucid v21
RUN node -e " \
  const fs = require('fs'); \
  const path = require('path'); \
  const stub = 'module.exports = {}'; \
  const libsqlStub = 'Object.defineProperty(exports, \"__esModule\", { value: true }); exports.default = function(){};'; \
  const dialectsDir = '/app/node_modules/@adonisjs/lucid/node_modules/knex/lib/dialects'; \
  fs.mkdirSync(dialectsDir, { recursive: true }); \
  ['sqlite3.js', 'better-sqlite3.js'].forEach(f => { \
    fs.writeFileSync(path.join(dialectsDir, f), stub); \
    console.log('Stubbed:', f); \
  }); \
  const libsqlPath = '/app/node_modules/@adonisjs/lucid/build/src/clients/libsql.cjs'; \
  if (fs.existsSync(libsqlPath)) { \
    fs.writeFileSync(libsqlPath, libsqlStub); \
    console.log('Stubbed: libsql.cjs'); \
  } \
"

EXPOSE 8080
CMD ["node", "./bin/server.js"]
