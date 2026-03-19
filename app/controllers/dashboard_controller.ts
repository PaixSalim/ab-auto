// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import Product from '#models/product' // Assuming this model exists
import Order from '#models/order' // Assuming this model exists

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    await user.load('roles')
    const roles = user.roles.map((r: Role) => r.slug)
    const isAdmin = roles.includes('admin') || roles.includes('superadmin')
    const isSeller = roles.includes('seller')

    // Fetch Stats
    let productsCount = 0
    let ordersCount = 0
    let pendingSellersCount = 0
    let recentProducts: any[] = []
    let pendingSellersList: any[] = []

    if (isAdmin) {
      productsCount = await Product.query().count('* as total').then(r => Number(r[0].$extras.total))
      ordersCount = await Order.query().count('* as total').then(r => Number(r[0].$extras.total))
      pendingSellersCount = await User.query().where('role', 'seller').where('is_validated', false).count('* as total').then(r => Number(r[0].$extras.total))
      
      recentProducts = await Product.query().preload('category').orderBy('created_at', 'desc').limit(5)
      pendingSellersList = await User.query().where('role', 'seller').where('is_validated', false).limit(5)
    } else if (isSeller) {
      productsCount = await Product.query().where('seller_id', user.id).count('* as total').then(r => Number(r[0].$extras.total))
      ordersCount = await Order.query().whereHas('product', (q) => q.where('seller_id', user.id)).count('* as total').then(r => Number(r[0].$extras.total))
      recentProducts = await Product.query().where('seller_id', user.id).preload('category').orderBy('created_at', 'desc').limit(5)
    }

    return inertia.render('dashboard', {
      stats: {
        products: productsCount,
        orders: ordersCount,
        pendingSellers: pendingSellersCount,
        revenue: '0 F' // Placeholder for now
      },
      recentProducts,
      pendingSellersList
    })
  }
}