'use client';

import { useEffect, useState, useRef } from 'react';
import { Excalidraw, restoreElements } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { ExcalidrawImperativeAPI, ExcalidrawElement, AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';

interface ExcalidrawCanvasProps {
  sessionId: string;
  initialElements?: any[];
}

export default function ExcalidrawCanvas({ sessionId, initialElements = [] }: ExcalidrawCanvasProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingUpdate = useRef(false);
  const lastUserActivity = useRef<number>(Date.now());
  const isEditingText = useRef(false);

  // Poll for updates from the API (AI changes)
  useEffect(() => {
    if (!excalidrawAPI) return;

    const pollInterval = setInterval(async () => {
      // Don't poll if user is actively editing (within last 5 seconds)
      const timeSinceLastActivity = Date.now() - lastUserActivity.current;
      if (timeSinceLastActivity < 5000 || isEditingText.current) {
        return;
      }

      try {
        const response = await fetch(`/api/sessions/${sessionId}/elements`);
        if (response.ok) {
          const data = await response.json();
          const currentElements = excalidrawAPI.getSceneElements();

          // Only update if there are differences (to avoid unnecessary re-renders)
          const currentIds = new Set(currentElements.map((el) => el.id));
          const newIds = new Set(data.elements.map((el: any) => el.id));
          const hasChanges =
            currentElements.length !== data.elements.length ||
            ![...currentIds].every((id) => newIds.has(id));

          if (hasChanges) {
            isPollingUpdate.current = true;
            // Use restoreElements to ensure proper element format
            const restoredElements = restoreElements(data.elements, null);
            excalidrawAPI.updateScene({ elements: restoredElements });
            setTimeout(() => {
              isPollingUpdate.current = false;
            }, 100);
          }
        }
      } catch (error) {
        console.error('Failed to poll for updates:', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [excalidrawAPI, sessionId]);

  // Handle changes with proper debouncing
  const handleChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    // Skip saving if this change came from polling
    if (isPollingUpdate.current) return;

    // Track user activity
    lastUserActivity.current = Date.now();

    // Check if user is editing text
    isEditingText.current = appState.editingElement !== null &&
      (appState.editingElement as any)?.type === 'text';

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Longer debounce (3 seconds) for better typing experience
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/sessions/${sessionId}/elements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            elements: elements.filter((el) => !el.isDeleted)
          }),
        });
        console.log('Canvas saved');
      } catch (error) {
        console.error('Failed to save elements:', error);
      }
    }, 3000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Restore initial elements properly
  const restoredInitialElements = restoreElements(initialElements, null);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={{
          elements: restoredInitialElements,
          scrollToContent: true,
        }}
        onChange={handleChange}
      />
    </div>
  );
}
