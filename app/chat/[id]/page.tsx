"use client";

import { useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CHATBOTS_MAP } from "@/lib/chatbots";

let renderCount = 0;

export default function ChatPage() {
  const params = useParams();
  // const { scheme, setScheme } = useColorScheme();
  const scheme = "light"; // FIXED THEME FOR TESTING
  const setScheme = () => {}; // NO-OP
  
  const chatbotId = params.id as string;
  const chatbot = CHATBOTS_MAP[chatbotId];

  // Debug logging - track re-renders
  renderCount++;
  console.log("[ChatPage] 🔄 RENDERING (FIXED THEME)", { 
    chatbotId, 
    hasChatbot: !!chatbot, 
    scheme,
    renderCount
  });

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    console.info("[ChatKitPanel] widget action", action);
  }, []);

  const handleResponseEnd = useCallback(() => {
    console.debug("[ChatKitPanel] response end");
  }, []);

  if (!chatbot) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
        
        <div className="relative z-10 text-center animate-scale-in">
          <div className="mb-6 text-6xl">🤖</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-amber-50 mb-4">
            Assistant Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            The assistant you're looking for doesn't exist.
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
    );
  }

  console.log("[ChatPage] About to render main with ChatKitPanel", {
    keyProp: chatbotId,
    themeProp: scheme
  });

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
      
      {/* Floating glass-morphic navbar */}
      <div className="relative z-20 mx-4 mt-4 mb-2 animate-slide-up">
        <nav className="mx-auto max-w-7xl px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between gap-4">
            {/* Back button with enhanced styling */}
            <Link
              href="/"
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
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
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <div className={`flex items-center justify-center w-12 h-12 ${chatbot.color} bg-opacity-10 rounded-xl text-2xl shadow-sm`}>
                  {chatbot.icon}
                </div>
                {/* Active status indicator */}
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white dark:border-slate-900"></span>
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-amber-50 truncate">
                  {chatbot.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                  {chatbot.description}
                </p>
              </div>
            </div>

            {/* Optional action button placeholder */}
            <div className="hidden md:flex items-center gap-2">
              <button
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Chat container with improved spacing */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="w-full max-w-6xl h-full">
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

