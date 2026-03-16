# Guide Vendeur - Auto-Pro

## 🎯 Connexion en tant que vendeur

### Étape 1 : Créer un compte vendeur (par l'admin)
1. L'administrateur doit d'abord créer votre compte vendeur
2. Vous recevrez vos identifiants (email + mot de passe)

### Étape 2 : Se connecter
1. Allez sur `http://localhost:3333/auth/login`
2. Entrez votre email et mot de passe
3. Vous serez redirigé vers votre dashboard vendeur

---

## 📊 Dashboard Vendeur

Une fois connecté, vous avez accès à 4 sections principales :

### 1. 🏠 Dashboard (`/seller`)
- Vue d'ensemble de vos produits
- Accès rapide à toutes les fonctionnalités

### 2. 📦 Mes Produits (`/seller/products`)
- Liste de tous vos produits
- Ajouter un nouveau produit
- Modifier un produit existant
- Supprimer un produit

### 3. 🏷️ Catégories (`/seller/categories`)
- Créer des catégories principales
- Créer des sous-catégories
- Modifier/Supprimer des catégories

### 4. 💬 Commentaires (`/seller/comments`)
- Voir tous les commentaires sur vos produits
- Répondre aux commentaires clients

---

## 📦 Gestion des Produits

### Ajouter un produit

1. **Aller sur** `/seller/products`
2. **Cliquer sur** "Ajouter un produit"
3. **Remplir le formulaire :**
   - **Nom du produit*** : Ex: "Pneu Michelin 205/55 R16"
   - **Prix (FCFA)*** : Ex: 75000
   - **Description*** : Description détaillée du produit
   - **Catégorie*** : Sélectionner dans la liste
   - **Marque*** : Sélectionner dans la liste
   - **État*** : Neuf ou Occasion
   - **Garantie** : Ex: "6 mois", "1 an"
   - **Caractéristiques** : Séparées par des virgules
     - Ex: "Haute qualité, Durable, Résistant aux intempéries"

4. **Cliquer sur** "Créer"

### Modifier un produit

1. Cliquer sur le bouton "Modifier" sur le produit
2. Modifier les informations
3. Cliquer sur "Modifier"

### Supprimer un produit

1. Cliquer sur le bouton "Supprimer"
2. Confirmer la suppression

---

## 🏷️ Gestion des Catégories

### Créer une catégorie principale

1. **Aller sur** `/seller/categories`
2. **Cliquer sur** "Nouvelle catégorie"
3. **Remplir :**
   - **Nom** : Ex: "Pièces moteur"
   - **URL** : Ex: "pieces-moteur"
4. **Cliquer sur** "Créer"

### Créer une sous-catégorie

1. **Trouver la catégorie parente**
2. **Cliquer sur** "Sous-catégorie"
3. **Remplir :**
   - **Nom** : Ex: "Pistons"
   - **URL** : Ex: "pistons"
4. **Cliquer sur** "Créer"

La sous-catégorie sera automatiquement liée à la catégorie parente.

### Exemple de hiérarchie

```
📁 Pièces moteur (catégorie principale)
  ├── 📄 Pistons (sous-catégorie)
  ├── 📄 Soupapes (sous-catégorie)
  └── 📄 Joints (sous-catégorie)

📁 Freinage (catégorie principale)
  ├── 📄 Plaquettes (sous-catégorie)
  └── 📄 Disques (sous-catégorie)
```

---

## 💬 Gestion des Commentaires

### Voir les commentaires

1. **Aller sur** `/seller/comments`
2. Vous verrez tous vos produits avec leurs commentaires

### Répondre à un commentaire

1. **Trouver le commentaire**
2. **Cliquer sur** "Répondre"
3. **Écrire votre réponse**
4. **Cliquer sur** "Envoyer"

Votre réponse apparaîtra sous le commentaire client avec votre nom.

---

## 🔑 Identifiants de test

### Créer un vendeur de test (par l'admin)

1. Se connecter en tant qu'admin :
   - Email: `autopro@uvatis.com`
   - Password: `YHs45*%92M9JiH72pII^RK4rh`

2. Aller sur `/admin/sellers`

3. Créer un nouveau vendeur :
   - Nom: "Vendeur Test"
   - Email: "vendeur@test.com"
   - Password: "vendeur123"

4. Se déconnecter et se reconnecter avec les identifiants du vendeur

---

## 📝 Exemple complet : Ajouter un produit

### Scénario : Ajouter un pneu

1. **Créer la catégorie (si elle n'existe pas)**
   - Aller sur `/seller/categories`
   - Créer "Pneus" avec URL "pneus"

2. **Ajouter le produit**
   - Aller sur `/seller/products`
   - Cliquer sur "Ajouter un produit"
   - Remplir :
     ```
     Nom: Pneu Michelin 205/55 R16
     Prix: 75000
     Description: Pneu de haute qualité pour une meilleure adhérence et longévité. Adapté aux véhicules de tourisme.
     Catégorie: Pneus
     Marque: Michelin
     État: Neuf
     Garantie: 1 an
     Caractéristiques: Haute adhérence, Longue durée de vie, Résistant à l'usure, Faible bruit de roulement
     ```
   - Cliquer sur "Créer"

3. **Vérifier**
   - Le produit apparaît dans votre liste
   - Il est visible sur la boutique publique

---

## ⚠️ Notes importantes

### Permissions
- Vous ne pouvez modifier/supprimer que VOS propres produits
- Vous ne pouvez répondre qu'aux commentaires sur VOS produits
- Les catégories sont partagées entre tous les vendeurs

### Validation
- Tous les champs marqués d'un * sont obligatoires
- Le prix doit être un nombre positif
- Les caractéristiques doivent être séparées par des virgules

### Bonnes pratiques
- Utilisez des descriptions claires et détaillées
- Ajoutez plusieurs caractéristiques pour mieux décrire le produit
- Répondez rapidement aux commentaires clients
- Organisez vos produits avec des catégories appropriées

---

## 🚀 Workflow complet

### Démarrage en tant que nouveau vendeur

1. ✅ Recevoir vos identifiants de l'admin
2. ✅ Se connecter sur `/auth/login`
3. ✅ Créer vos catégories sur `/seller/categories`
4. ✅ Ajouter vos premiers produits sur `/seller/products`
5. ✅ Surveiller les commentaires sur `/seller/comments`
6. ✅ Répondre aux clients

### Gestion quotidienne

1. 📊 Vérifier le dashboard
2. 📦 Ajouter/modifier des produits
3. 💬 Répondre aux commentaires
4. 🏷️ Organiser les catégories

---

## 🆘 Problèmes courants

### Je ne peux pas me connecter
- Vérifiez vos identifiants
- Contactez l'administrateur pour réinitialiser votre mot de passe

### Je ne vois pas mes produits
- Vérifiez que vous êtes bien connecté en tant que vendeur
- Vérifiez que les produits ont bien été créés

### Je ne peux pas créer de produit
- Vérifiez que tous les champs obligatoires sont remplis
- Vérifiez que vous avez sélectionné une catégorie et une marque

### Les catégories n'apparaissent pas
- Actualisez la page
- Vérifiez que vous avez bien créé des catégories

---

## 📞 Support

Pour toute question ou problème, contactez l'administrateur de la plateforme.

**Bon commerce ! 🎉**
