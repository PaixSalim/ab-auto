import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Middleware pour vérifier l'authentification
async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isValidated: true
      }
    })
    return user
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN'
    const isSeller = user.role === 'SELLER'

    let stats = {}
    let recentProducts = []
    let recentOrders = []

    if (isAdmin) {
      // Statistiques admin
      const [
        productsCount,
        ordersCount,
        pendingSellersCount,
        categoriesCount,
        brandsCount,
        customersCount,
        validatedSellersCount,
        pendingProductsCount,
        validatedProductsCount,
        commentsCount
      ] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count({ where: { role: 'SELLER', isValidated: false } }),
        prisma.category.count(),
        prisma.brand.count(),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.user.count({ where: { role: 'SELLER', isValidated: true } }),
        prisma.product.count({ where: { validationStatus: 'PENDING' } }),
        prisma.product.count({ where: { validationStatus: 'APPROVED' } }),
        prisma.comment.count()
      ])

      stats = {
        products: productsCount,
        orders: ordersCount,
        pendingSellers: pendingSellersCount,
        categories: categoriesCount,
        brands: brandsCount,
        customers: customersCount,
        validatedSellers: validatedSellersCount,
        pendingProducts: pendingProductsCount,
        validatedProducts: validatedProductsCount,
        comments: commentsCount
      }

      // Données récentes pour admin
      recentProducts = await prisma.product.findMany({
        include: {
          seller: { select: { fullName: true } },
          category: true,
          brand: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })

      recentOrders = await prisma.order.findMany({
        include: {
          customer: { select: { fullName: true } },
          product: { include: { seller: { select: { fullName: true } } } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })

    } else if (isSeller) {
      // Statistiques vendeur
      const [productsCount, ordersCount, commentsCount] = await Promise.all([
        prisma.product.count({ where: { sellerId: user.id } }),
        prisma.order.count({ 
          where: { 
            product: { sellerId: user.id } 
          } 
        }),
        prisma.comment.count({
          where: {
            product: { sellerId: user.id },
            status: 'APPROVED'
          }
        })
      ])

      stats = {
        products: productsCount,
        orders: ordersCount,
        comments: commentsCount
      }

      // Données récentes pour vendeur
      recentProducts = await prisma.product.findMany({
        where: { sellerId: user.id },
        include: { category: true, brand: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      })

      recentOrders = await prisma.order.findMany({
        where: { 
          product: { sellerId: user.id } 
        },
        include: {
          customer: { select: { fullName: true } },
          product: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })

    } else {
      // Statistiques client
      const [ordersCount, commentsCount] = await Promise.all([
        prisma.order.count({ where: { customerId: user.id } }),
        prisma.comment.count({ where: { userId: user.id } })
      ])

      stats = {
        orders: ordersCount,
        comments: commentsCount
      }
    }

    return NextResponse.json({
      success: true,
      stats,
      recentProducts,
      recentOrders,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isValidated: user.isValidated
      }
    })

  } catch (error) {
    console.error('Dashboard fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
