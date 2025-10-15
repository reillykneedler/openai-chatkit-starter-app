"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { CHATBOTS_MAP } from "@/lib/chatbots";
import AuthWrapper from "@/components/AuthWrapper";

export default function ChatPage() {
  const params = useParams();
  const chatbotId = params.id as string;
  const chatbot = CHATBOTS_MAP[chatbotId];

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    console.info("[ChatPage] widget action", {
      chatbotId,
      chatbotName: chatbot?.name,
      action,
      timestamp: new Date().toISOString()
    });
  }, [chatbotId, chatbot?.name]);

  const handleResponseEnd = useCallback(() => {
    console.debug("[ChatPage] response end", {
      chatbotId,
      chatbotName: chatbot?.name,
      timestamp: new Date().toISOString()
    });
  }, [chatbotId, chatbot?.name]);

  if (!chatbot) {
    return (
      <AuthWrapper>
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
        
        <div className="relative z-10 text-center animate-scale-in">
          <div className="mb-6 text-6xl">🤖</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-amber-50 mb-4">
            Assistant Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            The assistant you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-amber-600 dark:to-amber-700 text-white rounded-xl hover:from-slate-800 hover:to-slate-700 dark:hover:from-amber-700 dark:hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Selection
          </Link>
        </div>
      </main>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <main className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
      
      {/* Floating glass-morphic navbar */}
      <div className="relative z-20 mx-2 sm:mx-4 mt-4 sm:mt-4 mb-1 sm:mb-2 animate-slide-up">
        <nav className="mx-auto max-w-7xl px-2 py-2 sm:px-4 sm:py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between gap-4">
            {/* Back button with enhanced styling */}
            <Link
              href="/"
              className="group flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg sm:rounded-xl transition-all duration-300"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </Link>

            {/* Bot info with status indicator */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${chatbot.color} bg-opacity-10 rounded-lg sm:rounded-xl text-xl sm:text-2xl shadow-sm`}>
                  {chatbot.icon}
                </div>
                {/* Active status indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 flex h-3 w-3 sm:h-4 sm:w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-amber-500 border-2 border-white dark:border-slate-900"></span>
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-amber-50 truncate">
                  {chatbot.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                  {chatbot.description}
                </p>
              </div>
            </div>

          </div>
        </nav>
      </div>

      {/* Chat container with improved spacing */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-2 sm:px-4 pb-2 sm:pb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="w-full max-w-6xl h-full">
          <ChatKitPanel
            key={chatbotId}
            workflowId={chatbot.workflowId}
            greeting={chatbot.greeting}
            onWidgetAction={handleWidgetAction}
            onResponseEnd={handleResponseEnd}
          />
        </div>
      </div>
    </main>
    </AuthWrapper>
  );
}

