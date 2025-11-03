import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function findSession(sessionId: string) {
  let session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    session = await prisma.session.findUnique({
      where: { name: sessionId },
    });
  }

  return session;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const session = await findSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      elements: session.canvasState,
      sessionId: session.id,
      sessionName: session.name,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch elements' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { elements } = body;

    if (!Array.isArray(elements)) {
      return NextResponse.json(
        { error: 'Elements must be an array' },
        { status: 400 }
      );
    }

    const session = await findSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Merge new elements with existing ones
    const currentElements = session.canvasState as any[];
    const elementMap = new Map(currentElements.map((el: any) => [el.id, el]));

    // Update or add new elements
    elements.forEach((element: any) => {
      elementMap.set(element.id, element);
    });

    const updatedElements = Array.from(elementMap.values());

    const updatedSession = await prisma.session.update({
      where: { id: session.id },
      data: { canvasState: updatedElements },
    });

    return NextResponse.json({
      success: true,
      elements: updatedSession.canvasState,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update elements' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { elements } = body;

    if (!Array.isArray(elements)) {
      return NextResponse.json(
        { error: 'Elements must be an array' },
        { status: 400 }
      );
    }

    const session = await findSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Replace all elements
    const updatedSession = await prisma.session.update({
      where: { id: session.id },
      data: { canvasState: elements },
    });

    return NextResponse.json({
      success: true,
      elements: updatedSession.canvasState,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to replace elements' },
      { status: 500 }
    );
  }
}
