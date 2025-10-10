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
import type { ColorScheme } from "@/hooks/useColorScheme";

export type FactAction = {
  type: "save";
  factId: string;
  factText: string;
};

type ChatKitPanelProps = {
  theme: ColorScheme;
  onWidgetAction: (action: FactAction) => Promise<void>;
  onResponseEnd: () => void;
  onThemeRequest: (scheme: ColorScheme) => void;
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
  theme,
  onWidgetAction,
  onResponseEnd,
  onThemeRequest,
}: ChatKitPanelProps) {
  console.log("[ChatKitPanel] Component function called", { theme });
  
  const processedFacts = useRef(new Set<string>());
  console.log("[ChatKitPanel] 1. useRef created");
  
  const [errors, setErrors] = useState<ErrorState>(() => createInitialErrors());
  console.log("[ChatKitPanel] 2. errors state created");
  
  const [isInitializingSession, setIsInitializingSession] = useState(true);
  console.log("[ChatKitPanel] 3. isInitializingSession state created");
  
  const isMountedRef = useRef(true);
  const isInitializingRef = useRef(false); // Lock to prevent concurrent calls
  console.log("[ChatKitPanel] 4. isMountedRef created");
  
  const [scriptStatus, setScriptStatus] = useState<
    "pending" | "ready" | "error"
  >(() =>
    isBrowser && window.customElements?.get("openai-chatkit")
      ? "ready"
      : "pending"
  );
  console.log("[ChatKitPanel] 5. scriptStatus state created:", scriptStatus);
  
  const [widgetInstanceKey, setWidgetInstanceKey] = useState(0);
  console.log("[ChatKitPanel] 6. widgetInstanceKey state created");

  const setErrorState = useCallback((updates: Partial<ErrorState>) => {
    setErrors((current) => ({ ...current, ...updates }));
  }, []);
  console.log("[ChatKitPanel] 7. setErrorState callback created");

  useEffect(() => {
    console.log("[ChatKitPanel] ✅ COMPONENT MOUNTED");
    return () => {
      console.log("[ChatKitPanel] ❌ COMPONENT UNMOUNTING");
      isMountedRef.current = false;
    };
  }, []);
  console.log("[ChatKitPanel] 8. First useEffect registered");

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
    WORKFLOW_ID && !WORKFLOW_ID.startsWith("wf_replace")
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
      console.log("[getClientSecret] 🔵 CALLED", { 
        currentSecret: !!currentSecret,
        isAlreadyInitializing: isInitializingRef.current 
      });
      
      // Prevent concurrent calls
      if (isInitializingRef.current) {
        console.log("[getClientSecret] 🚫 Already initializing, skipping");
        throw new Error("Session initialization already in progress");
      }
      
      if (!isWorkflowConfigured) {
        console.log("[getClientSecret] ❌ Workflow not configured");
        const detail =
          "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your .env.local file.";
        if (isMountedRef.current) {
          setErrorState({ session: detail, retryable: false });
          setIsInitializingSession(false);
        }
        throw new Error(detail);
      }

      if (isMountedRef.current) {
        if (!currentSecret) {
          console.log("[getClientSecret] 🟡 Setting isInitializingSession = true & lock");
          isInitializingRef.current = true; // Set lock
          setIsInitializingSession(true);
        }
        setErrorState({ session: null, integration: null, retryable: false });
      }

      try {
        console.log("[getClientSecret] 📡 Fetching session...");
        const response = await fetch(CREATE_SESSION_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workflow: { id: WORKFLOW_ID },
          }),
        });

        console.log("[getClientSecret] 📨 Response received:", response.status);
        const raw = await response.text();

        let data: Record<string, unknown> = {};
        if (raw) {
          try {
            data = JSON.parse(raw) as Record<string, unknown>;
          } catch (parseError) {
            console.error(
              "[getClientSecret] Failed to parse create-session response",
              parseError
            );
          }
        }

        if (!response.ok) {
          const detail = extractErrorDetail(data, response.statusText);
          console.error("[getClientSecret] ❌ Request failed:", {
            status: response.status,
            body: data,
          });
          throw new Error(detail);
        }

        const clientSecret = data?.client_secret as string | undefined;
        if (!clientSecret) {
          console.error("[getClientSecret] ❌ Missing client secret");
          throw new Error("Missing client secret in response");
        }

        console.log("[getClientSecret] ✅ Got client secret");
        if (isMountedRef.current) {
          setErrorState({ session: null, integration: null });
        }

        return clientSecret;
      } catch (error) {
        console.error("[getClientSecret] ❌ CATCH block:", error);
        const detail =
          error instanceof Error
            ? error.message
            : "Unable to start ChatKit session.";
        if (isMountedRef.current) {
          setErrorState({ session: detail, retryable: false });
        }
        throw error instanceof Error ? error : new Error(detail);
      } finally {
        console.log("[getClientSecret] 🏁 FINALLY block", { 
          isMounted: isMountedRef.current, 
          currentSecret: !!currentSecret 
        });
        if (isMountedRef.current && !currentSecret) {
          console.log("[getClientSecret] 🟢 Setting isInitializingSession = FALSE & releasing lock");
          isInitializingRef.current = false; // Release lock
          setIsInitializingSession(false);
        } else {
          console.log("[getClientSecret] ⚠️ NOT setting isInitializingSession to false", {
            isMounted: isMountedRef.current,
            hasCurrentSecret: !!currentSecret
          });
        }
      }
    },
    [isWorkflowConfigured, setErrorState]
  );
  console.log("[ChatKitPanel] 9. About to call useChatKit", { 
    workflowId: WORKFLOW_ID,
    isWorkflowConfigured 
  });

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
    greeting: GREETING,
    prompts: STARTER_PROMPTS,
  }), []);

  const composerConfig = useMemo(() => ({
    placeholder: PLACEHOLDER_INPUT,
  }), []);

  const onClientTool = useCallback(async (invocation: {
    name: string;
    params: Record<string, unknown>;
  }) => {
      // THEME SWITCHING DISABLED FOR TESTING
      // if (invocation.name === "switch_theme") {
      //   const requested = invocation.params.theme;
      //   if (requested === "light" || requested === "dark") {
      //     if (isDev) {
      //       console.debug("[ChatKitPanel] switch_theme", requested);
      //     }
      //     onThemeRequest(requested);
      //     return { success: true };
      //   }
      //   return { success: false };
      // }

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
    // Note that Chatkit UI handles errors for your users.
    // Thus, your app code doesn't need to display errors on UI.
    console.error("ChatKit error", error);
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
  console.log("[ChatKitPanel] 10. useChatKit returned", { 
    hasControl: Boolean(chatkit.control) 
  });

  console.log("[ChatKitPanel] 11. About to calculate errors");
  const activeError = errors.session ?? errors.integration;
  console.log("[ChatKitPanel] 12. activeError:", activeError);
  const blockingError = errors.script ?? activeError;
  console.log("[ChatKitPanel] 13. blockingError:", blockingError);

  // Always log in production for debugging deployment issues
  console.log("[ChatKitPanel] ⭐ RENDER STATE ⭐", {
    isInitializingSession,
    hasControl: Boolean(chatkit.control),
    scriptStatus,
    hasError: Boolean(blockingError),
    workflowId: WORKFLOW_ID,
    errors,
    blockingError,
  });

  console.log("[ChatKitPanel] 14. About to return JSX");

  const chatKitClassName = blockingError || isInitializingSession
    ? "pointer-events-none opacity-0"
    : "block h-full w-full";
  
  console.log("[ChatKitPanel] 15. ChatKit className:", chatKitClassName, {
    blockingError: !!blockingError,
    isInitializingSession,
  });

  return (
    <div className="relative flex h-[90vh] w-full flex-col overflow-hidden bg-white shadow-sm transition-colors dark:bg-slate-900">
      <ChatKit
        key={widgetInstanceKey}
        control={chatkit.control}
        className={chatKitClassName}
      />
      <ErrorOverlay
        error={blockingError}
        fallbackMessage={
          blockingError || !isInitializingSession
            ? null
            : "Loading assistant session..."
        }
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
