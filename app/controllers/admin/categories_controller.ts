import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'
import { generateSlug } from '#utils/slug_utils'
import { getImageUrl } from '#utils/image_url_utils'

export default class AdminCategoriesController {
  async index({ inertia }: HttpContext) {
    const categories = await Category.query()
      .whereNull('parent_id')
      .preload('subCategories')
      .orderBy('name', 'asc')

    const formattedCategories = await Promise.all(categories.map(async category => ({
      ...category.toJSON(),
      url: await getImageUrl(category.url, '/uploads/categories/default-category.jpg'),
      subCategories: await Promise.all(category.subCategories.map(async sub => ({
        ...sub.toJSON(),
        url: await getImageUrl(sub.url, '/uploads/categories/default-category.jpg')
      })))
    })))

    return inertia.render('admin/categories/index', { categories: formattedCategories })
  }

  async create({ request, response, session }: HttpContext) {
    const { name, parentId } = request.only(['name', 'parentId'])
    const file = request.file('image')

    let imageUrl = 'categories/default-category.jpg'

    if (file && file.tmpPath) {
      const fileName = categories/-. 
      try {
        const disk = env.get('NODE_ENV') === 'production' ? 's3' : 'local'
        await file.moveToDisk(fileName, disk)
        imageUrl = disk === 'local' ? '/uploads/' + fileName : fileName
      } catch (error) {
        console.error('? Upload error:', error)
      }
    }

    try {
      await Category.create({ name, url: imageUrl, parentId: parentId || null })
      session.flash('notification', { type: 'success', message: 'Catégorie créée avec succès' })
    } catch (error) {
      console.error('? Error creating category:', error)
      session.flash('notification', { type: 'error', message: 'Erreur lors de la création' })
    }

    return response.redirect().back()
  }

  async edit({ request, response, session, params }: HttpContext) {
    const { name, parentId } = request.only(['name', 'parentId'])
    const category = await Category.findOrFail(params.id)
    const file = request.file('image')

    let imageUrl = category.url

    if (file && file.tmpPath) {
      const fileName = categories/-. 
      try {
        const disk = env.get('NODE_ENV') === 'production' ? 's3' : 'local'
        await file.moveToDisk(fileName, disk)
        imageUrl = disk === 'local' ? '/uploads/' + fileName : fileName
      } catch (error) {
        console.error('? Upload error:', error)
      }
    }

    try {
      await category.merge({ name, url: imageUrl, parentId: parentId || null }).save()
      session.flash('notification', { type: 'success', message: 'Catégorie modifiée avec succès' })
    } catch (error) {
      console.error('? Error updating category:', error)
      session.flash('notification', { type: 'error', message: 'Erreur lors de la modification' })
    }

    return response.redirect().back()
  }

  async delete({ response, session, params }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()
      session.flash('notification', { type: 'success', message: 'Catégorie supprimée avec succès' })
    } catch (error) {
      console.error('? Error deleting category:', error)
      session.flash('notification', { type: 'error', message: 'Erreur lors de la suppression' })
    }
    return response.redirect().back()
  }
}
