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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN'
    const isSeller = user.role === 'SELLER'

    let products
    let total

    if (isAdmin) {
      // Admin voit tous les produits
      products = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } }
          ]
        },
        include: {
          seller: {
            select: { id: true, fullName: true, email: true }
          },
          category: true,
          brand: true,
          _count: {
            select: {
              comments: true,
              orders: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })

      total = await prisma.product.count({
        where: {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } }
          ]
        }
      })
    } else if (isSeller) {
      // Vendeur voit seulement ses produits
      products = await prisma.product.findMany({
        where: {
          sellerId: user.id,
          OR: [
            { title: { contains: search } },
            { description: { contains: search } }
          ]
        },
        include: {
          category: true,
          brand: true,
          _count: {
            select: {
              comments: true,
              orders: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })

      total = await prisma.product.count({
        where: {
          sellerId: user.id,
          OR: [
            { title: { contains: search } },
            { description: { contains: search } }
          ]
        }
      })
    } else {
      // Client voit seulement les produits approuvés
      products = await prisma.product.findMany({
        where: {
          validationStatus: 'APPROVED',
          OR: [
            { title: { contains: search } },
            { description: { contains: search } }
          ]
        },
        include: {
          seller: {
            select: { id: true, fullName: true }
          },
          category: true,
          brand: true,
          _count: {
            select: {
              comments: {
                where: { status: 'APPROVED' }
              }
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })

      total = await prisma.product.count({
        where: {
          validationStatus: 'APPROVED',
          OR: [
            { title: { contains: search } },
            { description: { contains: search } }
          ]
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user || user.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Unauthorized - Only sellers can create products' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      images,
      stock,
      categoryId,
      brandId
    } = body

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        images,
        stock: parseInt(stock),
        reference: `PRD-${Date.now()}`,
        sellerId: user.id,
        categoryId: parseInt(categoryId),
        brandId: parseInt(brandId),
        validationStatus: 'PENDING' // Les produits des vendeurs sont en attente de validation
      },
      include: {
        seller: {
          select: { id: true, fullName: true, email: true }
        },
        category: true,
        brand: true
      }
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Produit créé. En attente de validation par l\'administration.'
    })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
