import { CreatePromotionDto, EditPromotionDto } from '#dto/promoted_products_dto'
import { generateSlug } from '#utils/slug_utils'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import Promotion from '#models/promotion'
import { DateTime } from 'luxon'

export class PromotionService {
  async create(payload: CreatePromotionDto, file: any) {
    const fileName: string = `${generateSlug(payload.promoLabel)}-${cuid()}.${file.extname}`
    try {
      await file.moveToDisk(fileName)
      await drive.use().getUrl(fileName)
    } catch (error) {
      console.error('Erreur lors de l’enregistrement du fichier :', error)
    }

    await Promotion.create({
      productId: payload.productId,
      promoLabel: payload.promoLabel,
      discountPercent: Number(payload.discountPercent),
      promoStartDate: DateTime.fromISO(payload.promoStartDate),
      promoEndDate: DateTime.fromISO(payload.promoEndDate),
      url: 'https://auto-cdn.uvatis.com/' + fileName,
    })
  }

  async edit(payload: EditPromotionDto) {
    const promo = await Promotion.findOrFail(payload.id)
    await promo
      .merge({
        productId: payload.productId,
        promoLabel: payload.promoLabel,
        discountPercent: payload.discountPercent,
        promoStartDate: DateTime.fromISO(payload.promoStartDate),
        promoEndDate: DateTime.fromISO(payload.promoEndDate),
      })
      .save()
  }

  async delete(id: number) {
    const promo = await Promotion.find(id)
    if (promo) {
      await promo.delete()
    }
  }
}
