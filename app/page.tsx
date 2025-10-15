"use client";

import { CHATBOTS } from "@/lib/chatbots";
import AuthWrapper from "@/components/AuthWrapper";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <AuthWrapper>
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-amber-50/50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-transparent dark:from-amber-900/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-100/30 via-transparent to-transparent dark:from-yellow-900/10"></div>
      </div>

      {/* Floating orbs for ambient effect */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-64 sm:h-64 bg-amber-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 sm:w-96 sm:h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>

      <div className="relative mx-auto w-full max-w-7xl z-10">
        {/* Logout button - only on homepage */}
        {session && (
          <div className="absolute top-4 right-0 z-50">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-medium text-slate-700 dark:text-slate-300"
              title="Sign out"
            >
              <span className="hidden sm:inline text-xs sm:text-sm">{session.user?.email}</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        )}
        
        {/* Header section with enhanced styling */}
        <div className="text-center mb-6 sm:mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-amber-100 mb-4 sm:mb-6 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Alpha Release
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent leading-tight">
            Wick AI Toolkit
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium px-4">
            Powerful tools to fuel our powerful work.
          </p>
        </div>

        {/* Organized tools by category */}
        <div className="space-y-10 sm:space-y-16 mb-8 sm:mb-12">
          {/* Advertising Tools Section */}
          {CHATBOTS.filter(bot => bot.category === "Advertising").length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-amber-50 mb-4 sm:mb-6">
                Advertising Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {CHATBOTS.filter(bot => bot.category === "Advertising").map((chatbot, index) => {
                  const CardWrapper = chatbot.inDevelopment ? 'div' : 'a';
                  const cardProps = chatbot.inDevelopment ? {} : { href: `/chat/${chatbot.id}` };
                  
                  return (
                    <CardWrapper
                      key={chatbot.id}
                      {...cardProps}
                      className={`group relative flex flex-col items-start p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-900 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-500 border-2 border-slate-200 dark:border-slate-800 text-left overflow-hidden animate-slide-up ${
                        chatbot.inDevelopment 
                          ? 'opacity-75 cursor-not-allowed' 
                          : 'hover:shadow-2xl hover:border-amber-400 dark:hover:border-amber-600 hover:scale-[1.02] cursor-pointer'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Gradient accent orb */}
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 ${chatbot.color} opacity-5 ${!chatbot.inDevelopment && 'group-hover:opacity-10'} rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 ${!chatbot.inDevelopment && 'group-hover:scale-150'} transition-all duration-700 blur-2xl`}
                      />
                      
                      {/* Shine effect on hover - only for active cards */}
                      {!chatbot.inDevelopment && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                      )}
                      
                      <div className="relative z-10 w-full">
                        {/* Category and status pills */}
                        <div className="mb-3 sm:mb-4 flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {chatbot.category}
                          </span>
                          {chatbot.inDevelopment && (
                            <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              In Development
                            </span>
                          )}
                        </div>

                        {/* Icon container with enhanced styling */}
                        <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ${chatbot.color} bg-opacity-10 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 text-3xl sm:text-4xl ${!chatbot.inDevelopment && 'group-hover:scale-110'} transition-transform duration-300 shadow-sm`}>
                          {chatbot.icon}
                        </div>
                        
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-amber-50 mb-2 sm:mb-3 ${!chatbot.inDevelopment && 'group-hover:text-amber-600 dark:group-hover:text-amber-400'} transition-colors`}>
                          {chatbot.name}
                        </h3>
                        
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 leading-relaxed">
                          {chatbot.description}
                        </p>
                        
                        {/* Enhanced CTA button */}
                        <div className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${chatbot.inDevelopment ? 'text-slate-400 dark:text-slate-600' : 'text-amber-600 dark:text-amber-400 group-hover:gap-3'} transition-all`}>
                          <span>{chatbot.inDevelopment ? 'Coming Soon' : 'Start Chat'}</span>
                          <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${!chatbot.inDevelopment && 'group-hover:translate-x-1'} transition-transform`}
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

                      {/* Bottom gradient line - only for active cards */}
                      {!chatbot.inDevelopment && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </CardWrapper>
                  );
                })}
              </div>
            </div>
          )}

          {/* Newsroom Tools Section */}
          {CHATBOTS.filter(bot => bot.category === "Newsroom").length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-amber-50 mb-4 sm:mb-6">
                Newsroom Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {CHATBOTS.filter(bot => bot.category === "Newsroom").map((chatbot, index) => {
                  const CardWrapper = chatbot.inDevelopment ? 'div' : 'a';
                  const cardProps = chatbot.inDevelopment ? {} : { href: `/chat/${chatbot.id}` };
                  
                  return (
                    <CardWrapper
                      key={chatbot.id}
                      {...cardProps}
                      className={`group relative flex flex-col items-start p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-900 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-500 border-2 border-slate-200 dark:border-slate-800 text-left overflow-hidden animate-slide-up ${
                        chatbot.inDevelopment 
                          ? 'opacity-75 cursor-not-allowed' 
                          : 'hover:shadow-2xl hover:border-amber-400 dark:hover:border-amber-600 hover:scale-[1.02] cursor-pointer'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Gradient accent orb */}
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 ${chatbot.color} opacity-5 ${!chatbot.inDevelopment && 'group-hover:opacity-10'} rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 ${!chatbot.inDevelopment && 'group-hover:scale-150'} transition-all duration-700 blur-2xl`}
                      />
                      
                      {/* Shine effect on hover - only for active cards */}
                      {!chatbot.inDevelopment && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                      )}
                      
                      <div className="relative z-10 w-full">
                        {/* Category and status pills */}
                        <div className="mb-3 sm:mb-4 flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {chatbot.category}
                          </span>
                          {chatbot.inDevelopment && (
                            <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              In Development
                            </span>
                          )}
                        </div>

                        {/* Icon container with enhanced styling */}
                        <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ${chatbot.color} bg-opacity-10 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 text-3xl sm:text-4xl ${!chatbot.inDevelopment && 'group-hover:scale-110'} transition-transform duration-300 shadow-sm`}>
                          {chatbot.icon}
                        </div>
                        
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-amber-50 mb-2 sm:mb-3 ${!chatbot.inDevelopment && 'group-hover:text-amber-600 dark:group-hover:text-amber-400'} transition-colors`}>
                          {chatbot.name}
                        </h3>
                        
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 leading-relaxed">
                          {chatbot.description}
                        </p>
                        
                        {/* Enhanced CTA button */}
                        <div className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${chatbot.inDevelopment ? 'text-slate-400 dark:text-slate-600' : 'text-amber-600 dark:text-amber-400 group-hover:gap-3'} transition-all`}>
                          <span>{chatbot.inDevelopment ? 'Coming Soon' : 'Start Chat'}</span>
                          <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${!chatbot.inDevelopment && 'group-hover:translate-x-1'} transition-transform`}
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

                      {/* Bottom gradient line - only for active cards */}
                      {!chatbot.inDevelopment && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </CardWrapper>
                  );
                })}
              </div>
            </div>
          )}

          {/* General Tools Section */}
          {CHATBOTS.filter(bot => bot.category === "General").length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-amber-50 mb-4 sm:mb-6">
                General Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {CHATBOTS.filter(bot => bot.category === "General").map((chatbot, index) => {
                  const CardWrapper = chatbot.inDevelopment ? 'div' : 'a';
                  const cardProps = chatbot.inDevelopment ? {} : { href: `/chat/${chatbot.id}` };
                  
                  return (
                    <CardWrapper
                      key={chatbot.id}
                      {...cardProps}
                      className={`group relative flex flex-col items-start p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-900 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-500 border-2 border-slate-200 dark:border-slate-800 text-left overflow-hidden animate-slide-up ${
                        chatbot.inDevelopment 
                          ? 'opacity-75 cursor-not-allowed' 
                          : 'hover:shadow-2xl hover:border-amber-400 dark:hover:border-amber-600 hover:scale-[1.02] cursor-pointer'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Gradient accent orb */}
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 ${chatbot.color} opacity-5 ${!chatbot.inDevelopment && 'group-hover:opacity-10'} rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 ${!chatbot.inDevelopment && 'group-hover:scale-150'} transition-all duration-700 blur-2xl`}
                      />
                      
                      {/* Shine effect on hover - only for active cards */}
                      {!chatbot.inDevelopment && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                      )}
                      
                      <div className="relative z-10 w-full">
                        {/* Category and status pills */}
                        <div className="mb-3 sm:mb-4 flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {chatbot.category}
                          </span>
                          {chatbot.inDevelopment && (
                            <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              In Development
                            </span>
                          )}
                        </div>

                        {/* Icon container with enhanced styling */}
                        <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ${chatbot.color} bg-opacity-10 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 text-3xl sm:text-4xl ${!chatbot.inDevelopment && 'group-hover:scale-110'} transition-transform duration-300 shadow-sm`}>
                          {chatbot.icon}
                        </div>
                        
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-amber-50 mb-2 sm:mb-3 ${!chatbot.inDevelopment && 'group-hover:text-amber-600 dark:group-hover:text-amber-400'} transition-colors`}>
                          {chatbot.name}
                        </h3>
                        
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 leading-relaxed">
                          {chatbot.description}
                        </p>
                        
                        {/* Enhanced CTA button */}
                        <div className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${chatbot.inDevelopment ? 'text-slate-400 dark:text-slate-600' : 'text-amber-600 dark:text-amber-400 group-hover:gap-3'} transition-all`}>
                          <span>{chatbot.inDevelopment ? 'Coming Soon' : 'Start Chat'}</span>
                          <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${!chatbot.inDevelopment && 'group-hover:translate-x-1'} transition-transform`}
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

                      {/* Bottom gradient line - only for active cards */}
                      {!chatbot.inDevelopment && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </CardWrapper>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced footer with glass-morphic design */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              More specialized assistants coming soon
            </span>
          </div>
        </div>
      </div>
    </main>
    </AuthWrapper>
  );
}
