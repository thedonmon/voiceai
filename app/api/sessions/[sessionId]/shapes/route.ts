import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomId } from '@/lib/utils';

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { shapes } = body;

    if (!Array.isArray(shapes)) {
      return NextResponse.json(
        { error: 'Shapes must be an array' },
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

    const currentElements = session.canvasState as any[];

    // Create new shape elements with smart defaults
    const newShapes: any[] = [];
    const boundTextElements: any[] = [];

    shapes.forEach((shape: any) => {
      const {
        type = 'rectangle',
        label = '',
        x = 100,
        y = 100,
        width = 150,
        height = 100,
        backgroundColor = '#ffffff',
        strokeColor = '#1e1e1e',
        strokeWidth = 1,
        fillStyle = 'solid',
        strokeStyle = 'solid',
        roughness = 1,
        opacity = 100,
        fontSize = 20,
        textAlign = 'center',
      } = shape;

      // Standalone text elements
      if (type === 'text') {
        const text = label || '';
        const estimatedWidth = text.length * (fontSize * 0.6);
        const estimatedHeight = fontSize * 1.5;

        newShapes.push({
          id: randomId(),
          type: 'text',
          x,
          y,
          width: estimatedWidth,
          height: estimatedHeight,
          angle: 0,
          strokeColor: '#1e1e1e',
          backgroundColor: 'transparent',
          fillStyle: 'solid',
          strokeWidth: 1,
          strokeStyle: 'solid',
          roughness: 0,
          opacity: 100,
          text,
          fontSize,
          fontFamily: 1,
          textAlign: textAlign as 'left' | 'center' | 'right',
          verticalAlign: 'top' as const,
          baseline: fontSize,
          isDeleted: false,
          groupIds: [],
          boundElements: null,
          updated: Date.now(),
          link: null,
          locked: false,
          containerId: null,
          originalText: text,
        });
        return;
      }

      // Regular shapes (rectangle, ellipse, diamond)
      const shapeId = randomId();
      const shapeElement = {
        id: shapeId,
        type,
        x,
        y,
        width,
        height,
        angle: 0,
        strokeColor,
        backgroundColor,
        fillStyle,
        strokeWidth,
        strokeStyle,
        roughness,
        opacity,
        isDeleted: false,
        groupIds: [],
        boundElements: [] as any[],
        updated: Date.now(),
        link: null,
        locked: false,
      };

      // Create bound text element if label exists
      if (label) {
        const textId = randomId();
        const text = label;
        const textFontSize = 20;
        const textWidth = text.length * (textFontSize * 0.6);
        const textHeight = textFontSize * 1.5;

        const textElement = {
          id: textId,
          type: 'text',
          x: x + (width - textWidth) / 2,
          y: y + (height - textHeight) / 2,
          width: textWidth,
          height: textHeight,
          angle: 0,
          strokeColor: '#1e1e1e',
          backgroundColor: 'transparent',
          fillStyle: 'solid',
          strokeWidth: 1,
          strokeStyle: 'solid',
          roughness: 0,
          opacity: 100,
          text,
          fontSize: textFontSize,
          fontFamily: 1,
          textAlign: 'center' as const,
          verticalAlign: 'middle' as const,
          baseline: textFontSize,
          isDeleted: false,
          groupIds: [],
          boundElements: null,
          updated: Date.now(),
          link: null,
          locked: false,
          containerId: shapeId,
          originalText: text,
        };

        shapeElement.boundElements.push({ id: textId, type: 'text' });
        boundTextElements.push(textElement);
      }

      newShapes.push(shapeElement);
    });

    const updatedElements = [...currentElements, ...newShapes, ...boundTextElements];

    const updatedSession = await prisma.session.update({
      where: { id: session.id },
      data: { canvasState: updatedElements },
    });

    return NextResponse.json({
      success: true,
      shapes: newShapes,
      message: `Created ${newShapes.length} shape(s)`,
    });
  } catch (error) {
    console.error('Error creating shapes:', error);
    return NextResponse.json(
      { error: 'Failed to create shapes' },
      { status: 500 }
    );
  }
}
