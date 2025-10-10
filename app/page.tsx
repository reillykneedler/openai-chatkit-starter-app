"use client";

import { CHATBOTS } from "@/lib/chatbots";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6 py-12 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Choose Your AI Assistant
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Select a chatbot to start your conversation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHATBOTS.map((chatbot) => (
            <a
              key={chatbot.id}
              href={`/chat/${chatbot.id}`}
              className="group relative flex flex-col items-start p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-left overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 ${chatbot.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
              />
              
              <div className="relative z-10 w-full">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${chatbot.color} bg-opacity-10 rounded-2xl mb-4 text-3xl`}>
                  {chatbot.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {chatbot.name}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                  {chatbot.description}
                </p>
                
                <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  Start Chat
                  <svg
                    className="w-4 h-4 ml-2"
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
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            More chatbots coming soon!
          </p>
        </div>
      </div>
    </main>
  );
}
