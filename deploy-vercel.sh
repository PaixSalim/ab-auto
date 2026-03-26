#!/bin/bash

echo "🚀 Déploiement AB-AUTO sur Vercel"
echo "================================="

# 1. Installation Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm i -g vercel
fi

# 2. Build du projet
echo "🔨 Build des assets..."
npm run build

echo "🔧 Compilation des views AdonisJS..."
node ace build

# 3. Génération de la clé d'application
if [ ! -f .env.production ]; then
    echo "🔑 Génération de la clé d'application..."
    node ace generate:key > .env.production
    echo "✅ Clé générée dans .env.production"
fi

# 4. Installation des dépendances de production
echo "📦 Installation des dépendances de production..."
npm ci --production

# 5. Déploiement sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé !"
echo "🌐 URL de l'application: https://ab-auto-ecommerce.vercel.app"
