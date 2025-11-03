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
    const { arrows } = body;

    if (!Array.isArray(arrows)) {
      return NextResponse.json(
        { error: 'Arrows must be an array' },
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

    // Create new arrow elements
    const newArrows = arrows.map((arrow: any) => {
      const {
        startX,
        startY,
        endX,
        endY,
        startElementId,
        endElementId,
        label = '',
        strokeColor = '#1e1e1e',
        strokeWidth = 1,
      } = arrow;

      const id = randomId();
      const width = endX - startX;
      const height = endY - startY;

      const arrowElement: any = {
        id,
        type: 'arrow',
        x: startX,
        y: startY,
        width,
        height,
        angle: 0,
        strokeColor,
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth,
        strokeStyle: 'solid',
        roughness: 1,
        opacity: 100,
        points: [[0, 0], [width, height]],
        lastCommittedPoint: null,
        startBinding: null,
        endBinding: null,
        startArrowhead: null,
        endArrowhead: 'arrow',
        isDeleted: false,
        groupIds: [],
        boundElements: null,
        updated: Date.now(),
        link: null,
        locked: false,
      };

      // Add bindings if element IDs are provided
      if (startElementId) {
        arrowElement.startBinding = {
          elementId: startElementId,
          focus: 0,
          gap: 10,
        };
      }

      if (endElementId) {
        arrowElement.endBinding = {
          elementId: endElementId,
          focus: 0,
          gap: 10,
        };
      }

      // Add label if provided
      if (label) {
        arrowElement.text = label;
        arrowElement.fontSize = 16;
        arrowElement.fontFamily = 1;
        arrowElement.textAlign = 'center';
      }

      return arrowElement;
    });

    // Update bound elements to reference the arrows
    const updatedElements = currentElements.map((el: any) => {
      const arrowsPointingTo = newArrows.filter(
        (arrow: any) =>
          arrow.startBinding?.elementId === el.id ||
          arrow.endBinding?.elementId === el.id
      );

      if (arrowsPointingTo.length > 0) {
        return {
          ...el,
          boundElements: [
            ...(el.boundElements || []),
            ...arrowsPointingTo.map((arrow: any) => ({
              id: arrow.id,
              type: 'arrow',
            })),
          ],
        };
      }

      return el;
    });

    const finalElements = [...updatedElements, ...newArrows];

    await prisma.session.update({
      where: { id: session.id },
      data: { canvasState: finalElements },
    });

    return NextResponse.json({
      success: true,
      arrows: newArrows,
      message: `Created ${newArrows.length} arrow(s)`,
    });
  } catch (error) {
    console.error('Error creating arrows:', error);
    return NextResponse.json(
      { error: 'Failed to create arrows' },
      { status: 500 }
    );
  }
}
