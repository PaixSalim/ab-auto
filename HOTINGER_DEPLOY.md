# Configuration spécifique pour Hotinger

## Étapes de déploiement sur Hotinger

### 1. Configuration du projet

#### A. Mettre à jour package.json
```json
{
  "scripts": {
    "build": "vite build",
    "start": "node server.js",
    "deploy": "chmod +x deploy-hotinger.sh && ./deploy-hotinger.sh"
  }
}
```

#### B. Configuration de Vite pour Hotinger
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/build'

export default defineConfig({
  plugins: [
    vue(),
    adonisjs({
      entrypoints: ['resources/js/app.js'],
      assetsCss: ['resources/css/app.css'],
      reload: process.env.NODE_ENV === 'development'
    })
  ],
  build: {
    outDir: 'public/assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', '@inertiajs/vue3']
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173
  }
})
```

### 2. Configuration de la base de données Hotinger

#### MySQL (Recommandé pour Hotinger)
```bash
# Dans la console Hotinger
DB_HOST=your-hotinger-mysql-host
DB_PORT=3306
DB_USER=your-hotinger-db-user
DB_PASSWORD=your-hotinger-db-password
DB_NAME=your-hotinger-db-name
```

#### PostgreSQL (Alternative)
```bash
DB_CONNECTION=pg
DB_HOST=your-hotinger-pg-host
DB_PORT=5432
DB_USER=your-hotinger-pg-user
DB_PASSWORD=your-hotinger-pg-password
DB_NAME=your-hotinger-pg-name
```

### 3. Variables d'environnement Hotinger

#### Variables requises
```bash
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
APP_KEY=votre-app-key-généré-avec-`node ace generate:key`
SESSION_DRIVER=redis
CACHE_VIEWS=true
ASSET_URL=https://votre-app.hotinger.dev
```

#### Variables optionnelles
```bash
LOG_CHANNEL=stack
LOG_LEVEL=info
BROADCAST_DRIVER=log
QUEUE_CONNECTION=redis
```

### 4. Déploiement automatique

#### Configuration GitHub Actions
```yaml
# .github/workflows/deploy-hotinger.yml
name: Deploy to Hotinger

on:
  push:
    branches: [main, production]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci --production
    
    - name: Build application
      run: |
        npm run build
        node ace build
    
    - name: Deploy to Hotinger
      uses: hotinger/action@v1
      with:
        hotinger-api-token: ${{ secrets.HOTINGER_API_TOKEN }}
        app-id: your-app-id
```

### 5. Monitoring et logs

#### Vérification de santé
```javascript
// routes/health.js
import { HttpContext } from '@adonisjs/core/http'

export default class HealthController {
  async index({ response }: HttpContext) {
    return response.ok({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version
    })
  }
}
```

#### Route de santé
```typescript
// start/routes.ts
import Route from '@adonisjs/core/services'
import HealthController from '#controllers/health_controller'

Route.get('/health', [HealthController, 'index'])
```

### 6. Optimisations spécifiques

#### Cache Redis
```typescript
// config/cache.ts
import { defineConfig } from '@adonisjs/cache'

export default defineConfig({
  driver: 'redis',
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    db: 0
  }
})
```

#### Session Redis
```typescript
// config/session.ts
import { defineConfig } from '@adonisjs/session'

export default defineConfig({
  driver: 'redis',
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    db: 0
  }
})
```

### 7. Sécurité

#### CORS
```typescript
// config/cors.ts
import { defineConfig } from '@adonisjs/cors'

export default defineConfig({
  origin: ['https://votre-app.hotinger.dev', 'https://votre-domaine.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
})
```

#### SSL et HTTPS
```typescript
// config/app.ts
import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  appUrl: process.env.APP_URL || 'https://votre-app.hotinger.dev',
  forceContentNegotiationToAcceptHeader: true,
  http: {
    cookieMaxAge: '2h',
    allowMethodSpoofing: true
  }
})
```

### 8. Checklist pré-déploiement

- [ ] Générer `APP_KEY` avec `node ace generate:key`
- [ ] Configurer toutes les variables d'environnement
- [ ] Tester la connexion à la base de données
- [ ] Vérifier la route `/health`
- [ ] Build des assets frontend
- [ ] Compiler les views AdonisJS
- [ ] Configurer le domaine personnalisé
- [ ] Activer le SSL automatique
- [ ] Configurer les backups automatiques
- [ ] Tester toutes les fonctionnalités en staging

### 9. Commandes rapides

```bash
# Déploiement local
chmod +x deploy-hotinger.sh
./deploy-hotinger.sh

# Build uniquement
npm run build
node ace build

# Vérification de santé
curl https://votre-app.hotinger.dev/health

# Logs Hotinger (après déploiement)
hotinger logs votre-app-id
```

### 10. Tarifs Hotinger

- **Starter** : $0/mois (limité)
- **Professional** : $7/mois (plus de ressources)
- **Business** : $25/mois (haute performance)

### Support

- Documentation Hotinger : https://docs.hotinger.dev
- Support Discord : https://discord.gg/hotinger
- API Documentation : https://api.hotinger.dev
