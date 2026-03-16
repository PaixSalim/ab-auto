import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { UserStatus } from '#dto/user_types'
import vine from '@vinejs/vine'

export default class RegisterController {
  /**
   * Afficher le formulaire d'inscription
   */
  async render({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  /**
   * Créer un nouveau compte client
   */
  async execute({ request, response, auth, session }: HttpContext) {
    const schema = vine.compile(
      vine.object({
        fullName: vine.string().trim().minLength(3),
        email: vine.string().email().normalizeEmail(),
        phone: vine.string().trim().optional(),
        city: vine.string().trim().optional(),
        password: vine.string().minLength(8),
      })
    )

    try {
      const data = await request.validateUsing(schema)

      const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        city: data.city || null,
        password: data.password,
        role: UserStatus.CUSTOMER,
      })

      await auth.use('web').login(user)

      session.flash('notification', {
        type: 'success',
        message: `Bienvenue ${user.fullName} ! Votre compte a été créé avec succès`
      })

      return response.redirect('/')
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: 'Erreur lors de l\'inscription. Vérifiez vos informations'
      })
      return response.redirect().back()
    }
  }
}
