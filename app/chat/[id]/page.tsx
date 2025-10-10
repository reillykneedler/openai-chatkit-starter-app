"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CHATBOTS_MAP } from "@/lib/chatbots";

export default function ChatPage() {
  const params = useParams();
  const { scheme, setScheme } = useColorScheme();
  
  const chatbotId = params.id as string;
  const chatbot = CHATBOTS_MAP[chatbotId];

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ChatKitPanel] widget action", action);
    }
  }, []);

  const handleResponseEnd = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[ChatKitPanel] response end");
    }
  }, []);

  if (!chatbot) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Chatbot not found
          </h1>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Selection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-100 dark:bg-slate-950">
      <div className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Selection
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{chatbot.icon}</span>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {chatbot.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {chatbot.description}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-5xl">
          <ChatKitPanel
            key={chatbotId}
            theme={scheme}
            onWidgetAction={handleWidgetAction}
            onResponseEnd={handleResponseEnd}
            onThemeRequest={setScheme}
          />
        </div>
      </div>
    </main>
  );
}

