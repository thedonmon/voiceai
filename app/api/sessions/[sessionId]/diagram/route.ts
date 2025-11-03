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

interface Node {
  id?: string;
  label: string;
  type?: 'rectangle' | 'ellipse' | 'diamond';
  x?: number;
  y?: number;
  color?: string;
}

interface Connection {
  from: string; // node label or ID
  to: string; // node label or ID
  label?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { nodes, connections, layout = 'horizontal' } = body;

    if (!Array.isArray(nodes)) {
      return NextResponse.json(
        { error: 'Nodes must be an array' },
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

    // Auto-layout nodes
    const spacing = 250;
    const startX = 100;
    const startY = 200;
    const nodeMap = new Map<string, any>();

    const createdElements: any[] = [];

    const createdNodes = nodes.map((node: Node, index: number) => {
      let x = node.x;
      let y = node.y;

      // Auto-calculate position if not provided
      if (x === undefined || y === undefined) {
        if (layout === 'horizontal') {
          x = startX + index * spacing;
          y = startY;
        } else if (layout === 'vertical') {
          x = startX;
          y = startY + index * spacing;
        } else if (layout === 'grid') {
          const cols = Math.ceil(Math.sqrt(nodes.length));
          x = startX + (index % cols) * spacing;
          y = startY + Math.floor(index / cols) * spacing;
        }
      }

      const shapeId = node.id || randomId();
      const width = 150;
      const height = 100;

      const shapeElement = {
        id: shapeId,
        type: node.type || 'rectangle',
        x,
        y,
        width,
        height,
        angle: 0,
        strokeColor: '#1e1e1e',
        backgroundColor: node.color || '#ffffff',
        fillStyle: 'solid',
        strokeWidth: 2,
        strokeStyle: 'solid',
        roughness: 1,
        opacity: 100,
        isDeleted: false,
        groupIds: [],
        boundElements: [],
        updated: Date.now(),
        link: null,
        locked: false,
      };

      // Create bound text element if label exists
      if (node.label) {
        const textId = randomId();
        const text = node.label;
        const fontSize = 20;
        const textWidth = text.length * (fontSize * 0.6);
        const textHeight = fontSize * 1.5;

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
          fontSize,
          fontFamily: 1,
          textAlign: 'center' as const,
          verticalAlign: 'middle' as const,
          baseline: fontSize,
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
        createdElements.push(textElement);
      }

      nodeMap.set(node.label, shapeElement);
      if (node.id) nodeMap.set(node.id, shapeElement);

      return shapeElement;
    });

    // Create connections
    const createdArrows = connections && Array.isArray(connections)
      ? connections.map((conn: Connection) => {
          const fromNode = nodeMap.get(conn.from);
          const toNode = nodeMap.get(conn.to);

          if (!fromNode || !toNode) {
            console.warn(`Could not find nodes for connection: ${conn.from} -> ${conn.to}`);
            return null;
          }

          const startX = fromNode.x + fromNode.width;
          const startY = fromNode.y + fromNode.height / 2;
          const endX = toNode.x;
          const endY = toNode.y + toNode.height / 2;

          const arrowId = randomId();

          // Update bound elements
          fromNode.boundElements.push({ id: arrowId, type: 'arrow' });
          toNode.boundElements.push({ id: arrowId, type: 'arrow' });

          return {
            id: arrowId,
            type: 'arrow',
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY,
            angle: 0,
            strokeColor: '#1e1e1e',
            backgroundColor: 'transparent',
            fillStyle: 'solid',
            strokeWidth: 2,
            strokeStyle: 'solid',
            roughness: 1,
            opacity: 100,
            points: [[0, 0], [endX - startX, endY - startY]],
            lastCommittedPoint: null,
            startBinding: {
              elementId: fromNode.id,
              focus: 0,
              gap: 10,
            },
            endBinding: {
              elementId: toNode.id,
              focus: 0,
              gap: 10,
            },
            startArrowhead: null,
            endArrowhead: 'arrow',
            text: conn.label || '',
            fontSize: 16,
            fontFamily: 1,
            textAlign: 'center',
            isDeleted: false,
            groupIds: [],
            boundElements: null,
            updated: Date.now(),
            link: null,
            locked: false,
          };
        }).filter(Boolean)
      : [];

    const finalElements = [...currentElements, ...createdNodes, ...createdElements, ...createdArrows];

    await prisma.session.update({
      where: { id: session.id },
      data: { canvasState: finalElements },
    });

    return NextResponse.json({
      success: true,
      nodesCreated: createdNodes.length,
      connectionsCreated: createdArrows.length,
      message: `Created diagram with ${createdNodes.length} node(s) and ${createdArrows.length} connection(s)`,
    });
  } catch (error) {
    console.error('Error creating diagram:', error);
    return NextResponse.json(
      { error: 'Failed to create diagram' },
      { status: 500 }
    );
  }
}
