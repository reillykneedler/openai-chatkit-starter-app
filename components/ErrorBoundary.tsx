"use client";

import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50/50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="max-w-md mx-auto px-6 text-center animate-scale-in">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full shadow-lg">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              Something Went Wrong
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-400 mb-6">
              An unexpected error occurred. Please refresh the page to try again.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left">
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-amber-600 dark:to-amber-700 text-white rounded-xl hover:from-slate-800 hover:to-slate-700 dark:hover:from-amber-700 dark:hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

