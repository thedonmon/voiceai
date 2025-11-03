import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    // Create a new session
    const session = await prisma.session.create({
      data: {
        name: name || undefined,
        canvasState: [],
      },
    });

    return NextResponse.json({
      id: session.id,
      name: session.name,
      url: `/canvas/${session.id}`,
      createdAt: session.createdAt,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A session with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
