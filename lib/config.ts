import { StartScreenPrompt } from "@openai/chatkit";

// Global fallback workflow ID for chatbots that don't specify their own workflowId
// Individual chatbots in lib/chatbots.ts can override this with their own workflow IDs
export const WORKFLOW_ID = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

// Debug logging only in development to avoid exposing configuration in production
if (process.env.NODE_ENV === "development") {
  console.log("[DEBUG] Environment variables:");
  console.log("NEXT_PUBLIC_CHATKIT_WORKFLOW_ID:", process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID);
  console.log("WORKFLOW_ID (processed):", WORKFLOW_ID);
  console.log("OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);
}

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "What can you do?",
    prompt: "What can you do?",
    icon: "circle-question",
  },
];

export const PLACEHOLDER_INPUT = "Start typing...";

export const GREETING = "How can I help you today?";
