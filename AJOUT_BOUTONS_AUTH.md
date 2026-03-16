# Ajout des Boutons de Connexion et d'Inscription

## Modifications Apportées

### 1. Configuration Inertia - Partage des Données Utilisateur
**Fichier**: `config/inertia.ts`

Ajout du partage automatique des informations de l'utilisateur connecté avec toutes les pages:
```typescript
sharedData: {
  notification: (ctx) => ctx.session.flashMessages.get('notification'),
  auth: (ctx) => ({
    user: ctx.auth.user ? {
      id: ctx.auth.user.id,
      email: ctx.auth.user.email,
      fullName: ctx.auth.user.fullName,
      role: ctx.auth.user.role,
    } : null,
  }),
}
```

### 2. Navbar Desktop
**Fichier**: `inertia/components/DesktopNavbar.vue`

**Ajouts**:
- Import de `Link` et `usePage` depuis `@inertiajs/vue3`
- Détection de l'utilisateur connecté via `usePage().props.auth?.user`
- Affichage conditionnel selon l'état de connexion:

**Si non connecté**:
- Bouton "Connexion" (lien texte)
- Bouton "S'inscrire" (bouton primaire avec style)

**Si connecté**:
- Affichage du nom de l'utilisateur
- Bouton de déconnexion avec icône logout

### 3. Navbar Mobile
**Fichier**: `inertia/components/MobileNavbar.vue`

**Ajouts**:
- Import de `Link` et `usePage` depuis `@inertiajs/vue3`
- Détection de l'utilisateur connecté
- Affichage conditionnel selon l'état de connexion:

**Si non connecté**:
- Icône de connexion (i-mdi-login)
- Bouton "S'inscrire" compact

**Si connecté**:
- Icône de déconnexion (i-mdi-logout)

**Note**: Les boutons n'apparaissent que lorsque la barre de recherche n'est pas étendue (`!isExpanded`)

### 4. Page d'Accueil
**Fichier**: `inertia/pages/home.vue`

**Ajouts**:
- Import du composant `Notification`
- Intégration du composant dans le template pour afficher les notifications de connexion/inscription

### 5. Page de Connexion
**Fichier**: `inertia/pages/auth/login.vue`

**Ajouts**:
- Lien vers la page d'inscription en bas du formulaire
- Message: "Vous n'avez pas de compte ? S'inscrire"

### 6. Page d'Inscription
**Fichier**: `inertia/pages/auth/register.vue`

**Déjà présent**:
- Lien vers la page de connexion en bas du formulaire
- Message: "Vous avez déjà un compte ? Se connecter"

## Comportement

### Utilisateur Non Connecté
1. Voit les boutons "Connexion" et "S'inscrire" dans la navbar
2. Peut cliquer sur "Connexion" → redirigé vers `/auth/login`
3. Peut cliquer sur "S'inscrire" → redirigé vers `/auth/register`

### Utilisateur Connecté
1. Voit son nom dans la navbar (desktop)
2. Voit l'icône de déconnexion
3. Peut se déconnecter en cliquant sur l'icône/bouton logout
4. Reçoit une notification de bienvenue après connexion/inscription

### Navigation Entre Pages
- Page de connexion → lien vers inscription
- Page d'inscription → lien vers connexion
- Après connexion/inscription → redirection vers la page appropriée avec notification

## Styles Appliqués

### Desktop
- **Connexion**: Texte gris avec hover primaire
- **S'inscrire**: Bouton primaire avec fond rouge, texte blanc, hover avec opacité
- **Nom utilisateur**: Texte gris, police medium
- **Logout**: Icône grise avec hover primaire

### Mobile
- **Connexion**: Icône login grise
- **S'inscrire**: Bouton compact primaire
- **Logout**: Icône logout grise avec hover primaire

## Routes Utilisées

- `/auth/login` - Page de connexion
- `/auth/register` - Page d'inscription
- `/auth/logout` - Déconnexion (POST)

## Notifications

Les utilisateurs reçoivent des notifications après:
- **Connexion réussie**: "Bienvenue [Nom]"
- **Inscription réussie**: "Bienvenue [Nom] ! Votre compte a été créé avec succès"
- **Erreur de connexion**: Message d'erreur approprié
- **Erreur d'inscription**: Message d'erreur approprié

## Fichiers Modifiés

1. `config/inertia.ts` - Configuration du partage des données utilisateur
2. `inertia/components/DesktopNavbar.vue` - Ajout des boutons desktop
3. `inertia/components/MobileNavbar.vue` - Ajout des boutons mobile
4. `inertia/pages/home.vue` - Ajout du composant Notification
5. `inertia/pages/auth/login.vue` - Ajout du lien vers inscription

## Test du Système

### Test 1: Utilisateur Non Connecté
1. Ouvrir la page d'accueil
2. Vérifier la présence des boutons "Connexion" et "S'inscrire"
3. Cliquer sur "S'inscrire" → vérifier la redirection
4. Cliquer sur "Connexion" → vérifier la redirection

### Test 2: Inscription
1. Remplir le formulaire d'inscription
2. Soumettre le formulaire
3. Vérifier la notification de bienvenue
4. Vérifier que les boutons ont changé (nom + logout)

### Test 3: Connexion
1. Se déconnecter
2. Cliquer sur "Connexion"
3. Remplir le formulaire
4. Vérifier la notification de bienvenue
5. Vérifier l'affichage du nom dans la navbar

### Test 4: Déconnexion
1. Cliquer sur l'icône de déconnexion
2. Vérifier le retour aux boutons "Connexion" et "S'inscrire"

### Test 5: Responsive
1. Tester sur desktop → vérifier les boutons texte
2. Tester sur mobile → vérifier les icônes compactes
3. Vérifier que les boutons disparaissent quand la recherche est étendue (mobile)
