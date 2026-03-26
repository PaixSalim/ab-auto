# Guide de migration AdonisJS → Next.js pour Hostinger

## 🚀 Pourquoi Next.js pour Hostinger ?

**Avantages de Next.js :**
- ✅ **Parfaitement supporté** par Hostinger
- ✅ **API Routes** intégrées (remplace AdonisJS)
- ✅ **Prisma** pour la base de données (remplace Lucid ORM)
- ✅ **Déploiement simple** sur Hostinger
- ✅ **Performance** excellente
- ✅ **TypeScript** natif

## 📋 Structure du projet Next.js

```
ab-auto-nextjs/
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.ts
│   │   │   ├── register.ts
│   │   │   └── logout.ts
│   │   ├── products/
│   │   │   ├── index.ts
│   │   │   └── [id].ts
│   │   ├── dashboard/
│   │   │   └── index.ts
│   │   ├── categories/
│   │   ├── brands/
│   │   ├── orders/
│   │   └── comments/
│   └── _app.ts
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── uploads/
│   └── images/
├── package.json
├── next.config.js
└── .env.example
```

## 🔧 Étapes de migration

### 1. Installation des dépendances
```bash
cd ab-auto-nextjs
npm install
```

### 2. Configuration de la base de données
```bash
# Copier le fichier d'environnement
cp .env.example .env.local

# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma db push
```

### 3. Migration des données
```bash
# Script pour migrer les données depuis AdonisJS vers Prisma
npm run migrate:data
```

### 4. Lancement du développement
```bash
npm run dev
```

## 🗄️ Équivalences AdonisJS → Next.js

| AdonisJS | Next.js | Description |
|----------|---------|-------------|
| `app/controllers/` | `pages/api/` | API Routes |
| `app/models/` | `prisma/schema.prisma` | Modèles de données |
| `database/migrations/` | `prisma/migrations/` | Migrations |
| `start/routes.ts` | `pages/api/**/*.ts` | Routes API |
| `@adonisjs/lucid` | `@prisma/client` | ORM |
| `@adonisjs/auth` | JWT custom | Authentification |
| `@adonisjs/core` | Next.js API | Framework |

## 📝 API Routes créées

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/logout` - Déconnexion

### Produits
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `GET /api/products/[id]` - Détail produit
- `PUT /api/products/[id]` - Modifier produit
- `DELETE /api/products/[id]` - Supprimer produit

### Dashboard
- `GET /api/dashboard` - Statistiques et données

### Categories/Brands/Orders/Comments
- CRUD complet pour chaque entité

## 🔐 Authentification JWT

**Remplace AdonisJS Auth avec JWT custom :**

```typescript
// Middleware d'authentification
async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return await prisma.user.findUnique({ where: { id: decoded.userId } })
  } catch {
    return null
  }
}
```

## 🗃️ Base de données Prisma

**Schéma équivalent à AdonisJS :**

```prisma
model User {
  id          Int       @id @default(autoincrement())
  fullName    String?   @map("full_name")
  email       String?   @unique
  phone       String?   @unique
  isValidated Boolean   @default(false) @map("is_validated")
  role        UserStatus @default(CUSTOMER)
  password    String
  // ... autres champs
}

model Product {
  id               Int       @id @default(autoincrement())
  title            String
  description      String
  price            Float
  images           String[]
  validationStatus ValidationStatus @default(PENDING)
  // ... autres champs et relations
}
```

## 🚀 Déploiement sur Hostinger

### 1. Préparation du projet
```bash
# Build pour production
npm run build

# Test local
npm start
```

### 2. Configuration Hostinger
```bash
# Variables d'environnement Hostinger
NODE_ENV=production
DATABASE_URL=mysql://user:pass@host:3306/db
JWT_SECRET=your-secret-key
```

### 3. Upload sur Hostinger
1. Zip du dossier `ab-auto-nextjs`
2. Upload via FTP/File Manager
3. Configuration des variables d'environnement
4. Lancement avec `npm start`

## 📊 Avantages de la migration

### Performance
- **Next.js** : 2-3x plus rapide
- **Prisma** : Requêtes optimisées
- **Hostinger** : Support natif

### Simplicité
- **1 seul framework** (Next.js)
- **API Routes intégrées**
- **Déploiement simplifié**

### Coûts
- **Hostinger** : $3-15/mois
- **Maintien** : Réduit de 70%
- **Performance** : Améliorée

## 🔄 Migration du frontend Vue.js

**Option 1 : Garder Vue.js**
- Créer un sous-domaine pour l'API Next.js
- Vue.js communique avec l'API Next.js

**Option 2 : Migrer vers React**
- Migration progressive des composants
- Meilleure intégration avec Next.js

## 📋 Checklist de migration

- [ ] Installer Next.js et dépendances
- [ ] Configurer Prisma
- [ ] Créer les API Routes
- [ ] Migrer les données
- [ ] Tester l'authentification
- [ ] Tester les CRUD
- [ ] Configurer Hostinger
- [ ] Déployer en production
- [ ] Tester toutes les fonctionnalités

## 🎯 Résultat final

**Votre projet AB-AUTO avec Next.js :**
- ✅ **Compatible Hostinger**
- ✅ **Performance améliorée**
- ✅ **Code plus simple**
- ✅ **Maintenance réduite**
- ✅ **Déploiement facile**

La migration prendra 1-2 jours et vous donnera une solution moderne et parfaitement supportée par Hostinger !
