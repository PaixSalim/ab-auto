import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { UserStatus } from '#dto/user_types'
import vine from '@vinejs/vine'

export default class SellersController {
  /**
   * Liste des vendeurs
   */
  async index({ inertia }: HttpContext) {
    const sellers = await User.query().where('role', UserStatus.SELLER).orderBy('created_at', 'desc')

    return inertia.render('admin/sellers/index', { sellers })
  }

  /**
   * Créer un nouveau vendeur
   */
  async create({ request, response, session }: HttpContext) {
    const schema = vine.compile(
      vine.object({
        fullName: vine.string().trim().minLength(3),
        email: vine.string().email().normalizeEmail(),
        password: vine.string().minLength(8),
        phone: vine.string().trim().optional(),
      })
    )

    try {
      const data = await request.validateUsing(schema)

      await User.create({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone || null,
        role: UserStatus.SELLER,
      })

      session.flash('notification', {
        type: 'success',
        message: 'Vendeur créé avec succès'
      })

      return response.redirect().back()
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: 'Erreur lors de la création du vendeur'
      })
      return response.redirect().back()
    }
  }

  /**
   * Supprimer un vendeur
   */
  async edit({ request, response, session }: HttpContext) {
    const schema = vine.compile(
      vine.object({
        id: vine.number(),
        fullName: vine.string().trim().minLength(3),
        email: vine.string().email().normalizeEmail(),
        phone: vine.string().trim().optional(),
        password: vine.string().minLength(8).optional(),
      })
    )

    try {
      const data = await request.validateUsing(schema)
      const seller = await User.findOrFail(data.id)

      if (seller.role !== UserStatus.SELLER) {
        session.flash('notification', { type: 'error', message: 'Utilisateur introuvable' })
        return response.redirect().back()
      }

      seller.fullName = data.fullName
      seller.email = data.email
      seller.phone = data.phone || null
      if (data.password) seller.password = data.password
      await seller.save()

      session.flash('notification', { type: 'success', message: 'Vendeur modifié avec succès' })
      return response.redirect().back()
    } catch (error) {
      session.flash('notification', { type: 'error', message: 'Erreur lors de la modification du vendeur' })
      return response.redirect().back()
    }
  }

  async delete({ params, response, session }: HttpContext) {
    try {
      const seller = await User.findOrFail(params.id)

      if (seller.role !== UserStatus.SELLER) {
        session.flash('notification', {
          type: 'error',
          message: 'Vous ne pouvez supprimer que des vendeurs'
        })
        return response.redirect().back()
      }

      await seller.delete()

      session.flash('notification', {
        type: 'success',
        message: 'Vendeur supprimé avec succès'
      })

      return response.redirect().back()
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: 'Erreur lors de la suppression du vendeur'
      })
      return response.redirect().back()
    }
  }
}
