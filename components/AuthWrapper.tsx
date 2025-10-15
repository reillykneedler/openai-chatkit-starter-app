"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { ReactNode, useState } from "react";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50/50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center animate-fade-in">
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated - show sign in page
  if (!session) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-amber-50/50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-transparent dark:from-amber-900/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-100/30 via-transparent to-transparent dark:from-yellow-900/10"></div>
        </div>

        {/* Floating orbs for ambient effect */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>

        <div className="relative z-10 text-center animate-scale-in max-w-md mx-auto px-6">
          {/* Lock icon */}
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full shadow-lg">
            <svg
              className="w-10 h-10 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
            Wick AI Toolkit
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Powerful tools to fuel our powerful work. <br></br>Sign in with your Google account.
          </p>

          {/* Google Sign In - Primary */}
          <button
            onClick={() => signIn("google")}
            className="group relative inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 font-semibold text-lg overflow-hidden hover:scale-105"
          >
            {/* Google icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Compact Admin Login Toggle */}
          <div className="mt-8">
            <button
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="text-md text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors underline"
            >
              {showAdminLogin ? "Hide" : "Admin login"}
            </button>

            {/* Collapsible Admin Form */}
            {showAdminLogin && (
              <form onSubmit={handleCredentialsLogin} className="mt-4 space-y-3">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 dark:focus:border-amber-600 text-slate-900 dark:text-slate-100 transition-colors"
                  placeholder="Admin username"
                  required
                />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 dark:focus:border-amber-600 text-slate-900 dark:text-slate-100 transition-colors"
                  placeholder="Admin password"
                  required
                />

                {error && (
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-sm bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - show the app
  return <>{children}</>;
}

