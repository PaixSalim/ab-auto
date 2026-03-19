import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import { UserStatus } from '#dto/user_types'
import vine from '@vinejs/vine'

export default class UsersController {
  async index({ inertia }: HttpContext) {
    const users = await User.query().preload('roles').orderBy('created_at', 'desc')
    const roles = await Role.all()
    
    return inertia.render('admin/users/index', { users, roles })
  }

  async store({ request, response }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        fullName: vine.string().trim(),
        email: vine.string().email(),
        phone: vine.string().trim().optional(),
        password: vine.string().minLength(8),
        isValidated: vine.boolean().optional(),
        roleId: vine.number(),
        // Seller specific fields
        companyName: vine.string().trim().optional(),
        city: vine.string().trim().optional(),
        neighborhood: vine.string().trim().optional(),
      })
    )

    const data = await request.validateUsing(validator)
    
    // Find the role to determine the UserStatus
    const role = await Role.findOrFail(data.roleId)
    let userStatus = UserStatus.CUSTOMER
    if (role.slug === 'superadmin' || role.slug === 'admin') {
      userStatus = UserStatus.ADMIN
    } else if (role.slug === 'seller') {
      userStatus = UserStatus.SELLER
    }

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: userStatus,
      isValidated: data.isValidated ?? true,
      companyName: data.companyName,
      city: data.city,
      neighborhood: data.neighborhood,
    })

    await user.related('roles').sync([data.roleId])

    return response.redirect().back()
  }

  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    
    const validator = vine.compile(
      vine.object({
        fullName: vine.string().trim().optional(),
        email: vine.string().email().optional(),
        phone: vine.string().trim().optional(),
        isValidated: vine.boolean().optional(),
        roleId: vine.number().optional(),
        companyName: vine.string().trim().optional(),
        city: vine.string().trim().optional(),
        neighborhood: vine.string().trim().optional(),
      })
    )

    const data = await request.validateUsing(validator)
    
    if (data.roleId) {
      const role = await Role.findOrFail(data.roleId)
      let userStatus = UserStatus.CUSTOMER
      if (role.slug === 'superadmin' || role.slug === 'admin') {
        userStatus = UserStatus.ADMIN
      } else if (role.slug === 'seller') {
        userStatus = UserStatus.SELLER
      }
      user.role = userStatus
      await user.related('roles').sync([data.roleId])
    }

    user.merge({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      isValidated: data.isValidated,
      companyName: data.companyName,
      city: data.city,
      neighborhood: data.neighborhood,
    } as any)
    
    await user.save()

    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.redirect().back()
  }
}