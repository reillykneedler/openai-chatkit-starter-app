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
    if (isDev) console.log("[ChatKitPanel] Component mounted");
    return () => {
      if (isDev) console.log("[ChatKitPanel] Component unmounting");
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
      if (isDev) {
        console.log("[getClientSecret] Called", { 
          currentSecret: !!currentSecret,
          isAlreadyInitializing: isInitializingRef.current 
        });
      }
      
      // Prevent concurrent calls
      if (isInitializingRef.current) {
        if (isDev) console.log("[getClientSecret] Already initializing, skipping");
        throw new Error("Session initialization already in progress");
      }
      
      if (!isWorkflowConfigured) {
        if (isDev) console.log("[getClientSecret] Workflow not configured");
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
          if (isDev) console.log("[getClientSecret] Initializing session");
          isInitializingRef.current = true; // Set lock
          setIsInitializingSession(true);
        }
        setErrorState({ session: null, integration: null, retryable: false });
      }

      try {
        if (isDev) console.log("[getClientSecret] Fetching session...");
        const response = await fetch(CREATE_SESSION_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workflow: { id: WORKFLOW_ID },
          }),
        });

        if (isDev) console.log("[getClientSecret] Response received:", response.status);
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
          console.error("[getClientSecret] Request failed:", {
            status: response.status,
            body: data,
          });
          throw new Error(detail);
        }

        const clientSecret = data?.client_secret as string | undefined;
        if (!clientSecret) {
          console.error("[getClientSecret] Missing client secret");
          throw new Error("Missing client secret in response");
        }

        if (isDev) console.log("[getClientSecret] Got client secret");
        if (isMountedRef.current) {
          setErrorState({ session: null, integration: null });
        }

        return clientSecret;
      } catch (error) {
        console.error("[getClientSecret] Error:", error);
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
          if (isDev) console.log("[getClientSecret] Session initialization complete");
          isInitializingRef.current = false; // Release lock
          setIsInitializingSession(false);
        }
      }
    },
    [isWorkflowConfigured, setErrorState]
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

  // Once we have control, clear the initialization state (only once)
  useEffect(() => {
    if (chatkit.control && !hasControlRef.current) {
      hasControlRef.current = true;
      if (isDev) console.log("[ChatKitPanel] ChatKit ready, clearing initialization state");
      if (isInitializingSession) {
        setIsInitializingSession(false);
      }
    }
  }, [chatkit.control, isInitializingSession]);

  const activeError = errors.session ?? errors.integration;
  const blockingError = errors.script ?? activeError;

  if (isDev) {
    console.log("[ChatKitPanel] Render state:", {
      isInitializingSession,
      hasControl: Boolean(chatkit.control),
      scriptStatus,
      hasError: Boolean(blockingError),
    });
  }

  const chatKitClassName = blockingError || isInitializingSession
    ? "pointer-events-none opacity-0"
    : "block h-full w-full";

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
