"use client";

import { CHATBOTS } from "@/lib/chatbots";
import AuthWrapper from "@/components/AuthWrapper";

export default function Home() {
  return (
    <AuthWrapper>
      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-amber-50/50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-transparent dark:from-amber-900/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-100/30 via-transparent to-transparent dark:from-yellow-900/10"></div>
      </div>

      {/* Floating orbs for ambient effect */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>

      <div className="relative mx-auto w-full max-w-7xl z-10">
        {/* Header section with enhanced styling */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-900/50 text-sm font-medium text-slate-900 dark:text-amber-100 mb-6 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Alpha Release
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent leading-tight">
            Wick AI Toolkit
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Powerful tools to fuel powerful work.
          </p>
        </div>

        {/* Organized tools by category */}
        <div className="space-y-16 mb-12">
          {/* Advertising Tools Section */}
          {CHATBOTS.filter(bot => bot.category === "Advertising").length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-amber-50 mb-6">
                Advertising Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CHATBOTS.filter(bot => bot.category === "Advertising").map((chatbot, index) => (
                  <a
                    key={chatbot.id}
                    href={`/chat/${chatbot.id}`}
                    className="group relative flex flex-col items-start p-8 bg-white dark:bg-slate-900 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 text-left overflow-hidden hover:scale-[1.02] animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Gradient accent orb */}
                    <div
                      className={`absolute top-0 right-0 w-40 h-40 ${chatbot.color} opacity-5 group-hover:opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-all duration-700 blur-2xl`}
                    />
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                    
                    <div className="relative z-10 w-full">
                      {/* Category pill */}
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {chatbot.category}
                        </span>
                      </div>

                      {/* Icon container with enhanced styling */}
                      <div className={`inline-flex items-center justify-center w-20 h-20 ${chatbot.color} bg-opacity-10 rounded-2xl mb-6 text-4xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        {chatbot.icon}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-amber-50 mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {chatbot.name}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                        {chatbot.description}
                      </p>
                      
                      {/* Enhanced CTA button */}
                      <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 group-hover:gap-3 transition-all">
                        <span>Start Chat</span>
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom gradient line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Newsroom Tools Section */}
          {CHATBOTS.filter(bot => bot.category === "Newsroom").length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-amber-50 mb-6">
                Newsroom Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CHATBOTS.filter(bot => bot.category === "Newsroom").map((chatbot, index) => (
                  <a
                    key={chatbot.id}
                    href={`/chat/${chatbot.id}`}
                    className="group relative flex flex-col items-start p-8 bg-white dark:bg-slate-900 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 text-left overflow-hidden hover:scale-[1.02] animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Gradient accent orb */}
                    <div
                      className={`absolute top-0 right-0 w-40 h-40 ${chatbot.color} opacity-5 group-hover:opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-all duration-700 blur-2xl`}
                    />
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                    
                    <div className="relative z-10 w-full">
                      {/* Category pill */}
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {chatbot.category}
                        </span>
                      </div>

                      {/* Icon container with enhanced styling */}
                      <div className={`inline-flex items-center justify-center w-20 h-20 ${chatbot.color} bg-opacity-10 rounded-2xl mb-6 text-4xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        {chatbot.icon}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-amber-50 mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {chatbot.name}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                        {chatbot.description}
                      </p>
                      
                      {/* Enhanced CTA button */}
                      <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 group-hover:gap-3 transition-all">
                        <span>Start Chat</span>
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom gradient line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* General Tools Section */}
          {CHATBOTS.filter(bot => bot.category === "General").length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-amber-50 mb-6">
                General Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CHATBOTS.filter(bot => bot.category === "General").map((chatbot, index) => (
                  <a
                    key={chatbot.id}
                    href={`/chat/${chatbot.id}`}
                    className="group relative flex flex-col items-start p-8 bg-white dark:bg-slate-900 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 text-left overflow-hidden hover:scale-[1.02] animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Gradient accent orb */}
                    <div
                      className={`absolute top-0 right-0 w-40 h-40 ${chatbot.color} opacity-5 group-hover:opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-all duration-700 blur-2xl`}
                    />
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                    
                    <div className="relative z-10 w-full">
                      {/* Category pill */}
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {chatbot.category}
                        </span>
                      </div>

                      {/* Icon container with enhanced styling */}
                      <div className={`inline-flex items-center justify-center w-20 h-20 ${chatbot.color} bg-opacity-10 rounded-2xl mb-6 text-4xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        {chatbot.icon}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-amber-50 mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {chatbot.name}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                        {chatbot.description}
                      </p>
                      
                      {/* Enhanced CTA button */}
                      <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 group-hover:gap-3 transition-all">
                        <span>Start Chat</span>
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom gradient line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced footer with glass-morphic design */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <svg className="w-5 h-5 text-slate-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              More specialized assistants coming soon
            </span>
          </div>
        </div>
      </div>
    </main>
    </AuthWrapper>
  );
}
