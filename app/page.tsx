'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [sessionName, setSessionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sessionName || undefined }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create session');
      }

      const data = await response.json();
      router.push(`/canvas/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Voice Whiteboard
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Collaborative whiteboard with Voice AI
          </p>
        </div>

        <form onSubmit={createSession} className="mt-8 space-y-6">
          <div>
            <label htmlFor="session-name" className="block text-sm font-medium text-gray-700">
              Session Name (optional)
            </label>
            <input
              id="session-name"
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="my-whiteboard-session"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional: Give your session a memorable name for easy access
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? 'Creating...' : 'Create New Session'}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            Your Voice AI can connect using the session name or ID
          </p>
          <a
            href="/debug"
            className="block text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            🔧 Debug Mode - Test All Features
          </a>
        </div>
      </div>
    </div>
  );
}
