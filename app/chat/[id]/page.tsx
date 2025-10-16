"use client";

import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChatKitPanel, type FactAction, type ChatControl } from "@/components/ChatKitPanel";
import { CHATBOTS_MAP } from "@/lib/chatbots";
import AuthWrapper from "@/components/AuthWrapper";

// Custom chat component for Ad Interest Form with welcome buttons
function AdInterestFormChat({
  chatbotId,
  workflowId,
  onWidgetAction,
  onResponseEnd,
}: {
  chatbotId: string;
  workflowId?: string;
  onWidgetAction: (action: FactAction) => Promise<void>;
  onResponseEnd: () => void;
}) {
  const [showCustomButtons, setShowCustomButtons] = useState(true);
  const [chatControl, setChatControl] = useState<ChatControl | null>(null);

  // Receive the control object from ChatKitPanel
  const handleControlReady = useCallback((control: ChatControl) => {
    setChatControl(control);
  }, []);

  // Handle button click: use control API to send message
  const handleButtonClick = (promptText: string) => {
    console.log('Button clicked:', promptText);
    
    // Hide our custom buttons immediately
    setShowCustomButtons(false);
    
    // Use the official ChatKit API to send the user message
    if (chatControl) {
      chatControl.sendUserMessage({ text: promptText });
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* ChatKit Panel */}
      <div className="h-full w-full">
        <ChatKitPanel
          key={chatbotId}
          workflowId={workflowId}
          greeting=""
          onWidgetAction={onWidgetAction}
          onResponseEnd={onResponseEnd}
          onControlReady={handleControlReady}
        />
      </div>

      {/* Custom Welcome Button Group overlay - shown initially */}
      {showCustomButtons && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
          <div className="flex flex-col gap-4 p-8 w-full max-w-md animate-fade-in">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-amber-50 mb-2">
                How can we help you today?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Choose an option to get started
              </p>
            </div>
            
            <button
              onClick={() => handleButtonClick("Plan my campaign")}
              className="group relative w-full py-4 px-6 bg-white dark:bg-slate-800 border-2 border-amber-600 dark:border-amber-500 rounded-xl text-amber-600 dark:text-amber-400 font-semibold text-lg hover:bg-amber-600 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Plan my campaign
              </span>
            </button>
            
            <button
              onClick={() => handleButtonClick("Get started")}
              className="group relative w-full py-4 px-6 bg-white dark:bg-slate-800 border-2 border-amber-600 dark:border-amber-500 rounded-xl text-amber-600 dark:text-amber-400 font-semibold text-lg hover:bg-amber-600 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get started
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

  // Custom page for Ad Interest Form
  if (chatbotId === "ad-interest-form") {
    return (
      <AuthWrapper>
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
          {/* Premium gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950/20"></div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>

          {/* Close button */}
          <Link
            href="/"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-300 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Link>

          <div className="relative z-10 w-full max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-center">
              {/* Left side - Hero content */}
              <div className="lg:col-span-2 text-center lg:text-left space-y-4 sm:space-y-6 animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-sm font-medium text-amber-900 dark:text-amber-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  AI-Powered Assistant
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-amber-50 leading-tight">
                    Tell Us About Your
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400">
                      Advertising Goals
                    </span>
                  </h1>
                  
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    Our AI assistant will guide you through a personalized conversation to understand your needs and match you with the perfect advertising solutions.
                  </p>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Quick & Easy</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">100% Secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">No Commitment</span>
                  </div>
                </div>
              </div>

              {/* Right side - Chat widget */}
              <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: '150ms' }}>
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-3xl blur-2xl"></div>
                  
                  <div className="relative ad-interest-form-wrapper">
                    <AdInterestFormChat
                      chatbotId={chatbotId}
                      workflowId={chatbot.workflowId}
                      onWidgetAction={handleWidgetAction}
                      onResponseEnd={handleResponseEnd}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </AuthWrapper>
    );
  }

  // Default chat page for other bots
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

