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

# Patch knex ESM exports
RUN node --input-type=module <<'EOF'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'

const paths = [
  '/app/node_modules/@adonisjs/lucid/node_modules/knex/package.json',
  '/app/node_modules/knex/package.json'
]

let patched = false
for (const p of paths) {
  if (existsSync(p)) {
    const pkg = JSON.parse(readFileSync(p, 'utf-8'))
    pkg.exports = { '.': { require: './knex.js', import: './knex.js', default: './knex.js' } }
    writeFileSync(p, JSON.stringify(pkg, null, 2))
    console.log('knex patched at: ' + p)
    patched = true
  }
}

if (!patched) {
  console.log('knex not found, listing node_modules...')
  const dirs = readdirSync('/app/node_modules/').filter(d => d.includes('knex'))
  console.log('knex-related:', dirs.join(', '))
}
EOF

EXPOSE 8080
# CMD ["sh", "-c", "node ace migration:run --force && node ace db:seed --files database/seeders/0system_setup_seeder.ts && node ace db:seed --files database/seeders/permission_seeder.ts && node ace db:seed --files database/seeders/role_seeder.ts && node ace db:seed --files database/seeders/1category_seeder.ts && node ace db:seed --files database/seeders/2brand_seeder.ts && node ace db:seed --files database/seeders/3product_seeder.ts && node ace db:seed --files database/seeders/6user_seeder.ts && node ace db:seed --files database/seeders/comment_seeder.ts && node ./bin/server.js"]
# CMD ["sh", "-c", "node ace migration:run --force && node ./bin/server.js"]
CMD ["node", "./bin/server.js"]