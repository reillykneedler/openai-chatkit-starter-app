"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CHATBOTS_MAP } from "@/lib/chatbots";
import { UserMenu } from "@/components/UserMenu";

type ChatSession = {
  id: string;
  chatbotId: string;
  createdAt: string;
  lastAccessedAt: string;
};

export default function ChatsPage() {
  const { data: session, status } = useSession();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/chat-sessions")
        .then((res) => res.json())
        .then((data) => {
          setChatSessions(data.sessions || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load chat sessions:", err);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Please sign in to view your chat history
          </h1>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-100 dark:bg-slate-950 px-6 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Chat History
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              View and resume your previous conversations
            </p>
          </div>
          <UserMenu />
        </div>

        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Start New Chat
          </Link>
        </div>

        {chatSessions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No chat sessions yet. Start your first conversation!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Choose an Assistant
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {chatSessions.map((chatSession) => {
              const chatbot = CHATBOTS_MAP[chatSession.chatbotId] || {
                name: "Unknown Assistant",
                icon: "💬",
                color: "bg-gray-500",
              };
              const lastAccessed = new Date(chatSession.lastAccessedAt);
              const created = new Date(chatSession.createdAt);

              return (
                <Link
                  key={chatSession.id}
                  href={`/chat/${chatSession.chatbotId}?sessionId=${chatSession.id}`}
                  className="block p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">{chatbot.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {chatbot.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span>
                            Created: {created.toLocaleDateString()} at{" "}
                            {created.toLocaleTimeString()}
                          </span>
                          <span>•</span>
                          <span>
                            Last accessed: {lastAccessed.toLocaleDateString()}{" "}
                            at {lastAccessed.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <svg
                      className="w-6 h-6 text-slate-400 dark:text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

