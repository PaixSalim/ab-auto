# Système Multi-Rôles - Documentation

## Vue d'ensemble

Le système a été étendu pour supporter 3 types d'utilisateurs avec des permissions différentes :

### 🔴 ADMIN (Administrateur)
- Gère tous les aspects du système
- Inscrit et gère les vendeurs
- Accès complet à toutes les fonctionnalités
- Peut gérer tous les produits, commandes, promotions

### 🟡 SELLER (Vendeur)
- Gère ses propres produits
- Crée et gère les catégories et sous-catégories
- Voit les commentaires sur ses produits
- Peut répondre aux commentaires clients
- Accès limité à ses propres données

### 🟢 CUSTOMER (Client)
- Peut créer un compte
- Consulte les produits
- Fait des commentaires sur les produits
- Passe des commandes

---

## Routes Disponibles

### Routes Publiques
- `GET /auth/register` - Page d'inscription client
- `POST /auth/register` - Créer un compte client
- `GET /auth/login` - Page de connexion
- `POST /auth/login` - Se connecter
- `POST /auth/logout` - Se déconnecter

### Routes Admin (nécessite rôle ADMIN)
**Préfixe: `/admin`**

#### Gestion des vendeurs
- `GET /admin/sellers` - Liste des vendeurs
- `POST /admin/sellers/create` - Créer un vendeur
- `DELETE /admin/sellers/delete/:id` - Supprimer un vendeur

#### Autres fonctionnalités admin
- `GET /admin/dashboard` - Tableau de bord
- `GET /admin/products` - Tous les produits
- `GET /admin/orders` - Toutes les commandes
- `GET /admin/comments` - Tous les commentaires
- `GET /admin/promotions` - Toutes les promotions

### Routes Vendeur (nécessite rôle SELLER ou ADMIN)
**Préfixe: `/seller`**

#### Dashboard vendeur
- `GET /seller` ou `/seller/dashboard` - Dashboard vendeur
- `GET /seller/products` - Mes produits
- `GET /seller/comments` - Commentaires sur mes produits
- `POST /seller/comments/reply` - Répondre à un commentaire

#### Gestion des catégories
- `GET /seller/categories` - Liste des catégories
- `POST /seller/categories/create` - Créer une catégorie/sous-catégorie
- `PUT /seller/categories/edit` - Modifier une catégorie
- `DELETE /seller/categories/delete/:id` - Supprimer une catégorie

#### Gestion des produits
- `POST /seller/product/create` - Créer un produit
- `PUT /seller/product/edit` - Modifier un produit
- `DELETE /seller/product/delete/:id` - Supprimer un produit

---

## Modèles de données mis à jour

### User
```typescript
{
  id: number
  fullName: string
  email: string
  role: 'customer' | 'seller' | 'admin'
  password: string
  products: Product[]        // Produits du vendeur
  comments: Comment[]        // Commentaires de l'utilisateur
}
```

### Category
```typescript
{
  id: number
  name: string
  url: string
  parentId: number | null    // NULL = catégorie principale
  parent: Category           // Catégorie parente
  subCategories: Category[]  // Sous-catégories
  products: Product[]
}
```

### Product
```typescript
{
  id: number
  name: string
  description: string
  price: number
  categoryId: number
  brandId: number
  sellerId: number | null    // ID du vendeur
  seller: User               // Relation vers le vendeur
  // ... autres champs
}
```

### Comment
```typescript
{
  id: number
  productId: number
  userId: number | null      // ID de l'utilisateur
  parentId: number | null    // NULL = commentaire principal
  comment: string
  user: string               // Nom affiché
  isActive: boolean
  author: User               // Relation vers l'utilisateur
  parent: Comment            // Commentaire parent
  replies: Comment[]         // Réponses
}
```

---

## Exemples d'utilisation

### 1. Inscription d'un client
```bash
POST /auth/register
{
  "fullName": "Jean Dupont",
  "email": "jean@example.com",
  "password": "motdepasse123"
}
```

### 2. Admin crée un vendeur
```bash
POST /admin/sellers/create
{
  "fullName": "Vendeur Auto",
  "email": "vendeur@example.com",
  "password": "vendeur123"
}
```

### 3. Vendeur crée une catégorie
```bash
POST /seller/categories/create
{
  "name": "Pièces moteur",
  "url": "pieces-moteur",
  "parentId": null  // Catégorie principale
}
```

### 4. Vendeur crée une sous-catégorie
```bash
POST /seller/categories/create
{
  "name": "Pistons",
  "url": "pistons",
  "parentId": 1  // Sous-catégorie de "Pièces moteur"
}
```

### 5. Vendeur crée un produit
```bash
POST /seller/product/create
{
  "name": "Piston Honda Civic",
  "description": "Piston haute performance",
  "price": 45000,
  "categoryId": 2,  // Sous-catégorie "Pistons"
  "brandId": 7,
  "state": "new",
  "warranty": "6 mois",
  "features": ["Haute qualité", "Durable"]
}
```

### 6. Vendeur répond à un commentaire
```bash
POST /seller/comments/reply
{
  "commentId": 5,
  "comment": "Merci pour votre retour ! Nous sommes ravis que vous soyez satisfait."
}
```

---

## Middlewares

### `auth` - Authentification requise
Vérifie que l'utilisateur est connecté

### `admin` - Rôle administrateur requis
Vérifie que l'utilisateur a le rôle ADMIN

### `seller` - Rôle vendeur requis
Vérifie que l'utilisateur a le rôle SELLER ou ADMIN

---

## Prochaines étapes (Frontend)

Pour compléter l'implémentation, il faut créer les pages Vue.js suivantes :

1. **Page d'inscription client** : `inertia/pages/auth/register.vue`
2. **Dashboard vendeur** : `inertia/pages/seller/products/index.vue`
3. **Gestion catégories vendeur** : `inertia/pages/seller/categories/index.vue`
4. **Commentaires vendeur** : `inertia/pages/seller/comments/index.vue`
5. **Gestion vendeurs admin** : `inertia/pages/admin/sellers/index.vue`

---

## Tests

Pour tester le système :

1. **Créer un admin** (déjà fait via seeder)
   - Email: `autopro@uvatis.com`
   - Password: `YHs45*%92M9JiH72pII^RK4rh`

2. **Se connecter en tant qu'admin**
   - Aller sur `/auth/login`

3. **Créer un vendeur**
   - Aller sur `/admin/sellers`
   - Créer un nouveau vendeur

4. **Se connecter en tant que vendeur**
   - Se déconnecter
   - Se reconnecter avec les identifiants du vendeur

5. **Tester les fonctionnalités vendeur**
   - Créer des catégories
   - Créer des produits
   - Répondre aux commentaires

---

## Base de données

Les nouvelles colonnes ajoutées :

- `products.seller_id` - Lien vers le vendeur
- `categories.parent_id` - Lien vers la catégorie parente
- `comments.user_id` - Lien vers l'utilisateur
- `comments.parent_id` - Lien vers le commentaire parent

Toutes les migrations ont été exécutées avec succès ✅
