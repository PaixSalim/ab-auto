import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
  role: z.enum(['CUSTOMER', 'SELLER']),
  city: z.string().optional(),
  country: z.string().optional(),
  companyName: z.string().optional(),
  registrationNumber: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Vérification si l'email ou téléphone existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { phone: validatedData.phone }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email ou téléphone déjà utilisé' },
        { status: 400 }
      )
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        isValidated: validatedData.role === 'CUSTOMER' // Les clients sont auto-validés
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isValidated: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      user,
      message: validatedData.role === 'SELLER' 
        ? 'Compte vendeur créé. En attente de validation par l\'administration.'
        : 'Compte client créé avec succès.'
    })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
