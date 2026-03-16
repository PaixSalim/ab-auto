// import type { HttpContext } from '@adonisjs/core/http'

import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class LoginController {
  static validator = vine.compile(
    vine.object({
      email: vine
        .string()
        .email()
        .unique(async (db, value) => {
          return await db.from('users').where('email', value).first()
        }),
      password: vine.string().minLength(10),
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
    const { email, password } = await request.validateUsing(LoginController.validator)

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)

    session.flash('notification', {
      type: 'success',
      message: `Bienvenue ${user.fullName || user.email}`
    })

    // Rediriger selon le rôle
    if (user.role === 'admin') {
      return response.redirect().toRoute('admin.index')
    } else if (user.role === 'seller') {
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
