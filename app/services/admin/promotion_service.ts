import { CreatePromotionDto, EditPromotionDto } from '#dto/promoted_products_dto'
import { generateSlug } from '#utils/slug_utils'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'
import Promotion from '#models/promotion'
import { DateTime } from 'luxon'

export class PromotionService {
  async create(payload: CreatePromotionDto, file?: any) {
    let imageUrl = 'products/default-product.jpg'

    if (file && file.tmpPath) {
      const fileName = `promotions/${generateSlug(payload.promoLabel)}-${cuid()}.${file.extname}`
      try {
        const disk = env.get('NODE_ENV') === 'production' ? 's3' : 'local'
        await file.moveToDisk(fileName, disk)
        imageUrl = disk === 'local' ? '/uploads/' + fileName : fileName
      } catch (error) {
        console.error('❌ Upload error:', error)
      }
    }

    return await Promotion.create({
      productId: payload.productId,
      promoLabel: payload.promoLabel,
      discountPercent: Number(payload.discountPercent),
      promoStartDate: DateTime.fromISO(payload.promoStartDate),
      promoEndDate: DateTime.fromISO(payload.promoEndDate),
      url: imageUrl,
    })
  }

  async edit(payload: EditPromotionDto, file?: any) {
    const promo = await Promotion.findOrFail(payload.id)
    let imageUrl = promo.url

    if (file && file.tmpPath) {
      const fileName = `promotions/${generateSlug(payload.promoLabel)}-${cuid()}.${file.extname}`
      try {
        const disk = env.get('NODE_ENV') === 'production' ? 's3' : 'local'
        await file.moveToDisk(fileName, disk)
        imageUrl = disk === 'local' ? '/uploads/' + fileName : fileName
      } catch (error) {
        console.error('❌ Upload error:', error)
      }
    }

    await promo.merge({
      productId: payload.productId,
      promoLabel: payload.promoLabel,
      discountPercent: payload.discountPercent,
      promoStartDate: DateTime.fromISO(payload.promoStartDate),
      promoEndDate: DateTime.fromISO(payload.promoEndDate),
      url: imageUrl,
    }).save()
  }

  async delete(id: number) {
    const promo = await Promotion.find(id)
    if (promo) await promo.delete()
  }
}