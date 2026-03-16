import vine from '@vinejs/vine'

export const CreatePromotionValidator = vine.compile(
  vine.object({
    productId: vine.number(),
    promoLabel: vine.string(),
    discountPercent: vine.number(),
    promoStartDate: vine.string(),
    promoEndDate: vine.string(),
  })
)
export const EditPromotionValidator = vine.compile(
  vine.object({
    id: vine.number(),
    productId: vine.number(),
    promoLabel: vine.string(),
    discountPercent: vine.number(),
    promoStartDate: vine.string(),
    promoEndDate: vine.string(),
  })
)
