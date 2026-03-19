import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import { UserStatus } from '#dto/user_types'
import vine from '@vinejs/vine'
import RegistrationNumberGeneratorService from '#services/registration_number_generator_service'

export default class RegisterController {
  /**
   * Afficher le formulaire d'inscription
   */
  async render({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  /**
   * Créer un nouveau compte (Client ou Vendeur)
   */
  async execute({ request, response, auth, session }: HttpContext) {
    const isSeller = request.input('isSeller') === true || request.input('isSeller') === 'true'

    const schema = vine.compile(
      vine.object({
        fullName: vine.string().trim().minLength(3),
        email: vine.string().email().normalizeEmail().unique({ table: 'users', column: 'email' }).optional(),
        phone: vine.string().trim(),
        city: vine.string().trim().optional(),
        password: vine.string().minLength(8),
        companyName: vine.string().trim().optional(),
        neighborhood: vine.string().trim().optional(),
        isSeller: vine.boolean().optional(),
      })
    )

    try {
      const data = await request.validateUsing(schema)

      const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        password: data.password,
        role: isSeller ? UserStatus.SELLER : UserStatus.CUSTOMER,
        companyName: isSeller ? data.companyName : null,
        neighborhood: isSeller ? data.neighborhood : null,
        registrationNumber: isSeller ? await RegistrationNumberGeneratorService.generate() : null,
        isValidated: !isSeller,
      })

      // Assign role in pivot table
      const roleSlug = isSeller ? 'seller' : 'customer'
      const role = await Role.findBy('slug', roleSlug)
      if (role) {
        await user.related('roles').attach([role.id])
      }

      await auth.use('web').login(user)

      session.flash('notification', {
        type: 'success',
        message: `Bienvenue ${user.fullName} ! Votre compte a été créé avec succès`
      })

      return response.redirect(isSeller ? '/seller' : '/')
    } catch (error) {
      console.error('Registration Error Details:', error)
      if (error.messages) {
        console.error('Validation Messages:', error.messages)
      }
      session.flash('notification', {
        type: 'error',
        message: 'Erreur lors de l\'inscription. ' + (error.messages ? 'Vérifiez les champs' : error.message)
      })
      return response.redirect().back()
    }
  }
}
