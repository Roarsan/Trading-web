import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ExpectedError } from "@/domain/expectedError/ExpectedError";

type ErrorPayload = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message = "Bad Request", details?: unknown) =>
  new ApiError(400, "BAD_REQUEST", message, details);

export const unauthorized = (message = "Unauthorized") =>
  new ApiError(401, "UNAUTHORIZED", message);

export const forbidden = (message = "Forbidden") =>
  new ApiError(403, "FORBIDDEN", message);

export const notFound = (message = "Not Found") =>
  new ApiError(404, "NOT_FOUND", message);

export function handleApiError(err: unknown): Response {
  if (err instanceof ApiError) {
    const payload: ErrorPayload = {
      error: { code: err.code, message: err.message, details: err.details },
    };
    return NextResponse.json(payload, { status: err.statusCode });
  }

  if (err instanceof ZodError) {
    const payload: ErrorPayload = {
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: err,
      },
    };
    return NextResponse.json(payload, { status: 400 });
  }

  if (err instanceof ExpectedError) {
    const payload: ErrorPayload = {
      error: { code: "EXPECTED_ERROR", message: err.message },
    };
    return NextResponse.json(payload, { status: 400 });
  }

  console.error("Unhandled API error:", err);
  const payload: ErrorPayload = {
    error: { code: "INTERNAL_SERVER_ERROR", message: "Unexpected server error" },
  };
  return NextResponse.json(payload, { status: 500 });
}

export function withApiError<T extends (...args: any[]) => Promise<Response>>(
  handler: T,
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (err) {
      return handleApiError(err);
    }
  }) as T;
}
