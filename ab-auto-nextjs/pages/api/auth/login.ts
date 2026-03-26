import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const loginSchema = z.object({
  uid: z.string(),
  password: z.string().min(6)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { uid, password } = loginSchema.parse(body)

    // Recherche par email ou téléphone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: uid.toLowerCase() },
          { phone: uid }
        ]
      },
      include: {
        products: true,
        comments: true,
        orders: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid user credentials' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid user credentials' },
        { status: 401 }
      )
    }

    // Génération du token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        role: user.role,
        isValidated: user.isValidated 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Création de la session
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isValidated: user.isValidated
      },
      token
    })

    // Configuration du cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 jours
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
