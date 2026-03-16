# Test de connexion vendeur

## Étapes pour tester

### 1. Créer un vendeur (en tant qu'admin)

**Se connecter en tant qu'admin:**
- URL: `http://localhost:3333/auth/login`
- Email: `autopro@uvatis.com`
- Password: `YHs45*%92M9JiH72pII^RK4rh`

**Créer un vendeur:**
- Aller sur: `http://localhost:3333/admin/sellers`
- Cliquer sur "Nouveau vendeur"
- Remplir:
  - Nom complet: `Vendeur Test`
  - Email: `vendeur@test.com`
  - Password: `vendeur123`
- Cliquer sur "Créer"

### 2. Se déconnecter

- Cliquer sur le menu utilisateur (icône profil)
- Cliquer sur "Déconnexion"

### 3. Se connecter en tant que vendeur

- URL: `http://localhost:3333/auth/login`
- Email: `vendeur@test.com`
- Password: `vendeur123`
- Cliquer sur "Se connecter"

**Résultat attendu:**
- ✅ Vous devriez être redirigé vers `/seller`
- ✅ Vous devriez voir le dashboard vendeur avec la liste de vos produits (vide au début)
- ✅ Vous devriez voir la sidebar avec 4 liens:
  - Dashboard
  - Mes Produits
  - Catégories
  - Commentaires

### 4. Tester les fonctionnalités

**a) Créer une catégorie:**
- Aller sur: `http://localhost:3333/seller/categories`
- Cliquer sur "Nouvelle catégorie"
- Nom: `Test Catégorie`
- URL: `test-categorie`
- Cliquer sur "Créer"

**b) Créer un produit:**
- Aller sur: `http://localhost:3333/seller/products`
- Cliquer sur "Ajouter un produit"
- Remplir tous les champs obligatoires
- Cliquer sur "Créer"

**c) Voir les commentaires:**
- Aller sur: `http://localhost:3333/seller/comments`
- Vous devriez voir vos produits (vide si pas de commentaires)

---

## Problèmes possibles

### Erreur "Accès réservé aux vendeurs"
- Vérifiez que vous êtes bien connecté avec un compte vendeur
- Vérifiez que le rôle est bien "seller" dans la base de données

### Page blanche après connexion
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs JavaScript
- Vérifiez que les routes sont bien configurées

### Impossible de créer un produit
- Vérifiez qu'il y a des catégories dans la base (via les seeders)
- Vérifiez qu'il y a des marques dans la base (via les seeders)

---

## Vérification base de données

Si vous avez des problèmes, vérifiez que les seeders ont bien été exécutés:

```bash
node ace db:seed
```

Cela créera:
- ✅ Catégories
- ✅ Marques
- ✅ Produits de test
- ✅ Utilisateur admin
- ✅ Commentaires
- ✅ Promotions
- ✅ Bannières
- ✅ Partenaires
