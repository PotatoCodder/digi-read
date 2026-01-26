import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const scores = await prisma.readingRecord.findMany({
      include: {
        student: true,
        class: true
      }
    })
    return NextResponse.json(scores)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, classId, score, section, startTime, endTime } = await request.json()
    const readingRecord = await prisma.readingRecord.create({
      data: {
        studentId,
        classId,
        score,
        section,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }
    })
    return NextResponse.json(readingRecord, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create score' }, { status: 500 })
  }
}