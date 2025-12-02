import { getString } from "../../utils/i18Lib.js";
import type { CompletionResponse } from "../types/completion.js";
import { LLMProvider } from "../types/provider.js";
import {
  LLMError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  StreamingError,
  StructuredOutputError,
} from "./LLMError.js";

/**
 * Translates provider-specific errors to LLM error types
 */
export function translateProviderError(
  errorCompletion: CompletionResponse,
  provider: LLMProvider
): LLMError {

  const { rawProviderError: originalError, statusCode, content } = errorCompletion;
  // ---- Authentication Errors ----
  if (statusCode === 401 || statusCode === 403) {
    return new AuthenticationError(
      getString("LLM_ERROR_AUTHENTICATION_FAILED", {
        args: { provider },
      }),
      provider,
      {
        statusCode,
        originalError,
      }
    );
  }

  // ---- Rate Limit Errors ----
  if (statusCode === 429) {
    return new RateLimitError(
      getString("LLM_ERROR_RATE_LIMIT", {
        args: { provider },
      }),
      provider,
      {
        statusCode,
        originalError,
      }
    );
  }

  // ---- Validation Errors ----
  if (statusCode === 400) {
    return new ValidationError(
      getString("LLM_ERROR_VALIDATION_FAILED", {
        args: { provider, details: content || "" },
      }),
      provider,
      {
        statusCode,
        originalError,
      }
    );
  }

  // ---- Fallback Provider Error ----
  return new LLMError(
    getString("LLM_ERROR_PROVIDER_ERROR", {
      args: { provider, statusCode },
    }),
    provider,
    {
      statusCode,
      retryable: statusCode >= 500,
      originalError,
    }
  );
}

/**
 * Logs an LLM error with appropriate context
 */
export function logLLMError(error: LLMError, context?: Record<string, any>) {
  const logData = {
    errorType: error.name,
    provider: error.provider,
    statusCode: error.statusCode,
    retryable: error.retryable,
    message: error.message,
    ...context,
  };

  // Log based on error severity
  if (error instanceof AuthenticationError) {
    console.error(
      getString("LOG_LLM_AUTHENTICATION_ERROR"),
      JSON.stringify(logData)
    );
  } else if (error instanceof RateLimitError) {
    console.warn(
      getString("LOG_LLM_RATE_LIMIT_ERROR"),
      JSON.stringify(logData)
    );
  } else if (error instanceof ValidationError) {
    console.error(
      getString("LOG_LLM_VALIDATION_ERROR"),
      JSON.stringify(logData)
    );
  } else if (error instanceof StreamingError) {
    console.error(
      getString("LOG_LLM_STREAMING_ERROR"),
      JSON.stringify(logData)
    );
  } else if (error instanceof StructuredOutputError) {
    console.error(
      getString("LOG_LLM_STRUCTURED_OUTPUT_ERROR"),
      JSON.stringify(logData)
    );
  } else {
    console.error(getString("LOG_LLM_ERROR"), JSON.stringify(logData));
  }
}

/**
 * Validates API key before making requests
 */
export function validateApiKey(apiKey: string | undefined): void {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new ValidationError(
      getString("LLM_ERROR_MISSING_API_KEY"),
      LLMProvider.OPENAI // Default provider for validation errors
    );
  }
}
