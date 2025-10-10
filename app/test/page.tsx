"use client";

import { useState } from "react";
import Link from "next/link";

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          🎉 Hello World!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Deployment is working! 🚀
        </p>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            Counter Test
          </h2>
          <p className="text-4xl font-bold text-blue-600 mb-4">{count}</p>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md"
          >
            Increment
          </button>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            ✅ What&apos;s Working:
          </h2>
          <ul className="text-left text-green-700 space-y-2">
            <li>✓ Next.js routing</li>
            <li>✓ React state management</li>
            <li>✓ Tailwind CSS styling</li>
            <li>✓ Client-side interactivity</li>
            <li>✓ Production build</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}

