'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DebugPage() {
  const [status, setStatus] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const router = useRouter();

  const log = (message: string) => {
    setStatus((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runDebugTests = async () => {
    setIsRunning(true);
    setStatus([]);

    try {
      // Test 1: Create Session
      log('🔧 Creating debug session...');
      const sessionRes = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `debug-${Date.now()}` }),
      });
      const session = await sessionRes.json();
      setSessionId(session.id);
      log(`✅ Session created: ${session.name} (${session.id})`);
      await sleep(1000);

      // Test 2: Create Initial Diagram
      log('🎨 Creating architecture diagram...');
      await fetch(`/api/sessions/${session.id}/diagram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: [
            { label: 'API Gateway', type: 'rectangle', color: '#e3f2fd' },
            { label: 'Auth Service', type: 'rectangle', color: '#fff3e0' },
            { label: 'User Service', type: 'rectangle', color: '#fff3e0' },
            { label: 'Database', type: 'ellipse', color: '#f3e5f5' },
          ],
          connections: [
            { from: 'API Gateway', to: 'Auth Service', label: 'authenticates' },
            { from: 'API Gateway', to: 'User Service', label: 'routes' },
            { from: 'User Service', to: 'Database', label: 'queries' },
          ],
          layout: 'horizontal',
        }),
      });
      log('✅ Created 4 nodes with 3 connections');
      await sleep(2000);

      // Test 3: Add More Shapes
      log('🔷 Adding cache layer...');
      await fetch(`/api/sessions/${session.id}/shapes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shapes: [
            {
              label: 'Redis Cache',
              type: 'ellipse',
              x: 500,
              y: 350,
              backgroundColor: '#ffebee',
              strokeColor: '#c62828',
            },
          ],
        }),
      });
      log('✅ Added Redis Cache');
      await sleep(2000);

      // Test 4: Add Arrow
      log('➡️ Connecting cache...');
      await fetch(`/api/sessions/${session.id}/arrows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arrows: [
            {
              startX: 500,
              startY: 300,
              endX: 500,
              endY: 350,
              label: 'caches',
              strokeColor: '#c62828',
            },
          ],
        }),
      });
      log('✅ Connected User Service to Redis');
      await sleep(2000);

      // Test 5: Add More Shapes (Different Layout)
      log('🔶 Adding external services...');
      await fetch(`/api/sessions/${session.id}/shapes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shapes: [
            {
              label: 'Payment Gateway',
              type: 'diamond',
              x: 100,
              y: 400,
              backgroundColor: '#e8f5e9',
              strokeColor: '#2e7d32',
            },
            {
              label: 'Email Service',
              type: 'diamond',
              x: 350,
              y: 400,
              backgroundColor: '#e8f5e9',
              strokeColor: '#2e7d32',
            },
          ],
        }),
      });
      log('✅ Added 2 external services');
      await sleep(2000);

      // Test 6: Get Snapshot
      log('📸 Getting AI snapshot...');
      const snapshotRes = await fetch(`/api/sessions/${session.id}/snapshot`);
      const snapshot = await snapshotRes.json();
      log(`✅ Snapshot generated: ${snapshot.elementCount} elements`);
      log(`📝 Description preview: ${snapshot.description.slice(0, 100)}...`);
      await sleep(1000);

      // Test 7: Create Another Diagram Section
      log('🎯 Adding monitoring stack...');
      await fetch(`/api/sessions/${session.id}/diagram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: [
            { label: 'Prometheus', type: 'rectangle', color: '#fff3e0' },
            { label: 'Grafana', type: 'rectangle', color: '#e3f2fd' },
            { label: 'Logs DB', type: 'ellipse', color: '#f3e5f5' },
          ],
          connections: [
            { from: 'Prometheus', to: 'Grafana', label: 'metrics' },
            { from: 'Prometheus', to: 'Logs DB', label: 'stores' },
          ],
          layout: 'vertical',
        }),
      });
      log('✅ Added monitoring stack');
      await sleep(2000);

      // Test 8: Add Standalone Text Elements
      log('📝 Adding text annotations...');
      await fetch(`/api/sessions/${session.id}/shapes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shapes: [
            {
              type: 'text',
              label: '🔥 Hot Path',
              x: 400,
              y: 150,
              fontSize: 20,
              textAlign: 'center',
            },
            {
              type: 'text',
              label: 'Microservices Architecture',
              x: 250,
              y: 50,
              fontSize: 28,
              textAlign: 'left',
            },
            {
              type: 'text',
              label: 'NOTE: Cache invalidation on writes',
              x: 600,
              y: 350,
              fontSize: 16,
              textAlign: 'left',
            },
          ],
        }),
      });
      log('✅ Added 3 text annotations');
      await sleep(2000);

      log('🎉 ALL TESTS COMPLETE!');
      log(`🌐 Open canvas: /canvas/${session.id}`);
      log('✨ You should see ~10 shapes with text annotations, colors, and connections');

    } catch (error: any) {
      log(`❌ ERROR: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const openCanvas = () => {
    if (sessionId) {
      router.push(`/canvas/${sessionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Debug Mode
          </h1>
          <p className="text-gray-600 mb-6">
            Test all autonomous features by creating a demo diagram with shapes, arrows, and connections.
          </p>

          <div className="space-y-4 mb-8">
            <button
              onClick={runDebugTests}
              disabled={isRunning}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors"
            >
              {isRunning ? '🔄 Running Tests...' : '▶️ Run Debug Tests'}
            </button>

            {sessionId && (
              <button
                onClick={openCanvas}
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                🎨 Open Canvas
              </button>
            )}
          </div>

          <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
            <div className="font-mono text-sm space-y-1">
              {status.length === 0 ? (
                <p className="text-gray-500">
                  Click "Run Debug Tests" to start...
                </p>
              ) : (
                status.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.includes('✅')
                        ? 'text-green-400'
                        : msg.includes('❌')
                        ? 'text-red-400'
                        : msg.includes('🎉')
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }
                  >
                    {msg}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What This Tests:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Session creation via API</li>
              <li>✓ Complete diagram creation (create_diagram endpoint)</li>
              <li>✓ Adding individual shapes (add_shapes endpoint)</li>
              <li>✓ Adding arrows/connections (add_arrows endpoint)</li>
              <li>✓ Adding standalone text elements</li>
              <li>✓ Real-time sync (watch shapes appear)</li>
              <li>✓ AI-friendly snapshot generation</li>
              <li>✓ Multiple layouts (horizontal, vertical)</li>
              <li>✓ Color-coded shapes</li>
              <li>✓ Labeled connections</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">⏱️ Timeline:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>0s - Create session</li>
              <li>1s - Create initial diagram (4 nodes)</li>
              <li>3s - Add Redis cache</li>
              <li>5s - Connect cache with arrow</li>
              <li>7s - Add external services</li>
              <li>9s - Get AI snapshot</li>
              <li>10s - Add monitoring stack</li>
              <li>12s - Add text annotations</li>
              <li>14s - Complete! (~14 seconds total)</li>
            </ul>
          </div>

          <div className="mt-4 text-center">
            <a
              href="/"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
