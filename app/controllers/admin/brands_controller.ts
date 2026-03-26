import type { HttpContext } from '@adonisjs/core/http'
import Brand from '#models/brand'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'
import { generateSlug } from '#utils/slug_utils'
import { getImageUrl } from '#utils/image_url_utils'

export default class AdminBrandsController {
  async index({ inertia }: HttpContext) {
    const brands = await Brand.query().orderBy('name', 'asc')

    const formattedBrands = await Promise.all(brands.map(async brand => ({
      ...brand.toJSON(),
      url: await getImageUrl(brand.url, '/uploads/brands/default-brand.jpg')
    })))

    return inertia.render('admin/brands/index', { brands: formattedBrands })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('admin/brands/create')
  }

  async store({ request, response, session }: HttpContext) {
    const { name } = request.only(['name'])
    const file = request.file('image')

    if (!name || name.trim() === '') {
      session.flash('errors', { name: 'Le nom de la marque est requis' })
      return response.redirect().back()
    }

    let imageUrl = 'brands/default-brand.jpg'

    if (file && file.tmpPath) {
      const fileName = rands/-. 
      try {
        const disk = env.get('NODE_ENV') === 'production' ? 's3' : 'local'
        await file.moveToDisk(fileName, disk)
        imageUrl = disk === 'local' ? '/uploads/' + fileName : fileName
      } catch (error) {
        console.error('? Upload error:', error)
      }
    }

    try {
      await Brand.create({ name: name.trim(), url: imageUrl })
      session.flash('notification', { type: 'success', message: 'Marque créée avec succès' })
      return response.redirect('/dashboard/brands')
    } catch (error) {
      console.error('? Error creating brand:', error)
      session.flash('notification', { type: 'error', message: 'Erreur lors de la création de la marque' })
      return response.redirect().back()
    }
  }

  async edit({ params, inertia }: HttpContext) {
    const brand = await Brand.find(params.id)
    if (!brand) return inertia.location('/dashboard/brands')

    return inertia.render('admin/brands/edit', {
      brand: {
        ...brand.toJSON(),
        url: await getImageUrl(brand.url, '/uploads/brands/default-brand.jpg')
      }
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const { name } = request.only(['name'])
    const brand = await Brand.find(params.id)
    const file = request.file('image')

    if (!brand) {
      session.flash('notification', { type: 'error', message: 'Marque non trouvée' })
      return response.redirect().back()
    }

    if (!name || name.trim() === '') {
      session.flash('errors', { name: 'Le nom de la marque est requis' })
      return response.redirect().back()
    }

    let imageUrl = brand.url

    if (file && file.tmpPath) {
      const fileName = rands/-. 
      try {
        const disk = env.get('NODE_ENV') === 'production' ? 's3' : 'local'
        await file.moveToDisk(fileName, disk)
        imageUrl = disk === 'local' ? '/uploads/' + fileName : fileName
      } catch (error) {
        console.error('? Upload error:', error)
      }
    }

    try {
      await brand.merge({ name: name.trim(), url: imageUrl }).save()
      session.flash('notification', { type: 'success', message: 'Marque modifiée avec succès' })
      return response.redirect('/dashboard/brands')
    } catch (error) {
      console.error('? Error updating brand:', error)
      session.flash('notification', { type: 'error', message: 'Erreur lors de la modification de la marque' })
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const brand = await Brand.find(params.id)
      if (!brand) {
        session.flash('notification', { type: 'error', message: 'Marque non trouvée' })
        return response.redirect().back()
      }
      await brand.delete()
      session.flash('notification', { type: 'success', message: 'Marque supprimée avec succès' })
      return response.redirect('/dashboard/brands')
    } catch (error) {
      console.error('? Error deleting brand:', error)
      session.flash('notification', { type: 'error', message: 'Erreur lors de la suppression de la marque' })
      return response.redirect().back()
    }
  }
}
