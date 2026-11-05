import "server-only";
import { randomUUID } from "node:crypto";
import { isAppError, type AppError } from "@/server/http/errors";

export type ErrorBody = {
  error: { code: string; message: string; details?: Record<string, string[]>; requestId?: string };
};

/**
 * The one place that turns any thrown value into a safe, consistent shape.
 * Expected errors (AppError) pass their message through. Unexpected ones are
 * logged with a correlation id and replaced by a generic message, so stack
 * traces, SQL and file paths never reach the client.
 */
export function toErrorBody(err: unknown): { status: number; body: ErrorBody; headers?: Record<string, string> } {
  if (isAppError(err)) {
    const e = err as AppError;
    return {
      status: e.status,
      headers: e.headers,
      body: { error: { code: e.code, message: e.message, ...(e.details ? { details: e.details } : {}) } },
    };
  }
  const requestId = randomUUID();
  console.error(`[error ${requestId}]`, err);
  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong on our side. Please try again.",
        requestId,
      },
    },
  };
}
