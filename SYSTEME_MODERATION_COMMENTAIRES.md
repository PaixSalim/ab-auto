# Système de Modération des Commentaires

## 🎯 Fonctionnement

### Pour les clients :
1. ✅ Le client laisse un commentaire sur un produit
2. ✅ Le commentaire est créé avec `isActive: false`
3. ✅ Un message s'affiche : "Merci pour votre avis ! Votre commentaire sera visible après modération."
4. ⏳ Le commentaire est en attente de validation

### Pour les vendeurs :
1. ✅ Le vendeur se connecte sur `/seller/comments`
2. ✅ Il voit TOUS les commentaires sur ses produits (actifs et inactifs)
3. ✅ Il peut :
   - **Activer** un commentaire inactif (bouton vert "Activer")
   - **Désactiver** un commentaire actif (bouton rouge "Désactiver")
   - **Répondre** à un commentaire
4. ✅ Une fois activé, le commentaire devient visible sur la page produit

### Pour les administrateurs :
1. ✅ L'admin se connecte sur `/admin/comments`
2. ✅ Il voit TOUS les commentaires de tous les produits
3. ✅ Il peut :
   - **Activer/Désactiver** n'importe quel commentaire
   - **Modifier** un commentaire
   - **Supprimer** un commentaire
   - **Répondre** à un commentaire

---

## 📋 Workflow complet

```
Client laisse un commentaire
         ↓
   [isActive: false]
         ↓
Vendeur/Admin reçoit notification
         ↓
Vendeur/Admin modère le commentaire
         ↓
    ┌─────────┴─────────┐
    ↓                   ↓
Activer            Désactiver
    ↓                   ↓
Visible           Masqué
sur la page       du public
```

---

## 🔧 Routes de modération

### Vendeur :
- `GET /seller/comments` - Voir tous les commentaires sur ses produits
- `PUT /admin/comments/toggle-status` - Activer/Désactiver un commentaire
- `POST /seller/comments/reply` - Répondre à un commentaire

### Admin :
- `GET /admin/comments` - Voir tous les commentaires
- `PUT /admin/comments/toggle-status` - Activer/Désactiver un commentaire
- `PUT /admin/comments/update` - Modifier un commentaire
- `DELETE /admin/comments/delete/:id` - Supprimer un commentaire

---

## 🧪 Test du système

### 1. Créer un commentaire (en tant que client)

```
1. Aller sur un produit : http://localhost:3333/catalogue/product/[slug]
2. Descendre à la section "Avis clients"
3. Remplir le formulaire :
   - Nom : "Jean Dupont"
   - Commentaire : "Excellent produit !"
4. Cliquer sur "Publier mon avis"
5. Message affiché : "Merci pour votre avis ! Votre commentaire sera visible après modération."
6. Le commentaire N'apparaît PAS encore sur la page
```

### 2. Modérer le commentaire (en tant que vendeur)

```
1. Se connecter en tant que vendeur
   Email: vendeur@test.com
   Password: vendeur123

2. Aller sur : http://localhost:3333/seller/comments

3. Trouver le produit avec le commentaire de "Jean Dupont"

4. Voir le badge "Inactif" (rouge)

5. Cliquer sur le bouton vert "Activer"

6. Le badge devient "Actif" (vert)

7. Retourner sur la page du produit

8. Le commentaire est maintenant visible ! ✅
```

### 3. Répondre au commentaire (en tant que vendeur)

```
1. Sur /seller/comments

2. Cliquer sur "Répondre" sous le commentaire

3. Écrire la réponse :
   "Merci Jean pour votre retour positif !"

4. Cliquer sur "Envoyer"

5. La réponse apparaît avec le badge "Vendeur"

6. Sur la page produit, la réponse est visible sous le commentaire
```

### 4. Désactiver un commentaire (en cas de spam)

```
1. Sur /seller/comments

2. Trouver un commentaire inapproprié

3. Cliquer sur le bouton rouge "Désactiver"

4. Le commentaire devient inactif

5. Il n'est plus visible sur la page produit
```

---

## 🎨 Interface vendeur

### Page `/seller/comments`

```
┌─────────────────────────────────────────────┐
│  Commentaires sur mes produits              │
├─────────────────────────────────────────────┤
│                                             │
│  📦 Pneu Michelin 205/55 R16               │
│  Catégorie: Pneus                          │
│  2 commentaire(s)                          │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Jean Dupont        [Inactif] [Activer]│ │
│  │ 13 mars 2026                          │ │
│  │ Excellent produit !                   │ │
│  │ [Répondre]                            │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Marie Martin       [Actif] [Désactiver]│ │
│  │ 12 mars 2026                          │ │
│  │ Très satisfaite de mon achat          │ │
│  │ [Répondre]                            │ │
│  │                                       │ │
│  │   └─ Vendeur Test (Vendeur)          │ │
│  │      Merci pour votre retour !       │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ⚙️ Configuration

### Activation automatique (NON recommandé)

Si vous voulez que les commentaires soient automatiquement actifs sans modération :

```typescript
// app/controllers/api_controller.ts
async postComment(ctx: HttpContext) {
  return ctx.response.ok(
    await this.commentsService.createComments({
      ...payload,
      ip: ctx.request.ip(),
      isActive: true, // ⚠️ Pas de modération
    })
  )
}
```

### Activation manuelle (RECOMMANDÉ) ✅

Configuration actuelle :

```typescript
// app/controllers/api_controller.ts
async postComment(ctx: HttpContext) {
  return ctx.response.ok(
    await this.commentsService.createComments({
      ...payload,
      ip: ctx.request.ip(),
      isActive: false, // ✅ Modération requise
    })
  )
}
```

---

## 📊 Avantages de la modération

1. **Protection contre le spam** 🛡️
   - Filtrer les commentaires inappropriés
   - Éviter les faux avis

2. **Contrôle de la qualité** ✨
   - Valider la pertinence des commentaires
   - Maintenir une bonne image de marque

3. **Gestion des conflits** 🤝
   - Répondre avant publication
   - Gérer les commentaires négatifs

4. **Conformité légale** ⚖️
   - Respecter les règles de modération
   - Éviter les contenus illégaux

---

## 🚀 Prochaines améliorations possibles

1. **Notifications en temps réel**
   - Email au vendeur lors d'un nouveau commentaire
   - Notification dans le dashboard

2. **Système de signalement**
   - Les clients peuvent signaler un commentaire
   - Modération automatique après X signalements

3. **Historique de modération**
   - Qui a activé/désactivé un commentaire
   - Quand et pourquoi

4. **Filtres anti-spam**
   - Détection automatique de spam
   - Liste noire de mots interdits

5. **Statistiques**
   - Nombre de commentaires en attente
   - Taux d'approbation
   - Temps moyen de modération

---

## ✅ Résumé

**Configuration actuelle :**
- ✅ Commentaires créés avec `isActive: false`
- ✅ Vendeurs peuvent activer/désactiver leurs commentaires
- ✅ Admins peuvent activer/désactiver tous les commentaires
- ✅ Message clair pour les clients
- ✅ Interface de modération intuitive

**Le système de modération est opérationnel ! 🎉**
