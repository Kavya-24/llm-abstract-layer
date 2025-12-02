import { LLMProvider } from "../types/provider.js";

/**
 * Base error class for all LLM-related errors
 */
export class LLMError extends Error {
  public readonly provider: LLMProvider;
  public readonly statusCode: number | undefined;
  public readonly retryable: boolean;
  public readonly originalError: any;

  constructor(
    message: string,
    provider: LLMProvider,
    options: {
      statusCode?: number;
      retryable?: boolean;
      originalError?: any;
    } = {}
  ) {
    super(message);
    this.name = "LLMError";
    this.provider = provider;
    this.statusCode = options.statusCode;
    this.retryable = options.retryable ?? false;
    this.originalError = options.originalError;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, LLMError.prototype);
  }
}

/**
 * Error thrown when authentication with an LLM provider fails
 */
export class AuthenticationError extends LLMError {
  constructor(
    message: string,
    provider: LLMProvider,
    options: {
      statusCode?: number;
      originalError?: any;
    } = {}
  ) {
    super(message, provider, {
      ...options,
      retryable: false,
    });
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Error thrown when rate limiting occurs
 */
export class RateLimitError extends LLMError {
  public readonly retryAfter: number | undefined;

  constructor(
    message: string,
    provider: LLMProvider,
    options: {
      statusCode?: number;
      retryAfter?: number;
      originalError?: any;
    } = {}
  ) {
    const baseOptions: {
      statusCode?: number;
      retryable?: boolean;
      originalError?: any;
    } = {
      retryable: true,
      originalError: options.originalError,
    };
    if (options.statusCode !== undefined) {
      baseOptions.statusCode = options.statusCode;
    }
    super(message, provider, baseOptions);
    this.name = "RateLimitError";
    this.retryAfter = options.retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Error thrown when request validation fails
 */
export class ValidationError extends LLMError {
  constructor(
    message: string,
    provider: LLMProvider,
    options: {
      statusCode?: number;
      originalError?: any;
    } = {}
  ) {
    super(message, provider, {
      ...options,
      retryable: false,
    });
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when streaming fails
 */
export class StreamingError extends LLMError {
  constructor(
    message: string,
    provider: LLMProvider,
    options: {
      statusCode?: number;
      retryable?: boolean;
      originalError?: any;
    } = {}
  ) {
    super(message, provider, {
      ...options,
      retryable: options.retryable ?? true,
    });
    this.name = "StreamingError";
    Object.setPrototypeOf(this, StreamingError.prototype);
  }
}

/**
 * Error thrown when structured output validation fails
 */
export class StructuredOutputError extends LLMError {
  public readonly validationDetails: Record<string, any> | undefined;

  constructor(
    message: string,
    provider: LLMProvider,
    options: {
      statusCode?: number;
      validationDetails?: Record<string, any>;
      originalError?: any;
    } = {}
  ) {
    const baseOptions: {
      statusCode?: number;
      retryable?: boolean;
      originalError?: any;
    } = {
      retryable: false,
      originalError: options.originalError,
    };
    if (options.statusCode !== undefined) {
      baseOptions.statusCode = options.statusCode;
    }
    super(message, provider, baseOptions);
    this.name = "StructuredOutputError";
    this.validationDetails = options.validationDetails;
    Object.setPrototypeOf(this, StructuredOutputError.prototype);
  }
}
