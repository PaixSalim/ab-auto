# Configuration du CI/CD sur Hostinger (sans Docker)

Ce guide explique comment mettre en place le déploiement automatique de l'application **AdonisJS v6** vers Hostinger cPanel via GitHub Actions.

## 1. Prérequis sur Hostinger

*   **Activer l'accès SSH** : Connectez-vous à Hostinger > Avancé > Accès SSH. Assurez-vous qu'il est "Activé". Notez l'IP, l'utilisateur et le port (généralement `65002`).
*   **Ajouter votre clé SSH** :
    1.  Si vous n'en avez pas, générez-en une sur votre machine : `ssh-keygen -t ed25519 -C "github-actions-auto-ab"`.
    2.  Copiez le contenu de `id_ed25519.pub`.
    3.  Sur Hostinger, dans "Accès SSH", collez-la dans la section "Gérer les clés SSH".

## 2. Configuration sur GitHub

Dans votre dépôt GitHub, allez dans **Settings > Secrets and variables > Actions** et ajoutez les secrets suivants :

| Secret | Description | Exemple |
| :--- | :--- | :--- |
| `HOSTINGER_IP` | L'adresse IP de votre serveur Hostinger | `123.45.67.89` |
| `HOSTINGER_USER` | Votre nom d'utilisateur cPanel / SSH | `u12345678` |
| `HOSTINGER_SSH_KEY` | Le contenu de votre clé privée SSH | (Commence par `-----BEGIN OPENSSH...`) |
| `HOSTINGER_DEPLOY_PATH` | Le chemin absolu du dossier de l'app sur le serveur | `/home/u12345678/public_html/mon-app` |

*Note : La clé privée SSH est celle générée à l'étape 1 (`id_ed25519`).*

## 3. Configuration du Sélecteur Node.js (cPanel)

Dans Hostinger > Site Web > Node.js :
1.  **Application Root** : Pointez vers le dossier correspondant à `${HOSTINGER_DEPLOY_PATH}/build`.
2.  **Application URL** : Choisissez votre domaine.
3.  **Application Startup File** : Mettez `bin/server.js`.
4.  **Version Node.js** : Sélectionnez 20 ou 22 (requis pour AdonisJS v6).

## 4. Fonctionnement du Workflow (`deploy.yml`)

1.  **Build** : GitHub Actions compile l'app TypeScript en JavaScript (génère le dossier `/build`).
2.  **Transfert (SCP)** : Le contenu de `/build` est transféré par SSH vers le serveur.
3.  **Dépendances** : Le workflow exécute `npm ci --omit=dev` sur le serveur pour installer uniquement le nécessaire.
4.  **Migrations** : Il exécute les migrations de base de données.
5.  **Restart** : Il crée/met à jour `tmp/restart.txt`, ce qui force Phusion Passenger (cPanel) à redémarrer l'application proprement.

## 5. Fichiers de configuration (.env)

Il est recommandé de déjà avoir un fichier `.env` configuré à la racine de `${HOSTINGER_DEPLOY_PATH}` sur votre serveur avant le premier déploiement. L'app utilisera ce fichier en production.
