import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import vine from '@vinejs/vine'

export default class SellerCategoriesController {
  /**
   * Liste des catégories et sous-catégories
   */
  async index({ inertia }: HttpContext) {
    const categories = await Category.query()
      .whereNull('parent_id')
      .preload('subCategories')
      .orderBy('name', 'asc')

    return inertia.render('seller/categories/index', { categories })
  }

  /**
   * Créer une catégorie ou sous-catégorie
   */
  async create({ request, response, session }: HttpContext) {
    const schema = vine.compile(
      vine.object({
        name: vine.string().trim().minLength(2),
        url: vine.string().trim(),
        parentId: vine.number().optional(),
      })
    )

    try {
      const data = await request.validateUsing(schema)

      await Category.create({
        name: data.name,
        url: data.url,
        parentId: data.parentId || null,
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
  async edit({ request, response, session }: HttpContext) {
    const schema = vine.compile(
      vine.object({
        id: vine.number(),
        name: vine.string().trim().minLength(2),
        url: vine.string().trim(),
        parentId: vine.number().optional(),
      })
    )

    try {
      const data = await request.validateUsing(schema)
      const category = await Category.findOrFail(data.id)

      category.name = data.name
      category.url = data.url
      category.parentId = data.parentId || null

      await category.save()

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
  async delete({ params, response, session }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
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
