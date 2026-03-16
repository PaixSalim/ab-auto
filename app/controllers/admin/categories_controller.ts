import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'

export default class AdminCategoriesController {
  /**
   * Afficher la liste des catégories avec sous-catégories
   */
  async index({ inertia }: HttpContext) {
    const categories = await Category.query()
      .whereNull('parent_id') // Catégories principales
      .preload('subCategories') // Charger les sous-catégories
      .orderBy('name', 'asc')

    return inertia.render('admin/categories/index', { categories })
  }

  /**
   * Créer une nouvelle catégorie
   */
  async create({ request, response, session }: HttpContext) {
    const { name, url, parentId } = request.only(['name', 'url', 'parentId'])

    try {
      await Category.create({
        name: name,
        url: url || name.toLowerCase().replace(/\s+/g, '-'),
        parentId: parentId || null
      })

      session.flash('notification', {
        type: 'success',
        message: 'Catégorie créée avec succès'
      })

      return response.redirect().back()
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: 'Erreur lors de la création de la catégorie'
      })
      return response.redirect().back()
    }
  }

  /**
   * Modifier une catégorie
   */
  async edit({ request, response, session, params }: HttpContext) {
    const { name, url, parentId } = request.only(['name', 'url', 'parentId'])
    const category = await Category.findOrFail(params.id)

    try {
      await category.merge({
        name: name,
        url: url || name.toLowerCase().replace(/\s+/g, '-'),
        parentId: parentId || null
      }).save()

      session.flash('notification', {
        type: 'success',
        message: 'Catégorie modifiée avec succès'
      })

      return response.redirect().back()
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: 'Erreur lors de la modification de la catégorie'
      })
      return response.redirect().back()
    }
  }

  /**
   * Supprimer une catégorie
   */
  async delete({ response, session, params }: HttpContext) {
    const category = await Category.findOrFail(params.id)

    try {
      await category.delete()

      session.flash('notification', {
        type: 'success',
        message: 'Catégorie supprimée avec succès'
      })

      return response.redirect().back()
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: 'Erreur lors de la suppression de la catégorie'
      })
      return response.redirect().back()
    }
  }
}
