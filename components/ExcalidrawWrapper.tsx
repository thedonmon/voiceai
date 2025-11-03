'use client';

import dynamic from 'next/dynamic';

const ExcalidrawCanvas = dynamic(
  () => import('@/components/ExcalidrawCanvas'),
  { ssr: false }
);

interface ExcalidrawWrapperProps {
  sessionId: string;
  initialElements: any[];
}

export default function ExcalidrawWrapper({ sessionId, initialElements }: ExcalidrawWrapperProps) {
  return <ExcalidrawCanvas sessionId={sessionId} initialElements={initialElements} />;
}
