import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const classrooms = await prisma.class.findMany({
      include: {
        teacher: true,
        students: {
          include: {
            readingRecords: true
          }
        },
        readingRecords: true
      }
    })
    return NextResponse.json(classrooms)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch classrooms' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { section, teacherId } = await request.json()
    const classroom = await prisma.class.create({
      data: {
        section,
        teacherId
      }
    })
    return NextResponse.json(classroom, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create classroom' }, { status: 500 })
  }
}