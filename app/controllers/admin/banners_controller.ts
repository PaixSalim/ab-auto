import type { HttpContext } from '@adonisjs/core/http'
import Banner from '#models/banner'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import env from '#start/env'
import { generateSlug } from '#utils/slug_utils'
import { getImageUrl } from '#utils/image_url_utils'

export default class AdminBannersController {
  /**
   * Afficher la liste des bannières
   */
  async index({ inertia }: HttpContext) {
    const banners = await Banner.query()
      .orderBy('createdAt', 'desc')

    console.log('🔍 Raw banners from DB:', banners.map(b => ({
      id: b.id,
      title: b.title,
      image: b.image
    })))

    // Formatter les URLs pour les images locales avec URLs signées
    const formattedBanners = await Promise.all(banners.map(async banner => ({
      ...banner.toJSON(),
      image: await getImageUrl(banner.image, '/uploads/banners/default-banner.jpg')
    })))

    console.log('🔍 Formatted banners for frontend:', formattedBanners.map((b, index) => {
      const originalBanner = banners[index]
      return {
        id: (b as any).id,
        title: (b as any).title,
        originalImage: originalBanner.image,
        formattedImage: (b as any).image
      }
    }))

    return inertia.render('admin/banners/index', {
      banners: formattedBanners
    })
  }

  /**
   * Afficher le formulaire de création
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('admin/banners/create')
  }

  /**
   * Créer une nouvelle bannière
   */
  async store({ request, response, session }: HttpContext) {
    const { title, description, link } = request.only(['title', 'description', 'link'])
    const file = request.file('image')

    console.log('🔍 CREATE BANNER DEBUG:')
    console.log('- Request data:', { title, description, link })
    console.log('- File object:', file)
    console.log('- File exists?', !!file)
    console.log('- File has tmpPath?', file?.tmpPath)
    console.log('- File size:', file?.size)

    let imageUrl = 'banners/default-banner.jpg'

    // Traiter l'upload d'image si fourni
    if (file && file.tmpPath) {
      console.log('📁 Processing file upload...')
      const fileName: string = `banners/${generateSlug(title)}-${cuid()}.${file.extname}`
      console.log('- Generated filename:', fileName)
      
      try {
        const disk = env.get('NODE_ENV') === 'production' ? 's3' : 'local'
        console.log('- Using disk:', disk)
        
        await file.moveToDisk(fileName, disk)
        console.log('✅ File moved to disk')
        
        if (disk === 'local') {
          // Pour le disque local, construire l'URL manuellement
          imageUrl = '/uploads/' + fileName
          console.log('- Local URL constructed manually:', imageUrl)
        } else {
          // Pour S3, sauvegarder seulement le chemin (pas l'URL signée)
          imageUrl = fileName
          console.log('- S3 path saved:', imageUrl)
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'upload de l\'image de bannière:', error)
      }
    } else {
      console.log('⚠️ No file provided or invalid file')
    }

    console.log('🎯 Final URL to save:', imageUrl)

    try {
      // Validation de base
      if (!title || title.trim() === '') {
        session.flash('errors', { title: 'Le titre de la bannière est requis' })
        return response.redirect().back()
      }

      if (!description || description.trim() === '') {
        session.flash('errors', { description: 'La description est requise' })
        return response.redirect().back()
      }

      const banner = await Banner.create({
        title: title.trim(),
        description: description.trim(),
        link: link?.trim() || '#',
        image: imageUrl
      })

      console.log('🔍 Banner created - DEBUG INFO:')
      console.log('- Title:', title)
      console.log('- Description:', description)
      console.log('- Link:', link)
      console.log('- Image URL saved in DB:', imageUrl)
      console.log('- Banner ID:', banner.id)

      session.flash('notification', {
        type: 'success',
        message: 'Bannière créée avec succès'
      })

      return response.redirect('/dashboard/banners')

    } catch (error) {
      console.error('❌ Error creating banner:', error)
      session.flash('notification', {
        type: 'error',
        message: 'Erreur lors de la création de la bannière'
      })
      return response.redirect().back()
    }
  }

  /**
   * Afficher le formulaire d'édition
   */
  async edit({ params, inertia }: HttpContext) {
    const banner = await Banner.find(params.id)
    
    if (!banner) {
      return inertia.location('/dashboard/banners')
    }

    // Générer l'URL signée pour l'affichage
    const bannerWithUrl = {
      ...banner.toJSON(),
      image: await getImageUrl(banner.image, '/uploads/banners/default-banner.jpg')
    }

    return inertia.render('admin/banners/edit', {
      banner: bannerWithUrl
    })
  }

  /**
   * Mettre à jour une bannière
   */
  async update({ params, request, response, session }: HttpContext) {
    const { title, description, link } = request.only(['title', 'description', 'link'])
    const banner = await Banner.find(params.id)
    const file = request.file('image')

    if (!banner) {
      session.flash('notification', {
        type: 'error',
        message: 'Bannière non trouvée'
      })
      return response.redirect().back()
    }

    let imageUrl = banner.image

    // Traiter l'upload d'image si fourni
    if (file && file.tmpPath) {
      console.log('📁 Processing file upload...')
      const fileName: string = `banners/${generateSlug(title)}-${cuid()}.${file.extname}`
      
      try {
        const disk = env.get('NODE_ENV') === 'production' ? 's3' : 'local'
        console.log('- Using disk:', disk)
        
        await file.moveToDisk(fileName, disk)
        console.log('✅ File moved to disk')
        
        let uploadedUrl: string
        
        if (disk === 'local') {
          // Pour le disque local, construire l'URL manuellement
          uploadedUrl = '/uploads/' + fileName
          console.log('- Local URL constructed manually:', uploadedUrl)
        } else {
          // Pour S3, sauvegarder seulement le chemin (pas l'URL signée)
          uploadedUrl = fileName
          console.log('- S3 path saved:', uploadedUrl)
        }
        
        imageUrl = uploadedUrl
        console.log('✅ Final image URL:', imageUrl)
      } catch (error) {
        console.error('❌ Erreur lors de l\'upload de l\'image de bannière:', error)
      }
    }

    try {
      // Validation de base
      if (!title || title.trim() === '') {
        session.flash('errors', { title: 'Le titre de la bannière est requis' })
        return response.redirect().back()
      }

      if (!description || description.trim() === '') {
        session.flash('errors', { description: 'La description est requise' })
        return response.redirect().back()
      }

      await banner.merge({
        title: title.trim(),
        description: description.trim(),
        link: link?.trim() || '#',
        image: imageUrl
      }).save()

      session.flash('notification', {
        type: 'success',
        message: 'Bannière modifiée avec succès'
      })

      return response.redirect('/dashboard/banners')

    } catch (error) {
      console.error('❌ Error updating banner:', error)
      session.flash('notification', {
        type: 'error',
        message: 'Erreur lors de la modification de la bannière'
      })
      return response.redirect().back()
    }
  }

  /**
   * Supprimer une bannière
   */
  async destroy({ params, response, session }: HttpContext) {
    try {
      const banner = await Banner.find(params.id)
      
      if (!banner) {
        session.flash('notification', {
          type: 'error',
          message: 'Bannière non trouvée'
        })
        return response.redirect().back()
      }

      await banner.delete()
      
      session.flash('notification', {
        type: 'success',
        message: 'Bannière supprimée avec succès'
      })
      return response.redirect('/dashboard/banners')

    } catch (error) {
      console.error('❌ Error deleting banner:', error)
      session.flash('notification', {
        type: 'error',
        message: 'Erreur lors de la suppression de la bannière'
      })
      return response.redirect().back()
    }
  }
}  
 