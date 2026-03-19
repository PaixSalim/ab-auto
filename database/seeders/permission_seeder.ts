import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

export default class extends BaseSeeder {
  async run() {
    const permissions = [
      // Utilisateurs
      { group: 'Utilisateurs', name: 'Voir les utilisateurs', slug: 'view_users' },
      { group: 'Utilisateurs', name: 'Créer des utilisateurs', slug: 'create_users' },
      { group: 'Utilisateurs', name: 'Modifier des utilisateurs', slug: 'edit_users' },
      { group: 'Utilisateurs', name: 'Supprimer des utilisateurs', slug: 'delete_users' },
      { group: 'Utilisateurs', name: 'Gérer les statuts utilisateurs', slug: 'status_users' },

      // Rôles
      { group: 'Configuration', name: 'Voir les rôles', slug: 'view_roles' },
      { group: 'Configuration', name: 'Gérer les rôles', slug: 'manage_roles' },
      { group: 'Configuration', name: 'Assigner des permissions', slug: 'assign_permissions' },

      // Catégories
      { group: 'Catalogue', name: 'Voir les catégories', slug: 'view_categories' },
      { group: 'Catalogue', name: 'Gérer les catégories', slug: 'manage_categories' },

      // Produits
      { group: 'Produits', name: 'Voir tous les produits', slug: 'view_all_products' },
      { group: 'Produits', name: 'Gérer tous les produits', slug: 'manage_all_products' },
      { group: 'Produits', name: 'Valider les produits', slug: 'validate_products' },
      { group: 'Produits', name: 'Gérer ses propres produits', slug: 'manage_own_products' },

      // Vendeurs
      { group: 'Vendeurs', name: 'Voir les vendeurs', slug: 'view_sellers' },
      { group: 'Vendeurs', name: 'Gérer les vendeurs', slug: 'manage_sellers' },
      { group: 'Vendeurs', name: 'Valider les vendeurs', slug: 'validate_sellers' },

      // Clients
      { group: 'Clients', name: 'Voir les clients', slug: 'view_customers' },
      { group: 'Clients', name: 'Gérer les clients', slug: 'manage_customers' },

      // Commandes
      { group: 'Commandes', name: 'Voir toutes les commandes', slug: 'view_all_orders' },
      { group: 'Commandes', name: 'Gérer toutes les commandes', slug: 'manage_all_orders' },
      { group: 'Commandes', name: 'Gérer ses propres commandes', slug: 'manage_own_orders' },
    ]

    await Permission.updateOrCreateMany('slug', permissions)
  }
}