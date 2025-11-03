import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ExcalidrawWrapper from '@/components/ExcalidrawWrapper';

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

export default async function CanvasPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await findSession(sessionId);

  if (!session) {
    notFound();
  }

  const elements = session.canvasState as any[];

  return (
    <main style={{ height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}>
      <ExcalidrawWrapper
        sessionId={session.id}
        initialElements={elements}
      />
    </main>
  );
}
