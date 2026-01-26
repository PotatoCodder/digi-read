import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        class: true,
        readingRecords: true
      }
    })
    return NextResponse.json(students)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, classId } = await request.json()
    const student = await prisma.student.create({
      data: {
        fullName,
        classId
      }
    })
    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}