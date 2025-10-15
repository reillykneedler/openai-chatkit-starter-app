"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import {
  STARTER_PROMPTS,
  PLACEHOLDER_INPUT,
  GREETING,
  CREATE_SESSION_ENDPOINT,
  WORKFLOW_ID,
} from "@/lib/config";
import { ErrorOverlay } from "./ErrorOverlay";

export type FactAction = {
  type: "save";
  factId: string;
  factText: string;
};

type ChatKitPanelProps = {
  workflowId?: string;
  greeting?: string;
  onWidgetAction: (action: FactAction) => Promise<void>;
  onResponseEnd: () => void;
};

type ErrorState = {
  script: string | null;
  session: string | null;
  integration: string | null;
  retryable: boolean;
};

const isBrowser = typeof window !== "undefined";
const isDev = process.env.NODE_ENV !== "production";

const createInitialErrors = (): ErrorState => ({
  script: null,
  session: null,
  integration: null,
  retryable: false,
});

export function ChatKitPanel({
  workflowId,
  greeting,
  onWidgetAction,
  onResponseEnd,
}: ChatKitPanelProps) {
  const processedFacts = useRef(new Set<string>());
  const [errors, setErrors] = useState<ErrorState>(() => createInitialErrors());
  const [isInitializingSession, setIsInitializingSession] = useState(true);
  const isMountedRef = useRef(true);
  const isInitializingRef = useRef(false); // Lock to prevent concurrent calls
  const hasControlRef = useRef(false); // Track if control has been received
  
  const [scriptStatus, setScriptStatus] = useState<
    "pending" | "ready" | "error"
  >(() =>
    isBrowser && window.customElements?.get("openai-chatkit")
      ? "ready"
      : "pending"
  );
  
  const [widgetInstanceKey, setWidgetInstanceKey] = useState(0);

  const setErrorState = useCallback((updates: Partial<ErrorState>) => {
    setErrors((current) => ({ ...current, ...updates }));
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    let timeoutId: number | undefined;

    const handleLoaded = () => {
      if (!isMountedRef.current) {
        return;
      }
      setScriptStatus("ready");
      setErrorState({ script: null });
    };

    const handleError = (event: Event) => {
      console.error("Failed to load chatkit.js for some reason", event);
      if (!isMountedRef.current) {
        return;
      }
      setScriptStatus("error");
      const detail = (event as CustomEvent<unknown>)?.detail ?? "unknown error";
      setErrorState({ script: `Error: ${detail}`, retryable: false });
      setIsInitializingSession(false);
    };

    window.addEventListener("chatkit-script-loaded", handleLoaded);
    window.addEventListener(
      "chatkit-script-error",
      handleError as EventListener
    );

    if (window.customElements?.get("openai-chatkit")) {
      handleLoaded();
    } else if (scriptStatus === "pending") {
      timeoutId = window.setTimeout(() => {
        if (!window.customElements?.get("openai-chatkit")) {
          handleError(
            new CustomEvent("chatkit-script-error", {
              detail:
                "ChatKit web component is unavailable. Verify that the script URL is reachable.",
            })
          );
        }
      }, 5000);
    }

    return () => {
      window.removeEventListener("chatkit-script-loaded", handleLoaded);
      window.removeEventListener(
        "chatkit-script-error",
        handleError as EventListener
      );
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [scriptStatus, setErrorState]);

  const isWorkflowConfigured = Boolean(
    (workflowId && !workflowId.startsWith("wf_replace")) ||
    (WORKFLOW_ID && !WORKFLOW_ID.startsWith("wf_replace"))
  );

  useEffect(() => {
    if (!isWorkflowConfigured && isMountedRef.current) {
      setErrorState({
        session: "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your .env.local file.",
        retryable: false,
      });
      setIsInitializingSession(false);
    }
  }, [isWorkflowConfigured, setErrorState]);

  const handleResetChat = useCallback(() => {
    processedFacts.current.clear();
    hasControlRef.current = false; // Reset control tracking
    if (isBrowser) {
      setScriptStatus(
        window.customElements?.get("openai-chatkit") ? "ready" : "pending"
      );
    }
    setIsInitializingSession(true);
    setErrors(createInitialErrors());
    setWidgetInstanceKey((prev) => prev + 1);
  }, []);

  const getClientSecret = useCallback(
    async (currentSecret: string | null) => {
      // Prevent concurrent calls
      if (isInitializingRef.current) {
        throw new Error("Session initialization already in progress");
      }
      
      if (!isWorkflowConfigured) {
        const detail =
          "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your .env.local file.";
        if (isMountedRef.current) {
          setErrorState({ session: detail, retryable: false });
          setIsInitializingSession(false);
        }
        throw new Error(detail);
      }

      if (isMountedRef.current) {
        if (!currentSecret && !hasControlRef.current) {
          isInitializingRef.current = true;
          setIsInitializingSession(true);
        } else if (!currentSecret) {
          isInitializingRef.current = true;
        }
        setErrorState({ session: null, integration: null, retryable: false });
      }

      try {
        const effectiveWorkflowId = workflowId && workflowId.trim() !== "" 
          ? workflowId 
          : WORKFLOW_ID;
        
        const response = await fetch(CREATE_SESSION_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workflow: { id: effectiveWorkflowId },
          }),
        });

        const raw = await response.text();
        let data: Record<string, unknown> = {};
        
        if (raw) {
          try {
            data = JSON.parse(raw) as Record<string, unknown>;
          } catch (parseError) {
            console.error(
              "[ChatKitPanel] Failed to parse session response",
              parseError
            );
          }
        }

        if (!response.ok) {
          const detail = extractErrorDetail(data, response.statusText);
          console.error("[ChatKitPanel] Session request failed:", {
            status: response.status,
            detail
          });
          throw new Error(detail);
        }

        const clientSecret = data?.client_secret as string | undefined;
        if (!clientSecret) {
          console.error("[ChatKitPanel] Missing client secret in response");
          throw new Error("Missing client secret in response");
        }

        if (isMountedRef.current) {
          setErrorState({ session: null, integration: null });
        }

        return clientSecret;
      } catch (error) {
        console.error("[ChatKitPanel] Session error:", error);
        const detail =
          error instanceof Error
            ? error.message
            : "Unable to start ChatKit session.";
        if (isMountedRef.current) {
          setErrorState({ session: detail, retryable: false });
        }
        throw error instanceof Error ? error : new Error(detail);
      } finally {
        if (isMountedRef.current && !currentSecret) {
          isInitializingRef.current = false;
          if (!hasControlRef.current) {
            setIsInitializingSession(false);
          }
        }
      }
    },
    [workflowId, isWorkflowConfigured, setErrorState]
  );

  // SIMPLIFIED FIXED THEME FOR TESTING
  const themeConfig = useMemo(() => {
    return {
      colorScheme: "light" as const,
      color: {
        grayscale: {
          hue: 220,
          tint: 6,
          shade: -4,
        },
        accent: {
          primary: "#0f172a",
          level: 1,
        },
      },
      radius: "round",
    } as const;
  }, []); // No dependencies - truly static

  const startScreenConfig = useMemo(() => ({
    greeting: greeting || GREETING,
    prompts: STARTER_PROMPTS,
  }), [greeting]);

  const composerConfig = useMemo(() => ({
    placeholder: PLACEHOLDER_INPUT,
  }), []);

  const onClientTool = useCallback(async (invocation: {
    name: string;
    params: Record<string, unknown>;
  }) => {
      if (invocation.name === "record_fact") {
        const id = String(invocation.params.fact_id ?? "");
        const text = String(invocation.params.fact_text ?? "");
        
        if (!id || processedFacts.current.has(id)) {
          return { success: true };
        }
        
        processedFacts.current.add(id);
        void onWidgetAction({
          type: "save",
          factId: id,
          factText: text.replace(/\s+/g, " ").trim(),
        });
        return { success: true };
      }

      if (isDev) {
        console.warn("[ChatKitPanel] Unknown client tool:", invocation.name);
      }
      return { success: false };
    }, [onWidgetAction, processedFacts]);

  const onResponseEndCallback = useCallback(() => {
    onResponseEnd();
  }, [onResponseEnd]);

  const onResponseStartCallback = useCallback(() => {
    setErrorState({ integration: null, retryable: false });
  }, [setErrorState]);

  const onThreadChangeCallback = useCallback(() => {
    processedFacts.current.clear();
  }, []);

  const onErrorCallback = useCallback(({ error }: { error: unknown }) => {
    // Note that ChatKit UI handles errors for your users.
    console.error("[ChatKitPanel] ChatKit error:", error instanceof Error ? error.message : error);
  }, []);

  const chatkit = useChatKit({
    api: { getClientSecret },
    theme: themeConfig,
    startScreen: startScreenConfig,
    composer: composerConfig,
    threadItemActions: {
      feedback: false,
    },
    onClientTool,
    onResponseEnd: onResponseEndCallback,
    onResponseStart: onResponseStartCallback,
    onThreadChange: onThreadChangeCallback,
    onError: onErrorCallback,
  });

  // Once we have control, clear the initialization state (only once)
  useEffect(() => {
    if (chatkit.control && !hasControlRef.current) {
      hasControlRef.current = true;
      if (isInitializingSession) {
        setIsInitializingSession(false);
      }
    }
  }, [chatkit.control, isInitializingSession]);

  const activeError = errors.session ?? errors.integration;
  const blockingError = errors.script ?? activeError;

  const chatKitClassName = blockingError || isInitializingSession
    ? "pointer-events-none opacity-0"
    : "block h-full w-full";

  return (
    <div className="relative flex h-[85vh] sm:h-[90vh] w-full flex-col overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
      {/* Subtle gradient border effect */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-600/10 -z-10 blur-xl"></div>
      
      {/* Loading skeleton overlay */}
      {isInitializingSession && !blockingError && (
        <div className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
          <div className="flex flex-col h-full p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              <div className="flex-1 space-y-1.5 sm:space-y-2">
                <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="h-2.5 sm:h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>
            
            {/* Message skeletons */}
            <div className="flex-1 space-y-3 sm:space-y-4 overflow-hidden">
              <div className="flex gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-200 dark:bg-slate-800 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-1.5 sm:space-y-2">
                  <div className="h-2.5 sm:h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-2.5 sm:h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 justify-end">
                <div className="w-1/2 space-y-1.5 sm:space-y-2">
                  <div className="h-2.5 sm:h-3 bg-amber-100 dark:bg-amber-900/30 rounded"></div>
                  <div className="h-2.5 sm:h-3 bg-amber-100 dark:bg-amber-900/30 rounded w-3/4 ml-auto"></div>
                </div>
              </div>
            </div>
            
            {/* Input skeleton */}
            <div className="h-10 sm:h-12 bg-slate-200 dark:bg-slate-800 rounded-xl sm:rounded-2xl"></div>
          </div>
        </div>
      )}
      
      <ChatKit
        key={widgetInstanceKey}
        control={chatkit.control}
        className={chatKitClassName}
      />
      <ErrorOverlay
        error={blockingError}
        fallbackMessage={null}
        onRetry={blockingError && errors.retryable ? handleResetChat : null}
        retryLabel="Restart chat"
      />
    </div>
  );
}

function extractErrorDetail(
  payload: Record<string, unknown> | undefined,
  fallback: string
): string {
  if (!payload) {
    return fallback;
  }

  const error = payload.error;
  if (typeof error === "string") {
    return error;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  const details = payload.details;
  if (typeof details === "string") {
    return details;
  }

  if (details && typeof details === "object" && "error" in details) {
    const nestedError = (details as { error?: unknown }).error;
    if (typeof nestedError === "string") {
      return nestedError;
    }
    if (
      nestedError &&
      typeof nestedError === "object" &&
      "message" in nestedError &&
      typeof (nestedError as { message?: unknown }).message === "string"
    ) {
      return (nestedError as { message: string }).message;
    }
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  return fallback;
}
