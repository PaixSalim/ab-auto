#!/bin/bash

echo "🚀 Déploiement AB-AUTO sur Hotinger"
echo "=================================="

# 1. Nettoyage et installation
echo "📦 Installation des dépendances..."
npm ci --production

# 2. Build du projet
echo "🔨 Build des assets..."
npm run build

echo "🔧 Compilation des views AdonisJS..."
node ace build

# 3. Configuration des variables d'environnement
echo "⚙️ Configuration de l'environnement..."
if [ ! -f .env.production ]; then
    echo "❌ Fichier .env.production introuvable"
    echo "Création du fichier .env.production..."
    cat > .env.production << EOF
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
APP_KEY=generated-app-key-here
SESSION_DRIVER=redis
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=hotinger_user
DB_PASSWORD=your-db-password
DB_NAME=hotinger_db
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
ASSET_URL=https://votre-app.hotinger.dev
CACHE_VIEWS=true
EOF
    echo "✅ Fichier .env.production créé"
    echo "⚠️  Veuillez modifier les valeurs avant de continuer"
    exit 1
fi

# 4. Génération de la clé d'application si nécessaire
if ! grep -q "APP_KEY=" .env.production; then
    echo "🔑 Génération de la clé d'application..."
    node ace generate:key
fi

# 5. Optimisation pour production
echo "⚡ Optimisation pour production..."
node ace optimize

# 6. Vérification de la santé de l'application
echo "🏥 Vérification de la santé..."
curl -f http://localhost:3333/health || {
    echo "❌ L'application ne répond pas correctement"
    exit 1
}

echo "✅ Préparation terminée !"
echo "📋 Prochaines étapes :"
echo "1. Connecter votre repo GitHub à Hotinger"
echo "2. Configurer les variables d'environnement dans Hotinger"
echo "3. Lancer le déploiement"
echo ""
echo "🌐 URL de l'application: https://votre-app.hotinger.dev"
