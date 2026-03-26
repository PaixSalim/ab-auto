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

# Patcher libsql.cjs pour éviter require('@libsql/sqlite3') absent en prod
RUN node -e " \
  const fs = require('fs'); \
  const path = require('path'); \
  \
  const libsqlPath = '/app/node_modules/@adonisjs/lucid/build/src/clients/libsql.cjs'; \
  const libsqlStub = \`'use strict'; \
const Sqlite3Client = require('knex/lib/dialects/sqlite3'); \
module.exports = class LibSQLClient extends Sqlite3Client { \
  _driver() { return {}; } \
  get dialect() { return 'libsql'; } \
  get driverName() { return 'libsql'; } \
};\`; \
  fs.writeFileSync(libsqlPath, libsqlStub); \
  console.log('Patched libsql.cjs'); \
  \
  const dialectsDir = '/app/node_modules/@adonisjs/lucid/node_modules/knex/lib/dialects'; \
  fs.mkdirSync(dialectsDir, { recursive: true }); \
  const sqlite3Stub = \`'use strict'; \
const { ClientBase } = require('../../../lib/client'); \
module.exports = class SQLite3Client extends ClientBase { \
  get dialect() { return 'sqlite3'; } \
  get driverName() { return 'sqlite3'; } \
  _driver() { return {}; } \
};\`; \
  fs.writeFileSync(path.join(dialectsDir, 'sqlite3.js'), sqlite3Stub); \
  console.log('Patched sqlite3.js'); \
"

EXPOSE 8080
CMD ["node", "./bin/server.js"]
