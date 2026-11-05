/**
 * Application error hierarchy. Anything thrown as an AppError carries a safe,
 * user-facing message and an HTTP status; anything else is treated as an
 * internal error, logged in full on the server and reported to the client as
 * a generic message with a correlation id.
 */
export type ErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly status: number,
    message: string,
    public readonly details?: Record<string, string[]>,
    public readonly headers?: Record<string, string>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const badRequest = (msg = "Bad request") => new AppError("BAD_REQUEST", 400, msg);
export const validationError = (details: Record<string, string[]>, msg = "Some fields are invalid") =>
  new AppError("VALIDATION_ERROR", 422, msg, details);
export const unauthenticated = (msg = "Please sign in to continue") => new AppError("UNAUTHENTICATED", 401, msg);
export const forbidden = (msg = "You do not have permission to do that") => new AppError("FORBIDDEN", 403, msg);
export const notFound = (msg = "Not found") => new AppError("NOT_FOUND", 404, msg);
export const conflict = (msg: string, details?: Record<string, string[]>) => new AppError("CONFLICT", 409, msg, details);
export const tooLarge = (msg = "Upload is too large") => new AppError("PAYLOAD_TOO_LARGE", 413, msg);
export const unsupportedMedia = (msg = "Unsupported file type") => new AppError("UNSUPPORTED_MEDIA_TYPE", 415, msg);
export const rateLimited = (retryAfterSec: number) =>
  new AppError("RATE_LIMITED", 429, "Too many requests. Please slow down and try again shortly.", undefined, {
    "Retry-After": String(retryAfterSec),
  });

export const isAppError = (e: unknown): e is AppError => e instanceof AppError;
