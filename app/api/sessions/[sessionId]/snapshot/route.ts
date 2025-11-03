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

function describeCanvas(elements: any[]) {
  if (elements.length === 0) {
    return 'The canvas is empty.';
  }

  const shapes: string[] = [];
  const arrows: string[] = [];
  const texts: string[] = [];
  const connections: Map<string, string[]> = new Map();

  elements.forEach((element: any) => {
    if (element.type === 'arrow' || element.type === 'line') {
      const start = element.startBinding?.elementId;
      const end = element.endBinding?.elementId;
      if (start && end) {
        if (!connections.has(start)) connections.set(start, []);
        connections.get(start)?.push(end);
      }
      arrows.push(
        `Arrow from (${Math.round(element.x)}, ${Math.round(element.y)}) to (${Math.round(element.x + element.width)}, ${Math.round(element.y + element.height)})`
      );
    } else if (element.type === 'text') {
      texts.push(`Text: "${element.text || '(empty)'}"`);
    } else if (['rectangle', 'ellipse', 'diamond'].includes(element.type)) {
      const label = element.text ? ` labeled "${element.text}"` : '';
      shapes.push(
        `${element.type.charAt(0).toUpperCase() + element.type.slice(1)}${label} at (${Math.round(element.x)}, ${Math.round(element.y)})`
      );
    }
  });

  let description = `Canvas contains ${elements.length} element(s):\n\n`;

  if (shapes.length > 0) {
    description += `Shapes (${shapes.length}):\n${shapes.map(s => `- ${s}`).join('\n')}\n\n`;
  }

  if (texts.length > 0) {
    description += `Text elements (${texts.length}):\n${texts.map(t => `- ${t}`).join('\n')}\n\n`;
  }

  if (arrows.length > 0) {
    description += `Connections (${arrows.length}):\n${arrows.map(a => `- ${a}`).join('\n')}\n\n`;
  }

  // Add connection graph if available
  if (connections.size > 0) {
    description += 'Element connections:\n';
    connections.forEach((targets, source) => {
      description += `- Element ${source.substring(0, 8)} connects to: ${targets.map(t => t.substring(0, 8)).join(', ')}\n`;
    });
  }

  return description.trim();
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

    const elements = session.canvasState as any[];
    const description = describeCanvas(elements);

    return NextResponse.json({
      sessionId: session.id,
      sessionName: session.name,
      description,
      elementCount: elements.length,
      elements,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate snapshot' },
      { status: 500 }
    );
  }
}
