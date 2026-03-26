#!/bin/bash

echo "🚀 Migration AB-AUTO vers Next.js pour Hostinger"
echo "=============================================="

# Vérification de Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérification de la version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    echo "❌ Node.js 18+ requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Installation des dépendances
echo "📦 Installation des dépendances..."
cd ab-auto-nextjs
npm install

# Configuration de l'environnement
if [ ! -f .env.local ]; then
    echo "⚙️ Configuration de l'environnement..."
    cp .env.example .env.local
    echo "✅ Fichier .env.local créé"
    echo "⚠️  Veuillez modifier les variables d'environnement avant de continuer"
    echo "🔑 Clé JWT générée:"
    node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
fi

# Génération du client Prisma
echo "🗄️ Génération du client Prisma..."
npx prisma generate

# Configuration de la base de données
echo "🔧 Configuration de la base de données..."
echo "Veuillez configurer DATABASE_URL dans .env.local"
echo "Exemple: DATABASE_URL=mysql://user:password@localhost:3306/ab_auto_nextjs"

# Attendre la configuration
read -p "Appuyez sur Entrée une fois DATABASE_URL configuré..."

# Création des tables
echo "🏗️ Création des tables de la base de données..."
npx prisma db push

# Build du projet
echo "🔨 Build du projet..."
npm run build

# Test de l'application
echo "🧪 Test de l'application..."
npm start &
APP_PID=$!

sleep 5

# Test des API
echo "📡 Test des API endpoints..."
curl -f http://localhost:3000/api/auth/login || echo "⚠️  Login endpoint test failed"
curl -f http://localhost:3000/api/products || echo "⚠️  Products endpoint test failed"

# Arrêt du test
kill $APP_PID

echo "✅ Migration terminée !"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurer les variables d'environnement dans .env.local"
echo "2. Adapter votre frontend Vue.js pour utiliser les nouvelles API"
echo "3. Déployer sur Hostinger"
echo ""
echo "🌐 API endpoints disponibles:"
echo "- POST /api/auth/login"
echo "- POST /api/auth/register"
echo "- GET /api/products"
echo "- POST /api/products"
echo "- GET /api/dashboard"
echo ""
echo "📚 Documentation: NEXTJS_MIGRATION_GUIDE.md"
