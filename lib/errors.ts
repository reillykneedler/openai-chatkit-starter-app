/**
 * Custom error types for better error handling and debugging
 */

export class SessionError extends Error {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = "SessionError";
  }
}

export class WorkflowConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkflowConfigurationError";
  }
}

export class TimeoutError extends Error {
  constructor(message: string = "Request timeout") {
    super(message);
    this.name = "TimeoutError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class ParseError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = "ParseError";
  }
}

/**
 * Type guard to check if an error is an AbortError
 */
export function isAbortError(error: unknown): error is Error {
  return error instanceof Error && error.name === "AbortError";
}

/**
 * Safely extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}

