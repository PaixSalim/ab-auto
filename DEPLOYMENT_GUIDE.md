# Guide d'hébergement AB-AUTO

## Étape 1: Préparation du projet

### Variables d'environnement requises
```bash
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
APP_KEY=votre-app-key-généré-avec-`node ace generate:key`
SESSION_DRIVER=redis
DB_CONNECTION=pg
DB_HOST=votre-db-host
DB_PORT=5432
DB_USER=votre-db-user
DB_PASSWORD=votre-db-password
DB_NAME=votre-db-name
REDIS_HOST=votre-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=votre-redis-password
```

### Générer la clé d'application
```bash
node ace generate:key
```

## Étape 2: Build de production

### Installer les dépendances
```bash
npm ci --production
```

### Build des assets frontend
```bash
npm run build
```

### Compiler les views AdonisJS
```bash
node ace build
```

## Étape 3: Configuration de la base de données

### Migration et seed
```bash
node ace migration:run --force
node ace db:seed --force
```

## Étape 4: Options d'hébergement

### Option A: Vercel (Recommandé)
1. Installer Vercel CLI
```bash
npm i -g vercel
```

2. Créer vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. Déployer
```bash
vercel --prod
```

### Option B: DigitalOcean VPS
1. Créer un droplet Ubuntu 22.04
2. Installer Node.js 18+
3. Installer PostgreSQL
4. Installer Redis
5. Configurer Nginx comme reverse proxy
6. Utiliser PM2 pour la gestion des processus

### Option C: Railway
1. Connecter votre repo GitHub
2. Railway détecte automatiquement AdonisJS
3. Configurer les variables d'environnement
4. Déployer automatiquement

## Étape 5: Configuration du serveur

### Installation des dépendances système
```bash
# Sur Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm postgresql redis-server nginx
```

### Configuration Nginx
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ab-auto',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3333
    }
  }]
}
```

## Étape 6: Sécurité

### SSL avec Let's Encrypt
```bash
sudo certbot --nginx -d votre-domaine.com
```

### Firewall
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Étape 7: Monitoring et maintenance

### Logs
```bash
# PM2 logs
pm2 logs ab-auto

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup de la base de données
```bash
# Script de backup automatique
pg_dump -h localhost -U votre-user votre-db > backup.sql
```

## Étape 8: Domaine et DNS

1. Acheter un nom de domaine
2. Configurer les DNS vers l'IP de votre serveur
3. Configurer le domaine dans Nginx
4. Installer SSL

## Checklist avant déploiement

- [ ] Générer APP_KEY
- [ ] Configurer toutes les variables d'environnement
- [ ] Build des assets frontend
- [ ] Compiler les views AdonisJS
- [ ] Migrations de base de données
- [ ] Configurer le reverse proxy
- [ ] Installer SSL
- [ ] Configurer le monitoring
- [ ] Tester toutes les fonctionnalités
- [ ] Backup initial de la base de données

## Coûts estimés

### Vercel: $0-20/mois (selon l'usage)
### DigitalOcean: $5-50/mois (selon la taille du droplet)
### Railway: $5-20/mois (plan hobby)
### Domaine: $10-15/an
### SSL: Gratuit (Let's Encrypt)

## Support technique

- Documentation AdonisJS: https://docs.adonisjs.com
- Community Discord: https://discord.gg/adonisjs
- Issues GitHub: https://github.com/adonisjs/core/issues
