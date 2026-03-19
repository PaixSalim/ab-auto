// import type { HttpContext } from '@adonisjs/core/http'

import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class LoginController {
  static validator = vine.compile(
    vine.object({
      uid: vine.string(),
      password: vine.string(),
    })
  )

  render(ctx: HttpContext) {
    ctx.logger.info(
      '[%s] Login Page: %s - Method: %s - IP: %s',
      DateTime.local().toISO(),
      ctx.request.url(),
      ctx.request.method(),
      ctx.request.ip()
    )
    return ctx.inertia.render('auth/login')
  }

  async execute({ auth, request, response, logger, session }: HttpContext) {
    logger.info(
      '[%s] Login: %s - Method: %s - IP: %s',
      DateTime.local().toISO(),
      request.url(),
      request.method(),
      request.ip()
    )
    const data = await request.validateUsing(LoginController.validator)

    const user = await User.verifyCredentials(data.uid, data.password)

    // Only sellers need validation check
    if (await user.isSeller() && !user.isValidated) {
      session.flash('errors', { uid: 'Votre compte vendeur est en attente de validation.' })
      return response.redirect().back()
    }


    await auth.use('web').login(user)

    session.flash('notification', {
      type: 'success',
      message: `Bienvenue ${user.fullName || user.email}`
    })

    // Rediriger selon le rôle
    const roles = await user.related('roles').query()
    const roleNames = roles.map((r: any) => r.slug)

    if (roleNames.includes('admin') || roleNames.includes('superadmin')) {
      return response.redirect('/dashboard')
    } else if (roleNames.includes('seller')) {
      return response.redirect('/seller')
    } else {
      return response.redirect('/')
    }
  }

  async logout({ auth, response, request, logger }: HttpContext) {
    logger.info(
      '[%s] Logout: %s - Method: %s - IP: %s',
      DateTime.local().toISO(),
      request.url(),
      request.method(),
      request.ip()
    )
    await auth.use('web').logout()
    return response.redirect().toRoute('index')
  }
}
