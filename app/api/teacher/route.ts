import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        classes: true
      }
    })
    return NextResponse.json(teachers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fullName } = await request.json()
    const teacher = await prisma.teacher.create({
      data: {
        fullName
      }
    })
    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 })
  }
}