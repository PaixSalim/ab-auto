import { CreatePromotionDto, EditPromotionDto } from '#dto/promoted_products_dto'
import { generateSlug } from '#utils/slug_utils'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import Promotion from '#models/promotion'
import { DateTime } from 'luxon'

export class PromotionService {
  async create(payload: CreatePromotionDto, file?: any) {
    let imageUrl = 'https://auto-cdn.uvatis.com/default-promotion.jpg'
    
    console.log('Creating promotion with payload:', payload)
    console.log('File received:', file)
    
    if (file && file.tmpPath) {
      console.log('Processing file upload...')
      const fileName: string = `${generateSlug(payload.promoLabel)}-${cuid()}.${file.extname}`
      console.log('Generated filename:', fileName)
      
      try {
        await file.moveToDisk(fileName)
        imageUrl = await drive.use().getUrl(fileName)
        console.log('Image uploaded successfully:', imageUrl)
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du fichier :', error)
        // Continue avec l'image par défaut en cas d'erreur
      }
    } else {
      console.log('No file provided or invalid file')
    }

    const promotion = await Promotion.create({
      productId: payload.productId,
      promoLabel: payload.promoLabel,
      discountPercent: Number(payload.discountPercent),
      promoStartDate: DateTime.fromISO(payload.promoStartDate),
      promoEndDate: DateTime.fromISO(payload.promoEndDate),
      url: imageUrl, // L'URL de l'image est stockée dans la BD
    })
    
    console.log('Promotion created with ID:', promotion.id)
    console.log('Promotion créée avec URL:', imageUrl)
  }

  async edit(payload: EditPromotionDto, file?: any) {
    console.log('Editing promotion with payload:', payload)
    console.log('File received for edit:', file)
    
    const promo = await Promotion.findOrFail(payload.id)
    console.log('Found promotion:', promo.id, 'current URL:', promo.url)
    
    let imageUrl = promo.url // Conserver l'URL existante par défaut
    
    // Si une nouvelle image est fournie, la traiter
    if (file && file.tmpPath) {
      console.log('Processing new file upload for edit...')
      const fileName: string = `${generateSlug(payload.promoLabel)}-${cuid()}.${file.extname}`
      console.log('Generated filename for edit:', fileName)
      
      try {
        await file.moveToDisk(fileName)
        imageUrl = await drive.use().getUrl(fileName)
        console.log('Image uploaded successfully for edit:', imageUrl)
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du fichier :', error)
        // Continue avec l'URL existante en cas d'erreur
      }
    } else {
      console.log('No new file provided for edit, keeping existing image')
    }
    
    await promo
      .merge({
        productId: payload.productId,
        promoLabel: payload.promoLabel,
        discountPercent: payload.discountPercent,
        promoStartDate: DateTime.fromISO(payload.promoStartDate),
        promoEndDate: DateTime.fromISO(payload.promoEndDate),
        url: imageUrl, // Mettre à jour l'URL si nouvelle image
      })
      .save()
      
    console.log('Promotion modified with URL:', imageUrl)
  }

  async delete(id: number) {
    const promo = await Promotion.find(id)
    if (promo) {
      await promo.delete()
    }
  }
}
